import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { reportsApi } from "../api/endpoints";
import LoadingSpinner from "../components/LoadingSpinner";
import { extractErrorMessage, useToast } from "../hooks/useToast";

const CARD_CONFIG = [
  { key: "total_products", label: "Total Products", accent: "text-teal-600" },
  { key: "total_warehouses", label: "Total Warehouses", accent: "text-sky-600" },
  { key: "total_suppliers", label: "Total Suppliers", accent: "text-violet-600" },
  { key: "low_stock_items", label: "Low Stock Items", accent: "text-rose-600" },
  { key: "pending_purchase_orders", label: "Pending Purchase Orders", accent: "text-amber-600" },
];

export default function Dashboard() {
  const toast = useToast();
  const [summary, setSummary] = useState(null);
  const [stockMovement, setStockMovement] = useState([]);
  const [purchaseTrends, setPurchaseTrends] = useState([]);
  const [inventoryValue, setInventoryValue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reportsApi.dashboardSummary(),
      reportsApi.stockMovement(6),
      reportsApi.purchaseTrends(6),
      reportsApi.inventoryValue(),
    ])
      .then(([summaryRes, movementRes, trendsRes, valueRes]) => {
        setSummary(summaryRes.data);
        setStockMovement(movementRes.data);
        setPurchaseTrends(trendsRes.data);
        setInventoryValue(valueRes.data);
      })
      .catch((err) => toast.error(extractErrorMessage(err)))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <LoadingSpinner label="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {CARD_CONFIG.map((card) => (
          <div key={card.key} className="card">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{card.label}</p>
            <p className={`text-3xl font-bold mt-2 font-mono ${card.accent}`}>{summary?.[card.key] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-sm font-semibold text-ink-900 mb-4">Monthly Stock Movement</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stockMovement}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" fontSize={12} stroke="#94a3b8" />
              <YAxis fontSize={12} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="stock_in" name="Stock In" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="stock_out" name="Stock Out" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-ink-900 mb-4">Purchase Trends</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={purchaseTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" fontSize={12} stroke="#94a3b8" />
              <YAxis fontSize={12} stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="po_count" name="PO Count" stroke="#0d9488" strokeWidth={2} />
              <Line type="monotone" dataKey="total_value" name="Total Value" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-ink-900 mb-4">Inventory Value by Warehouse</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={inventoryValue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="warehouse" fontSize={12} stroke="#94a3b8" />
              <YAxis fontSize={12} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="total_value" name="Inventory Value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
