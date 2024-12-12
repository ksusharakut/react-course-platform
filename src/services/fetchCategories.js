export const fetchCategories = async (token) => {
  const response = await fetch('https://localhost:7079/api/category', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};
