import { createContext, useContext, useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardServices";

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data = await getDashboardStats();

      if (data?.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        stats,
        loading,
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