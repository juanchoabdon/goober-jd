export const Modal: React.FC<{ message: string; onClose: () => void }> = ({
  message,
  onClose,
}) => {
  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
      <div className="flex w-96 flex-col items-center rounded-md bg-white p-8 shadow-lg">
        <p
          className="mb-4 text-center"
          dangerouslySetInnerHTML={{ __html: message }}
        ></p>
        <button
          className="rounded-md bg-blue-500 p-2 text-white"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
