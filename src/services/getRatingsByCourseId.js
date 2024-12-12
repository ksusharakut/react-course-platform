import axios from 'axios';

export const getRatingsByCourseId = async (courseId) => {
    try {
        const response = await axios.get(`https://localhost:7079/api/rating/${courseId}/ratings`, {
            
        });
        return response.data; // Предполагаем, что это массив объектов с полем value
    } catch (error) {
        console.error('Ошибка при загрузке рейтингов курса:', error);
        return [];
    }
};
