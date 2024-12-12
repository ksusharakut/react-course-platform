import axios from "axios";

export const getTransactions = async (userId) => {
  const token = localStorage.getItem("token"); 
  if (!token) {
    throw new Error("Токен не найден. Пожалуйста, авторизуйтесь.");
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Добавляем токен в заголовки
    },
  };

  try {
    // Используем config для добавления токена в запрос
    const response = await axios.get(
      `https://localhost:7079/api/users/${userId}/transactions`,
      config
    );
    return response.data;
  } catch (error) {
    // Обработка ошибок
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
