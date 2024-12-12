import axios from 'axios';

export const getPublishedCoursesByUser = async (userId) => {
  const token = localStorage.getItem("token"); // Получаем токен

  if (!token) {
    throw new Error("Токен не найден. Пожалуйста, выполните вход.");
  }

  try {
    const response = await axios.get(`https://localhost:7079/api/course/published/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Передаем токен в заголовке
      },
    });

    return response.data; // Возвращаем массив курсов
  } catch (error) {
    console.error("Ошибка при запросе опубликованных курсов пользователя:", error);
    throw error; // Бросаем ошибку, если запрос не удался
  }
};
