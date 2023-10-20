import React from "react";
import { useRouter } from "next/router";

const RoleSelection: React.FC = () => {
  const router = useRouter();

  const handleRoleSelection = (role: "rider" | "driver" | "admin") => {
    void router.push(`/${role}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <img src="/logo.png" alt="Goober Logo" className="mb-10 h-32" />

      <div className="rounded-lg bg-white p-10 text-center shadow-md">
        <h2 className="mb-4 text-2xl">Select your role in Goober</h2>

        <button
          className="mt-4 block w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
          onClick={() => handleRoleSelection("rider")}
        >
          {`I'm a Rider`}
        </button>

        <button
          className="mt-4 block w-full rounded bg-orange-500 py-2 text-white hover:bg-orange-600"
          onClick={() => handleRoleSelection("driver")}
        >
          {`I'm a Driver`}
        </button>

        <button
          className="mt-4 block w-full rounded bg-purple-400 py-2 text-white hover:bg-purple-500"
          onClick={() => handleRoleSelection("admin")}
        >
          {`I'm an Admin`}
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
