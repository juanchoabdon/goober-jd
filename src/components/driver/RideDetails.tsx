import React from 'react';
import { parseLocation } from '~/utils/utils';
import { type RideRequest } from '~/shared/types/rides';

interface RideDetailsProps {
    title: string;
    buttons: React.ReactNode;
    ride: RideRequest;
    cancelRide: () => void;
  }

const RideDetails: React.FC<RideDetailsProps> = ({ title, buttons, ride, cancelRide }) => {
  return (
    <div className="rounded-md border p-4 text-center">
      <h3 className="mb-4 text-xl font-bold">{title}</h3>
      <p><strong>Rider Name:</strong> {ride.rider_name}</p>
      <p><strong>Pickup:</strong> {ride?.start_location ? ` ${parseLocation(ride?.start_location).address}` : ""}</p>
      <p><strong>Dropoff:</strong> {ride?.end_location ? ` ${parseLocation(ride?.end_location).address}` : ""}</p>
      <p><strong>Price:</strong> {` $${ride.quote_price ?? 0}`}</p>
      {buttons}
      <button onClick={cancelRide} className="ml-2 mt-4 rounded bg-white px-4 py-1 text-red-600">Cancel Ride</button>
    </div>
  );
}

export default RideDetails;