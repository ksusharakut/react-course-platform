import axios from 'axios';

export const createLesson = async (lessonData, token, courseId, unitId) => {
  const response = await axios.post(
    `https://localhost:7079/api/course/${courseId}/createunits/${unitId}/createlessons`, // обновленный путь
    lessonData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};