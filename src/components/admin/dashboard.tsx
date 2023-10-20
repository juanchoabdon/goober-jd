import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import {
  type RevenueProfitsStats,
  type RidesStats,
} from "~/shared/types/admin";

const Dashboard: React.FC = () => {
  const [revenueStats, setRevenueStats] = useState<RevenueProfitsStats>();
  const [ridesStats, setRidesStats] = useState<RidesStats>();
  const revenueProfitsMutation = api.admin.getRevenueProfitsStats.useMutation();
  const ridesStatsMutation = api.admin.getRidesStats.useMutation();

  useEffect(() => {
    getRevenueStats();
    getRideStats();
  }, []);

  const getRevenueStats = () => {
    revenueProfitsMutation
      .mutateAsync()
      .then((data) => {
        setRevenueStats(data);
      })
      .catch((error) => {
        console.error("Failed to fetch revenue stats:", error);
      });
  };

  const getRideStats = () => {
    ridesStatsMutation
      .mutateAsync()
      .then((data) => {
        setRidesStats(data);
      })
      .catch((error) => {
        console.error("Failed to fetch rides stats:", error);
      });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Revenue Stats */}
      <div className="rounded bg-white p-4 shadow">
        <h3 className="mb-4 text-lg font-bold">Revenue Stats</h3>
        {revenueStats ? (
          <div className="mt-6 sm:flex block justify-around">
            <div className="mb-2 flex flex-col items-center">
              <span className="text-gray-600">30 days</span>
              <span className="text-2xl">${revenueStats.days30.revenue}</span>
            </div>
            <div className="mb-2 flex flex-col items-center">
              <span className="text-gray-600">90 days</span>
              <span className="text-2xl">${revenueStats.days90.revenue}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-600">180 days</span>
              <span className="text-2xl">${revenueStats.days180.revenue}</span>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Profit Stats */}
      <div className="rounded bg-white p-4 shadow">
        <h3 className="mb-4 text-lg font-bold">Profit Stats</h3>
        {revenueStats ? (
          <div className="mt-6 sm:flex block justify-around">
            <div className="mb-2 flex flex-col items-center">
              <span className="text-gray-600">30 days</span>
              <span className="text-2xl">${revenueStats.days30.profits}</span>
            </div>
            <div className="mb-2 flex flex-col items-center">
              <span className="text-gray-600">90 days</span>
              <span className="text-2xl">${revenueStats.days90.profits}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-600">180 days</span>
              <span className="text-2xl">${revenueStats.days180.profits}</span>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Active & Completed Rides */}
      <div className="col-span-2 mt-4 rounded bg-white p-4 shadow">
        <h3 className="mb-4 text-lg font-bold">Ride Stats</h3>
        {ridesStats ? (
          <div className="mt-4 sm:flex block justify-around">
            <div className="mb-2 flex flex-col items-center">
              <span className="text-gray-600">Active Rides</span>
              <span className="text-2xl">{ridesStats.activeRides}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-600">Completed Rides</span>
              <span className="text-2xl">{ridesStats.finishedRides}</span>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
