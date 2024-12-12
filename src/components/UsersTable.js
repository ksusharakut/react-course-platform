import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../services/getUsers'; // Импортируем функцию запроса пользователей
import Header from './Header'; // Импортируем компонент Header

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await getUsers(); // Запрашиваем пользователей
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError('Ошибка при загрузке пользователей');
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    const handleUserClick = (userId) => {
        navigate(`/user/${userId}`); // Переход на страницу пользователя
    };

    return (
        <div>
            {/* Включаем Header */}
            <Header />

            {/* Таблица пользователей */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">

                {users.map((user) => (
                    <div
                        key={user.userId}
                        className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg hover:shadow-xl cursor-pointer"
                        onClick={() => handleUserClick(user.userId)}
                    >
                        {/* Используем серый кружок с первой буквой имени */}
                        <div
                            className="w-24 h-24 rounded-full bg-gray-400 mb-4 flex items-center justify-center"
                        >
                            {/* Отображаем первую букву имени */}
                            <span className="text-white text-xl">
                                {user.firstName ? user.firstName.charAt(0).toUpperCase() : ''}
                            </span>
                        </div>
                        <div className="text-xl font-semibold">{user.nickname}</div>
                        <div className="text-gray-600">{user.email}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersTable;
