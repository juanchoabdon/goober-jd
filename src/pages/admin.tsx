import React, { useState } from "react";
import Rides from "~/components/admin/rides";
import Dashboard from "~/components/admin/dashboard";
import Settings from "~/components/admin/settings";

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-between bg-purple-500 p-4 text-white">
        <h1 className="text-2xl font-bold">Goober Admin</h1>
        <button className="rounded bg-purple-500 px-4 py-2 hover:bg-purple-700">
          Sign Out
        </button>
      </div>

      <div className="my-4 flex justify-center space-x-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 text-lg ${
              selectedTab === "dashboard"
                ? "border-b-2 border-purple-600 bg-purple-200 font-bold"
                : ""
            }`}
            onClick={() => setSelectedTab("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={`px-4 py-2 text-lg ${
              selectedTab === "rides"
                ? "border-b-2 border-purple-600 bg-purple-200 font-bold"
                : ""
            }`}
            onClick={() => setSelectedTab("rides")}
          >
            Rides Operations
          </button>

          <button
            className={`px-4 py-2 text-lg ${
              selectedTab === "settings"
                ? "border-b-2 border-purple-600 bg-purple-200 font-bold"
                : ""
            }`}
            onClick={() => setSelectedTab("settings")}
          >
            Settings
          </button>
        </div>
      </div>
      <div className="p-6">
        {selectedTab === "dashboard" && <Dashboard />}
        {selectedTab === "rides" && <Rides />}
        {selectedTab === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default Admin;
