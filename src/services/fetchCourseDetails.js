export const fetchCourseDetails = async (courseId, token) => {
  const response = await fetch(`https://localhost:7079/api/course/${courseId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка при загрузке данных курса');
  }

  const courseData = await response.json();
  return courseData;
};