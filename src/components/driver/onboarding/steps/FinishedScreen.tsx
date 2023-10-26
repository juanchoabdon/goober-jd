import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const FinishedScreen = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Confetti {...dimensions} />
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Congratulations!</h1>
        <p className="text-xl mb-4">
          You have successfully created an account with Goober.
        </p>
        <button
          className="bg-blue-500 text-white rounded-md px-4 py-2"
        >
          Recieve rides
        </button>
      </div>
    </div>
  );
};

export default FinishedScreen;
