import React from 'react';

const BreadcrumbStepper = ({ currentStep, totalSteps = 7 }) => {
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <div className="breadcrumb-stepper mb-4">
      {steps.map(step => (
        <div
          key={step}
          className={`step${currentStep === step ? ' active' : ''}`}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default BreadcrumbStepper;
