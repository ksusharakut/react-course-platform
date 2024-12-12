import axios from 'axios';

export const createUnit = async (courseId, unitData, token) => {
  const response = await axios.post(
    `https://localhost:7079/api/course/${courseId}/unit`,
    unitData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',  // Явное указание Content-Type
      },
    }
  );
  return response.data;
};
