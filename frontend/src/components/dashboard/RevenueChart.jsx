import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const weeklyData = [
  { name: "Mon", revenue: 4200, orders: 80 },
  { name: "Tue", revenue: 5200, orders: 95 },
  { name: "Wed", revenue: 4800, orders: 90 },
  { name: "Thu", revenue: 6500, orders: 120 },
  { name: "Fri", revenue: 7600, orders: 140 },
  { name: "Sat", revenue: 8400, orders: 160 },
  { name: "Sun", revenue: 9200, orders: 185 },
];

const monthlyData = [
  { name: "Jan", revenue: 32000, orders: 680 },
  { name: "Feb", revenue: 36000, orders: 740 },
  { name: "Mar", revenue: 42000, orders: 810 },
  { name: "Apr", revenue: 47000, orders: 890 },
  { name: "May", revenue: 52000, orders: 980 },
  { name: "Jun", revenue: 61000, orders: 1080 },
];

const yearlyData = [
  { name: "2022", revenue: 220000, orders: 4200 },
  { name: "2023", revenue: 310000, orders: 6100 },
  { name: "2024", revenue: 420000, orders: 7900 },
  { name: "2025", revenue: 580000, orders: 10200 },
  { name: "2026", revenue: 720000, orders: 12600 },
];

const RevenueChart = () => {
  const [period, setPeriod] = useState("Weekly");
  const [metric, setMetric] = useState("revenue");

  const chartData =
    period === "Weekly"
      ? weeklyData
      : period === "Monthly"
      ? monthlyData
      : yearlyData;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Revenue Analytics
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Sales Performance Overview
          </p>
        </div>

        <div className="flex gap-2">

          {["Weekly", "Monthly", "Yearly"].map((item) => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              className={`px-4 py-2 rounded-lg transition ${
                period === item
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-slate-800"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      {/* Revenue / Orders Toggle */}

      <div className="flex gap-3 mb-6">

        <button
          onClick={() => setMetric("revenue")}
          className={`px-4 py-2 rounded-lg transition ${
            metric === "revenue"
              ? "bg-green-600 text-white"
              : "bg-gray-100 dark:bg-slate-800"
          }`}
        >
          Revenue
        </button>

        <button
          onClick={() => setMetric("orders")}
          className={`px-4 py-2 rounded-lg transition ${
            metric === "orders"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 dark:bg-slate-800"
          }`}
        >
          Orders
        </button>

      </div>

      {/* Chart */}

      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={chartData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey={metric}
            stroke={metric === "revenue" ? "#2563eb" : "#9333ea"}
            strokeWidth={4}
            dot={{ r: 6 }}
            activeDot={{ r: 9 }}
            animationDuration={1500}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default RevenueChart;