import axios from 'axios';

export const getUsers = async () => {
    const token = localStorage.getItem("token"); // Получаем токен из localStorage
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
        },
    };

    const response = await axios.get('https://localhost:7079/api/users', config); // Запрос с токеном
    return response.data;
};
