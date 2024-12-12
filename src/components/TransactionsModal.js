import React, { useState, useEffect } from "react";
import { getTransactions } from "../services/getTransactions"; // Импортируем сервис для получения транзакций
import { getCourseById } from "../services/getCourseById"; // Импортируем функцию для получения курса

const TransactionsModal = ({ userId, onClose }) => {
  const [transactions, setTransactions] = useState([]);
  const [courses, setCourses] = useState({}); // Для хранения названий курсов по ID
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await getTransactions(userId);
        setTransactions(data);

        // Подтягиваем информацию о курсах, если courseId присутствует в транзакциях
        const coursePromises = data.map(async (transaction) => {
          if (transaction.courseId) {
            try {
              const course = await getCourseById(transaction.courseId);
              setCourses((prevCourses) => ({
                ...prevCourses,
                [transaction.courseId]: course.title, // Сохраняем название курса
              }));
            } catch (err) {
              console.error("Ошибка при получении курса:", err);
            }
          }
        });

        await Promise.all(coursePromises);
      } catch (err) {
        setError("Ошибка загрузки транзакций.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [userId]);

  if (isLoading) return <div>Загрузка транзакций...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl"> {/* Ширина окна увеличена */}
        <h2 className="text-xl font-semibold mb-4">Транзакции</h2>
        {transactions.length === 0 ? (
          <p>У вас нет транзакций.</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Тип</th>
                <th className="px-4 py-2">Сумма</th>
                <th className="px-4 py-2">Курс</th> {/* Добавляем колонку для курса */}
                <th className="px-4 py-2">Дата</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.transactionId}>
                  <td className="border px-4 py-2">{transaction.transactionId}</td>
                  <td className="border px-4 py-2">{transaction.transactionType}</td>
                  <td className="border px-4 py-2">{transaction.amount} МудроБакс</td>
                  <td className="border px-4 py-2">
                    {transaction.courseId ? courses[transaction.courseId] || "Загружается..." : "Не применимо"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default TransactionsModal;
