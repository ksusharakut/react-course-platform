import axios from 'axios';

// Функция для сброса пароля
export const resetPassword = async (email, token, newPassword) => {
  try {
    const response = await axios.post('https://localhost:7079/api/auth/reset_password', {
      email: email,
      token: token,
      newPassword: newPassword
    });
    return response.data; // Возвращаем данные, если запрос успешен
  } catch (error) {
    console.error("Ошибка при сбросе пароля:", error);
    throw error; // Выбрасываем ошибку для обработки в компоненте
  }
};
