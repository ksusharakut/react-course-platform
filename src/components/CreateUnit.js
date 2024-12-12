import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUnit } from '../services/createUnit';
import { deleteUnit } from '../services/deleteUnit';
import { getUnits } from '../services/getUnits';
import { updateUnit } from '../services/updateUnit';
import { reorderUnits } from '../services/reorderUnits';
import { fetchLessons } from '../services/fetchLessons';
import Header from './Header';

// Компонент для отображения номера юнита
const UnitNumber = ({ number }) => (
  <span className="font-semibold text-lg mr-2">{number}</span>
);

const CreateUnit = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [unitName, setUnitName] = useState('');
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null); // Выбранный юнит
  const [editingUnit, setEditingUnit] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
  const fetchUnitsAndLessons = async () => {
    try {
      // Загружаем юниты
      const fetchedUnits = await getUnits(courseId, token);

      // Загружаем уроки для каждого юнита
      const unitsWithLessons = await Promise.all(
        fetchedUnits.map(async (unit) => {
          try {
            const lessons = await fetchLessons(courseId, unit.unitId, token); // Функция для получения уроков
            return { ...unit, lessons }; // Добавляем уроки к юниту
          } catch (err) {
            console.error(`Ошибка загрузки уроков для юнита ${unit.unitId}:`, err);
            return { ...unit, lessons: [] }; // Если ошибка, возвращаем пустой массив уроков
          }
        })
      );

      setUnits(unitsWithLessons);
    } catch (err) {
      console.error('Ошибка загрузки юнитов:', err);
      setError('Не удалось загрузить юниты.');
    } finally {
      setIsLoading(false);
    }
  };

  fetchUnitsAndLessons();
}, [courseId, token]);


  const handleCreateUnit = async () => {
    if (!unitName.trim()) {
      setError('Название юнита не может быть пустым.');
      return;
    }

    try {
      const newUnit = {
        title: unitName,
        courseId,
        order: units.length + 1,
      };
      const createdUnit = await createUnit(courseId, newUnit, token);
      setUnits((prevUnits) => [...prevUnits, createdUnit]);
      setUnitName('');
    } catch (err) {
      console.error('Ошибка создания юнита:', err);
      setError('Не удалось создать юнит. Пожалуйста, попробуйте снова.');
    }
  };

  const handleDeleteUnit = async (unitId) => {
    try {
      await deleteUnit(courseId, unitId, token);
      setUnits((prevUnits) => prevUnits.filter((unit) => unit.unitId !== unitId));
      if (selectedUnit === unitId) {
        setSelectedUnit(null);
      }
    } catch (err) {
      console.error('Ошибка удаления юнита:', err);
      setError('Не удалось удалить юнит.');
    }
  };

  const handleEditUnit = async (unitId) => {
  if (!editingName.trim()) {
    setError('Название не может быть пустым.');
    return;
  }

  try {
    const updatedUnit = await updateUnit(courseId, unitId, { title: editingName }, token);
    setUnits((prevUnits) =>
      prevUnits.map((unit) =>
        unit.unitId === unitId ? { ...unit, title: updatedUnit.title } : unit
      )
    );
    setEditingUnit(null); // Выход из режима редактирования
    setEditingName('');
  } catch (err) {
    console.error('Ошибка редактирования юнита:', err);
    setError('Не удалось обновить юнит.');
  }
  };
  
  const handleReorder = async (unitId, direction) => {
    const currentIndex = units.findIndex((unit) => unit.unitId === unitId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= units.length) {
      return;
    }

    const reorderedUnits = [...units];
    const [movedUnit] = reorderedUnits.splice(currentIndex, 1);
    reorderedUnits.splice(targetIndex, 0, movedUnit);

    reorderedUnits.forEach((unit, index) => {
      unit.orderIndex = index;
    });

    setUnits(reorderedUnits);

    const reorderedData = reorderedUnits.map((unit, index) => ({
      unitId: unit.unitId,
      newOrderIndex: index + 1,
    }));

    try {
      await reorderUnits(courseId, reorderedData, token);
    } catch (err) {
      console.error('Ошибка обновления порядка юнитов:', err);
      setError('Не удалось обновить порядок юнитов.');
    }
  };

  const handleSelectUnit = (unitId) => {
    setSelectedUnit(unitId); // Выбор юнита
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div>
      <Header />
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Создание глав для курса</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isLoading ? (
          <p>Загрузка глав...</p>
        ) : (
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateUnit();
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="unitName" className="block text-lg font-medium text-gray-700">
                  Название главы
                </label>
                <input
                  type="text"
                  id="unitName"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  required
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Создать главу
              </button>
            </form>

           <div className="mt-8">
  <h2 className="text-xl font-semibold">Существующие главы</h2>
  <ul className="space-y-4 mt-4">
    {units.map((unit, index) => (
      <li
        key={unit.unitId}
        className={`flex flex-col justify-between items-start p-4 rounded-lg shadow ${
          selectedUnit === unit.unitId ? 'bg-blue-100' : 'bg-white'
        }`}
        onClick={() => handleSelectUnit(unit.unitId)} // При клике выбираем юнит
      >
        <div className="flex justify-between w-full items-center">
          <div className="flex items-center">
  <UnitNumber number={index + 1} /> {/* Отображаем номер юнита */}
  {editingUnit === unit.unitId ? (
    <>
      <input
        type="text"
        value={editingName}
        onChange={(e) => setEditingName(e.target.value)}
        className="border rounded p-2 flex-1"
        placeholder="Введите новое название"
      />
      <button
        onClick={() => handleEditUnit(unit.unitId)}
        className="ml-2 bg-green-500 text-white rounded px-4 py-2"
      >
        Сохранить
      </button>
      <button
        onClick={() => setEditingUnit(null)} // Отмена редактирования
        className="ml-2 bg-gray-300 rounded px-4 py-2"
      >
        Отмена
      </button>
    </>
  ) : (
    <span className="ml-2">{unit.title}</span>
  )}
</div>
<div>
  {editingUnit !== unit.unitId && (
    <button
      onClick={() => {
        setEditingUnit(unit.unitId); // Установить текущий юнит для редактирования
        setEditingName(unit.title); // Задать начальное значение
      }}
      className="text-blue-500 hover:text-blue-600 ml-2"
    >
      Редактировать
    </button>
  )}
  <button
    onClick={() => handleDeleteUnit(unit.unitId)}
    className="text-red-500 hover:text-red-600 ml-2"
  >
    Удалить
  </button>
  <button
    onClick={() => handleReorder(unit.unitId, 'up')}
    className="text-gray-500 hover:text-gray-600 ml-2"
    disabled={index === 0}
  >
    ↑
  </button>
  <button
    onClick={() => handleReorder(unit.unitId, 'down')}
    className="text-gray-500 hover:text-gray-600 ml-2"
    disabled={index === units.length - 1}
  >
    ↓
  </button>
</div>
        </div>

        {/* Отображение списка уроков */}
        {unit.lessons && unit.lessons.length > 0 ? (
          <ul className="mt-2 ml-8 space-y-1">
            {unit.lessons.map((lesson) => (
              <li key={lesson.lessonId} className="text-gray-600">
                {lesson.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 mt-2 ml-8">Уроков нет</p>
        )}
      </li>
    ))}
  </ul>
</div>

            <button
              className={`px-6 py-2 font-semibold rounded-lg shadow ${
                selectedUnit
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={() =>
                selectedUnit &&
                navigate(`/createcourse/${courseId}/createunits/${selectedUnit}/createlessons`)
              }
              disabled={!selectedUnit}
            >
              Перейти на форму создания уроков
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUnit;
