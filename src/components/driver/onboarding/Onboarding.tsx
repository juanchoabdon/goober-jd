import React, { useState, type FC } from "react";
import AccountTypeSelection from "./steps/AccountTypeSelection";
import WelcomeScreen from "./steps/WelcomeScreen";
import PersonalInformation from "./steps/PersonalInformation";
import VehicleInformation from "./steps/VehicleInformation";
import DocumentUpload from "./steps/DocumentUpload";
import DrivingHistory from "./steps/DrivingHistory";
import TrainingVideos from "./steps/TrainingVideos";
import ReviewAndSubmit from "./steps/ReviewAndSubmit";
import PaymentInformation from "./steps/PaymentInformation";
import FinishedScreen from "./steps/FinishedScreen";

interface RenderStepProps {
  currentStep: number;
}

interface ReviewAndSubmitData {
  SelectedAccountType: string | null;
  PersonalInformation: any | null; // Replace `any` with the actual type
  VehicleInformation: any | null; // Replace `any` with the actual type
  Documents: any | null; // Replace `any` with the actual type
  DrivingHistory: any | null; // Replace `any` with the actual type
}

const Onboarding: React.FC = ({}) => {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [selectedAccountType, setSelectedAccountType] = useState<string>("");
  const [personalInformation, setPersonalInformation] = useState<any | null>(
    null,
  );
  const [vehicleInformation, setVehicleInformation] = useState<any | null>(
    null,
  );
  const [documents, setDocuments] = useState<any | null>(null);
  const [drivingHistory, setDrivingHistory] = useState<any | null>(null);

  const handleNextStep = () => {
    setSelectedStep((prevStep) => prevStep + 1);
  };

  const handleEdit = (stepNumber: number) => {
    setSelectedStep(stepNumber);
  };

  const RenderStep: FC<RenderStepProps> = ({ currentStep }) => {
    switch (currentStep) {
      case 1:
        return (
          <AccountTypeSelection
            onNext={(accountType) => {
              setSelectedAccountType(accountType);
              handleNextStep();
            }}
          />
        );
      case 2:
        return (
          <WelcomeScreen
            onNext={handleNextStep}
            accountType={selectedAccountType}
          />
        );
      case 3:
        return (
          <PersonalInformation
            onNext={(formData) => {
              setPersonalInformation(formData);
              handleNextStep();
            }}
          />
        );
      case 4:
        return (
          <VehicleInformation
            onNext={(formData) => {
              setVehicleInformation(formData);
              handleNextStep();
            }}
          />
        );
      case 5:
        return (
          <DocumentUpload
            onNext={(formData) => {
              setDocuments(formData);
              handleNextStep();
            }}
            accountType={selectedAccountType}
          />
        );
      case 6:
        return (
          <DrivingHistory
            onNext={(formData) => {
              setDrivingHistory(formData);
              handleNextStep();
            }}
          />
        );
      case 7:
        return <TrainingVideos onNext={handleNextStep} />;
      case 8:
        return (
          <ReviewAndSubmit
            data={{
              SelectedAccountType: selectedAccountType,
              PersonalInformation: personalInformation,
              VehicleInformation: vehicleInformation,
              Documents: documents,
              DrivingHistory: drivingHistory,
            }}
            onEdit={handleEdit}
            onNext={handleNextStep}
          />
        );
      case 9:
        return <PaymentInformation onNext={handleNextStep} />;
      case 10:
        return <FinishedScreen />;
      default:
        return null;
    }
  };

  return <RenderStep currentStep={selectedStep}></RenderStep>;
};

export default Onboarding;
