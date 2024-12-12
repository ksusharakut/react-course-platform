export const fetchCourseCategories  = async (courseId, token) => {
  const response = await fetch(`https://localhost:7079/api/category/course/${courseId}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch course categories');
  
  return response.json();
};