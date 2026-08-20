import { motion } from "framer-motion";
import CountUp from "react-countup";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const DashboardCard = ({
  title,
  value,
  icon,
  color,
  change,
  prefix = "",
  suffix = "",
}) => {
  const numericValue = Number(String(value).replace(/,/g, ""));

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.3,
      }}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 dark:border-slate-700 p-6 transition-all"
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-3 text-gray-800 dark:text-white">

            {prefix}

            {!isNaN(numericValue) ? (
              <CountUp
                end={numericValue}
                duration={2}
                separator=","
              />
            ) : (
              value
            )}

            {suffix}

          </h2>

          <div className="flex items-center gap-2 mt-4">

            <span
              className={`flex items-center gap-1 text-sm font-semibold ${
                change.startsWith("+")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {change.startsWith("+") ? (
                <FaArrowUp />
              ) : (
                <FaArrowDown />
              )}

              {change}
            </span>

            <span className="text-gray-400 text-sm">
              this month
            </span>

          </div>

        </div>

        <motion.div
          whileHover={{
            rotate: 360,
          }}
          transition={{
            duration: 0.8,
          }}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg ${color}`}
        >
          {icon}
        </motion.div>

      </div>
    </motion.div>
  );
};

export default DashboardCard;