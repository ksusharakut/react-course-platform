// utils/api.js

export const fetchUserCourses = async (userId, token) => {
  const response = await fetch(`https://localhost:7079/api/users/${userId}/courses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text(); // Получаем текст ошибки для более информативных сообщений
    throw new Error(errorMessage || "Не удалось загрузить курсы.");
  }

  return response.json();
};
