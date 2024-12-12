import axios from "axios";

export const getPurchasedCourses = async (token) => {
  try {
    const response = await axios.get("https://localhost:7079/api/usercourseprogress/me/courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Возвращаем данные о курсах
  } catch (error) {
    console.error("Ошибка при загрузке приобретённых курсов:", error);
    throw new Error(
      error.response?.data?.message || "Не удалось загрузить курсы пользователя."
    );
  }
};
