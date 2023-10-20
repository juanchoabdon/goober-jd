import React from "react";

interface DriverRegistrationProps {
    handleRegister: (event: React.FormEvent<HTMLFormElement>) => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    formData: {
      name: string;
      email: string;
      plate: string;
      carModel: string;
    };
    isLoading: boolean;
  }

const DriverRegistrationForm: React.FC<DriverRegistrationProps> = ({ handleRegister, handleInputChange, formData, isLoading }) => {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <img src="/logo.png" alt="Goober Logo" className="mb-10 h-32" />
      <div className="relative w-96 rounded-md bg-white p-8 shadow-lg">
        <div>
          <h2 className="mb-4 text-xl font-bold">Become a Goober driver</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-md border p-2"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-md border p-2"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="plate">
                Plate
              </label>
              <input
                type="text"
                id="plate"
                name="plate"
                className="w-full rounded-md border p-2"
                value={formData.plate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="carModel">
                Car Model
              </label>
              <input
                type="text"
                id="carModel"
                name="carModel"
                className="w-full rounded-md border p-2"
                value={formData.carModel}
                onChange={handleInputChange}
                required
              />
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full rounded-md bg-blue-500 p-2 text-white"
            >
              {isLoading ? "Loading..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverRegistrationForm;
