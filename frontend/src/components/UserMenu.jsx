import { FaUserCircle, FaUser, FaCog, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const UserMenu = ({ user, onClose }) => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const logout = () => {
    localStorage.removeItem("pos-user");
    localStorage.removeItem("pos-token");
    navigate("/login");
  };

  return (
    <div className="absolute right-0 mt-4 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden z-50">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">

        <FaUserCircle size={60} />

        <h2 className="font-bold text-xl mt-3">
          {user.name}
        </h2>

        <p className="text-sm opacity-90">
          {user.email}
        </p>

      </div>

      {/* Menu */}

      <div className="p-3 space-y-1">

        <button
          onClick={() => {
            navigate("/admin-dashboard/profile");
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-white transition"
        >
          <FaUser />
          My Profile
        </button>

        <button
          onClick={() => {
            navigate("/admin-dashboard/settings");
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-white transition"
        >
          <FaCog />
          Settings
        </button>

        <button
          onClick={() => {
            toggleTheme();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-white transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <hr className="my-2 border-gray-200 dark:border-slate-700" />

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>
    </div>
  );
};

export default UserMenu;