import React from "react";
import { Driver } from "~/shared/types/drivers";

interface DriverHeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  driver: Driver | undefined;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  totalProfit?: string;
  updateDriverStatus: (status: string) => void;
  subscribeToReceiveRides: () => void;
}

const DriverHeader: React.FC<DriverHeaderProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  driver,
  isActive,
  setIsActive,
  totalProfit,
  updateDriverStatus,
  subscribeToReceiveRides,
}) => {
  return (
    <div className="bg-orange-500 p-4 text-white">
      <div className="bg-orange-500 p-4 text-white">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span className="text-2xl font-bold">≡</span>
            </button>
            {isMenuOpen && (
              <div className="absolute left-4 top-12 rounded bg-white p-4 shadow-lg">
                <button className="text-orange-500 hover:text-red-500">
                  Sign Out
                </button>
              </div>
            )}

            <h2 className="ml-4 text-xl font-bold">Welcome, {driver?.name}</h2>
          </div>

          <div className="flex items-center">
            <div className="mr-4 flex items-center">
              <label className="flex cursor-pointer items-center">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isActive}
                    onChange={() => {
                      updateDriverStatus(
                        !isActive ? "available" : "unavailable",
                      );
                      if (!isActive) {
                        subscribeToReceiveRides();
                      }
                      setIsActive(!isActive);
                    }}
                  />
                  <div
                    className={`h-6 w-12 rounded-full bg-gray-300 shadow-inner ${
                      isActive && "bg-green-400"
                    }`}
                  ></div>
                  <div
                    className={`dot absolute -left-1 top-0 h-6 w-6 rounded-full bg-white shadow transition ${
                      isActive && "translate-x-full"
                    }`}
                  ></div>
                </div>
                <div className="ml-3 font-medium text-white">
                  {isActive ? "Active" : "Inactive"}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-lg font-bold text-white">Total Profits:</span>
          {` $${totalProfit ?? 0}`}
        </div>

        <div className="mb-4">
          <p>Plate: {driver?.plate}</p>
          <p>Car Model: {driver?.car_model}</p>
        </div>
      </div>
    </div>
  );
};

export default DriverHeader;
