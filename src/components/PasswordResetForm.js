import React, { useState } from 'react';
import { resetPassword } from '../services/resetPassword'; // Импортируем функцию
import { useLocation, useNavigate } from 'react-router-dom';

const PasswordResetForm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Получаем email из состояния навигации
    const email = location.state?.email || '';

    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Очистить старые сообщения
        setErrorMessage('');

        try {
            // Вызов функции для сброса пароля
            await resetPassword(email, token, newPassword);

            // Если запрос успешен, открываем модальное окно
            setIsModalOpen(true);
        } catch (err) {
            // Если ошибка, выводим сообщение об ошибке
            setErrorMessage(err.response?.data?.message || 'Ошибка при сбросе пароля.');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        navigate('/login'); // Переход на страницу логина
    };

    return (
        <div className='bg-white px-10 py-20 rounded-3xl'>
            <h1 className='text-5xl font-semibold mb-3 text-center'>Сброс пароля</h1>
            <p className='text-center mb-5'>Введите данные для сброса вашего пароля.</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className='text-lg font-medium'>Токен:</label>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent'
                        placeholder='Введите секретный ключ'
                        required
                        autoComplete="new-password"
                    />
                </div>
                <div className="mb-4">
                    <label className='text-lg font-medium'>Новый пароль:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent'
                        placeholder='Введите новый пароль'
                        required
                        autoComplete="new-password"
                    />
                </div>
                <div className='mt-8 flex flex-col gap-y-4'>
                    <button
                        type="submit"
                        className='active:scale-[.98] transition-all hover:scale-[1.01] py-3 rounded-xl bg-pink-500 text-white font-bold'>
                        Сбросить пароль
                    </button>
                </div>
                <div>
                    <button
                        type="button"
                        className='active:scale-[.98] transition-all hover:scale-[1.01] py-3 rounded-xl bg-pink-500 text-white font-bold'
                        onClick={() => navigate(-1)}>
                        Вернуться
                    </button>
                </div>
                {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            </form>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-center">
                            Пароль успешно обновлён
                        </h2>
                        <p className="text-center mb-4">
                            Теперь вы можете войти в систему с новым паролем.
                        </p>
                        <button
                            onClick={handleModalClose}
                            className="py-2 px-6 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600">
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordResetForm;
