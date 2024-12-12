export const checkCourseProgress = async (courseId, userId, token) => {
  try {
    const response = await fetch(`https://localhost:7079/api/usercourseprogress/check-progress/${courseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.started;
    } else {
      throw new Error('Не удалось проверить прогресс курса');
    }
  } catch (err) {
    console.error('Ошибка при проверке прогресса курса:', err);
    return false;
  }
};
