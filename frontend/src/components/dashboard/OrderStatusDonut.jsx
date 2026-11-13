import DonutChart from "./DonutChart";
import DemoDataBadge from "../common/DemoDataBadge";
import { useDashboard } from "../../context/DashboardContext";
import { DEMO_ORDER_STATUS } from "../../data/demoData";

const STATUS_COLORS = {
  Delivered: "#10b981",
  Processing: "#2563eb",
  Pending: "#f59e0b",
  Shipped: "#8b5cf6",
  Cancelled: "#ef4444",
};

const OrderStatusDonut = () => {
  const { statusCounts, loading } = useDashboard();

  const realData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const usingDemo = !loading && realData.length === 0;
  const data = usingDemo ? DEMO_ORDER_STATUS : realData;
  const colors = data.map((d) => STATUS_COLORS[d.name] || "#94a3b8");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 h-full">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Order Status</h2>
        {usingDemo && <DemoDataBadge />}
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Distribution of current orders</p>

      {loading ? (
        <div className="h-[200px] rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
      ) : (
        <DonutChart data={data} colors={colors} centerLabel="Orders" />
      )}
    </div>
  );
};

export default OrderStatusDonut;
