import DashboardCards from "../components/dashboard/DashboardCards";
import SalesAnalytics from "../components/dashboard/SalesAnalytics";
import RevenueChart from "../components/dashboard/RevenueChart";
import RecentOrders from "../components/dashboard/RecentOrders";

const Dashboard = () => {
  return (
    <div className="w-full space-y-6">

      {/* ================= PAGE HEADER ================= */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening with your inventory today.
        </p>
      </div>

      {/* ================= STATISTICS ================= */}

      <div className="w-full">
        <DashboardCards />
      </div>

      {/* ================= CHARTS ================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
          items-start
          w-full
        "
      >

        {/* Revenue Chart */}

        <div
          className="
            xl:col-span-2
            w-full
            min-w-0
          "
        >
          <RevenueChart />
        </div>

        {/* Sales Analytics */}

        <div
          className="
            w-full
            min-w-0
          "
        >
          <SalesAnalytics />
        </div>

      </div>

      {/* ================= RECENT ORDERS ================= */}

      <div className="w-full">
        <RecentOrders />
      </div>

    </div>
  );
};

export default Dashboard;