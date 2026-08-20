import {
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-2">

      <button
        onClick={onView}
        className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
      >
        <FaEye className="mx-auto" />
      </button>

      <button
        onClick={onEdit}
        className="w-9 h-9 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
      >
        <FaEdit className="mx-auto" />
      </button>

      <button
        onClick={onDelete}
        className="w-9 h-9 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
      >
        <FaTrash className="mx-auto" />
      </button>

    </div>
  );
};

export default ActionButtons;