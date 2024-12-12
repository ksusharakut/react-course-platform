import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "../services/getCourseById";
import { getUnits } from "../services/getUnits";
import { fetchLessons } from "../services/fetchLessons";
import { getUserById } from "../services/getUserById";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import getCurrentUserId from "../utils/getCurrentUserId"; // Функция для получения текущего userId
import { startCourse } from "../services/startCourse"; // Сервис для начала курса
import { checkCourseProgress } from "../services/checkCourseProgress"; // Сервис для проверки начала курса
import { getBalance } from "../services/getBalance"; // Сервис для получения баланса пользователя

const CoursePage = () => {
  const { courseId } = useParams(); // Получаем ID курса из маршрута
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]); // Состояние для хранения юнитов
  const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCourseStarted, setIsCourseStarted] = useState(false); // Состояние для отслеживания начала курса
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUserId = getCurrentUserId(); // Получаем текущий userId из токена

  useEffect(() => {
    const loadCourseAndUnits = async () => {
      try {
        // Загружаем данные курса
        const courseData = await getCourseById(courseId);
        setCourse(courseData);

        // Загружаем информацию о пользователе, создавшем курс
        const userData = await getUserById(courseData.userId); // Запрашиваем пользователя по userId
        setUser(userData);

        // Загружаем список юнитов для курса
        const unitsData = await getUnits(courseId);

        // Загружаем уроки для каждого юнита
        const unitsWithLessons = await Promise.all(
          unitsData.map(async (unit) => {
            const lessons = await fetchLessons(courseId, unit.unitId, token);
            return { ...unit, lessons };
          })
        );

        setUnits(unitsWithLessons);
        setLoading(false);

        // Проверяем, начат ли курс
        const isStarted = await checkCourseProgress(courseId, currentUserId, token);
        setIsCourseStarted(isStarted);

      } catch (err) {
        setError(err.message || "Ошибка при загрузке данных");
        setLoading(false);
      }
    };

    loadCourseAndUnits();
  }, [courseId, token]);

const handleStartOrContinueCourse = async () => {
  try {
    // Получаем баланс пользователя
    const balance = await getBalance(currentUserId, token);

    // Проверяем, достаточно ли средств на балансе
    if (course.price > balance) {
      alert("Недостаточно средств для прохождения курса.");
      return;
    }

    // Если курс уже начат, просто переходим к продолжению
    if (isCourseStarted) {
      navigate(`/viewpage/${courseId}`); // Перенаправляем пользователя на страницу курса
      return;
    }

    // Если курс не начат, отправляем запрос на сервер для создания записи о начале курса
    const response = await startCourse(courseId, currentUserId, token);
    if (response.ok) {
      setIsCourseStarted(true); // Обновляем состояние, что курс начат
      navigate(`/viewpage/${courseId}`); // Перенаправляем пользователя на страницу курса
    } else {
      setError("Ошибка при запуске курса.");
    }
  } catch (err) {
    setError(err.message || "Ошибка при запуске курса.");
  }
};

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  const isCreator = course && currentUserId === course.userId;

  return (
    <div>
      <Header />
      <div className="p-6">
        {/* Отображение данных курса */}
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-lg text-gray-700 mb-6">{course.description}</p>
        <div className="text-xl font-semibold mb-4">
          Цена: {course.price ? `${course.price} МудроБакс.` : "Бесплатно"}
        </div>

        {/* Отображение никнейма создателя курса */}
        <div className="text-gray-600 mb-6">
          <strong>Создатель:</strong> {user ? user.nickname : "Неизвестный пользователь"}
        </div>

        <button
          className={`px-6 py-2 font-semibold rounded-lg shadow ${
            isCreator
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : isCourseStarted
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={handleStartOrContinueCourse}
          disabled={isCreator}
        >
          {isCourseStarted ? "Продолжить прохождение курса" : "Пройти курс"}
        </button>

        {/* Отображение списка юнитов */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Список глав</h2>
          {units.length > 0 ? (
            <ul className="space-y-4">
              {units.map((unit, index) => (
                <li
                  key={unit.unitId}
                  className="p-4 bg-gray-100 rounded-lg shadow"
                >
                  <div>
                    <span className="font-semibold">{index + 1}. </span>
                    {unit.title}
                  </div>

                  {/* Список уроков для каждого юнита */}
                  {unit.lessons.length > 0 ? (
                    <ul className="mt-2 ml-4 space-y-2">
                      {unit.lessons.map((lesson) => (
                        <li
                          key={lesson.lessonId}
                          className="p-2 bg-gray-50 rounded-lg shadow"
                        >
                          {lesson.title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 mt-2">Уроки не найдены.</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Юниты не найдены.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
