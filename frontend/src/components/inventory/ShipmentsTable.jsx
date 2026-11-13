import { useEffect, useMemo, useState } from "react";
import { FaTruck, FaArrowRight } from "react-icons/fa";
import { getShipments } from "../../services/inventoryService";
import StatusBadge from "../common/StatusBadge";
import ProductImage from "../common/ProductImage";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";

const STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const ShipmentsTable = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("All");

  useEffect(() => {
    getShipments()
      .then(({ data }) => setShipments(data.shipments || []))
      .catch((err) => setError(err.response?.data?.message || "Unable to load shipments"))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(
    () => shipments.filter((s) => status === "All" || s.status === status),
    [shipments, status]
  );

  if (loading) return <Loader text="Loading shipments..." />;
  if (error) return <EmptyState title="Couldn't load shipments" description={error} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Each order fulfilled from a warehouse is a shipment: where it leaves from, where it's going, and what's in it.
        </p>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter shipments by status"
          className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={<FaTruck className="text-2xl" />} title="No shipments" description="Orders will appear here as they're placed." />
      ) : (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-gray-50 dark:bg-slate-800/60">
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <th className="px-5 py-3 font-semibold">Shipment</th>
                <th className="px-5 py-3 font-semibold">Route</th>
                <th className="px-5 py-3 font-semibold">Items</th>
                <th className="px-5 py-3 font-semibold text-right">Units</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => (
                <tr key={s._id} className="border-t border-gray-100 dark:border-slate-800 align-top">
                  <td className="px-5 py-3.5">
                    <p className="font-mono text-xs text-gray-700 dark:text-gray-200">#{s.reference}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {new Date(s.createdAt).toLocaleDateString()} · {s.customer}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <span>{s.from ? s.from.name : <em className="text-gray-400">No warehouse</em>}</span>
                      <FaArrowRight size={10} className="text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300 max-w-[180px] truncate">{s.to || "—"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <ul className="space-y-1.5">
                      {s.items.map((i, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <ProductImage product={{ productName: i.name, image: i.image, category: i.category }} size={24} />
                          <span className="text-gray-700 dark:text-gray-200">{i.name}</span>
                          <span className="text-gray-400 dark:text-gray-500">× {i.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-gray-800 dark:text-white">{s.totalUnits}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShipmentsTable;
