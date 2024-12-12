import axios from 'axios';

export const getCategoryById = async (categoryId) => {
    const token = localStorage.getItem("token"); // Получаем токен из localStorage
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
        },
    };

    try {
        const response = await axios.get(`https://localhost:7079/api/category/${categoryId}`, config); // Запрос на получение категории по ID
        return response.data; // Возвращаем категорию
    } catch (err) {
        throw new Error('Ошибка при получении категории');
    }
};
