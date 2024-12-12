import axios from 'axios';

const getBalance = async (userId, token) => {
  try {
    const response = await axios.get(`https://localhost:7079/api/users/${userId}/balance`, {
      headers: {
        Authorization: `Bearer ${token}`, // Добавляем токен в заголовки для авторизации
      },
    });

    if (response.status === 200) {
      return response.data.balance; // Предполагаем, что сервер возвращает объект с полем 'balance'
    } else {
      throw new Error('Не удалось получить баланс');
    }
  } catch (error) {
    throw new Error(error.message || 'Ошибка при запросе баланса');
  }
};

export { getBalance };
