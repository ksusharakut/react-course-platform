import { jwtDecode } from 'jwt-decode';

const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Токен не найден. Пользователь не авторизован.");
    }

    try {
        const decodedToken = jwtDecode(token); // Расшифровываем токен
        const userId = decodedToken.sub || decodedToken.id; // Используем sub или id, если userId отсутствует
        if (!userId) {
            throw new Error("Некорректный токен: отсутствует userId, sub или id.");
        }
        return userId; // Возвращаем userId
    } catch (err) {
        throw new Error("Ошибка при расшифровке токена: " + err.message);
    }
};

export default getCurrentUserId;
