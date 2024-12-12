import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react'; // Подключение TinyMCE
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header'; // Ваш компонент Header
import { createLesson } from '../services/createLesson'; // Функция для отправки урока на сервер
import { fetchLessons, updateLesson, deleteLesson, fetchLessonContent, reorderLessons} from '../services/fetchLessons'; // Функция для получения и удаления уроков

const CreateLessonsPage = () => {
  const { courseId, unitId } = useParams(); // Получаем ID курса и юнита из маршрута
  const navigate = useNavigate();
  const [originalTitle, setOriginalTitle] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [lessons, setLessons] = useState([]); // Список созданных уроков
  const [selectedLessonId, setSelectedLessonId] = useState(null); // Хранит ID выбранного для редактирования урока
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Для отображения загрузки

  const token = localStorage.getItem('token');

  // Загружаем существующие уроки при открытии страницы
  useEffect(() => {
    const loadLessons = async () => {
      try {
        const loadedLessons = await fetchLessons(courseId, unitId, token);
        setLessons(loadedLessons);
      } catch (err) {
        console.error('Ошибка при загрузке уроков:', err);
        setError('Не удалось загрузить уроки.');
      }
    };

    loadLessons();
  }, [courseId, unitId, token]);

  // Функция для загрузки содержимого урока при его выборе
  const loadLessonContent = async (lessonId) => {
    setLoading(true);
    setError('');
    try {
      const lessonContent = await fetchLessonContent(courseId, unitId, lessonId, token);
      console.log('Loaded content:', lessonContent); // Лог для проверки
      setTitle(lessonContent.title);
      setContent(lessonContent.content);

      setOriginalTitle(lessonContent.title);
      setOriginalContent(lessonContent.content);
    } catch (err) {
      setError('Не удалось загрузить содержимое урока.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateLesson = async () => {
    // Проверяем, что название и содержимое не пустые, но только если они были изменены
    if (selectedLessonId && title === originalTitle && content === originalContent) {
      setError('Изменений не обнаружено.');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('Название и содержимое урока не могут быть пустыми.');
      return;
    }

    try {
      if (selectedLessonId) {
        // Обновляем урок
        await updateLesson(selectedLessonId, { title, content }, token, courseId, unitId);
        setLessons((prevLessons) =>
          prevLessons.map((lesson) =>
            lesson.lessonId === selectedLessonId ? { ...lesson, title } : lesson
          )
        );
        setSelectedLessonId(null); // Сбрасываем режим редактирования
      } else {
        // Создаем новый урок
        const newLesson = {
          unitId: parseInt(unitId),
          title,
          content,
          fileName: `${title.replace(/\s/g, '_')}_${Date.now()}.html`,
        };

        const createdLesson = await createLesson(newLesson, token, courseId, unitId);
        setLessons((prevLessons) => [...prevLessons, createdLesson]);
      }

      // Сброс формы
      setTitle('');
      setContent('');
      setOriginalTitle(''); // Сбрасываем оригинальное содержимое
      setOriginalContent('');
    } catch (err) {
      console.error('Ошибка при сохранении урока:', err);
      setError('Не удалось сохранить урок.');
    }
  };

  // Обработчик для выбора урока для редактирования
  const handleEditLesson = (lesson) => {
    setSelectedLessonId(lesson.lessonId);
    setTitle(lesson.title);
    setOriginalTitle(lesson.title);
    loadLessonContent(lesson.lessonId); // Загружаем содержимое и название урока при его выборе
  };

  // Функция для удаления урока
  const handleDeleteLesson = async (lessonId) => {
    try {
      await deleteLesson(lessonId, token, courseId, unitId);
      setLessons((prevLessons) => prevLessons.filter((lesson) => lesson.lessonId !== lessonId));
    } catch (err) {
      setError('Не удалось удалить урок.');
    }
  };

  const handleReorderLesson = async (lessonId, direction) => {
    const currentIndex = lessons.findIndex((lesson) => lesson.lessonId === lessonId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= lessons.length) {
      return;
    }

    const reorderedLessons = [...lessons];
    const [movedLesson] = reorderedLessons.splice(currentIndex, 1);
    reorderedLessons.splice(targetIndex, 0, movedLesson);

    // Обновляем порядок в локальном состоянии
    setLessons(reorderedLessons);

    // Подготовка данных для отправки на сервер
    const reorderData = reorderedLessons.map((lesson, index) => ({
      lessonId: lesson.lessonId,
      newOrderIndex: index,
    }));

    try {
      await reorderLessons(courseId, unitId, reorderData, token); // Отправляем новый порядок на сервер
    } catch (err) {
      setError('Не удалось обновить порядок уроков.');
      console.error(err);
    }
  };

  const handleClearForm = () => {
    setTitle('');
    setContent('');
    setOriginalTitle('');
    setOriginalContent('');
    setSelectedLessonId(null); // Если нужно сбросить выбранный урок
  };

  return (
    <div>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Создание уроков</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateOrUpdateLesson();
          }}
          className="space-y-6"
        >
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700">
              Название урока
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
            <label htmlFor="content" className="block text-lg font-medium text-gray-700">
              Содержимое урока
            </label>
            <Editor
              apiKey="efv1khah9a70fdgyk2fyb6m26tgv3iu7u5v7eno219exsyn2" // Укажите ваш TinyMCE API-ключ
              value={content}
              onEditorChange={(newContent) => setContent(newContent)}
              init={{
                height: 600,
                menubar: true,
                plugins: [
                  'advlist', 'anchor', 'autolink', 'autoresize', 'autosave', 'charmap', 'code',
                  'codesample', 'directionality', 'emoticons', 'fullscreen', 'help', 'image',
                  'imagetools', 'importcss', 'insertdatetime', 'link', 'lists', 'media',
                  'nonbreaking', 'pagebreak', 'preview', 'print', 'quickbars', 'save',
                  'searchreplace', 'table', 'template', 'visualblocks', 'visualchars', 'wordcount',
                ],
                toolbar: `undo redo | fontselect fontsizeselect formatselect | bold italic underline strikethrough |
                          forecolor backcolor | alignleft aligncenter alignright alignjustify |
                          outdent indent | bullist numlist checklist | image media link anchor |
                          table tabledelete tableprops | emoticons charmap | codesample code |
                          visualblocks visualchars | fullscreen preview print |
                          searchreplace | insertfile template | help`,
                toolbar_mode: 'sliding', // Удобная адаптация для небольших экранов
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {selectedLessonId ? 'Сохранить изменения' : 'Сохранить урок'}
          </button>

          <button
            type="button"
            onClick={handleClearForm}
            className="w-full py-2 mt-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Очистить
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Созданные уроки</h2>
          {lessons.length > 0 ? (
            <ul className="space-y-4">
              {lessons.map((lesson, index) => (
                <li
                  key={lesson.lessonId}
                  className="p-4 bg-gray-100 rounded-lg shadow flex justify-between items-center"
                >
                  <div>
                    <button
                      onClick={() => handleEditLesson(lesson)} // При клике на урок загружаем его содержимое
                      className="text-blue-500 underline"
                    >
                      {index + 1}. {lesson.title}
                    </button>
                  </div>
                  <div className="flex space-x-2">
                   <button
                      onClick={() => handleReorderLesson(lesson.lessonId, 'up')} // Перемещаем урок вверх
                      className="text-green-500 hover:text-green-700"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleReorderLesson(lesson.lessonId, 'down')} // Перемещаем урок вниз
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.lessonId)} // При клике на кнопку удаляем урок
                      className="text-red-500 hover:text-red-700"
                    >
                      Удалить
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Уроки еще не созданы.</p>
          )}
        </div>

        <div className="mt-6">
          <button
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={() => navigate(`/createcourse/${courseId}/createunits`)}
          >
            Вернуться к главам
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLessonsPage;
