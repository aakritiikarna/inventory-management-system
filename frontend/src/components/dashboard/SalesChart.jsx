import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 5200 },
  { month: "Mar", sales: 6100 },
  { month: "Apr", sales: 5400 },
  { month: "May", sales: 7200 },
  { month: "Jun", sales: 8100 },
  { month: "Jul", sales: 9000 },
  { month: "Aug", sales: 8400 },
  { month: "Sep", sales: 9600 },
  { month: "Oct", sales: 10500 },
  { month: "Nov", sales: 11800 },
  { month: "Dec", sales: 13200 },
];

const SalesAnalytics = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6">

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Sales Analytics
          </h2>

          <p className="text-gray-500 dark:text-gray-400">
            Monthly Sales Performance
          </p>

        </div>

        <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
          +18.4%
        </span>

      </div>

      <ResponsiveContainer width="100%" height={350}>

        <LineChart data={salesData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="#2563eb"
            strokeWidth={4}
            dot={{
              r: 5,
              fill: "#2563eb",
            }}
            activeDot={{
              r: 8,
            }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
};

export default SalesAnalytics;