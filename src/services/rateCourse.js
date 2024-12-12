// services/rateCourse.js

export const rateCourse = async (token, courseId, userRating) => {
  try {
    const response = await fetch(`https://localhost:7079/api/rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Токен пользователя
      },
      body: JSON.stringify({
        courseId,
        userRating,
      }),
    });

    if (!response.ok) {
      throw new Error("Не удалось отправить рейтинг");
    }

    const updatedRating = await response.json();
    return updatedRating;
  } catch (err) {
    console.error("Ошибка при отправке рейтинга:", err);
    throw err; // Пробрасываем ошибку для обработки на уровне компонента
  }
};
