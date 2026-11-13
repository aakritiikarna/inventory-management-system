import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useDashboard } from "../../context/DashboardContext";
import { DEMO_USER_GROWTH } from "../../data/demoData";
import DemoDataBadge from "../common/DemoDataBadge";

const monthLabel = (ym) => {
  const [y, m] = ym.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleDateString(undefined, { month: "short" });
};

const MIN_REAL_POINTS = 3;

const CustomerGrowthChart = () => {
  const { userGrowth, loading } = useDashboard();

  const realData = (userGrowth || []).map((p) => ({ label: monthLabel(p.month), users: p.users }));
  const usingDemo = !loading && realData.length < MIN_REAL_POINTS;
  const chartData = usingDemo ? DEMO_USER_GROWTH.map((d) => ({ label: d.label, users: d.users })) : realData;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 h-full">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Customer Growth</h2>
        {usingDemo && <DemoDataBadge />}
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        {usingDemo ? "Sample trend — will use real signups once there are more." : "New accounts per month"}
      </p>

      {loading ? (
        <div className="h-[240px] rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="customerGrowthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-800" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" className="text-gray-400" />
            <YAxis tick={{ fontSize: 12 }} stroke="currentColor" className="text-gray-400" allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }} />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#f59e0b"
              strokeWidth={3}
              fill="url(#customerGrowthFill)"
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CustomerGrowthChart;
