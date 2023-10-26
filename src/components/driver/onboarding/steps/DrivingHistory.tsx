import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import BreadcrumbStepper from "./BreadcrumbStepper";

const DrivingHistory: React.FC = ({ onNext }) => {
  const [formData, setFormData] = useState({
    drivingExperience: "",
    referenceLetters: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFormData((prev) => ({
      ...prev,
      referenceLetters: [...prev.referenceLetters, ...acceptedFiles],
    }));
  }, []);

  const handleRemoveFile = (index) => {
    setFormData((prev) => {
      const updatedFiles = [...prev.referenceLetters];
      updatedFiles.splice(index, 1);
      return { ...prev, referenceLetters: updatedFiles };
    });
  };

  const dropzoneProps = useDropzone({
    onDrop,
    accept: ".pdf,.jpg,.jpeg,.png",
    multiple: true,
  });

  const isFormComplete = formData.drivingExperience.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormComplete) {
      onNext(formData);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <img src="/logo.png" alt="Goober Logo" className="mb-2 h-32" />
      <BreadcrumbStepper currentStep={4}/>
      <div className="relative w-full max-w-2xl rounded-md bg-white p-12 shadow-lg">
        <div>
          <h2 className="mb-4 text-xl font-bold">Share your Driving History</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="drivingExperience">
                Past Driving Experience
              </label>
              <textarea
                id="drivingExperience"
                name="drivingExperience"
                className="w-full rounded-md border p-2"
                value={formData.drivingExperience}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block">Reference Letters (optional)</label>
              <div
                {...dropzoneProps.getRootProps()}
                className="centered-content mb-4 cursor-pointer rounded-md border border-dashed border-gray-400 p-4 text-center transition hover:bg-gray-100"
              >
                <input
                  {...dropzoneProps.getInputProps()}
                  name="referenceLetters"
                />
                <p className="centered-content text-gray-600">
                  <FaCloudUploadAlt className="mb-2 text-6xl text-gray-400" />
                  Drag or drop your reference letters here, or click to select
                </p>
              </div>
              {formData.referenceLetters.map((file, index) => (
                <div
                  key={index}
                  className="mb-2 flex items-center justify-between"
                >
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file.name}
                  </span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="rounded-full bg-red-500 p-1 text-white"
                    aria-label="Remove File"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              ))}
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

export default DrivingHistory;
