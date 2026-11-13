import { FaExclamationTriangle, FaBoxOpen } from "react-icons/fa";
import { useDashboard } from "../../context/DashboardContext";

const SalesAnalytics = () => {
  const { lowStockItems, stats, loading } = useDashboard();

  return (
    <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <FaExclamationTriangle className="text-amber-500" />
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Low Stock
        </h2>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
        {stats.lowStockCount ?? 0} item{stats.lowStockCount === 1 ? "" : "s"} at or below minimum stock
      </p>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 rounded-lg bg-gray-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : lowStockItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 text-gray-400 dark:text-gray-500 py-6">
          <FaBoxOpen size={20} />
          <p className="text-sm">Everything is adequately stocked.</p>
        </div>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {lowStockItems.map((item) => (
            <li
              key={item._id}
              className="flex items-center justify-between text-sm rounded-lg px-3 py-2 bg-amber-50 dark:bg-amber-900/20"
            >
              <span className="min-w-0">
                <span className="block text-gray-700 dark:text-gray-200 truncate">{item.productName}</span>
                <span className="block text-xs text-gray-400 dark:text-gray-500 truncate">
                  {item.branch?.name ? `${item.branch.name}` : "No warehouse assigned"} · min {item.minStock ?? 5}
                </span>
              </span>
              <span
                className={`font-semibold whitespace-nowrap ml-2 ${
                  item.stock <= 0 ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {item.stock <= 0 ? "Out of stock" : `${item.stock} left`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SalesAnalytics;
