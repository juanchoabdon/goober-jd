import React from 'react';

const LocationRequest: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="relative w-96 rounded-md bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-4 p-4">
          <h2 className="mb-4 text-xl font-bold">
            Location Access Required
          </h2>
          <p>
            We need access to your location to continue. Please allow
            location access in your browser settings and refresh the page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LocationRequest;