import { useState } from "react";
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaDownload,
  FaSyncAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaBoxOpen,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { motion } from "framer-motion";

const Reports = () => {
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // SALES DATA
  // ==========================================

  const salesData = [
    {
      month: "Jan",
      sales: 18500,
      revenue: 22500,
    },
    {
      month: "Feb",
      sales: 21000,
      revenue: 24800,
    },
    {
      month: "Mar",
      sales: 24500,
      revenue: 28100,
    },
    {
      month: "Apr",
      sales: 26800,
      revenue: 31500,
    },
    {
      month: "May",
      sales: 29500,
      revenue: 34200,
    },
    {
      month: "Jun",
      sales: 32500,
      revenue: 38200,
    },
  ];

  // ==========================================
  // CATEGORY DATA
  // ==========================================

  const categoryData = [
    {
      name: "Electronics",
      value: 35,
    },
    {
      name: "Accessories",
      value: 25,
    },
    {
      name: "Computers",
      value: 20,
    },
    {
      name: "Office",
      value: 12,
    },
    {
      name: "Others",
      value: 8,
    },
  ];

  // ==========================================
  // INVENTORY DATA
  // ==========================================

  const inventoryData = [
    {
      status: "In Stock",
      products: 382,
    },
    {
      status: "Low Stock",
      products: 76,
    },
    {
      status: "Out of Stock",
      products: 24,
    },
  ];

  // ==========================================
  // TOP PRODUCTS
  // ==========================================

  const topProducts = [
    {
      name: "Gaming Laptop",
      category: "Electronics",
      units: 128,
      revenue: "$160,000",
    },
    {
      name: "Wireless Mouse",
      category: "Accessories",
      units: 245,
      revenue: "$11,025",
    },
    {
      name: "Mechanical Keyboard",
      category: "Accessories",
      units: 186,
      revenue: "$22,320",
    },
    {
      name: "Monitor 27 Inch",
      category: "Electronics",
      units: 94,
      revenue: "$30,080",
    },
    {
      name: "USB Hub",
      category: "Accessories",
      units: 310,
      revenue: "$7,750",
    },
  ];

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // ==========================================
  // EXPORT
  // ==========================================

  const handleExport = () => {
    const reportText = `
INVENTORY PRO - SALES REPORT

Date Range: ${dateRange}

Total Revenue: $84,250
Total Sales: $82,500
Total Orders: 1,248
Customers: 326
Products Sold: 2,846

TOP PRODUCTS

Gaming Laptop - 128 units - $160,000
Wireless Mouse - 245 units - $11,025
Mechanical Keyboard - 186 units - $22,320
Monitor 27 Inch - 94 units - $30,080
USB Hub - 310 units - $7,750
`;

    const blob = new Blob([reportText], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "inventory-report.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ==========================================
  // SUMMARY CARDS
  // ==========================================

  const summaryCards = [
    {
      title: "Total Revenue",
      value: "$84,250",
      change: "+18.5%",
      icon: <FaDollarSign />,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
    },
    {
      title: "Total Orders",
      value: "1,248",
      change: "+12.4%",
      icon: <FaShoppingCart />,
      iconColor: "text-green-600",
      iconBg: "bg-green-100 dark:bg-green-900/40",
    },
    {
      title: "Customers",
      value: "326",
      change: "+24.2%",
      icon: <FaUsers />,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
    },
    {
      title: "Products Sold",
      value: "2,846",
      change: "+15.8%",
      icon: <FaBoxOpen />,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100 dark:bg-orange-900/40",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >

      {/* ==========================================
          HEADER
      ========================================== */}

      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
      >

        <div>

          <div className="flex items-center gap-3">

            <motion.div
              whileHover={{
                scale: 1.1,
                rotate: 5,
              }}
              transition={{ duration: 0.25 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl"
            >
              <FaChartLine size={22} />
            </motion.div>

            <div>

              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Reports & Analytics
              </h1>

              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Monitor your business performance and inventory insights
              </p>

            </div>

          </div>

        </div>

        <div className="flex flex-wrap items-center gap-3">

          {/* DATE RANGE */}

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative"
          >

            <FaCalendarAlt className="absolute left-4 top-3.5 text-gray-400" />

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-11 pr-5 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>

          </motion.div>

          {/* REFRESH */}

          <motion.button
            whileHover={{
              scale: 1.05,
              y: -2,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition shadow-md"
          >

            <FaSyncAlt
              className={refreshing ? "animate-spin" : ""}
            />

            Refresh

          </motion.button>

          {/* EXPORT */}

          <motion.button
            whileHover={{
              scale: 1.05,
              y: -2,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xl transition"
          >

            <FaDownload />

            Export Report

          </motion.button>

        </div>

      </motion.div>

      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {summaryCards.map((card, index) => (

          <motion.div
            key={card.title}
            initial={{
              opacity: 0,
              y: 30,
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
              y: -8,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-2xl p-6 cursor-pointer transition-shadow duration-300"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                  {card.value}
                </h2>

                <p className="text-green-500 text-sm font-semibold mt-2">
                  {card.change} this month
                </p>

              </div>

              <motion.div
                whileHover={{
                  rotate: 10,
                  scale: 1.1,
                }}
                className={`w-14 h-14 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center text-2xl shadow-md`}
              >
                {card.icon}
              </motion.div>

            </div>

          </motion.div>

        ))}

      </div>

      {/* ==========================================
          SALES CHART
      ========================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.4,
        }}
        whileHover={{
          y: -4,
        }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-2xl p-6 transition-shadow duration-300"
      >

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Sales & Revenue Overview
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Monthly business performance
            </p>

          </div>

          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shadow-md"
          >
            <FaChartLine />
          </motion.div>

        </div>

        <div className="h-[350px]">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={salesData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="month"
                stroke="#6b7280"
              />

              <YAxis
                stroke="#6b7280"
              />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="sales"
                name="Sales"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{
                  r: 5,
                }}
                activeDot={{
                  r: 8,
                }}
                animationDuration={1800}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{
                  r: 5,
                }}
                activeDot={{
                  r: 8,
                }}
                animationDuration={2200}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </motion.div>

      {/* ==========================================
          PIE + BAR
      ========================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* CATEGORY */}

        <motion.div
          initial={{
            opacity: 0,
            x: -40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.5,
          }}
          whileHover={{
            y: -5,
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-2xl p-6 transition-shadow duration-300"
        >

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Sales by Category
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Product category distribution
              </p>

            </div>

            <motion.div
              whileHover={{
                rotate: 15,
                scale: 1.1,
              }}
              className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center shadow-md"
            >
              <FaChartPie />
            </motion.div>

          </div>

          <div className="h-[320px]">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={105}
                  innerRadius={55}
                  paddingAngle={3}
                  label
                  animationBegin={200}
                  animationDuration={1200}
                >

                  {categoryData.map((entry, index) => (

                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#2563eb",
                          "#16a34a",
                          "#9333ea",
                          "#f97316",
                          "#64748b",
                        ][index]
                      }
                    />

                  ))}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </motion.div>

        {/* INVENTORY */}

        <motion.div
          initial={{
            opacity: 0,
            x: 40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.5,
          }}
          whileHover={{
            y: -5,
          }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-2xl p-6 transition-shadow duration-300"
        >

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Inventory Status
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current inventory health
              </p>

            </div>

            <motion.div
              whileHover={{
                rotate: -15,
                scale: 1.1,
              }}
              className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 flex items-center justify-center shadow-md"
            >
              <FaChartBar />
            </motion.div>

          </div>

          <div className="h-[320px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={inventoryData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="status"
                  stroke="#6b7280"
                />

                <YAxis
                  stroke="#6b7280"
                />

                <Tooltip />

                <Bar
                  dataKey="products"
                  name="Products"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </motion.div>

      </div>

      {/* ==========================================
          TOP PRODUCTS
      ========================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.7,
        }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg overflow-hidden"
      >

        <div className="p-6 border-b border-gray-200 dark:border-slate-700">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Top Performing Products
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Best-selling products by units and revenue
              </p>

            </div>

            <motion.div
              whileHover={{
                scale: 1.1,
                rotate: 10,
              }}
              className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shadow-md"
            >
              <FaChartBar />
            </motion.div>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 dark:bg-slate-800">

              <tr>

                <th className="text-left p-4 text-gray-700 dark:text-gray-200">
                  Product
                </th>

                <th className="text-left p-4 text-gray-700 dark:text-gray-200">
                  Category
                </th>

                <th className="text-left p-4 text-gray-700 dark:text-gray-200">
                  Units Sold
                </th>

                <th className="text-left p-4 text-gray-700 dark:text-gray-200">
                  Revenue
                </th>

              </tr>

            </thead>

            <tbody>

              {topProducts.map((product, index) => (

                <motion.tr
                  key={index}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: 0.8 + index * 0.08,
                  }}
                  whileHover={{
                    scale: 1.01,
                    x: 5,
                  }}
                  className="border-t border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >

                  <td className="p-4">

                    <div className="flex items-center gap-3">

                      <motion.div
                        whileHover={{
                          rotate: 10,
                          scale: 1.1,
                        }}
                        className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold shadow-md"
                      >
                        {index + 1}
                      </motion.div>

                      <span className="font-semibold text-gray-800 dark:text-white">
                        {product.name}
                      </span>

                    </div>

                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {product.category}
                  </td>

                  <td className="p-4 text-gray-700 dark:text-gray-200 font-semibold">
                    {product.units}
                  </td>

                  <td className="p-4 text-green-600 dark:text-green-400 font-bold">
                    {product.revenue}
                  </td>

                </motion.tr>

              ))}

            </tbody>

          </table>

        </div>

      </motion.div>

    </motion.div>
  );
};

export default Reports;
