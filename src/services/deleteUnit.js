import axios from 'axios';

export const deleteUnit = async (courseId, unitId, token) => {
  const response = await fetch(`https://localhost:7079/api/course/${courseId}/unit/${unitId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка удаления юнита: ${response.statusText}`);
  }

  // Если сервер возвращает 204 No Content, нет необходимости в `response.json()`
  return true;
};