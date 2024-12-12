// services/startCourse.js
export const startCourse = async (courseId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`https://localhost:7079/api/usercourseprogress/purchase/${courseId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error("Не удалось начать курс.");
  }

  return response;
};
