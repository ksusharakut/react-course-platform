import axios from 'axios';

export const getUnits = async (courseId, token) => {
  const response = await fetch(`https://localhost:7079/api/course/${courseId}/units`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки юнитов: ${response.statusText}`);
  }

  return response.json(); // Предполагаем, что сервер возвращает массив юнитов
};