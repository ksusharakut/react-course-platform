import axios from "axios";

export const withdrawBalance = async (userId, amount) => {
  const token = localStorage.getItem("token");  // Получаем токен из localStorage
  if (!token) {
    throw new Error("Токен не найден. Пожалуйста, авторизуйтесь.");
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Добавляем токен в заголовки
    },
  };

  const body = { amount };

  try {
    const response = await axios.patch(
      `https://localhost:7079/api/users/${userId}/deduct`,
      body,
      config
    );
    return response.data; // Возвращаем обновленный баланс пользователя
  } catch (err) {
    throw new Error(err.response?.data || "Ошибка при пополнении баланса");
  }
};