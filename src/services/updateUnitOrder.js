export const reorderUnits = async (courseId, reorderedData, token) => {
  const response = await fetch(`https://localhost:7079/api/course/${courseId}/reorder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reorderedData),
  });

  if (!response.ok) {
    throw new Error('Ошибка при обновлении порядка юнитов');
  }

  return await response.json();
};
