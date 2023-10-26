import React, { useState } from "react";
import BreadcrumbStepper from "./BreadcrumbStepper";

const ReviewAndSubmit = ({ data, onEdit, onNext }) => {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <img src="/logo.png" alt="Goober Logo" className="mb-2 h-32" />
      <BreadcrumbStepper currentStep={6}/>
      <div className="relative w-full max-w-2xl rounded-md bg-white p-12 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Review & Submit</h2>
        {/* ...rest of the review summary content... */}
        {Object.keys(data).map((key, index) => (
          <button
            key={index}
            onClick={() => onEdit(index + 3)}
            className="mb-2 w-full rounded-md bg-yellow-500 p-2 text-white"
          >
            Edit {key.replace(/([A-Z])/g, " $1")}
          </button>
        ))}
        <button
          onClick={onNext}
          className="w-full rounded-md bg-blue-500 p-2 text-white"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReviewAndSubmit;
