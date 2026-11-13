import {
  FaDollarSign,
  FaShoppingCart,
  FaChartLine,
  FaUserPlus,
  FaBoxes,
  FaTruck,
  FaWarehouse,
  FaExclamationTriangle,
} from "react-icons/fa";

import DashboardCard from "./DashboardCard";
import { useDashboard } from "../../context/DashboardContext";
import { useCurrency } from "../../context/CurrencyContext";

const toSpark = (arr, key) => (arr || []).map((p) => ({ v: p[key] }));

const DashboardCards = () => {
  const { formatMoney: currency } = useCurrency();
  const { stats, periodStats, revenueTrend, ordersTrend, profitTrend, loading } = useDashboard();

  const cards = [
    {
      title: "Total Revenue",
      value: currency(stats.totalRevenue),
      icon: <FaDollarSign />,
      color: "bg-blue-500",
      accent: "#2563eb",
      change: periodStats.revenueChange,
      note: "vs last 30 days",
      sparkline: toSpark(revenueTrend, "revenue"),
    },
    {
      title: "Total Orders",
      value: stats.totalOrders?.toLocaleString() ?? "0",
      icon: <FaShoppingCart />,
      color: "bg-emerald-500",
      accent: "#10b981",
      change: periodStats.ordersChange,
      note: "vs last 30 days",
      sparkline: toSpark(ordersTrend, "orders"),
    },
    {
      title: "Total Profit",
      value: currency(stats.totalProfit),
      icon: <FaChartLine />,
      color: "bg-violet-500",
      accent: "#8b5cf6",
      change: periodStats.profitChange,
      note: stats.hasCostData ? "vs last 30 days" : "add product cost to enable",
      sparkline: toSpark(profitTrend, "profit"),
    },
    {
      title: "New Customers",
      value: periodStats.newCustomers?.toLocaleString() ?? "0",
      icon: <FaUserPlus />,
      color: "bg-amber-500",
      accent: "#f59e0b",
      change: periodStats.newCustomersChange,
      note: "last 30 days",
      sparkline: [],
    },
    {
      title: "Products",
      value: stats.totalProducts?.toLocaleString() ?? "0",
      icon: <FaBoxes />,
      color: "bg-orange-500",
      accent: "#f97316",
      note: `${stats.categoriesCount ?? 0} categories`,
      sparkline: [],
    },
    {
      title: "Suppliers",
      value: stats.totalSuppliers?.toLocaleString() ?? "0",
      icon: <FaTruck />,
      color: "bg-teal-500",
      accent: "#14b8a6",
      note: `${stats.totalBranches ?? 0} branches`,
      sparkline: [],
    },
    {
      title: "Units in Stock",
      value: stats.totalUnits?.toLocaleString() ?? "0",
      icon: <FaWarehouse />,
      color: "bg-indigo-500",
      accent: "#6366f1",
      note: `${currency(stats.inventoryValue)} inventory value`,
      sparkline: [],
    },
    {
      title: "Low Stock",
      value: stats.lowStockCount?.toLocaleString() ?? "0",
      icon: <FaExclamationTriangle />,
      color: stats.lowStockCount > 0 ? "bg-red-500" : "bg-emerald-500",
      accent: stats.lowStockCount > 0 ? "#ef4444" : "#10b981",
      note: stats.lowStockCount > 0 ? "products need restocking" : "all products sufficiently stocked",
      sparkline: [],
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[148px] rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card, i) => (
        <DashboardCard key={card.title} {...card} delay={i * 0.05} />
      ))}
    </div>
  );
};

export default DashboardCards;
