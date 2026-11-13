import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaTruck,
  FaShoppingCart,
  FaUsers,
  FaUserCircle,
  FaCog,
  FaTimes,
  FaBars,
  FaSignOutAlt,
  FaWarehouse,
  FaChartBar,
  FaMapMarkedAlt,
} from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const isAdmin = user?.role === "admin";

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/admin-dashboard",
    },
    {
      title: "Products",
      icon: <FaBoxOpen />,
      path: "/admin-dashboard/products",
    },
    {
      title: "Categories",
      adminOnly: true,
      icon: <FaTags />,
      path: "/admin-dashboard/categories",
    },
    {
      title: "Suppliers",
      adminOnly: true,
      icon: <FaTruck />,
      path: "/admin-dashboard/suppliers",
    },
    {
      title: "Orders",
      adminOnly: true,
      icon: <FaShoppingCart />,
      path: "/admin-dashboard/orders",
    },
    {
      title: "Users",
      adminOnly: true,
      icon: <FaUsers />,
      path: "/admin-dashboard/users",
    },
    {
      title: "Branches",
      adminOnly: true,
      icon: <FaMapMarkedAlt />,
      path: "/admin-dashboard/branches",
    },
    {
      title: "Inventory",
      adminOnly: true,
      icon: <FaWarehouse />,
      path: "/admin-dashboard/inventory",
    },
    {
      title: "Reports",
      adminOnly: true,
      icon: <FaChartBar />,
      path: "/admin-dashboard/reports",
    },
    {
      title: "Profile",
      icon: <FaUserCircle />,
      path: "/admin-dashboard/profile",
    },
    {
      title: "Settings",
      icon: <FaCog />,
      path: "/admin-dashboard/settings",
    },
  ];

  const logout = () => {
    authLogout(); // clears token + user from storage AND from auth state
    navigate("/login");
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Non-admins only see what they can actually open. This is a UX layer —
  // the real enforcement is the route guards in App.jsx and the API.
  const visibleItems = menuItems.filter((item) => isAdmin || !item.adminOnly);

  return (
    <>
      {/* =====================================
          MOBILE MENU BUTTON
      ===================================== */}

      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="
          fixed
          top-4
          left-4
          z-[60]
          lg:hidden
          w-10
          h-10
          rounded-lg
          bg-gray-900
          dark:bg-white
          text-white
          dark:text-gray-900
          flex
          items-center
          justify-center
          shadow-sm
          cursor-pointer
          transition
        "
      >
        <FaBars size={20} />
      </button>

      {/* =====================================
          MOBILE OVERLAY
      ===================================== */}

      {sidebarOpen && (
        <div
          className="
            fixed
            inset-0
            z-[50]
            bg-black/50
            lg:hidden
          "
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        className={`
          fixed
          lg:sticky
          top-0
          left-0
          z-[55]
          h-screen
          w-64
          flex-shrink-0
          bg-white
          dark:bg-slate-900
          border-r
          border-gray-200
          dark:border-slate-800
          flex
          flex-col
          transition-transform
          duration-300
          ease-in-out

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* =====================================
            LOGO
        ===================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            px-5
            py-5
            border-b
            border-gray-200
            dark:border-slate-800
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                w-10
                h-10
                rounded-lg
                bg-gray-900
                dark:bg-white
                text-white
                dark:text-gray-900
                flex
                items-center
                justify-center
                font-bold
                text-lg
              "
            >
              I
            </div>

            <div>

              <h1 className="text-[15px] font-semibold text-gray-900 dark:text-white tracking-tight">
                Inventory Pro
              </h1>

              <p className="text-xs text-gray-400 dark:text-gray-500">
                {isAdmin ? "Admin Dashboard" : "Product Catalog"}
              </p>

            </div>

          </div>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="
              lg:hidden
              w-9
              h-9
              rounded-lg
              flex
              items-center
              justify-center
              text-gray-500
              dark:text-gray-300
              hover:bg-gray-100
              dark:hover:bg-slate-800
              cursor-pointer
            "
          >
            <FaTimes />
          </button>

        </div>

        {/* =====================================
            NAVIGATION
        ===================================== */}

        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-0.5">

          {visibleItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              end={item.path === "/admin-dashboard"}
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `
                  relative
                  flex
                  items-center
                  gap-3
                  pl-4
                  pr-3
                  py-2.5
                  rounded-lg
                  text-[13.5px]
                  font-medium
                  transition-colors
                  duration-150
                  cursor-pointer

                  ${
                    isActive
                      ? `
                        bg-gray-100
                        dark:bg-slate-800
                        text-gray-900
                        dark:text-white
                      `
                      : `
                        text-gray-500
                        dark:text-gray-400
                        hover:bg-gray-50
                        dark:hover:bg-slate-800/60
                        hover:text-gray-900
                        dark:hover:text-gray-200
                      `
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full bg-gray-900 dark:bg-white" />
                  )}
                  <span className="w-5 text-[15px] flex justify-center">
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </>
              )}
            </NavLink>
          ))}

        </nav>

        {/* =====================================
            LOGOUT
        ===================================== */}

        <div
          className="
            p-4
            border-t
            border-gray-200
            dark:border-slate-800
          "
        >

          <button
            type="button"
            onClick={logout}
            className="
              w-full
              flex
              items-center
              gap-3
              pl-4
              pr-3
              py-2.5
              rounded-lg
              text-[13.5px]
              font-medium
              text-gray-500
              dark:text-gray-400
              hover:bg-red-50
              dark:hover:bg-red-900/20
              hover:text-red-600
              dark:hover:text-red-400
              transition-colors
              duration-150
              cursor-pointer
            "
          >
            <span className="w-5 text-[15px] flex justify-center">
              <FaSignOutAlt />
            </span>

            Logout

          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;