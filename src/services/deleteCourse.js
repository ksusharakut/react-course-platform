export const deleteCourse = async (courseId, token) => {
  const response = await fetch(`https://localhost:7079/api/course/${courseId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Не удалось удалить курс');
  }

  // Проверяем, если ответ пустой (статус 204 No Content), то просто возвращаем успешный результат
  if (response.status === 204) {
    return;  // Пустой ответ, ничего не нужно возвращать
  }

  // Если есть тело ответа, обрабатываем его как JSON
  return response.json();
};