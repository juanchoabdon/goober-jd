import React from "react";
import { type RideRequest } from "~/shared/types/rides";
import { parseLocation } from "~/utils/utils";

interface CompletedRideProps {
  completedRides: Array<RideRequest>;
}

const CompletedRides: React.FC<CompletedRideProps> = ({ completedRides }) => {
  return (
    <>
      {completedRides.length > 0 ? (
        <ul className="space-y-2">
          {completedRides.map((ride) => {
            const parsedStartLocation = parseLocation(ride?.start_location);
            const parsedEndLocation = parseLocation(ride?.end_location);

            return (
              <li key={ride.id} className="rounded-md border p-3">
                <p>
                  <strong>Pickup:</strong>
                  {parsedStartLocation ? ` ${parsedStartLocation.address}` : " Address not available"}
                </p>
                <p>
                  <strong>Dropoff:</strong>
                  {parsedEndLocation ? ` ${parsedEndLocation.address}` : " Address not available"}
                </p>
                <p>
                  <strong>Earnings:</strong> {` $${ride.driver_profit ?? 0}`}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-md border p-4 text-center">
          No completed rides yet.
        </div>
      )}
    </>
  );
};

export default CompletedRides;
