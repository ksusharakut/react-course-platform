import axios from 'axios';

export const getPublishedCourses = async () => {
    const token = localStorage.getItem("token"); // Получаем токен из localStorage
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
        },
    };

    try {
        const response = await axios.get('https://localhost:7079/api/course/publishedcourses', config); // Запрос с токеном для опубликованных курсов
        return response.data; // Возвращаем данные курсов
    } catch (err) {
        throw new Error('Ошибка при получении опубликованных курсов'); // Обрабатываем ошибку
    }
};

export const getCourses = async () => {
    const token = localStorage.getItem("token"); // Получаем токен из localStorage
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
        },
    };
try {
        const response = await axios.get('https://localhost:7079/api/course', config); // Запрос с токеном для получения курсов
        return response.data; // Возвращаем данные курсов
    } catch (err) {
        throw new Error('Ошибка при получении курсов'); // Обрабатываем ошибку
    }
};
