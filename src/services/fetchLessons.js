import axios from 'axios';

// Функция для получения всех уроков для курса и юнита
export const fetchLessons = async (courseId, unitId, token) => {
  const response = await axios.get(
    `https://localhost:7079/api/course/${courseId}/units/${unitId}/lessons`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Функция для обновления урока
export const updateLesson = async (lessonId, updatedLesson, token, courseId, unitId) => {
  await axios.put(
    `https://localhost:7079/api/course/${courseId}/units/${unitId}/lessons/${lessonId}`,
    updatedLesson,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Функция для создания нового урока
export const createLesson = async (lessonData, token, courseId, unitId) => {
  const response = await axios.post(
    `https://localhost:7079/api/course/${courseId}/createunits/${unitId}/createlessons`,
    lessonData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Функция для получения содержимого урока по его ID
export const fetchLessonContent = async (courseId, unitId, lessonId, token) => {
  try {
    const response = await axios.get(
      `https://localhost:7079/api/course/${courseId}/units/${unitId}/lessons/${lessonId}/content`, // Путь для получения конкретного урока
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data; // Предположим, что сервер возвращает объект с полем "Content"
  } catch (error) {
    console.error('Ошибка при загрузке содержимого урока:', error);
    throw new Error('Не удалось загрузить содержимое урока.');
  }
};

export const deleteLesson = async (lessonId, token, courseId, unitId) => {
  try {
    const response = await axios.delete(
      `https://localhost:7079/api/course/${courseId}/units/${unitId}/lessons/${lessonId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data; // Возвращаем ответ сервера, если нужно
  } catch (error) {
    console.error('Ошибка при удалении урока:', error);
    throw new Error('Не удалось удалить урок.');
  }
};

export const reorderLessons = async (courseId, unitId, reorderedLessons, token) => {
  try {
    const response = await axios.post(
      `https://localhost:7079/api/course/${courseId}/units/${unitId}/lessons/reorder`,
      reorderedLessons,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при изменении порядка уроков:', error);
    throw new Error('Не удалось изменить порядок уроков.');
  }
};
