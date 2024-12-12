import axios from "axios";

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post("https://localhost:7079/api/auth/login", {
            email: email,
            password: password,
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при попытке входа:", error);
        throw error;
    }
};