// services/getUserById.js
import axios from 'axios';

export const getUserById = async (userId) => {
    const token = localStorage.getItem("token");  // Предположим, что токен сохраняется в localStorage

    try {
        const response = await axios.get(`https://localhost:7079/api/users/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return response.data;  // Возвращаем данные пользователя
    } catch (err) {
        console.error("Ошибка при загрузке данных о пользователе:", err);
        throw err;  // Выбрасываем ошибку, если запрос не удался
    }
};
