import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useDashboard } from "../../context/DashboardContext";

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString(undefined, { month: "short", day: "numeric" });

const OrdersChart = () => {
  const { ordersTrend, loading } = useDashboard();

  const chartData = ordersTrend.map((p) => ({
    label: formatDate(p.date),
    orders: p.orders,
  }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 h-full">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Orders Overview</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Orders placed per day</p>
      </div>

      {loading ? (
        <div className="h-[240px] rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
      ) : chartData.length === 0 ? (
        <div className="h-[240px] flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-sm text-center px-4">
          No orders yet — this chart fills in as orders come through.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-800" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" className="text-gray-400" />
            <YAxis tick={{ fontSize: 12 }} stroke="currentColor" className="text-gray-400" allowDecimals={false} />
            <Tooltip
              cursor={{ fill: "rgba(16,185,129,0.08)" }}
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
            />
            <Bar dataKey="orders" fill="#10b981" radius={[6, 6, 0, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default OrdersChart;
