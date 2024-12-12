import React, { useState } from 'react';
import { sendResetKey } from '../services/sendResetKey';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await sendResetKey(email);
            setMessage('Секретный ключ был отправлен на указанную почту.');
            setErrorMessage(''); // Сбрасываем сообщение об ошибке

            // Переход на форму ввода ключа и нового пароля
            navigate('/resetpass', { state: { email } });
        } catch (error) {
            setErrorMessage('Ошибка при отправке ключа. Проверьте введённую почту.');
            setMessage(''); // Сбрасываем успешное сообщение
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrorMessage(''); // Убираем сообщение об ошибке при изменении email
    };

    return (
        <div className='bg-white px-10 py-20 rounded-3xl'>
            <h1 className='text-5xl font-semibold mb-3 text-center'>Забыли пароль?</h1>
            <p className='text-center mb-5'>Введите адрес электронной почты, чтобы получить секретный ключ.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className='text-lg font-medium'>Почта:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange} // Используем обновленный обработчик
                        className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent'
                        placeholder='Введите ваш почтовый ящик'
                        required
                        autoComplete="new-password"
                    />
                </div>
                <div className='mt-8 flex flex-col gap-y-4'>
                    <button
                        type="submit"
                        className='active:scale-[.98] transition-all hover:scale-[1.01] py-3 rounded-xl bg-pink-500 text-white font-bold'>
                        Отправить
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
                {message && <p className="text-green-500 mt-4">{message}</p>}
                {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            </form>
        </div>
    );
}
