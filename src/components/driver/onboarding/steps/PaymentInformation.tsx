import React, { useState } from "react";

const PaymentInformation = ({ onNext }) => {
  const [bankInfo, setBankInfo] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    routingNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(bankInfo);
  };

  const isFormComplete = Object.values(bankInfo).every(
    (value) => value.trim() !== "",
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <img src="/logo.png" alt="Goober Logo" className="mb-10 h-32" />
      <div className="relative w-full max-w-2xl rounded-md bg-white p-12 shadow-lg">
        <div>
          <h2 className="mb-4 text-xl font-bold">Payment Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="accountName">
                Account Name
              </label>
              <input
                type="text"
                id="accountName"
                name="accountName"
                className="w-full rounded-md border p-2"
                value={bankInfo.accountName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="accountNumber">
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                className="w-full rounded-md border p-2"
                value={bankInfo.accountNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="bankName">
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                className="w-full rounded-md border p-2"
                value={bankInfo.bankName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="routingNumber">
                Routing Number
              </label>
              <input
                type="text"
                id="routingNumber"
                name="routingNumber"
                className="w-full rounded-md border p-2"
                value={bankInfo.routingNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full rounded-md bg-blue-500 p-2 text-white ${
                !isFormComplete
                  ? "cursor-not-allowed opacity-50"
                  : "bg-blue-500"
              }`}
              disabled={!isFormComplete}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentInformation;
