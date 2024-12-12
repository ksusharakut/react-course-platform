import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../services/getUserById"; // Функция для запроса данных пользователя
import { getPublishedCoursesByUser } from "../services/getPublishedCoursesByUser"; // Функция для запроса курсов пользователя
import { getCategoryById } from "../services/getCategoryById"; // Функция для получения данных категории
import Header from "./Header";

const UserProfilePage = () => {
  const { userId } = useParams(); // Получаем ID пользователя из маршрута
  const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
  const [courses, setCourses] = useState([]); // Состояние для хранения курсов пользователя
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Загружаем данные пользователя
        const userData = await getUserById(userId);
        setUser(userData);

        // Загружаем курсы, созданные пользователем
        const coursesData = await getPublishedCoursesByUser(userId);
        
        // Для каждого курса загружаем категории
        const coursesWithCategories = await Promise.all(coursesData.map(async (course) => {
          // Подгружаем категории для каждого курса
          const categoryPromises = course.categoryIds.map((categoryId) =>
            getCategoryById(categoryId)
          );
          const categories = await Promise.all(categoryPromises);
          
          // Добавляем категории в курс
          return { ...course, categories };
        }));

        setCourses(coursesWithCategories);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Ошибка при загрузке данных");
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]); // Загружаем данные пользователя по его ID

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header />
      <div className="p-6">
        {/* Отображение данных пользователя */}
        <h1 className="text-3xl font-bold mb-4">{user.nickname}</h1>
        <div className="text-lg text-gray-700 mb-6">
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        {/* Отображение курсов пользователя */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Курсы пользователя</h2>
          {courses.length > 0 ? (
            <ul className="space-y-4">
              {courses.map((course) => (
                <li
                  key={course.courseId}
                  className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-xl cursor-pointer"
                  onClick={() => window.location.href = `/coursepage/${course.courseId}`}
                >
                  <div className="text-xl font-semibold mb-2">{course.title}</div>
                  <div className="text-gray-600 mb-2">
                    {/* Отображаем категории для курса */}
                    {course.categories && course.categories.length > 0 ? (
                      <>
                        <span className="font-semibold">Категории: </span>
                        <ul className="inline-block ml-2">
                          {course.categories.map((category) => (
                            <li key={category.categoryId} className="inline-block mr-2 bg-gray-300 px-2 py-1 rounded">
                              {category.categoryName}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <span>Без категорий</span>
                    )}
                  </div>
                  <div className="text-gray-900 font-semibold">
                    {course.price ? `${course.price} руб.` : "Цена не указана"}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">У этого пользователя нет опубликованных курсов.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
