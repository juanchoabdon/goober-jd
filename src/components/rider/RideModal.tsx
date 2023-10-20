import React from "react";
import { type Driver } from "~/shared/types/drivers";
import { type RideQuote, type RideRequest } from "~/shared/types/rides";

interface RideModalProps {
  showModal: boolean;
  rideRequest?: RideRequest;
  rideQuote?: RideQuote;
  isLoadingRideRequest: boolean;
  driver?: Driver;
  handleConfirmClick: () => void;
  handleCancelRide: () => void;
  resetMapAndAddresses: () => void;
  handleShowModal: () => void;
}

const RideModal: React.FC<RideModalProps> = ({
  showModal,
  rideRequest,
  rideQuote,
  isLoadingRideRequest,
  driver,
  handleConfirmClick,
  handleCancelRide,
  resetMapAndAddresses,
  handleShowModal
}) => {
  if (!showModal) return null;

  return (
    <div className="shadow-t fixed bottom-0 left-0 z-50 w-full transform bg-white p-4 transition-transform duration-300">
      {!rideRequest?.status && (
        <>
          <h3 className="mb-2 text-xl font-bold">Ride Details</h3>
          <p>Price: {rideQuote?.estimatedPrice} (Estimated)</p>
          <p>ETA: {rideQuote?.estimatedETA}</p>
          <button
            disabled={isLoadingRideRequest}
            className="mt-4 w-full rounded bg-blue-500 p-2 text-white"
            onClick={handleConfirmClick}
          >
            {isLoadingRideRequest ? "Loading..." : "Confirm"}
          </button>
          <button
            className="mt-2 w-full rounded bg-red-500 p-2 text-white"
            onClick={() => handleShowModal()}
          >
            Cancel Ride
          </button>
          <p className="disclaimer mt-2 text-center">
            We will send you the invoice via email.
          </p>
        </>
      )}

      {rideRequest?.status === "requested" && (
        <div className="centered-content">
          <h1 className="text-center text-xl font-bold">
            We are looking for a driver...
          </h1>
          <img src="/waiting-car.gif" alt="Waiting for a car" />
          <button
            className="mt-2 w-full rounded bg-red-500 p-2 text-white"
            onClick={handleCancelRide}
          >
            Cancel Ride
          </button>
        </div>
      )}

      {(rideRequest?.status === "inRoute" ||
        rideRequest?.status === "arrived" ||
        rideRequest?.status === "onTrip" ||
        rideRequest?.status === "finished") && (
        <>
          {rideRequest?.status === "inRoute" && (
            <h3 className="mb-2 text-xl font-bold">
              Your driver is on the way!
            </h3>
          )}
          {rideRequest?.status === "arrived" && (
            <h3 className="mb-2 text-xl font-bold">
              Your driver has arrived!{" "}
            </h3>
          )}
          {rideRequest?.status === "onTrip" && (
            <h3 className="mb-2 text-xl font-bold">You are on your trip! </h3>
          )}
          {rideRequest?.status === "finished" && (
            <>
              <h3 className="mb-2 text-xl font-bold">
                Ride finished, you have to pay
                {rideRequest.final_price ? `$${rideRequest?.final_price}` : ""}
              </h3>
              <p className="disclaimer">
                We will send you the invoice via email.
              </p>
            </>
          )}

          <p>Driver: {driver?.name}</p>
          <p>Plate: {driver?.plate}</p>
          <p>Car Model: {driver?.car_model}</p>

          {rideRequest?.status !== "finished" && (
            <button
              className="mt-2 w-full rounded bg-red-500 p-2 text-white"
              onClick={handleCancelRide}
            >
              Cancel Ride
            </button>
          )}

          {rideRequest?.status === "finished" && (
            <button
              className="mt-4 w-full rounded bg-blue-500 p-2 text-white"
              onClick={() => {
                resetMapAndAddresses();
                handleShowModal();
              }}
            >
              Got it
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default RideModal;
