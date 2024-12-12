import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublishedCourses } from '../services/getCourses'; // Импортируем функцию запроса курсов
import { getCategoryById } from '../services/getCategoryById'; // Импортируем запрос категории по ID
import { getUserById } from '../services/getUserById.js'; // Импортируем запрос для получения данных о пользователе
import getCurrentUserId from '../utils/getCurrentUserId'; // Функция для получения текущего userId
import { getRatingsByCourseId } from '../services/getRatingsByCourseId';
import Header from './Header';

const CoursesTable = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState({}); // Храним категории как объект
    const [userNames, setUserNames] = useState({}); // Храним никнеймы пользователей по их ID
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [averageRatings, setAverageRatings] = useState({});
    const navigate = useNavigate();

    const currentUserId = getCurrentUserId(); // Получаем текущий userId

    useEffect(() => {
        const loadCoursesAndCategories = async () => {
            try {
                const coursesData = await getPublishedCourses();

                // Отфильтровываем курсы, созданные текущим пользователем
                const filteredCourses = coursesData.filter(course => course.userId !== currentUserId);
                setCourses(filteredCourses);

                // Для каждого курса загружаем категории по их ID
                const categoryPromises = filteredCourses.flatMap(course =>
                    course.categoryIds.map(categoryId => 
                        getCategoryById(categoryId).then(category => ({
                            [categoryId]: category.categoryName, // Возвращаем название категории
                        }))
                    )
                );

                const categoriesData = await Promise.all(categoryPromises);

                // Объединяем полученные категории в один объект
                const categoryMap = categoriesData.reduce((acc, categoryData) => {
                    return { ...acc, ...categoryData };
                }, {});

                setCategories(categoryMap);

                // Запрашиваем никнеймы пользователей, которые опубликовали курсы
                const userPromises = filteredCourses.map(course =>
                    getUserById(course.userId).then(user => ({
                        [course.userId]: user.nickname, // Сохраняем никнейм пользователя
                    }))
                );

                const usersData = await Promise.all(userPromises);

                // Объединяем данные о пользователях
                const userMap = usersData.reduce((acc, userData) => {
                    return { ...acc, ...userData };
                }, {});

                setUserNames(userMap);

                // Загружаем рейтинги курсов
                const ratingsPromises = filteredCourses.map(course =>
                    getRatingsByCourseId(course.courseId).then(ratings => {
                        // Рассчитываем средний рейтинг
                        const average =
                            ratings.length > 0
                                ? (ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length).toFixed(1)
                                : 'Нет рейтинга';
                        return { [course.courseId]: average };
                    })
                );

                const ratingsData = await Promise.all(ratingsPromises);
                const ratingsMap = ratingsData.reduce((acc, ratingData) => {
                    return { ...acc, ...ratingData };
                }, {});

                setAverageRatings(ratingsMap);

                
                setLoading(false);
            } catch (err) {
                setError('Ошибка при загрузке данных');
                setLoading(false);
            }
        };

        loadCoursesAndCategories();
    }, [currentUserId]); // Добавляем currentUserId как зависимость

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    const handleCourseClick = (courseId) => {
        navigate(`/coursepage/${courseId}`); // Переход на страницу курса
    };

    // Функция для получения названий категорий по их ID
    const getCategoryNames = (categoryIds) => {
        if (!categoryIds || categoryIds.length === 0) return 'Без категорий';

        // Для каждого ID категории находим её название из состояния categories
        return categoryIds
            .map(id => categories[id] || 'Неизвестная категория') // Получаем название категории по ID
            .join(', '); // Соединяем названия категорий через запятую
    };

    return (
        <div>
            <Header />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
    {courses.map((course) => (
        <div
            key={course.courseId}
            className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg hover:shadow-xl cursor-pointer"
            onClick={() => handleCourseClick(course.courseId)}
        >
            <div className="text-xl font-semibold mb-2">{course.title}</div>
            <div className="text-gray-600 mb-2">
                {getCategoryNames(course.categoryIds)} {/* Отображаем категории по их ID */}
            </div>
            <div className="text-gray-900 font-semibold">
                {course.price ? `${course.price} МудроБакс.` : 'Цена не указана'}
            </div>
            <div className="text-gray-500 mt-2">
                <strong>Опубликовал:</strong> {userNames[course.userId] || 'Неизвестный пользователь'}
            </div>
            <div className="text-gray-500 mt-2">
                <strong>Средний рейтинг:</strong>{' '}
                {averageRatings[course.courseId] !== undefined
                    ? averageRatings[course.courseId]
                    : 'Нет данных'} {/* Отображение среднего рейтинга */}
            </div>
        </div>
    ))}
</div>
        </div>
    );
};

export default CoursesTable;