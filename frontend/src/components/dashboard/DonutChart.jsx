import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const DEFAULT_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#14b8a6", "#f97316"];

/**
 * Reusable animated donut chart. `data` = [{ name, value }].
 * Shows the total in the center and a simple legend below.
 */
const DonutChart = ({ data = [], colors = DEFAULT_COLORS, height = 200, centerLabel = "Total" }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <div className="relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="90%"
              paddingAngle={3}
              animationDuration={900}
              animationBegin={100}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} (${total ? Math.round((value / total) * 100) : 0}%)`, name]}
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">{total}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{centerLabel}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-3">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length] }} />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
