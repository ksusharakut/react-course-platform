import axios from 'axios';

export const sendResetKey = async (email) => {
    try {
        const response = await axios.post('https://localhost:7079/api/auth/request_password_reset', { email });
        return response.data;
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
        throw error;
    }
};
