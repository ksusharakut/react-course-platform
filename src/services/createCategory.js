export const createCategory = async (categoryData, token) => {
  const response = await fetch('https://localhost:7079/api/category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) throw new Error('Failed to create category');
  return response.json();
};
