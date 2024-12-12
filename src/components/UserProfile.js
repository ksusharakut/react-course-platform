import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "../services/fetchUserProfile";
import { getUserCourses } from "../services/getUserCourses";
import { deleteCourse } from "../services/deleteCourse";
import { setPublishStatus } from "../services/setPublishStatus";
import { getCourseSales } from "../services/getCourseSales";
import { useNavigate } from "react-router-dom";
import { getCategoryById } from "../services/getCategoryById";
import Header from "./Header";
import BalanceTopUpModal from "./BalanceTopUpModal";
import { topUpBalance } from "../services/topUpBalance.js";
import WithdrawBalanceModal from "./WithdrawBalanceModal"; // Новый компонент
import { withdrawBalance } from "../services/withdrawBalance"; // Новый сервис
import TransactionsModal from "./TransactionsModal"; // Новый компонент для транзакций

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [courseSales, setCourseSales] = useState({});
  const [courseError, setCourseError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false); 
  const token = localStorage.getItem("token");

useEffect(() => {
  if (!token) {
    navigate("/login");
    return;
  }

  const loadUserData = async () => {
    try {
      const profileData = await fetchUserProfile(token);
      setUserProfile(profileData);

      const userCourses = await getUserCourses(token);
      const coursesWithCategories = await Promise.all(
        userCourses.map(async (course) => {
          if (course.categoryIds?.length > 0) {
            const categories = await Promise.all(
              course.categoryIds.map(getCategoryById)
            );
            return { ...course, categories };
          }
          return { ...course, categories: [] };
        })
      );

      setCourses(coursesWithCategories);

      const salesData = await getCourseSales(token);
      const salesMap = salesData.reduce((acc, sale) => {
        acc[sale.courseId || sale.CourseId] = sale.salesCount || sale.SalesCount;
        return acc;
      }, {});

      setCourseSales(salesMap);

      // Вычисление общей прибыли
      const totalProfit = coursesWithCategories.reduce((sum, course) => {
        const salesCount = salesMap[course.courseId] || 0;
        return sum + salesCount * course.price;
      }, 0);

      setUserProfile((prevProfile) => ({
        ...prevProfile,
        totalProfit,
      }));
    } catch (err) {
      setCourseError(err.message || "Ошибка загрузки данных.");
    } finally {
      setIsLoading(false);
    }
  };

  loadUserData();
}, [token, navigate]);

  const handleEditCourse = (courseId) => {
    navigate(`/editcourse/${courseId}`);
  };

const handleWithdraw = async ({ amount, accountDetails }) => {
  try {
    // Пример вызова сервиса вывода средств
    await withdrawBalance(userProfile.userId, amount, accountDetails, token);

    // Обновление баланса пользователя
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      accountBalance: prevProfile.accountBalance - amount,
    }));

    alert("Средства успешно выведены.");
  } catch (error) {
    console.error("Ошибка при выводе средств:", error);
    alert("Не удалось вывести средства. Попробуйте еще раз.");
  }
};

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId, token);
      setCourses(courses.filter((course) => course.courseId !== courseId));
      alert("Курс успешно удален.");
    } catch (err) {
      setCourseError("Ошибка при удалении курса: " + err.message);
    }
  };

  const togglePublishStatus = async (course) => {
    try {
      const updatedStatus = !course.isPublished;
      await setPublishStatus(course.courseId, updatedStatus, token);
      setCourses(
        courses.map((c) =>
          c.courseId === course.courseId ? { ...c, isPublished: updatedStatus } : c
        )
      );
    } catch (err) {
      setCourseError("Ошибка при изменении статуса публикации: " + err.message);
    }
  };

    const handleTopUp = async (amount) => {
  try {
    // Отправка запроса на сервер
    const response = await topUpBalance(userProfile.userId, amount, token);

    if (response.success) {
      // Обновление состояния баланса пользователя
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        accountBalance: prevProfile.accountBalance + Number(amount),
      }));

      alert("Баланс успешно пополнен.");
    } else {
      alert("Ошибка при пополнении баланса. Попробуйте еще раз.");
    }
  } catch (error) {
    console.error("Ошибка при пополнении баланса:", error);
    alert("Не удалось пополнить баланс.");
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
        <div className="w-1/3">
  <h1 className="text-2xl font-semibold">Профиль пользователя</h1>
  <div className="space-y-2">
    <p><strong>Никнейм:</strong> {nickname || "Не указано"}</p>
    <p><strong>Email:</strong> {email || "Не указан"}</p>
   
    <p><strong>Баланс аккаунта:</strong> {userProfile.accountBalance } МудроБакс </p>
    <p><strong>Общая прибыль:</strong> {userProfile.totalProfit || 0} МудроБакс </p>
    {/* Обертка для кнопок с промежутком */}
        <div  className="space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Пополнить баланс
          </button>
          <button
            className="bg-pink-400 text-white px-4 py-2 rounded"
            onClick={() => setIsWithdrawModalOpen(true)}
          >
            Вывести средства
              </button>
              <button
  className="bg-green-500 text-white px-4 py-2 rounded"
  onClick={() => setIsTransactionsModalOpen(true)}
>
  Посмотреть транзакции
</button>
        </div>
  </div>
</div>
        <div className="w-2/3 ml-8 space-y-8">
          <h2 className="text-xl font-semibold mb-4">Ваши курсы</h2>
          {courseError && <p className="text-purple-900">{courseError}</p>}
          {courses.length === 0 ? (
            <p className="text-gray-500">У вас пока нет созданных курсов.</p>
          ) : (
            courses.map((course) => (
              <div
                key={course.courseId}
                className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{course.title}</h3>
                  <p><strong>Цена:</strong> {course.price} рублей</p>
                  <p><strong>Статус:</strong> {course.isPublished ? "Опубликован" : "Скрыт"}</p>
                  <p><strong>Продано:</strong> {courseSales[course.courseId] || 0} копий</p>
                </div>
                <div className="space-x-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleEditCourse(course.courseId)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="bg-purple-900 text-white px-4 py-2 rounded"
                    onClick={() => handleDeleteCourse(course.courseId)}
                  >
                    Удалить
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${course.isPublished ? "bg-yellow-500" : "bg-green-500"} text-white`}
                    onClick={() => togglePublishStatus(course)}
                  >
                    {course.isPublished ? "Скрыть" : "Опубликовать"}
                  </button>
                  
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Модальное окно пополнения баланса */}
      <BalanceTopUpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTopUp={handleTopUp}
      />
      <WithdrawBalanceModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdraw={handleWithdraw}
      />
      {isTransactionsModalOpen && (
        <TransactionsModal
          userId={userProfile.userId}
          onClose={() => setIsTransactionsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;
