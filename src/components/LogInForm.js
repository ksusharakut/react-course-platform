import React, { useState } from 'react';
import { loginUser } from '../services/loginUser';
import { useNavigate } from 'react-router-dom';

export default function LogInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

         try {
        const response = await loginUser(email, password);
        console.log("Успешный вход:", response);
        // Сохранить токен в localStorage
        localStorage.setItem("token", response.token);
        console.log(response.token);

         if (response.userRole === 'admin') {
                // Перенаправляем администратора на страницу администратора
                navigate('/admin/courses');
            } else {
                // Перенаправляем обычного пользователя на страницу курсов
                navigate('/getcourses');
            }
    } catch (error) {
        setErrorMessage("Ошибка при входе. Пожалуйста, проверьте данные.");
    }
    };

    
    return (
        <div className='bg-white px-10 py-20 rounded-3xl'>
            <h1 className='text-5xl font-semibold mb-3 text-center'>Вход</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className='text-lg font-medium'>Почта:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent'
                        placeholder='Введите свой почтовый ящик'
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
                        placeholder='Введите свой пароль'
                        required
                        autoComplete="new-password"
                    />
                </div>
                <div className='mt-2'>
                    <button
                        type="button"
                        className='font-medium text-base text-pink-500'
                        onClick={() => navigate('/forgotpass')}
                    >Забыли пароль?</button>
                </div>
                <div className='mt-8 flex flex-col gap-y-4'>
                    <button type="submit" className='active:scale-[.98] transition-all hover:scale-[1.01] py-3 rounded-xl bg-pink-500 text-white font-bold'>Войти</button>
                </div>
                {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                <div className='mt-8 flex justify-center items-center'>
                    <p className='font-medium text-base'>Всё ещё нет аккаунта?</p>
                    <button
                        type="button"
                        className='ml-2 text-pink-500 text-base font-medium'
                        onClick={() => navigate('/register')}
                    >Создать</button>
                </div>
            </form>
        </div>
    );
}