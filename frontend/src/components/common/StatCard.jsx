import { motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  icon,
  color = "bg-blue-100 text-blue-600",
  change,
}) => {
  return (

    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
      transition={{
        duration: 0.2,
      }}
      className="bg-white rounded-2xl shadow-sm border p-6"
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2 text-gray-800">
            {value}
          </h2>

          {change && (
            <p className="text-green-600 text-sm mt-2 font-medium">
              {change}
            </p>
          )}

        </div>

        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${color}`}
        >
          {icon}
        </div>

      </div>

    </motion.div>

  );
};

export default StatCard;