import React, { useState, type ChangeEvent, type FormEvent, useCallback } from "react";
import { type Accept, useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import Slider from "react-slick";
import { FiX } from "react-icons/fi";
import BreadcrumbStepper from "./BreadcrumbStepper";

interface FormData {
  carType: string;
  licensePlate: string;
  carPhotos: File[];
  additionalFeatures: string[];
}

interface VehicleInformationProps {
  onNext: (formData: FormData) => void;
}

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerPadding: "10px",
};

const VehicleInformation: React.FC<VehicleInformationProps> = ({ onNext }) => {
  const [formData, setFormData] = useState<FormData>({
    carType: "",
    licensePlate: "",
    carPhotos: [],
    additionalFeatures: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFormData((prev) => ({
      ...prev,
      carPhotos: [...prev.carPhotos, ...acceptedFiles],
    }));
}, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*" as unknown as Accept,
    multiple: true,
  });

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => {
      const updatedPhotos = [...prev.carPhotos];
      updatedPhotos.splice(index, 1);
      return { ...prev, carPhotos: updatedPhotos };
    });
  };

  const handleAddFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalFeatures: [...prev.additionalFeatures, feature],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const isFormComplete = Object.values(formData).every((value) => {
    return value !== "" && (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <img src="/logo.png" alt="Goober Logo" className="mb-2 h-32" />
      <BreadcrumbStepper currentStep={2} />
      <div className="relative w-full max-w-2xl rounded-md bg-white p-12 shadow-lg">
        <div>
          <h2 className="mb-4 text-xl font-bold">
            Complete your vehicle information
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="carType">
                Type of Car
              </label>
              <select
                id="carType"
                name="carType"
                className="w-full rounded-md border p-2"
                value={formData.carType}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select your car type
                </option>
                <option value="-">-</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Coupe">Coupe</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Convertible">Convertible</option>
                <option value="Sports Car">Sports Car</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="licensePlate">
                License Plate
              </label>
              <input
                type="text"
                id="licensePlate"
                name="licensePlate"
                className="w-full rounded-md border p-2"
                value={formData.licensePlate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block">Car Photos</label>
              <div
                {...getRootProps()}
                className="centered-content mb-4 cursor-pointer rounded-md border border-dashed border-gray-400 p-4 text-center transition hover:bg-gray-100"
              >
                <input {...getInputProps()} />
                <p className="centered-content text-gray-600">
                  <FaCloudUploadAlt className="mb-2 text-6xl text-gray-400" />
                  Drag or drop your car photos here, or click to select
                </p>
              </div>
              {formData.carPhotos.length > 0 && (
                <Slider {...sliderSettings}>
                  {formData.carPhotos.map((photo, index) => (
                    <div key={index} className="relative w-20 px-2">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Car Photo ${index + 1}`}
                        className="mb-4 rounded-md"
                      />
                      <button
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white"
                        aria-label="Remove Photo"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
            <div className="mb-4 mt-2">
              <label className="mb-2 block" htmlFor="additionalFeatures">
                Additional Features
              </label>
              <input
                type="text"
                id="additionalFeatures"
                name="additionalFeatures"
                className="w-full rounded-md border p-2"
                placeholder="Type a feature and hit enter e.g Wifi"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const feature = e.currentTarget.value.trim();
                    if (feature) {
                      handleAddFeature(feature);
                    }
                  }
                }}
              />
              <div className="mt-2">
                {formData.additionalFeatures.map((feature, index) => (
                  <span
                    key={index}
                    className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className={`w-full rounded-md bg-blue-500 p-2 text-white ${
                !isFormComplete
                  ? "cursor-not-allowed bg-blue-500 opacity-50"
                  : "bg-blue-500"
              }`}
              disabled={!isFormComplete}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleInformation;
