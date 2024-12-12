export const getUserCourses = async (token) => {
  const response = await fetch("https://localhost:7079/api/course/user/courses", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки курсов: ${response.statusText}`);
  }

  return response.json(); // Предполагаем, что сервер возвращает массив курсов
};
