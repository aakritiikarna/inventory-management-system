import { useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaLock,
  FaSave,
  FaTimes,
  FaCamera,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "Admin",
    email: user?.email || "admin@gmail.com",
    phone: user?.phone || "+977 9800000000",
    address: user?.address || "Kathmandu, Nepal",
    role: user?.role || "Administrator",
    joined: user?.joined || "June 2026",
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    localStorage.setItem("profile", JSON.stringify(profile));

    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    if (
      !password.current ||
      !password.newPassword ||
      !password.confirm
    ) {
      alert("Please fill all password fields.");
      return;
    }

    if (password.newPassword !== password.confirm) {
      alert("New password and confirm password do not match.");
      return;
    }

    alert("Password updated successfully.");

    setPassword({
      current: "",
      newPassword: "",
      confirm: "",
    });

    setShowPassword(false);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition";

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
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            My Profile
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your personal information and account settings
          </p>

        </div>

        {!editing && (
          <motion.button
            whileHover={{
              scale: 1.05,
              y: -2,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => setEditing(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg transition"
          >
            <FaEdit />
            Edit Profile
          </motion.button>
        )}
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

            <span className="font-medium">
              Profile updated successfully.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          PROFILE TOP CARD
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
          y: -4,
        }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-shadow overflow-hidden"
      >

        {/* Cover */}

        <div className="h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">

          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute inset-0 bg-white/5"
          />

        </div>

        {/* Profile Information */}

        <div className="px-6 pb-6">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 -mt-16">

            {/* Avatar */}

            <div className="flex items-end gap-5">

              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotate: 3,
                }}
                className="relative"
              >

                <div className="w-32 h-32 rounded-full bg-white dark:bg-slate-900 p-2 shadow-xl">

                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                    <FaUserCircle size={85} />
                  </div>

                </div>

                <motion.button
                  whileHover={{
                    scale: 1.1,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700"
                  title="Change profile picture"
                >
                  <FaCamera />
                </motion.button>

              </motion.div>

              <div className="pb-2">

                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {profile.name}
                </h2>

                <p className="text-gray-500 dark:text-gray-400">
                  {profile.role}
                </p>

              </div>

            </div>

            {/* Status */}

            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-semibold text-sm">

              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />

              Active Account

            </div>

          </div>

        </div>

      </motion.div>

      {/* ==========================================
          PROFILE INFORMATION
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

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Personal Information
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your account and contact information
            </p>

          </div>

          <FaUserCircle className="text-blue-600 text-2xl" />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* NAME */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>

            <div className="relative">

              <FaUserCircle className="absolute left-4 top-4 text-gray-400" />

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!editing}
                className={`${inputClass} pl-11 ${
                  !editing
                    ? "cursor-not-allowed opacity-80"
                    : ""
                }`}
              />

            </div>

          </div>

          {/* EMAIL */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>

            <div className="relative">

              <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!editing}
                className={`${inputClass} pl-11 ${
                  !editing
                    ? "cursor-not-allowed opacity-80"
                    : ""
                }`}
              />

            </div>

          </div>

          {/* PHONE */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>

            <div className="relative">

              <FaPhone className="absolute left-4 top-4 text-gray-400" />

              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!editing}
                className={`${inputClass} pl-11 ${
                  !editing
                    ? "cursor-not-allowed opacity-80"
                    : ""
                }`}
              />

            </div>

          </div>

          {/* ADDRESS */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>

            <div className="relative">

              <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400" />

              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                disabled={!editing}
                className={`${inputClass} pl-11 ${
                  !editing
                    ? "cursor-not-allowed opacity-80"
                    : ""
                }`}
              />

            </div>

          </div>

          {/* ROLE */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>

            <div className="relative">

              <FaShieldAlt className="absolute left-4 top-4 text-gray-400" />

              <input
                type="text"
                value={profile.role}
                disabled
                className={`${inputClass} pl-11 cursor-not-allowed opacity-70`}
              />

            </div>

          </div>

          {/* JOINED */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Joined Date
            </label>

            <div className="relative">

              <FaCalendarAlt className="absolute left-4 top-4 text-gray-400" />

              <input
                type="text"
                value={profile.joined}
                disabled
                className={`${inputClass} pl-11 cursor-not-allowed opacity-70`}
              />

            </div>

          </div>

        </div>

        {/* SAVE / CANCEL */}

        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="flex flex-wrap justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700"
            >

              <motion.button
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition shadow-md"
              >
                <FaTimes />
                Cancel
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.04,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-lg"
              >
                <FaSave />
                Save Changes
              </motion.button>

            </motion.div>
          )}
        </AnimatePresence>

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
          delay: 0.3,
        }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg p-6"
      >

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Account Security
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your password and account security
            </p>

          </div>

          <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center shadow-md">
            <FaLock />
          </div>

        </div>

        <motion.button
          whileHover={{
            scale: 1.03,
            y: -2,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={() => setShowPassword(!showPassword)}
          className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition shadow-md"
        >

          <FaLock />

          {showPassword
            ? "Close Password Form"
            : "Change Password"}

        </motion.button>

        <AnimatePresence>

          {showPassword && (

            <motion.form
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              onSubmit={handlePasswordUpdate}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 overflow-hidden"
            >

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>

                  <input
                    type="password"
                    name="current"
                    value={password.current}
                    onChange={handlePasswordChange}
                    placeholder="Current password"
                    className={inputClass}
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>

                  <input
                    type="password"
                    name="newPassword"
                    value={password.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New password"
                    className={inputClass}
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirm"
                    value={password.confirm}
                    onChange={handlePasswordChange}
                    placeholder="Confirm password"
                    className={inputClass}
                  />

                </div>

              </div>

              <div className="flex justify-end mt-5">

                <motion.button
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg transition"
                >

                  <FaSave />

                  Update Password

                </motion.button>

              </div>

            </motion.form>

          )}

        </AnimatePresence>

      </motion.div>

    </motion.div>
  );
};

export default Profile;