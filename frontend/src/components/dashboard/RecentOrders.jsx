import { useNavigate } from "react-router-dom";
import { FaEye, FaArrowRight, FaShoppingBag } from "react-icons/fa";
import { useDashboard } from "../../context/DashboardContext";
import ProductImage from "../common/ProductImage";
import { useCurrency } from "../../context/CurrencyContext";

const STATUS_STYLE = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Shipped: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const RecentOrders = () => {
  const { recentOrders, loading } = useDashboard();
  const { formatMoney } = useCurrency();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Orders
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Latest orders placed
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin-dashboard/orders")}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition shadow-sm cursor-pointer"
        >
          View All
          <FaArrowRight size={12} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-gray-50 dark:bg-slate-800/60">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-slate-800">
                  <td colSpan={6} className="px-6 py-4">
                    <div className="h-4 rounded bg-gray-100 dark:bg-slate-800 animate-pulse" />
                  </td>
                </tr>
              ))
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4">
                    {order.products?.[0]?.product ? (
                      <div className="flex items-center gap-2.5">
                        <ProductImage product={order.products[0].product} size={32} />
                        <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[140px]">
                          {order.products[0].product.productName}
                          {order.products.length > 1 && (
                            <span className="text-gray-400 dark:text-gray-500"> +{order.products.length - 1}</span>
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-300 dark:text-gray-600 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-200">
                    {formatMoney(Number(order.totalAmount))}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_STYLE[order.orderStatus] ||
                        "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      title="View order"
                      onClick={() => navigate("/admin-dashboard/orders")}
                      className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                    <FaShoppingBag size={22} />
                    <p>No orders yet.</p>
                  </div>
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
