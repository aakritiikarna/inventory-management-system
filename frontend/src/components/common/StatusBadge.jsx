const StatusBadge = ({ status }) => {

  const getColor = () => {

    switch (status) {

      case "Active":
      case "Completed":
      case "Delivered":
      case "Paid":
      case "In Stock":
        return "bg-green-100 text-green-700";

      case "Pending":
      case "Processing":
      case "Low Stock":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
      case "Rejected":
      case "Out of Stock":
        return "bg-red-100 text-red-700";

      case "Draft":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-blue-100 text-blue-700";
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