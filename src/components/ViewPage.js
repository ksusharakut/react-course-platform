import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../services/getCourseById";
import { getUnits } from "../services/getUnits";
import { fetchLessons } from "../services/fetchLessons";
import { fetchLessonContent } from "../services/fetchLessons";
import { getUserById } from "../services/getUserById";
import Header from "./Header";
import getCurrentUserId from "../utils/getCurrentUserId"; // Функция для получения текущего userId

const ViewPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null); // Для отслеживания активного урока
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const loadCourseAndUnits = async () => {
      try {
        const courseData = await getCourseById(courseId);
        setCourse(courseData);

        const userData = await getUserById(courseData.userId);
        setUser(userData);

        const unitsData = await getUnits(courseId);

        const unitsWithLessons = await Promise.all(
          unitsData.map(async (unit) => {
            const lessons = await fetchLessons(courseId, unit.unitId, token);
            return { ...unit, lessons };
          })
        );

        setUnits(unitsWithLessons);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Ошибка при загрузке данных");
        setLoading(false);
      }
    };

    loadCourseAndUnits();
  }, [courseId, token]);

  const handleLessonClick = async (unitId, lessonId) => {
    setActiveLessonId(lessonId); // Устанавливаем активный урок
    try {
      const content = await fetchLessonContent(courseId, unitId, lessonId, token);
      setSelectedLesson({
        id: lessonId,
        unitId,
        content: content.content,
      });
    } catch (error) {
      setSelectedLesson({
        id: lessonId,
        unitId,
        content: "Не удалось загрузить содержимое урока.",
      });
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header />
      <div className="flex p-6">
        {/* Панель навигации по курсу */}
        <div className="w-1/4 pr-4">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Панель навигации:</h2>
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

                    {unit.lessons.length > 0 ? (
                      <ul className="mt-2 ml-4 space-y-2">
                        {unit.lessons.map((lesson) => (
                          <li
                            key={lesson.lessonId}
                            className={`p-2 rounded-lg shadow cursor-pointer hover:bg-blue-100 ${
                              activeLessonId === lesson.lessonId
                                ? "bg-blue-200 font-bold" // Класс для активного урока
                                : "bg-gray-50"
                            }`}
                            onClick={() => handleLessonClick(unit.unitId, lesson.lessonId)}
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

        {/* Панель отображения урока */}
        <div className="w-3/4 pl-4">
  <div
    className="p-4 bg-white rounded-lg shadow overflow-y-auto"
    style={{ maxHeight: "calc(100vh - 150px)" }} // Ограничиваем высоту, оставляя место для шапки
  >
    {selectedLesson ? (
      <>
        <h3 className="text-xl font-bold mb-4">{selectedLesson.title}</h3>
        <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
      </>
    ) : (
      <p className="text-gray-500">Нажмите на урок, чтобы просмотреть его содержимое.</p>
    )}
  </div>
</div>
      </div>
    </div>
  );
};

export default ViewPage;
