import { motion } from "framer-motion";
import DashboardCards from "../components/dashboard/DashboardCards";
import RevenueChart from "../components/dashboard/RevenueChart";
import OrdersChart from "../components/dashboard/OrdersChart";
import CustomerGrowthChart from "../components/dashboard/CustomerGrowthChart";
import SalesAnalytics from "../components/dashboard/SalesAnalytics";
import OrderStatusDonut from "../components/dashboard/OrderStatusDonut";
import CategoryDonut from "../components/dashboard/CategoryDonut";
import RecentOrders from "../components/dashboard/RecentOrders";
import WarehouseOverview from "../components/dashboard/WarehouseOverview";
import DashboardCard from "../components/dashboard/DashboardCard";
import { FaBoxes, FaTags } from "react-icons/fa";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const { user } = useAuth();
  const { lastUpdated, stats, loading } = useDashboard();
  const isAdmin = user?.role === "admin";
  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="w-full space-y-6">

      {/* ================= PAGE HEADER ================= */}

      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {getGreeting()}{firstName ? `, ${firstName}` : ""} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isAdmin
              ? "Here's what's happening with your inventory today."
              : "Browse the product catalog and see what's available."}
          </p>
        </div>
        {lastUpdated && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Last updated {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </motion.div>

      {/* ================= NON-ADMIN VIEW ================= */}
      {/* The API only sends catalog size + category mix to non-admins, so
          there is nothing else to render — revenue, orders, stock and
          warehouse data never reach their browser. */}
      {!isAdmin && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <DashboardCard
              title="Products"
              value={loading ? "0" : (stats.totalProducts ?? 0).toLocaleString()}
              icon={<FaBoxes />}
              color="bg-orange-500"
              accent="#f97316"
              note="in the catalog"
              sparkline={[]}
            />
            <DashboardCard
              title="Categories"
              value={loading ? "0" : (stats.categoriesCount ?? 0).toLocaleString()}
              icon={<FaTags />}
              color="bg-violet-500"
              accent="#8b5cf6"
              note="product categories"
              sparkline={[]}
            />
          </div>
          <div className="max-w-xl">
            <ErrorBoundary label="the category chart">
              <CategoryDonut />
            </ErrorBoundary>
          </div>
        </>
      )}

      {isAdmin && (
      <>
      {/* ================= KPI CARDS ================= */}
      {/* Each section below has its own ErrorBoundary — a broken chart
          shows "Unable to load this section" instead of blanking the page. */}

      <ErrorBoundary label="your KPI cards" compact>
        <DashboardCards />
      </ErrorBoundary>

      {/* ================= REVENUE / ORDERS / CUSTOMER GROWTH ================= */}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch"
      >
        <ErrorBoundary label="the revenue chart">
          <RevenueChart />
        </ErrorBoundary>
        <ErrorBoundary label="the orders chart">
          <OrdersChart />
        </ErrorBoundary>
        <ErrorBoundary label="the customer growth chart">
          <CustomerGrowthChart />
        </ErrorBoundary>
      </motion.div>

      {/* ================= WAREHOUSES + LOW STOCK ================= */}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch"
      >
        <ErrorBoundary label="warehouse stock">
          <WarehouseOverview />
        </ErrorBoundary>
        <ErrorBoundary label="low stock details">
          <SalesAnalytics />
        </ErrorBoundary>
      </motion.div>

      {/* ================= RECENT ORDERS ================= */}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        transition={{ duration: 0.35 }}
        className="w-full"
      >
        <ErrorBoundary label="recent orders">
          <RecentOrders />
        </ErrorBoundary>
      </motion.div>

      {/* ================= ANALYTICS: STATUS / CATEGORY ================= */}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch"
      >
        <ErrorBoundary label="the order status chart">
          <OrderStatusDonut />
        </ErrorBoundary>
        <ErrorBoundary label="the category chart">
          <CategoryDonut />
        </ErrorBoundary>
      </motion.div>
      </>
      )}

    </div>
  );
};

export default Dashboard;
