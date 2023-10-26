import React, { type FC, useState, useCallback, type FormEvent } from "react";
import { useDropzone, type DropEvent, type FileRejection, type Accept } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import BreadcrumbStepper from "./BreadcrumbStepper";

interface DocumentUploadProps {
  onNext: (documents: Documents) => void;
  accountType: string;
}

interface Documents {
  driversLicense: File | null;
  vehicleInsurance: File | null;
  backgroundCheck: File | null;
  drivingCertificate: File | null;
}

const DocumentUpload: FC<DocumentUploadProps> = ({ onNext, accountType }) => {
  const [documents, setDocuments] = useState<Documents>({
    driversLicense: null,
    vehicleInsurance: null,
    backgroundCheck: null,
    drivingCertificate: accountType === "Luxury Driver" ? null : null,
  });

  const onDrop = useCallback(
    (field: keyof Documents) =>
      (
        acceptedFiles: File[],
        fileRejections: FileRejection[],
        event: DropEvent,
      ) => {
        setDocuments((prev) => ({
          ...prev,
          [field]: acceptedFiles[0],
        }));
      },
    [],
  );

  const isFormComplete = () => {
    const {
      driversLicense,
      vehicleInsurance,
      backgroundCheck,
      drivingCertificate,
    } = documents;
    if (accountType === "Luxury Driver") {
      return (
        driversLicense &&
        vehicleInsurance &&
        backgroundCheck &&
        drivingCertificate
      );
    }
    return driversLicense && vehicleInsurance && backgroundCheck;
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDrop("drivingCertificate"),
    accept: ".pdf,.jpg,.jpeg,.png" as unknown as Accept,
    multiple: false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext(documents);
  };

  const formatLabel = (label: string): string => {
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const dropzoneProps = useDropzone({
    accept: ".pdf,.jpg,.jpeg,.png" as unknown as Accept,
    multiple: false,
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <img src="/logo.png" alt="Goober Logo" className="mb-2 h-32" />
      <BreadcrumbStepper currentStep={3} />
      <div className="relative w-full max-w-2xl rounded-md bg-white p-12 shadow-lg">
        <div>
          <h2 className="mb-4 text-xl font-bold">Upload your documents</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 grid grid-cols-2 gap-4">
              {["driversLicense", "vehicleInsurance", "backgroundCheck"].map(
                (field) => {
                
                  return (
                    <div className="mb-4" key={field}>
                      <label className="mb-2 block" htmlFor={field}>
                        {formatLabel(field)}{" "}
                      </label>
                      <div
                        {...dropzoneProps.getRootProps()}
                        className="centered-content mb-4 cursor-pointer rounded-md border border-dashed border-gray-400 p-4 text-center transition hover:bg-gray-100"
                      >
                        <input
                          {...dropzoneProps.getInputProps()}
                          onChange={(e) => onDrop(e.target.files, field)}
                          name={field}
                        />
                        <p className="centered-content text-gray-600">
                          <FaCloudUploadAlt className="mb-2 text-6xl text-gray-400" />
                          <span
                            style={{
                              display: "block",
                              // whiteSpace: "nowrap",
                              // overflow: "hidden",
                              // textOverflow: "ellipsis",
                            }}
                          >
                            {documents[field]
                              ? documents[field].name
                              : `Insert your ${field
                                  .replace(/([A-Z])/g, " $1")
                                  .toLowerCase()} document here`}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                },
              )}
              {accountType === "Luxury Driver" && (
                <div className="mb-4">
                  <label className="mb-2 block" htmlFor="drivingCertificate">
                    Professional Driving Certificate
                  </label>
                  <div
                    {...getRootProps()}
                    className="centered-content mb-4 cursor-pointer rounded-md border border-dashed border-gray-400 p-4 text-center transition hover:bg-gray-100"
                  >
                    <input
                      {...getInputProps()}
                      name="drivingCertificate"
                      style={{
                        opacity: 0,
                      }}
                    />
                    <p className="centered-content text-gray-600">
                      <FaCloudUploadAlt className="mb-2 text-6xl text-gray-400" />
                      {documents.drivingCertificate
                        ? documents.drivingCertificate.name
                        : "Drag or drop your driving certificate here, or click to select"}
                    </p>
                  </div>
                </div>
              )}
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

export default DocumentUpload;
