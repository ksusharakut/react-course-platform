// Пример сервиса reorderUnits (в services/reorderUnits.js)
export const reorderUnits = async (courseId, units, token) => {
  const response = await fetch(`https://localhost:7079/api/course/${courseId}/units/reorder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(units),
  });

  if (!response.ok) {
    throw new Error('Не удалось обновить порядок юнитов');
  }

  return await response.json();
};