import React from 'react';

interface RiderFormProps {
  riderName: string;
  riderEmail: string;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNameSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const RiderForm: React.FC<RiderFormProps> = ({
  riderName,
  riderEmail,
  handleNameChange,
  handleEmailChange,
  handleNameSubmit,
}) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <img src="/logo.png" alt="Goober Logo" className="mb-10 h-32" />
      <div className="w-96 rounded-md bg-white p-8 shadow-lg">
        <div>
          <h2 className="mb-4 text-xl font-bold">Become a Rider</h2>
          <form onSubmit={handleNameSubmit}>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="riderName">
                Name
              </label>
              <input
                type="text"
                id="riderName"
                name="riderName"
                className="w-full rounded-md border p-2"
                value={riderName}
                onChange={handleNameChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="riderEmail">
                Email
              </label>
              <input
                type="email"
                id="riderEmail"
                name="riderEmail"
                className="w-full rounded-md border p-2"
                value={riderEmail}
                onChange={handleEmailChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 p-2 text-white"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RiderForm;
