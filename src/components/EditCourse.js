import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCourseDetails } from '../services/fetchCourseDetails'; // Функция для получения деталей курса
import { updateCourse } from '../services/updateCourse'; // Функция для обновления курса
import { fetchCategories } from '../services/fetchCategories';
import { createCategory } from '../services/createCategory';
import { fetchCourseCategories } from '../services/fetchCourseCategories'; // Функция для получения категорий курса
import Header from './Header';

const EditCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // Категории для этого курса
  const [newCategory, setNewCategory] = useState(''); // Новая категория
  const [error, setError] = useState('');
  const { courseId } = useParams(); // Получаем courseId из URL
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Загружаем категории при загрузке страницы
useEffect(() => {
  const loadCategories = async () => {
    try {
      // Загружаем все категории
      const fetchedCategories = await fetchCategories(token);
      const sortedCategories = fetchedCategories.sort((a, b) =>
        a.categoryName.localeCompare(b.categoryName)
      );
      setCategories(sortedCategories);

      // Загружаем информацию о курсе
      const courseDetails = await fetchCourseDetails(courseId, token);
      setTitle(courseDetails.title);
      setDescription(courseDetails.description);
      setPrice(courseDetails.price);

      // Загружаем категории, связанные с курсом
      const courseCategories = await fetchCourseCategories(courseId, token);
      setSelectedCategories(courseCategories.map(category => category.categoryId)); // Устанавливаем выбранные категории
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Не удалось загрузить данные.');
    }
  };

  loadCategories();
}, [courseId, token]);



  // Обработчик изменения выбранных категорий
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Обработчик добавления новой категории
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const createdCategory = await createCategory({ categoryName: newCategory }, token);
      setCategories((prev) => {
        const updatedCategories = [...prev, createdCategory];
        return updatedCategories.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
      });
      setNewCategory('');
    } catch (err) {
      console.error('Ошибка создания категории:', err);
      setError('Не удалось создать категорию.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      setError('Пожалуйста, выберите хотя бы одну категорию.');
      return;
    }

    const courseData = {
      title,
      description,
      price: parseFloat(price),
      categoryIds: selectedCategories,
    };

    try {
      const createdCourse = await updateCourse(courseId, courseData, token); // Используйте updateCourse для обновления
      console.log(createdCourse);

      // Сохраняем courseId в localStorage
      localStorage.setItem('courseId', createdCourse.courseId);

      // Перенаправляем на страницу управления юнитами
      navigate(`/createcourse/${createdCourse.courseId}/createunits`);
    } catch (err) {
      console.error('Ошибка создания курса:', err);
      setError('Не удалось создать курс. Пожалуйста, попробуйте снова.');
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || value >= 0) {
      setPrice(value);
    }
  };

  return (
    <div>
      <Header />
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Редактировать курс</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700">
              Название курса
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-lg font-medium text-gray-700">
              Описание курса
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-lg font-medium text-gray-700">
              Цена курса
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={handlePriceChange}
              required
              min="0"
              placeholder="0"
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Категории</label>
            <div className="space-y-2 max-h-20 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.categoryId}>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories && selectedCategories.includes(category.categoryId)}
                      onChange={() => handleCategoryChange(category.categoryId)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2">{category.categoryName}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Добавить новую категорию"
                className="p-2 border border-gray-300 rounded-lg w-full"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="mt-2 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Добавить категорию
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Сохранить курс
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
