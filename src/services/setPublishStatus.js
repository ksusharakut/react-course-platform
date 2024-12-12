import axios from "axios";

export const setPublishStatus = async (courseId, isPublished, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const body = { isPublished };

  try {
    const response = await axios.post(
      `https://localhost:7079/api/course/${courseId}/set-publish-status`,
      body,
      config
    );
    return response.data; // Сообщение об успешном действии
  } catch (err) {
    throw new Error(
      err.response?.data || "Ошибка при изменении статуса публикации"
    );
  }
};