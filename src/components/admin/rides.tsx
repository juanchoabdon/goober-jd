import React, { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { type FormattedRide } from "~/shared/types/admin";
import { toast } from "react-toastify";
import moment from "moment";

const Rides = () => {
  const [rides, setRides] = useState<FormattedRide[]>();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<FormattedRide>();
  const getRides = api.admin.getRides.useMutation();
  const cancelRideMutation = api.rides.cancelRide.useMutation();

  useEffect(() => {
    getAllRides();
  }, []);

  const getAllRides = () => {
    getRides
      .mutateAsync()
      .then((data) => {
        setRides(data);
      })
      .catch((error) => {
        console.error("Failed to fetch rides:", error);
      });
  };

  const handleDetailClick = (ride: FormattedRide) => {
    setSelectedRide(ride);
    setIsDetailModalOpen(true);
  };

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const cancelRide = () => {
    if (!selectedRide) {
      return;
    }
    cancelRideMutation
      .mutateAsync({
        rideId: Number(selectedRide?.rideId),
      })
      .then(() => {
        toast.success("Ride was cancelled succesfully");
        getAllRides();
        setIsDetailModalOpen(true);
      })
      .catch((e) => {
        console.error("Failed to fetch rides:", e);
      });
  };

  return (
    <div className="rounded bg-white p-4 shadow">
      <h3 className="mb-4 text-lg font-bold">Ride Operations</h3>
      <table className="w-full">
        <thead>
          <tr>
            <th>Ride ID</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Revenue</th>
            <th>Profit</th>
            <th>Actions</th>
          </tr>
        </thead>
        {rides && (
          <tbody>
            {rides.map((ride: FormattedRide) => (
              <tr className="text-center" key={ride.rideId}>
                <td>{ride.rideId}</td>
                <td>
                  {moment(ride?.created_at).format("MMMM D, YYYY h:mm A")}
                </td>
                <td>{ride.status}</td>
                <td>${ride.price.toFixed(2)}</td>
                <td>${ride.company_profits.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => handleDetailClick(ride)}
                    className="rounded bg-purple-500 px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  >
                    See Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>

      {isDetailModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
          <div className="w-full max-w-xl rounded bg-white p-6">
            <h4 className="mb-4 text-center text-xl font-bold">Ride Details</h4>
            <div className="mb-4">
              <p>Ride ID: {selectedRide?.rideId}</p>
            </div>
            <div className="mb-4">
              <p>
                <strong>Status:</strong> {selectedRide?.status}
              </p>
              <p>
                <strong>Started:</strong>{" "}
                {moment(selectedRide?.created_at).format("MMMM D, YYYY h:mm A")}
              </p>
              {selectedRide?.finished_at && (
                <p>
                  <strong>Finished:</strong>{" "}
                  {moment(selectedRide.finished_at).format(
                    "MMMM D, YYYY h:mm A",
                  )}
                </p>
              )}
            </div>
            <div className="mb-4">
              <h5 className="font-semibold">Driver:</h5>
              <p>Name: {selectedRide?.driver.name}</p>
              <p>ID: {selectedRide?.driver.id}</p>
            </div>
            <div className="mb-4">
              <h5 className="font-semibold">Rider:</h5>
              <p>Name: {selectedRide?.rider.name}</p>
              <p>ID: {selectedRide?.rider.id}</p>
            </div>
            <div className="mb-4">
              <p>
                <strong>Pickup:</strong> {selectedRide?.pickup_address}
              </p>
              <p>
                <strong>Dropoff:</strong> {selectedRide?.dropoff_address}
              </p>
            </div>

            <div className="mb-4">
              <p>
                <strong>Revenue:</strong> {` $${selectedRide?.price}`}
              </p>
              <p>
                <strong>Profits:</strong> {` $${selectedRide?.company_profits}`}
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              {selectedRide?.status !== "finished" &&
                selectedRide?.status !== "cancelled" && (
                  <button
                    onClick={() => handleCancelClick()}
                    className="rounded bg-purple-500 px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-purple-600 focus:outline-none"
                  >
                    Cancel Ride
                  </button>
                )}
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="rounded bg-gray-300 px-4 py-2 text-black transition duration-150 ease-in-out hover:bg-gray-400 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isCancelModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
          <div className="w-full max-w-xl rounded bg-white p-6 text-center">
            <h4 className="mb-4 text-xl font-bold">Confirm Cancellation</h4>
            <p className="mb-4">Are you sure you want to cancel the ride?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  cancelRide();
                  setIsCancelModalOpen(false);
                }}
                className="rounded bg-purple-500 px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-purple-600 focus:outline-none"
              >
                Yes, Cancel Ride
              </button>
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="rounded bg-gray-300 px-4 py-2 text-black transition duration-150 ease-in-out hover:bg-gray-400 focus:outline-none"
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rides;
