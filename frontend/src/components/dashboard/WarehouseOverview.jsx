import { Link } from "react-router-dom";
import { FaWarehouse, FaBoxOpen } from "react-icons/fa";
import { useDashboard } from "../../context/DashboardContext";

/**
 * Stock distribution across warehouses/branches, from real product data
 * (each product belongs to one branch). Plain HTML bars rather than a
 * chart library — it's a ranked list, and this keeps it dependency-free.
 */
const WarehouseOverview = () => {
  const { warehouseStock, loading } = useDashboard();
  const max = Math.max(1, ...warehouseStock.map((w) => w.units));

  return (
    <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <FaWarehouse className="text-indigo-500" />
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Stock by Warehouse</h2>
        </div>
        <Link
          to="/admin-dashboard/inventory"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          View details
        </Link>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Units on hand at each location</p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-gray-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : warehouseStock.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 text-gray-400 dark:text-gray-500 py-6">
          <FaBoxOpen size={20} />
          <p className="text-sm">No products assigned to a warehouse yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {warehouseStock.map((w) => (
            <li key={w.name}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700 dark:text-gray-200 truncate">
                  {w.name}
                  {w.city && <span className="text-gray-400 dark:text-gray-500 font-normal"> · {w.city}</span>}
                </span>
                <span className="flex items-center gap-2 whitespace-nowrap ml-2">
                  {w.lowStockCount > 0 && (
                    <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">
                      {w.lowStockCount} low
                    </span>
                  )}
                  <span className="font-semibold text-gray-800 dark:text-white">{w.units.toLocaleString()}</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${w.name === "Unassigned" ? "bg-gray-400" : "bg-indigo-500"}`}
                  style={{ width: `${(w.units / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WarehouseOverview;
