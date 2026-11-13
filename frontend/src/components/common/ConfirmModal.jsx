const ConfirmModal = ({
  isOpen,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-xl">

        <div className="border-b border-gray-200 dark:border-slate-800 px-6 py-4">

          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {title}
          </h2>

        </div>

        <div className="px-6 py-5">

          <p className="text-gray-600 dark:text-gray-300">
            {message}
          </p>

        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 dark:border-slate-800 px-6 py-4">

          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 dark:border-slate-700 px-5 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700 transition cursor-pointer"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmModal;