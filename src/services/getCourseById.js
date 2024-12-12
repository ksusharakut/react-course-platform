import axios from 'axios';

export const getCourseById = async (courseId) => {
    const token = localStorage.getItem("token"); // Получаем токен из localStorage
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
        },
    };

    try {
        const response = await axios.get(`https://localhost:7079/api/course/${courseId}`, config); // Запрос курса по ID
        return response.data; // Возвращаем данные курса
    } catch (err) {
        throw new Error('Ошибка при получении данных курса'); // Обрабатываем ошибку
    }
};
