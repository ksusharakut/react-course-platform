export const updateUnit = async (courseId, unitId, updatedData, token) => {
  const response = await fetch(`https://localhost:7079/api/course/${courseId}/unit/${unitId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error('Ошибка при обновлении юнита');
  }

  return await response.json();
};