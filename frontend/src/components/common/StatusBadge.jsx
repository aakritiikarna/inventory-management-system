const StatusBadge = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case "Active":
      case "Completed":
      case "Delivered":
      case "Paid":
      case "In Stock":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";

      case "Pending":
      case "Processing":
      case "Low Stock":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";

      case "Cancelled":
      case "Rejected":
      case "Out of Stock":
      case "Failed":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

      case "Shipped":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";

      case "Draft":
      case "inactive":
        return "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300";

      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getColor()}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
