export const updateCourse = async (courseId, courseData, token) => {
  const response = await fetch(`https://localhost:7079/api/course/${courseId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(courseData),
  });

  if (!response.ok) {
    throw new Error('Ошибка при обновлении курса');
  }

  const updatedCourse = await response.json();
  return updatedCourse;
};
