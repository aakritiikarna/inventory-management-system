import { createContext, useContext, useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardServices";

const DashboardContext = createContext(null);

const emptyStats = {
  totalProducts: 0,
  totalCustomers: 0,
  activeUsers: 0,
  totalOrders: 0,
  totalBranches: 0,
  totalSuppliers: 0,
  totalRevenue: 0,
  totalProfit: 0,
  hasCostData: false,
  inventoryValue: 0,
  totalUnits: 0,
  lowStockCount: 0,
  categoriesCount: 0,
};

const emptyPeriodStats = {
  revenueChange: null,
  ordersChange: null,
  profitChange: null,
  newCustomers: 0,
  newCustomersChange: null,
};

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState(emptyStats);
  const [periodStats, setPeriodStats] = useState(emptyPeriodStats);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [ordersTrend, setOrdersTrend] = useState([]);
  const [profitTrend, setProfitTrend] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [categoryCounts, setCategoryCounts] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [warehouseStock, setWarehouseStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDashboard = async () => {
    try {
      setError(null);

      const data = await getDashboardStats();

      if (data?.stats) setStats(data.stats);
      setPeriodStats(data?.periodStats || emptyPeriodStats);
      setRevenueTrend(data?.revenueTrend || []);
      setOrdersTrend(data?.ordersTrend || []);
      setProfitTrend(data?.profitTrend || []);
      setUserGrowth(data?.userGrowth || []);
      setStatusCounts(data?.statusCounts || {});
      setCategoryCounts(data?.categoryCounts || {});
      setTopProducts(data?.topProducts || []);
      setLowStockItems(data?.lowStockItems || []);
      setWarehouseStock(data?.warehouseStock || []);
      setRecentOrders(data?.recentOrders || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Dashboard stats error:", err);
      setError(
        err.response?.data?.message || "Unable to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // The fetch manages loading state while its request is in flight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        stats,
        periodStats,
        revenueTrend,
        ordersTrend,
        profitTrend,
        userGrowth,
        statusCounts,
        categoryCounts,
        topProducts,
        lowStockItems,
        warehouseStock,
        recentOrders,
        loading,
        error,
        lastUpdated,
        reloadDashboard: loadDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard must be used inside DashboardProvider"
    );
  }

  return context;
};
