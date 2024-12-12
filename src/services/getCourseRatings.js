// Функция для получения среднего рейтинга курса
export const getCourseRatings = async (courseId) => {
    try {
        // Здесь запросим данные с сервера (можно заменить на реальный API запрос)
        const response = await fetch(`https://localhost:7079/api/courses/${courseId}/ratings`);
        const ratingsData = await response.json();

        if (!ratingsData || ratingsData.length === 0) {
            return 0; // Если нет рейтингов, возвращаем 0
        }

        // Считаем средний рейтинг
        const totalRating = ratingsData.reduce((acc, rating) => acc + rating.value, 0);
        const averageRating = totalRating / ratingsData.length;

        // Округляем до 1 знака после запятой
        return Math.round(averageRating * 10) / 10;
    } catch (error) {
        console.error('Ошибка при получении рейтингов курса:', error);
        return 0; // Возвращаем 0 в случае ошибки
    }
};
