import React, { useState } from "react";

const WithdrawBalanceModal = ({ isOpen, onClose, onWithdraw }) => {
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [accountDetails, setAccountDetails] = useState({
    bankName: "",
    accountNumber: "",
  });

  // Список банков
  const banks = ["Сбербанк", "Тинькофф", "ВТБ", "Альфа-Банк", "Росбанк"];

  // Курс конвертации
  const conversionRate = 0.8;

  // Обработчик изменения суммы
  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    setAmount(value);
    setConvertedAmount(value > 0 ? (value * conversionRate).toFixed(2) : 0);
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    if (!amount || amount <= 0) {
      alert("Введите корректную сумму для вывода.");
      return;
    }

    if (!accountDetails.bankName || !accountDetails.accountNumber) {
      alert("Заполните данные о банке и номере счета.");
      return;
    }

    try {
      // Вызов функции для вывода средств
      await onWithdraw({ amount, accountDetails });

      // Сброс состояния и закрытие модального окна
      setAmount("");
      setAccountDetails({ bankName: "", accountNumber: "" });
      onClose();
    } catch (error) {
      alert("Ошибка при выводе средств. Пожалуйста, попробуйте еще раз.");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Вывод средств</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Сумма для вывода (в МудроБаксах):</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="border rounded w-full mb-2 px-3 py-2"
            min="1"
          />
          <p className="text-gray-600 mb-4">
            Вы получите: <strong>{convertedAmount} рублей</strong>
          </p>

          <div className="mb-4">
            <label className="block mb-2">Выберите банк:</label>
            <select
              value={accountDetails.bankName}
              onChange={(e) =>
                setAccountDetails({ ...accountDetails, bankName: e.target.value })
              }
              className="border rounded w-full px-3 py-2"
            >
              <option value="">Выберите банк</option>
              {banks.map((bank, index) => (
                <option key={index} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Номер счета:</label>
            <input
              type="text"
              value={accountDetails.accountNumber}
              onChange={(e) =>
                setAccountDetails({
                  ...accountDetails,
                  accountNumber: e.target.value,
                })
              }
              className="border rounded w-full px-3 py-2"
              placeholder="Введите номер счета"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Подтвердить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawBalanceModal;
