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
import { useCurrency } from "../../context/CurrencyContext";
import { DEMO_MONTHLY_REVENUE } from "../../data/demoData";
import DemoDataBadge from "../common/DemoDataBadge";

const formatDate = (isoDate) => {
  const d = new Date(isoDate);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

// Below this many real data points, a line/area chart doesn't read as a
// trend — so we show clearly-labeled demo data instead of a near-empty chart.
const MIN_REAL_POINTS = 3;

const RevenueChart = () => {
  const { revenueTrend, loading } = useDashboard();
  const { formatMoney, currency } = useCurrency();
  // Axis ticks: convert from USD and abbreviate (e.g. Rs 1.2M) so large
  // converted values (NPR/INR) don't overflow the axis.
  const compactMoney = (usd) => {
    const n = Number(usd) * currency.rate;
    const abs = Math.abs(n);
    const short = abs >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : abs >= 1e3 ? `${(n / 1e3).toFixed(abs >= 1e4 ? 0 : 1)}K` : `${Math.round(n)}`;
    return `${currency.symbol.trim()}${short}`;
  };

  const realData = revenueTrend.map((point) => ({
    label: formatDate(point.date),
    revenue: point.revenue,
  }));

  const usingDemo = !loading && realData.length < MIN_REAL_POINTS;
  const chartData = usingDemo ? DEMO_MONTHLY_REVENUE : realData;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Revenue Trend
            </h2>
            {usingDemo && <DemoDataBadge />}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {usingDemo
              ? "Sample monthly revenue — will switch to real data once you have more orders"
              : `Based on orders placed, most recent ${chartData.length} active days`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-[320px] rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-800" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" className="text-gray-400" />
            <YAxis tick={{ fontSize: 12 }} stroke="currentColor" className="text-gray-400" width={64} tickFormatter={(v) => compactMoney(v)} />
            <Tooltip
              formatter={(value) => [formatMoney(Number(value)), "Revenue"]}
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#revenueFill)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueChart;
