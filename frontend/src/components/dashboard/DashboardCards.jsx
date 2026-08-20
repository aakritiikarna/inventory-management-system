import {
  FaBoxes,
  FaShoppingCart,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";

import { motion } from "framer-motion";

const cards = [
  {
    title: "Total Revenue",
    value: "$84,250",
    icon: <FaDollarSign />,
    bg: "bg-blue-50",
    iconBg: "bg-blue-500",
    text: "text-blue-700",
    change: "+18%",
  },
  {
    title: "Total Orders",
    value: "1,248",
    icon: <FaShoppingCart />,
    bg: "bg-green-50",
    iconBg: "bg-green-500",
    text: "text-green-700",
    change: "+12%",
  },
  {
    title: "Products",
    value: "582",
    icon: <FaBoxes />,
    bg: "bg-orange-50",
    iconBg: "bg-orange-500",
    text: "text-orange-700",
    change: "+8%",
  },
  {
    title: "Customers",
    value: "326",
    icon: <FaUsers />,
    bg: "bg-purple-50",
    iconBg: "bg-purple-500",
    text: "text-purple-700",
    change: "+24%",
  },
];

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
          }}
          whileHover={{
            y: -6,
            scale: 1.02,
          }}
          className={`${card.bg} rounded-2xl shadow-sm border border-gray-200 p-6 cursor-pointer`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                {card.title}
              </p>

              <h2 className="text-3xl font-bold mt-2 text-gray-800">
                {card.value}
              </h2>

              <span
                className={`${card.text} text-sm font-semibold mt-3 inline-block`}
              >
                {card.change} this month
              </span>
            </div>

            <div
              className={`${card.iconBg} w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}
            >
              {card.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardCards;