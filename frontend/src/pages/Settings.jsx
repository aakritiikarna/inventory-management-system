import { useEffect, useState } from "react";
import {
  FaCog,
  FaMoon,
  FaSun,
  FaBell,
  FaEnvelope,
  FaShoppingCart,
  FaExclamationTriangle,
  FaVolumeUp,
  FaGlobe,
  FaMoneyBillWave,
  FaSave,
  FaUndo,
  FaShieldAlt,
  FaDatabase,
  FaCheckCircle,
} from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";

import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();

  const [saved, setSaved] = useState(false);

  const defaultSettings = {
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    soundEffects: true,
    autoSave: true,
    language: "English",
    currency: "USD",
  };

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("inventory-settings");

    if (savedSettings) {
      return JSON.parse(savedSettings);
    }

    return defaultSettings;
  });

  // ==========================================
  // SAVE SETTINGS AUTOMATICALLY
  // ==========================================

  useEffect(() => {
    if (settings.autoSave) {
      localStorage.setItem(
        "inventory-settings",
        JSON.stringify(settings)
      );
    }
  }, [settings]);

  // ==========================================
  // TOGGLE
  // ==========================================

  const toggleSetting = (name) => {
    setSettings((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  // ==========================================
  // SELECT
  // ==========================================

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE
  // ==========================================

  const saveSettings = () => {
    localStorage.setItem(
      "inventory-settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  // ==========================================
  // RESET
  // ==========================================

  const resetSettings = () => {
    setSettings(defaultSettings);

    localStorage.setItem(
      "inventory-settings",
      JSON.stringify(defaultSettings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  // ==========================================
  // TOGGLE COMPONENT
  // ==========================================

  const Toggle = ({ enabled, onClick }) => {
    return (
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onClick}
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
          enabled
            ? "bg-blue-600"
            : "bg-gray-300 dark:bg-slate-600"
        }`}
      >
        <motion.div
          animate={{
            x: enabled ? 28 : 4,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
        />
      </motion.button>
    );
  };

  // ==========================================
  // SETTING ROW
  // ==========================================

  const SettingRow = ({
    icon,
    iconBg,
    title,
    description,
    enabled,
    settingName,
  }) => {
    return (
      <motion.div
        whileHover={{
          x: 4,
          scale: 1.01,
        }}
        className="flex items-center justify-between gap-4 p-5 rounded-xl bg-gray-50 dark:bg-slate-800/70 hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-center gap-4">

          <motion.div
            whileHover={{
              scale: 1.1,
              rotate: 5,
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}
          >
            {icon}
          </motion.div>

          <div>

            <h3 className="font-semibold text-gray-800 dark:text-white">
              {title}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>

          </div>

        </div>

        <Toggle
          enabled={enabled}
          onClick={() => toggleSetting(settingName)}
        />

      </motion.div>
    );
  };

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
        initial={{
          opacity: 0,
          y: -25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >

        <div className="flex items-center gap-4">

          <motion.div
            animate={{
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl"
          >
            <FaCog size={22} />
          </motion.div>

          <div>

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Settings
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your dashboard preferences and notifications
            </p>

          </div>

        </div>

      </motion.div>

      {/* ==========================================
          SUCCESS MESSAGE
      ========================================== */}

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -15,
            }}
            className="flex items-center gap-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-5 py-4 rounded-xl shadow-md"
          >

            <FaCheckCircle />

            <span className="font-semibold">
              Settings saved successfully.
            </span>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          APPEARANCE
      ========================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.1,
        }}
        whileHover={{
          y: -3,
        }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-shadow p-6"
      >

        <div className="flex items-center gap-3 mb-6">

          <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center shadow-md">
            {darkMode ? <FaMoon /> : <FaSun />}
          </div>

          <div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Appearance
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Customize how your dashboard looks
            </p>

          </div>

        </div>

        <div className="flex items-center justify-between p-5 rounded-xl bg-gray-50 dark:bg-slate-800">

          <div className="flex items-center gap-4">

            <motion.div
              animate={{
                rotate: darkMode ? 180 : 0,
              }}
              transition={{
                duration: 0.4,
              }}
              className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center"
            >
              {darkMode ? <FaMoon /> : <FaSun />}
            </motion.div>

            <div>

              <h3 className="font-semibold text-gray-800 dark:text-white">
                Dark Mode
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {darkMode
                  ? "Dark theme is currently enabled"
                  : "Light theme is currently enabled"}
              </p>

            </div>

          </div>

          <Toggle
            enabled={darkMode}
            onClick={toggleTheme}
          />

        </div>

      </motion.div>

      {/* ==========================================
          NOTIFICATIONS
      ========================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg p-6"
      >

        <div className="flex items-center gap-3 mb-6">

          <div className="w-11 h-11 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 flex items-center justify-center shadow-md">
            <FaBell />
          </div>

          <div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Notifications
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose which notifications you want to receive
            </p>

          </div>

        </div>

        <div className="space-y-3">

          <SettingRow
            icon={<FaEnvelope className="text-blue-600" />}
            iconBg="bg-blue-100 dark:bg-blue-900/40"
            title="Email Notifications"
            description="Receive important updates through email"
            enabled={settings.emailNotifications}
            settingName="emailNotifications"
          />

          <SettingRow
            icon={<FaShoppingCart className="text-green-600" />}
            iconBg="bg-green-100 dark:bg-green-900/40"
            title="Order Notifications"
            description="Get notified when a new order is created"
            enabled={settings.orderNotifications}
            settingName="orderNotifications"
          />

          <SettingRow
            icon={<FaExclamationTriangle className="text-orange-600" />}
            iconBg="bg-orange-100 dark:bg-orange-900/40"
            title="Low Stock Alerts"
            description="Receive alerts when products are running low"
            enabled={settings.lowStockAlerts}
            settingName="lowStockAlerts"
          />

          <SettingRow
            icon={<FaVolumeUp className="text-purple-600" />}
            iconBg="bg-purple-100 dark:bg-purple-900/40"
            title="Sound Effects"
            description="Play sound when important notifications arrive"
            enabled={settings.soundEffects}
            settingName="soundEffects"
          />

        </div>

      </motion.div>

      {/* ==========================================
          GENERAL SETTINGS
      ========================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.3,
        }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg p-6"
      >

        <div className="flex items-center gap-3 mb-6">

          <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shadow-md">
            <FaGlobe />
          </div>

          <div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              General Settings
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage regional and dashboard preferences
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* LANGUAGE */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>

            <div className="relative">

              <FaGlobe className="absolute left-4 top-4 text-gray-400" />

              <select
                name="language"
                value={settings.language}
                onChange={handleSelectChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >

                <option>English</option>
                <option>Nepali</option>
                <option>Hindi</option>

              </select>

            </div>

          </div>

          {/* CURRENCY */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>

            <div className="relative">

              <FaMoneyBillWave className="absolute left-4 top-4 text-gray-400" />

              <select
                name="currency"
                value={settings.currency}
                onChange={handleSelectChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >

                <option value="USD">
                  USD - US Dollar
                </option>

                <option value="NPR">
                  NPR - Nepalese Rupee
                </option>

                <option value="INR">
                  INR - Indian Rupee
                </option>

                <option value="EUR">
                  EUR - Euro
                </option>

              </select>

            </div>

          </div>

        </div>

      </motion.div>

      {/* ==========================================
          SYSTEM SETTINGS
      ========================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.4,
        }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg p-6"
      >

        <div className="flex items-center gap-3 mb-6">

          <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shadow-md">
            <FaDatabase />
          </div>

          <div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              System Preferences
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure how your application behaves
            </p>

          </div>

        </div>

        <SettingRow
          icon={<FaDatabase className="text-blue-600" />}
          iconBg="bg-blue-100 dark:bg-blue-900/40"
          title="Auto Save"
          description="Automatically save dashboard preferences"
          enabled={settings.autoSave}
          settingName="autoSave"
        />

      </motion.div>

      {/* ==========================================
          SECURITY
      ========================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.5,
        }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white"
      >

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div className="flex items-center gap-4">

            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"
            >
              <FaShieldAlt size={22} />
            </motion.div>

            <div>

              <h2 className="text-xl font-bold">
                Your settings are secure
              </h2>

              <p className="text-blue-100 text-sm mt-1">
                Preferences are stored locally on this device.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 text-sm font-semibold">

            <FaCheckCircle />

            Protected

          </div>

        </div>

      </motion.div>

      {/* ==========================================
          ACTION BUTTONS
      ========================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.6,
        }}
        className="flex flex-col sm:flex-row justify-end gap-3 pb-5"
      >

        <motion.button
          whileHover={{
            scale: 1.04,
            y: -2,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={resetSettings}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 shadow-md transition"
        >

          <FaUndo />

          Reset Settings

        </motion.button>

        <motion.button
          whileHover={{
            scale: 1.04,
            y: -2,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={saveSettings}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xl transition"
        >

          <FaSave />

          Save Settings

        </motion.button>

      </motion.div>

    </motion.div>
  );
};

export default Settings;