import React, { useState, useEffect } from "react";
import { api } from "~/utils/api"; // Assuming api utility is set up to make trpc calls
import { toast } from 'react-toastify';

const Settings = () => {
  const [pricePerKm, setPricePerKm] = useState(0);
  const [takeRate, setTakeRate] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [pricePerMinute, setPricePerMinute] = useState(0);
  const updateSettingsMutation = api.admin.updateSettings.useMutation();
  const getSettings = api.admin.getSettings.useMutation();

  useEffect(() => {
    getSettings.mutateAsync()
      .then((settingsData) => {
        if (settingsData?.[0]) {
          setPricePerKm(settingsData[0].price_km);
          setTakeRate(settingsData[0].take_rate);
          setBasePrice(settingsData[0].base_price);
          setPricePerMinute(settingsData[0].price_minute);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch settings:", error);
      });
  }, []);
  
  const handleEdit = () => {
    if (!pricePerKm || !takeRate || !basePrice || !pricePerMinute) {
        return;
      }

    updateSettingsMutation
      .mutateAsync({
        price_km: pricePerKm,
        take_rate: takeRate,
        base_price: basePrice,
        price_minute: pricePerMinute,
      })
      .then((data) => {
        toast.success("Data successfully updated!");
      })
      .catch((error) => {
        console.error("Failed to fetch revenue stats:", error);
      });
  };

  const isEditDisabled = !pricePerKm || !takeRate || !basePrice || !pricePerMinute;

  return (
    <div className="rounded bg-white p-4 shadow">
      <h3 className="mb-4 text-lg font-bold">Settings</h3>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-bold">
          Ride Price per KM:
        </label>
        <input
          type="number"
          value={pricePerKm}
          onChange={(e) => setPricePerKm(parseFloat(e.target.value))}
          className="w-full appearance-none rounded border px-3 py-2 shadow"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-bold">Ride Take Rate:</label>
        <input
          type="number"
          value={takeRate}
          onChange={(e) => setTakeRate(parseFloat(e.target.value))}
          className="w-full appearance-none rounded border px-3 py-2 shadow"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-bold">Base Price:</label>
        <input
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(parseFloat(e.target.value))}
          className="w-full appearance-none rounded border px-3 py-2 shadow"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-bold">
          Price per Minute:
        </label>
        <input
          type="number"
          value={pricePerMinute}
          onChange={(e) => setPricePerMinute(parseFloat(e.target.value))}
          className="w-full appearance-none rounded border px-3 py-2 shadow"
        />
      </div>

      <button
        onClick={handleEdit}
        className={`rounded px-4 py-2 text-white ${isEditDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-500'}`}
      >
        Edit
      </button>
    </div>
  );
};

export default Settings;
