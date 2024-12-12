import React, { useState } from 'react';
import { registerUser } from '../services/registerUser';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
    
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dateBirth, setDateBirth] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Пароли не совпадают.");
            return;
        }

        try {
            const response = await registerUser(nickname, email, password, dateBirth);
            console.log("Успешная регистрация:", response);
            // Открываем модальное окно
            setIsModalOpen(true);
        } catch (error) {
            setErrorMessage("Ошибка при регистрации. Пожалуйста, проверьте данные.");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Перенаправляем на страницу входа после закрытия модального окна
        navigate('/login');
    };

    return (
        <div className='bg-white px-10 py-20 rounded-3xl'>
            {/* Модальное окно */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg text-center max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Аккаунт успешно создан!</h2>
                        <p className="mb-6">Вы можете войти в систему с вашим новым аккаунтом.</p>
                        <button
                            onClick={handleCloseModal}
                            className="bg-pink-500 text-white py-2 px-6 rounded-lg hover:bg-pink-600"
                        >
                            Перейти к входу
                        </button>
                    </div>
                </div>
            )}

            <h1 className='text-5xl font-semibold mb-3 text-center'>Регистрация</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className='text-lg font-medium'>Никнейм пользователя:</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent'
                        placeholder='Введите ваше имя'
                        required
                    />
                </div>
                <div>
                    <label className='text-lg font-medium'>Почта:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent'
                        placeholder='Введите ваш почтовый ящик'
                        required
                        autoComplete="new-password"
                    />
                </div>
                <div>
                    <label className='text-lg font-medium'>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent'
                        placeholder='Введите ваш пароль'
                        required
                        autoComplete="new-password"
                    />
                </div>
                <div>
                    <label className='text-lg font-medium'>Подтверждение пароля:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent'
                        placeholder='Подтвердите ваш пароль'
                        required
                    />
                </div>
                <div>
                    <label className='text-lg font-medium'>Дата рождения:</label>
                    <input
                        type="date"
                        value={dateBirth}
                        onChange={(e) => setDateBirth(e.target.value)}
                        className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent'
                        required
                    />
                </div>
                <div className='mt-8 flex flex-col gap-y-4'>
                    <button type="submit" className='active:scale-[.98] transition-all hover:scale-[1.01] py-3 rounded-xl bg-pink-500 text-white font-bold'>Зарегистрироваться</button>
                </div>
                {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                <div className='mt-8 flex justify-center items-center'>
                    <p className='font-medium text-base'>Уже есть аккаунт?</p>
                    <button type="button" className='ml-2 text-pink-500 text-base font-medium'
                    onClick={() => navigate('/login')}>Войти</button>
                </div>
            </form>
        </div>
    );
}
