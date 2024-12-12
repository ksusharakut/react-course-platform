import axios from "axios";

export const getCourseSales = async (token) => {
  try {
    const response = await axios.get("https://localhost:7079/api/course/all-sales", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Ошибка при получении данных о продажах:", err);
    throw err;
  }
};
