import { NavLink, useNavigate } from "react-router-dom";

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
} from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

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
      icon: <FaTags />,
      path: "/admin-dashboard/categories",
    },
    {
      title: "Suppliers",
      icon: <FaTruck />,
      path: "/admin-dashboard/suppliers",
    },
    {
      title: "Orders",
      icon: <FaShoppingCart />,
      path: "/admin-dashboard/orders",
    },
    {
      title: "Users",
      icon: <FaUsers />,
      path: "/admin-dashboard/users",
    },
    {
      title: "Inventory",
      icon: <FaWarehouse />,
      path: "/admin-dashboard/inventory",
    },
    {
      title: "Reports",
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
    localStorage.removeItem("pos-user");
    localStorage.removeItem("pos-token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

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
          w-11
          h-11
          rounded-xl
          bg-blue-600
          hover:bg-blue-700
          text-white
          flex
          items-center
          justify-center
          shadow-lg
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
          w-72
          flex-shrink-0
          bg-white
          dark:bg-slate-900
          border-r
          border-gray-200
          dark:border-slate-800
          shadow-xl
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
                w-11
                h-11
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                text-white
                flex
                items-center
                justify-center
                font-bold
                text-xl
                shadow-lg
              "
            >
              I
            </div>

            <div>

              <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                Inventory Pro
              </h1>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Admin Dashboard
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

        <nav className="flex-1 overflow-y-auto px-4 py-5">

          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              end={item.path === "/admin-dashboard"}
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `
                  flex
                  items-center
                  gap-4
                  px-4
                  py-3
                  mb-2
                  rounded-xl
                  font-medium
                  transition-all
                  duration-200
                  cursor-pointer

                  ${
                    isActive
                      ? `
                        bg-gradient-to-r
                        from-blue-600
                        to-indigo-600
                        text-white
                        shadow-lg
                      `
                      : `
                        text-gray-700
                        dark:text-gray-300
                        hover:bg-blue-50
                        dark:hover:bg-slate-800
                        hover:text-blue-600
                        dark:hover:text-blue-400
                      `
                  }
                `
              }
            >

              <span className="w-6 text-lg flex justify-center">
                {item.icon}
              </span>

              <span>
                {item.title}
              </span>

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
              justify-center
              gap-3
              py-3
              rounded-xl
              bg-red-500
              hover:bg-red-600
              text-white
              font-semibold
              shadow-md
              hover:shadow-lg
              active:scale-95
              transition-all
              duration-200
              cursor-pointer
            "
          >
            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;