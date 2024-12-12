import axios from "axios";

export const getUserRatingForCourse = async (courseId, token) => {
  try {
    const response = await axios.get(`https://localhost:7079/api/rating/qwerty/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Rating response:", response.data);  // Добавим вывод данных
    return response.data; // Предполагаем, что сервер возвращает объект с полями averageRating и userRating
  } catch (err) {
    console.error("Ошибка при запросе рейтинга:", err);
    throw new Error(err.response?.data?.message || "Ошибка при загрузке рейтинга для курса.");
  }
};

