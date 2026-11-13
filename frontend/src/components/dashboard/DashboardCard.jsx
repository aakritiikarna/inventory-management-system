import { motion } from "framer-motion";
import CountUp from "./CountUp";
import Sparkline from "./Sparkline";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

/**
 * Single KPI card: icon, animated number, %-change badge (real
 * period-over-period data, or hidden entirely when there's nothing to
 * compare against), and a small trend sparkline.
 */
const DashboardCard = ({
  title,
  value,
  icon,
  color,
  accent = "#2563eb",
  note,
  change, // number | null — percentage change vs previous period
  sparkline = [], // [{ v: number }] — small trend series
  prefix = "",
  suffix = "",
  delay = 0,
}) => {
  const numericValue = Number(String(value).replace(/[^0-9.-]/g, ""));
  // Pull out whatever leading, non-numeric characters formatMoney()
  // produced (e.g. "$", "Rs ", "₹", "€") instead of hardcoding "$" —
  // otherwise switching currency would silently drop the symbol here
  // while every other screen updated correctly.
  const leadingSymbol = String(value).match(/^[^\d.-]*/)?.[0] || "";
  const displayPrefix = leadingSymbol || prefix;

  const hasChange = typeof change === "number" && !Number.isNaN(change);
  const isUp = hasChange && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-slate-800 p-5 transition-shadow"
    >
      <div className="flex items-start justify-between">
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium truncate">
          {title}
        </p>
        <div
          className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-white text-sm shadow-sm ${color}`}
        >
          {icon}
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">
        {displayPrefix}
        {!isNaN(numericValue) ? (
          <CountUp end={numericValue} duration={1.2} separator="," />
        ) : (
          value
        )}
        {suffix}
      </h2>

      <div className="flex items-center justify-between mt-2">
        <div className="min-w-0">
          {hasChange ? (
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold ${
                isUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
              }`}
            >
              {isUp ? <FaArrowUp size={9} /> : <FaArrowDown size={9} />}
              {Math.abs(change).toFixed(1)}%
            </span>
          ) : note ? (
            <span className="text-xs text-gray-400 dark:text-gray-500 truncate">{note}</span>
          ) : null}
          {hasChange && note && (
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1.5">{note}</span>
          )}
        </div>
      </div>

      {sparkline.length > 1 && (
        <div className="h-9 -mx-1 mt-2">
          <Sparkline values={sparkline.map((p) => p?.v)} color={accent} height={32} />
        </div>
      )}
    </motion.div>
  );
};

export default DashboardCard;
