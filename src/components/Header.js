import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBook, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Удаляем токен из localStorage
        localStorage.removeItem('token');
        // Перенаправляем на страницу логина
        navigate('/login');
    };

    return (
        <header className="flex justify-between items-center p-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-md">
            {/* Логотип */}
            <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/getcourses')}>
                CourseEra
            </div>

            {/* Значки */}
            <div className="flex items-center gap-4">
                {/* Переход к созданию курса */}
                <button
                    className="p-2 bg-white text-blue-500 rounded-full shadow-md"
                    onClick={() => navigate('/createcourse')}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </button>

                {/* Профиль пользователя */}
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 bg-white text-blue-500 rounded-full shadow-md"
                        onClick={() => navigate('/profile')}
                    >
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                    <button
                        className="p-2 bg-white text-blue-500 rounded-full shadow-md"
                        onClick={() => navigate('/mycourses')}
                    >
                        <FontAwesomeIcon icon={faBook} />
                    </button>
                </div>

                {/* Кнопка выхода */}
                <button
                    className="py-2 px-4 bg-white text-black rounded-xl"
                    onClick={handleLogout}
                >
                    Выйти
                </button>
            </div>
        </header>
    );
};

export default Header;
