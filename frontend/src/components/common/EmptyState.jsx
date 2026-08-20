import { FaBoxOpen } from "react-icons/fa";

const EmptyState = ({
  title = "No Data Found",
  description = "There is nothing to display right now.",
  buttonText,
  onClick,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-12 flex flex-col items-center justify-center text-center">

      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">

        <FaBoxOpen className="text-4xl text-blue-600" />

      </div>

      <h2 className="text-2xl font-bold text-gray-800">
        {title}
      </h2>

      <p className="text-gray-500 mt-3 max-w-md">
        {description}
      </p>

      {buttonText && (
        <button
          onClick={onClick}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
        >
          {buttonText}
        </button>
      )}

    </div>
  );
};

export default EmptyState;