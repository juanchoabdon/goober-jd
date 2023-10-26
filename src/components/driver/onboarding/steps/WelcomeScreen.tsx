import React from "react";

interface WelcomeScreenProps {
  onNext: () => void;
  accountType: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext, accountType }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <img src="/logo.png" alt="Goober Logo" className="mb-10 h-32" />
      <div className="relative text-center w-full max-w-2xl rounded-md bg-white p-12 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-center"> Welcome to Goober, you are a {accountType} </h2>
        <p> You will have to complete certain information in order to recieve rides </p>
        <div className="centered-content">
          <img src="/waiting-car.gif" alt="Waiting for a car" />
        </div>
        <button
          onClick={onNext}
          className={`w-full rounded-md bg-blue-500 p-2 text-white`}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
