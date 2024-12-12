import axios from "axios";

export const registerUser = async (nickname, email, password, datebirth) => {
    try {
        const response = await axios.post("https://localhost:7079/api/auth/register", {
            nickname: nickname,
            email: email,
            password: password,
            datebirth: datebirth, // Добавляем поле даты рождения
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при попытке регистрации:", error);
        throw error;
    }
};