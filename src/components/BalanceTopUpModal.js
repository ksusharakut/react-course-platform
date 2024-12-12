import React, { useState } from "react";

const BalanceTopUpModal = ({ isOpen, onClose, onTopUp }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [calculatedCoins, setCalculatedCoins] = useState(0);

  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 16);
    return numbers.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const resetForm = () => {
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setCustomAmount("");
    setCalculatedCoins(0);
  };

  const formatExpiryDate = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) {
      return numbers;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    }
  };

  const formatCvv = (value) => {
    return value.replace(/\D/g, "").slice(0, 3);
  };

  const handleTopUp = () => {
    if (cardNumber && expiryDate && cvv && customAmount > 0) {
      const amountInCoins = customAmount; // Сумма для пополнения
      onTopUp(amountInCoins); // Передаем сумму пополнения
      resetForm(); // Очищаем форму после пополнения
      onClose(); // Закрываем модальное окно
    } else {
      alert("Введите корректную сумму!");
    }
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value > 0) {
      setCalculatedCoins(value); // Количество МудроКоинов теперь равно введенной сумме
    } else {
      setCalculatedCoins(0);
    }
  };

  const handleClose = () => {
    resetForm(); // Сброс данных
    onClose(); // Закрытие модального окна
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Пополнить баланс</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Номер карты</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className="w-full border rounded p-2"
              placeholder="Введите номер карты"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block mb-1">Срок действия</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              className="w-full border rounded p-2"
              placeholder="MM/YY"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block mb-1">CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(formatCvv(e.target.value))}
              className="w-full border rounded p-2"
              placeholder="CVV"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block mb-1">Введите сумму для пополнения (в рублях)</label>
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="w-full border rounded p-2"
              placeholder="Введите сумму"
            />
          </div>
          <div>
            <p>Вы получите: {calculatedCoins} МудроКоинов</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Отмена
          </button>
          <button
            onClick={handleTopUp}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Пополнить баланс
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceTopUpModal;
