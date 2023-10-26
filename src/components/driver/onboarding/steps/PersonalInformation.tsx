/* eslint-disable @next/next/no-img-element */
import React, { useState, type ChangeEvent, type FormEvent, useCallback } from "react";
import { type Accept, useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import BreadcrumbStepper from "./BreadcrumbStepper";

interface PersonalInformationProps {
  onNext: (formData: FormData) => void;
}

interface FormData {
  name: string;
  ssn: string;
  birth_date: string;
  gender: string;
  profile_picture: File | null;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({
  onNext,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    ssn: "",
    birth_date: "",
    gender: "",
    profile_picture: null,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFormData((prev) => ({ ...prev, profile_picture: acceptedFiles[0] ?? null }));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*" as unknown as Accept,
    multiple: false,
  });

  const preview = formData.profile_picture ? (
    <img
      src={URL.createObjectURL(formData.profile_picture)}
      width={200}
      alt="Profile Preview"
      className="mt-4 rounded-md"
    />
  ) : null;

  const isFormComplete = () => {
    return (
      formData.name &&
      formData.ssn &&
      formData.birth_date &&
      formData.gender &&
      formData.profile_picture
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <img src="/logo.png" alt="Goober Logo" className="mb-2 h-32" />
      <BreadcrumbStepper currentStep={1} />
      <div className="relative w-full max-w-2xl rounded-md bg-white p-12 shadow-lg">
        <div>
          <h2 className="mb-4 text-xl font-bold">Personal Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-md border p-2"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="email">
                Social Security Number
              </label>
              <input
                type="number"
                min={1}
                id="email"
                name="ssn"
                className="w-full rounded-md border p-2"
                value={formData.ssn}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="birth_date">
                Birth Date
              </label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                className="w-full rounded-md border p-2"
                value={formData.birth_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="w-full rounded-md border p-2"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select your gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="mb-2 block" htmlFor="profile_picture">
                Profile Picture
              </label>
              <div
                {...getRootProps()}
                className="centered-content cursor-pointer rounded-md border border-dashed border-gray-400 p-4 text-center transition hover:bg-gray-100"
              >
                <input {...getInputProps()} />
                <FaCloudUploadAlt className="mb-2 text-6xl text-gray-400" />
                <p className="centered-content text-gray-600">
                  {!preview
                    ? "Drag or drop a image in here, or click to select"
                    : "Drag or drop another image in here, or click to it"}
                  {preview}
                </p>
              </div>
            </div>
            <button
              type="submit"
              className={`w-full rounded-md bg-blue-500 p-2 text-white ${
                !isFormComplete()
                  ? "cursor-not-allowed bg-blue-500 opacity-50"
                  : "bg-blue-500"
              }`}
              disabled={!isFormComplete()}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
