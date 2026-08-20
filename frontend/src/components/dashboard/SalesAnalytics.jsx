import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowUp,
  FaShoppingBag,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";

const metrics = [
  {
    id: "sales",
    title: "Sales",
    value: "1,245",
    subtitle: "Orders",
    change: "18%",
    icon: FaShoppingBag,
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    selectedBg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    id: "revenue",
    title: "Revenue",
    value: "$15,100",
    subtitle: "Total Revenue",
    change: "22%",
    icon: FaChartLine,
    iconBg: "bg-green-100 dark:bg-green-900/40",
    iconColor: "text-green-600 dark:text-green-400",
    selectedBg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    id: "customers",
    title: "Customers",
    value: "842",
    subtitle: "Active Customers",
    change: "12%",
    icon: FaUsers,
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    selectedBg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    id: "current-sales",
    title: "Current Sales",
    value: "1,245",
    subtitle: "Orders",
    change: "18%",
    icon: FaShoppingBag,
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    selectedBg: "bg-blue-50 dark:bg-blue-900/20",
  },
];

const SalesAnalytics = () => {
  const [selectedMetric, setSelectedMetric] = useState("sales");

  const selected =
    metrics.find((metric) => metric.id === selectedMetric) || metrics[0];

  return (
    <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-900 p-6 transition-colors duration-300">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Sales Analytics
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Click a metric to view performance
        </p>
      </div>

      {/* Circular Percentage */}
      <div className="flex justify-center mb-8">
        <motion.div
          key={selectedMetric}
          initial={{ rotate: -90, scale: 0.85, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="relative w-44 h-44"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 180 180"
          >
            {/* Background Circle */}
            <circle
              cx="90"
              cy="90"
              r="68"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-200 dark:text-slate-700"
            />

            {/* Progress Circle */}
            <motion.circle
              cx="90"
              cy="90"
              r="68"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              className="text-blue-600"
              strokeDasharray="427"
              initial={{
                strokeDashoffset: 427,
              }}
              animate={{
                strokeDashoffset: 427 - (427 * 0.18),
              }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
              }}
              transform="rotate(-90 90 90)"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMetric}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {selected.change}
                </h2>

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Growth
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="space-y-4">

        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isSelected = selectedMetric === metric.id;

          return (
            <motion.button
              key={metric.id}
              type="button"
              onClick={() => setSelectedMetric(metric.id)}
              whileHover={{
                scale: 1.02,
                y: -3,
              }}
              whileTap={{
                scale: 0.97,
              }}
              animate={{
                scale: isSelected ? 1.02 : 1,
              }}
              transition={{
                duration: 0.2,
              }}
              className={`
                w-full
                text-left
                flex
                items-center
                justify-between
                p-5
                rounded-2xl
                transition-all
                duration-300
                cursor-pointer
                ${
                  isSelected
                    ? `${metric.selectedBg} shadow-lg`
                    : "bg-gray-50 dark:bg-slate-800 shadow-sm hover:shadow-md"
                }
              `}
            >

              {/* Left */}
              <div className="flex items-center gap-4">

                <motion.div
                  animate={{
                    scale: isSelected ? [1, 1.12, 1] : 1,
                    rotate: isSelected ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className={`
                    w-14
                    h-14
                    rounded-full
                    flex
                    items-center
                    justify-center
                    ${metric.iconBg}
                    ${metric.iconColor}
                  `}
                >
                  <Icon className="text-xl" />
                </motion.div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {metric.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {metric.value}{" "}
                    {metric.id === "revenue"
                      ? ""
                      : metric.subtitle}
                  </p>
                </div>

              </div>

              {/* Right */}
              <motion.span
                animate={{
                  x: isSelected ? [0, 4, 0] : 0,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="text-green-500 flex items-center gap-1 font-semibold text-lg"
              >
                <FaArrowUp />
                {metric.change}
              </motion.span>

            </motion.button>
          );
        })}

      </div>

      {/* Selected Metric Summary */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMetric}
          initial={{
            opacity: 0,
            y: 15,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -10,
          }}
          transition={{
            duration: 0.35,
          }}
          className="
            mt-6
            p-6
            rounded-2xl
            bg-blue-50
            dark:bg-blue-900/20
            shadow-lg
          "
        >
          <div className="flex items-center gap-4">

            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                w-14
                h-14
                rounded-xl
                bg-blue-100
                dark:bg-blue-900/50
                flex
                items-center
                justify-center
              "
            >
              <selected.icon className="text-blue-600 dark:text-blue-400 text-xl" />
            </motion.div>

            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Selected Metric
              </p>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selected.title}
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {selected.value} {selected.subtitle}
              </p>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default SalesAnalytics;