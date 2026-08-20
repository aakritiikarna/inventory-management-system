import { useState } from "react";
import {
  FaEye,
  FaFileInvoice,
  FaTrash,
  FaArrowRight,
} from "react-icons/fa";

const initialOrders = [
  {
    id: "ORD-1001",
    customer: "Rahul Sharma",
    amount: "$320",
    status: "Completed",
    date: "06 Aug 2026",
  },
  {
    id: "ORD-1002",
    customer: "Amit Kumar",
    amount: "$180",
    status: "Pending",
    date: "05 Aug 2026",
  },
  {
    id: "ORD-1003",
    customer: "Priya Singh",
    amount: "$720",
    status: "Shipped",
    date: "05 Aug 2026",
  },
  {
    id: "ORD-1004",
    customer: "Rohit Verma",
    amount: "$95",
    status: "Cancelled",
    date: "04 Aug 2026",
  },
];

const RecentOrders = () => {
  const [orders, setOrders] = useState(initialOrders);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";

      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";

      case "Shipped":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";

      case "Cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleView = (order) => {
    alert(
      `Order Details\n\nOrder: ${order.id}\nCustomer: ${order.customer}\nAmount: ${order.amount}\nStatus: ${order.status}`
    );
  };

  const handleInvoice = (order) => {
    alert(`Invoice for ${order.id}\nCustomer: ${order.customer}`);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete order ${id}?`
    );

    if (!confirmed) return;

    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== id)
    );
  };

  const handleViewAll = () => {
    alert("Opening all orders...");
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 dark:border-slate-700">

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Orders
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Latest customer purchases
          </p>
        </div>

        <button
          type="button"
          onClick={handleViewAll}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          View All
          <FaArrowRight size={13} />
        </button>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full min-w-[850px]">

          {/* Table Header */}
          <thead className="bg-gray-50 dark:bg-slate-800/80">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Order ID
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Date
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                Actions
              </th>

            </tr>

          </thead>

          {/* Table Body */}
          <tbody>

            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors"
                >

                  {/* Order ID */}
                  <td className="px-6 py-5">

                    <span className="font-semibold text-gray-900 dark:text-white">
                      {order.id}
                    </span>

                  </td>

                  {/* Customer */}
                  <td className="px-6 py-5">

                    <span className="text-gray-700 dark:text-gray-300">
                      {order.customer}
                    </span>

                  </td>

                  {/* Amount */}
                  <td className="px-6 py-5">

                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {order.amount}
                    </span>

                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">

                    <span
                      className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                  </td>

                  {/* Date */}
                  <td className="px-6 py-5">

                    <span className="text-gray-600 dark:text-gray-400">
                      {order.date}
                    </span>

                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">

                    <div className="flex items-center justify-center gap-2">

                      {/* View */}
                      <button
                        type="button"
                        title="View Order"
                        onClick={() => handleView(order)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <FaEye />
                      </button>

                      {/* Invoice */}
                      <button
                        type="button"
                        title="View Invoice"
                        onClick={() => handleInvoice(order)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white transition-all"
                      >
                        <FaFileInvoice />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        title="Delete Order"
                        onClick={() => handleDelete(order.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>
              ))
            ) : (
              <tr>

                <td
                  colSpan="6"
                  className="px-6 py-12 text-center"
                >
                  <p className="text-gray-500 dark:text-gray-400">
                    No recent orders found.
                  </p>
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RecentOrders;