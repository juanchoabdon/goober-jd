import React from 'react';

interface TabNavigationProps {
  currentTab: "available" | "completed";
  setCurrentTab: (tab: "available" | "completed") => void;
  listCompletedRides: () => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ currentTab, setCurrentTab, listCompletedRides }) => {
  return (
    <div className="mb-4 flex justify-between border-b bg-orange-500 text-white">
      <button
        className={`px-6 py-2 ${currentTab === "available" ? "border-white-800 border-b-4" : ""}`}
        onClick={() => setCurrentTab("available")}
      >
        Available Rides
      </button>
      <button
        className={`px-6 py-2 ${currentTab === "completed" ? "border-white-800 border-b-4" : ""}`}
        onClick={() => {
          listCompletedRides();
          setCurrentTab("completed");
        }}
      >
        Completed Rides
      </button>
    </div>
  );
}

export default TabNavigation;





