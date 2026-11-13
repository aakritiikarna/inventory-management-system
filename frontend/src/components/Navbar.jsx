import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaBell,
  FaMoon,
  FaSun,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaShoppingCart,
  FaCheckCircle,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useDashboard } from "../context/DashboardContext";
import { useCurrency } from "../context/CurrencyContext";
import Avatar from "./common/Avatar";

const roleLabel = (role) =>
  ({ admin: "Administrator", user: "Staff", customer: "Customer" }[role] || role || "User");

const readLowStockAlertsSetting = () => {
  try {
    return JSON.parse(localStorage.getItem("inventory-settings") || "{}").lowStockAlerts !== false;
  } catch {
    return true;
  }
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { lowStockItems, recentOrders } = useDashboard();
  const { formatMoney } = useCurrency();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  // Honors Settings → Low Stock Alerts (stored client-side). Defaults to on.
  const lowStockAlertsOn = readLowStockAlertsSetting();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Real notifications derived from actual dashboard data — no fake feed.
  // Low-stock/inventory alerts are admin-only: a staff or customer
  // account has no reason to see internal warehouse stock levels, so
  // that half of the feed is simply not built for them rather than
  // just hidden behind CSS.
  const notifications = [
    ...(isAdmin && lowStockAlertsOn
      ? lowStockItems.slice(0, 4).map((item) => ({
          id: `low-${item._id}`,
          icon: <FaExclamationTriangle className="text-amber-500" />,
          iconBg: "bg-amber-50 dark:bg-amber-900/20",
          title: "Low stock",
          desc: `${item.productName} has ${item.stock} unit${item.stock === 1 ? "" : "s"} left${
            item.branch?.name ? ` at ${item.branch.name}` : ""
          }.`,
          urgent: true,
        }))
      : []),
    ...recentOrders.slice(0, 4).map((order) => ({
      id: `order-${order._id}`,
      icon: <FaShoppingCart className="text-blue-500" />,
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      title: "Order update",
      desc: `${order.customer} — ${order.orderStatus} — ${formatMoney(Number(order.totalAmount || 0))}`,
    })),
  ].slice(0, 6);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="relative z-[100] w-full h-20 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 shadow-sm transition-colors duration-300">
      {/* SEARCH */}
      <div className="relative w-full max-w-md hidden sm:block">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search products, orders, users..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              navigate(`/admin-dashboard/products?q=${encodeURIComponent(e.currentTarget.value.trim())}`);
            }
          }}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        {/* Theme */}
        <button
          onClick={toggleTheme}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 flex items-center justify-center transition cursor-pointer"
        >
          {darkMode ? <FaSun size={17} /> : <FaMoon size={17} />}
        </button>

        {/* Notifications */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => { setShowNotifications((v) => !v); setShowProfile(false); }}
            className="relative w-11 h-11 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 flex items-center justify-center transition cursor-pointer"
          >
            <FaBell size={17} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-14 w-80 sm:w-96 max-w-[90vw] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-[9999]">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-700">
                <h3 className="font-bold text-gray-800 dark:text-white">Notifications</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {isAdmin ? "Low stock and recent order activity" : "Recent order activity"}
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto p-2">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-gray-400 dark:text-gray-500">
                    <FaCheckCircle size={22} />
                    <p className="text-sm">You're all caught up.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                      <div className={`relative w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${n.iconBg}`}>
                        {n.icon}
                        {n.urgent && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-900" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-1.5">
                          {n.title}
                          {n.urgent && (
                            <span className="text-[10px] font-bold uppercase tracking-wide text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded">
                              Action needed
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 break-words">{n.desc}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setShowProfile((v) => !v); setShowNotifications(false); }}
            className="flex items-center gap-3 cursor-pointer rounded-xl pl-2 pr-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            <Avatar name={user?.name} src={user?.profileImage} size={40} />
            <div className="text-left hidden md:block">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">{user?.name || "Account"}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{roleLabel(user?.role)}</p>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-16 w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-[9999]">
              <div className="px-5 py-5 flex items-center gap-3 border-b border-gray-100 dark:border-slate-800">
                <Avatar name={user?.name} src={user?.profileImage} size={48} />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => { setShowProfile(false); navigate("/admin-dashboard/profile"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <FaUser size={13} /> Profile
                </button>
                <button
                  onClick={() => { setShowProfile(false); navigate("/admin-dashboard/settings"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <FaCog size={13} /> Account Settings
                </button>
                <div className="my-1 border-t border-gray-100 dark:border-slate-800" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer"
                >
                  <FaSignOutAlt size={13} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
