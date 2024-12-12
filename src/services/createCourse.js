// src/api/api.js
import axios from 'axios';

const API_URL = 'https://localhost:7079/api/course'; // Замените на ваш URL

export const createCourse = async (courseData, token) => {
  try {
    const response = await axios.post(API_URL, courseData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании курса:', error);
    throw error;
  }
};
