import React from "react";
import { parseLocation } from "~/utils/utils"; // Assuming this is the right path
import RideDetails from "./RideDetails"; // Adjust the path based on your directory structure
import { type RideRequest } from "~/shared/types/rides";

interface AvailableRideProps {
  isActive: boolean;
  acceptedRide?: RideRequest | null;
  availableRide?: RideRequest | null;
  acceptRide: (ride: RideRequest) => void;
  declineRide: () => void;
  cancelRide: () => void;
  confirmFinishRide: () => void;
  changeRideStatus: (status: string) => void;
  subscribeToReceiveRides?: () => void;
}

const AvailableRides: React.FC<AvailableRideProps> = ({
  isActive,
  acceptedRide,
  availableRide,
  acceptRide,
  declineRide,
  cancelRide,
  confirmFinishRide,
  changeRideStatus,
}) => {
  const parsedStartLocation = parseLocation(availableRide?.start_location);
  const parsedEndLocation = parseLocation(availableRide?.start_location);

  return (
    <>
      {isActive && !acceptedRide ? (
        availableRide ? (
          <ul className="space-y-2">
            <li key={availableRide.id} className="rounded-md border p-3">
              <p>
                <strong>Pickup:</strong>{" "}
                {parsedStartLocation
                  ? parsedStartLocation.address
                  : "Unknown address"}
              </p>
              <p>
                <strong>Price:</strong> {` $${availableRide.quote_price}`}
              </p>
              <div className="mt-2 flex justify-center gap-1">
                <button
                  onClick={() => acceptRide(availableRide)}
                  className="rounded bg-green-500 px-4 py-1 text-white"
                >
                  Accept
                </button>
                <button
                  onClick={() => declineRide()}
                  className="rounded bg-red-500 px-4 py-1 text-white"
                >
                  Decline
                </button>
              </div>
            </li>
          </ul>
        ) : (
          <div className="rounded-md border p-4 text-center">
            No available rides at the moment.
          </div>
        )
      ) : acceptedRide && acceptedRide.status === "onTrip" ? (
        <RideDetails
          cancelRide={cancelRide}
          title="On a Trip"
          ride={acceptedRide}
          buttons={
            <>
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/${
                      parsedEndLocation ? parsedEndLocation.lat : "0"
                    },${parsedEndLocation ? parsedEndLocation.lng : "0"}`,
                    "_blank",
                  )
                }
                className="mt-4 rounded bg-blue-500 px-4 py-1 text-white"
              >
                Go to Dropoff
              </button>
              <button
                onClick={confirmFinishRide}
                className="ml-2 mt-4 rounded bg-green-500 px-4 py-1 text-white"
              >
                Finish Ride
              </button>
            </>
          }
        />
      ) : acceptedRide && acceptedRide.status === "inRoute" ? (
        <RideDetails
          cancelRide={cancelRide}
          title="Head to Pickup Location"
          ride={acceptedRide}
          buttons={
            <>
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/${
                      parsedStartLocation ? parsedStartLocation.lat : "0"
                    },${parsedStartLocation ? parsedStartLocation.lng : "0"}`,
                    "_blank",
                  )
                }
                className="mt-4 rounded bg-blue-500 px-4 py-1 text-white"
              >
                Go to Pickup
              </button>
              <button
                onClick={() => {
                  changeRideStatus("arrived");
                }}
                className="ml-2 mt-4 rounded bg-green-500 px-4 py-1 text-white"
              >
                Arrived to location
              </button>
            </>
          }
        />
      ) : acceptedRide && acceptedRide.status === "arrived" ? (
        <RideDetails
          cancelRide={cancelRide}
          title="Arrived at Pickup Location"
          ride={acceptedRide}
          buttons={
            <button
              className="mt-4 rounded bg-blue-500 px-4 py-1 text-white"
              onClick={() => {
                changeRideStatus("onTrip");
              }}
            >
              Rider Collected
            </button>
          }
        />
      ) : (
        <div className="rounded-md border p-4 text-center">
          Activate yourself to become visible and receive rides.
        </div>
      )}
    </>
  );
};

export default AvailableRides;
