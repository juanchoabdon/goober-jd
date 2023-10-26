import React, { FC } from "react";

interface AccountTypeSelectionProps {
  onNext: (type: string) => void;
}

const AccountTypeSelection: FC<AccountTypeSelectionProps> = ({ onNext }) => {
  const handleSelection = (type: string) => {
    onNext(type);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <img src="/logo.png" alt="Goober Logo" className="mb-10 h-32" />
      <div className="relative w-full max-w-2xl rounded-md bg-white p-12 shadow-lg">
        <div>
          <h2 className="mb-4 text-center text-xl font-bold">
            Select your account type to become a Goober Driver
          </h2>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleSelection("Regular Driver")}
              className="w-full rounded-md bg-blue-500 p-2 text-white"
            >
              Regular Driver
            </button>
            <button
              type="button"
              onClick={() => handleSelection("Luxury Driver")}
              className="w-full rounded-md bg-yellow-500 p-2 text-white"
            >
              Luxury Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelection;
