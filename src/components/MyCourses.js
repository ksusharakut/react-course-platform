import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "../services/fetchUserProfile.js";
import { getUserCourses } from "../services/getUserCourses.js";
import { getPurchasedCourses } from "../services/getPurchasedCourses.js"; // Новый сервис

import { useNavigate } from "react-router-dom";

import Header from "./Header.js";
import BalanceTopUpModal from "./BalanceTopUpModal.js";
import { topUpBalance } from "../services/topUpBalance.js";
import { rateCourse } from "../services/rateCourse";
import {getUserRatingForCourse } from "../services/getUserRatingForCourse.js"


const MyCourses = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [courses, setCourses] = useState([]);
const [purchasedCourses, setPurchasedCourses] = useState([]);
const [purchasedCoursesError, setPurchasedCoursesError] = useState("");
  const [courseError, setCourseError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [userRatings, setUserRatings] = useState({}); 
  const token = localStorage.getItem("token");
  

useEffect(() => {
  const loadUserData = async () => {
    try {
      // Загружаем профиль пользователя
      const profileData = await fetchUserProfile(token);
      setUserProfile(profileData);

       // Загружаем приобретённые курсы
        const purchasedCoursesData = await getPurchasedCourses(token);
        setPurchasedCourses(purchasedCoursesData);

     // Загружаем рейтинги для каждого курса
        const ratings = {};
        for (const course of purchasedCoursesData) {
          const ratingData = await getUserRatingForCourse(course.courseId, token);
          ratings[course.courseId] = ratingData.userRating;
        }
        setUserRatings(ratings);
    } catch (err) {
      console.error("Ошибка при загрузке данных:", err);
      setCourseError(
        err.message || "Ошибка загрузки данных пользователя."
      );
    } finally {
      setIsLoading(false);
    }
  };

  loadUserData();
}, [token]);

  const handleRatingChange = async (courseId, rating) => {
    try {
      const updatedRating = await rateCourse(token, courseId, rating);

      // Обновляем локальное состояние
      setUserRatings((prev) => ({
        ...prev,
        [courseId]: updatedRating.userRating,
      }));

      alert("Рейтинг успешно установлен!");
    } catch (err) {
      alert("Ошибка при выставлении рейтинга.");
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) return <div>Загрузка...</div>;
  if (!userProfile) return <div>Ошибка: профиль пользователя не найден.</div>;

  const { nickname, email, role, accountBalance } = userProfile;

  return (
    <div>
      <Header />
      <div className="p-6 max-w-full mx-auto bg-white rounded-xl shadow-md space-y-4 flex">
       
        

        {/* Секция курсов */}
        <div className="w-2/3 ml-8 space-y-8">
          

          {/* Приобретённые курсы */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Приобретённые курсы</h2>
            {purchasedCourses.length === 0 ? (
              <p className="text-gray-500">Вы пока не приобрели курсы.</p>
            ) : (
              purchasedCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="p-4 bg-gray-100 rounded-lg shadow"
                >
                  <h3 className="font-semibold">{course.title}</h3>
                  <p><strong>Описание:</strong> {course.description}</p>
                  <button
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate(`/viewpage/${course.courseId}`)}
                  >
                    Перейти к курсу
                  </button>

                  <div className="mt-4">
                    <p className="text-gray-700">Поставить оценку:</p>
                    <select
                      value={userRatings[course.courseId] || ""}
                      onChange={(e) =>
                        handleRatingChange(course.courseId, Number(e.target.value))
                      }
                      className="mt-1 p-2 border border-gray-300 rounded"
                    >
                      <option value="">Выберите оценку</option>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <BalanceTopUpModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onTopUp={(amount) => topUpBalance(userProfile.userId, amount)}
        pricePerBubble={10}
      />
    </div>
  );
};

export default MyCourses;
