import { useEffect, useState } from "react";
import { FaWarehouse, FaExclamationTriangle } from "react-icons/fa";
import { getWarehouseInventory } from "../../services/inventoryService";
import { useCurrency } from "../../context/CurrencyContext";
import ProductImage from "../common/ProductImage";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";

const LEVEL_STYLE = {
  ok: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  low: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  out: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const WarehouseCard = ({ warehouse, formatMoney, unassigned = false }) => (
  <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 overflow-hidden">
    <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <FaWarehouse />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white">
            {unassigned ? "Not assigned to a warehouse" : warehouse.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {unassigned ? "Assign these products a branch on the Products page" : warehouse.city}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-5 text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          <b className="text-gray-800 dark:text-white">{warehouse.totalUnits.toLocaleString()}</b> units
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          <b className="text-gray-800 dark:text-white">{formatMoney(warehouse.inventoryValue)}</b> value
        </span>
        {warehouse.lowStockCount + warehouse.outOfStockCount > 0 && (
          <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
            <FaExclamationTriangle size={12} />
            {warehouse.lowStockCount + warehouse.outOfStockCount} need restocking
          </span>
        )}
      </div>
    </div>

    {warehouse.products.length === 0 ? (
      <p className="p-6 text-sm text-gray-400 dark:text-gray-500 text-center">No products stored here yet.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
              <th className="px-5 py-2.5 font-semibold">Product</th>
              <th className="px-5 py-2.5 font-semibold">SKU</th>
              <th className="px-5 py-2.5 font-semibold text-right">Min</th>
              <th className="px-5 py-2.5 font-semibold text-right">On hand</th>
            </tr>
          </thead>
          <tbody>
            {warehouse.products.map((p) => (
              <tr key={p._id} className="border-t border-gray-100 dark:border-slate-800">
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-3">
                    <ProductImage product={p} size={32} />
                    <span className="text-gray-800 dark:text-gray-100">{p.productName}</span>
                  </div>
                </td>
                <td className="px-5 py-2.5 text-gray-500 dark:text-gray-400">{p.sku || "—"}</td>
                <td className="px-5 py-2.5 text-right text-gray-500 dark:text-gray-400">{p.minStock}</td>
                <td className="px-5 py-2.5 text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${LEVEL_STYLE[p.level]}`}>
                    {p.level === "out" ? "Out of stock" : p.stock}
                    {p.level === "low" && " · low"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const WarehouseInventory = () => {
  const { formatMoney } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getWarehouseInventory()
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load warehouse inventory"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading warehouses..." />;
  if (error) return <EmptyState title="Couldn't load warehouses" description={error} />;

  const { warehouses, unassigned } = data;

  if (warehouses.length === 0 && unassigned.products.length === 0) {
    return <EmptyState title="No inventory yet" description="Add a branch and assign products to it to see stock by warehouse." />;
  }

  return (
    <div className="space-y-5">
      {warehouses.map((w) => (
        <WarehouseCard key={w._id} warehouse={w} formatMoney={formatMoney} />
      ))}
      {unassigned.products.length > 0 && (
        <WarehouseCard warehouse={unassigned} formatMoney={formatMoney} unassigned />
      )}
    </div>
  );
};

export default WarehouseInventory;
