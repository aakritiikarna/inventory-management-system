import { useEffect, useRef, useState } from "react";
import {
  FaSearch,
  FaBell,
  FaEnvelope,
  FaUserCircle,
  FaCheckCircle,
  FaBoxOpen,
  FaShoppingCart,
  FaTimes,
} from "react-icons/fa";

import ThemeToggle from "./ThemeToggle";
import NotificationDropdown from "./NotificationDropdown";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const messageRef = useRef(null);

  const user = {
    name: "Admin",
    email: "admin@gmail.com",
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }

      if (
        messageRef.current &&
        !messageRef.current.contains(event.target)
      ) {
        setShowMessages(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotification = () => {
    setShowNotification((prev) => !prev);
    setShowProfile(false);
    setShowMessages(false);
  };

  const handleProfile = () => {
    setShowProfile((prev) => !prev);
    setShowNotification(false);
    setShowMessages(false);
  };

  const handleMessages = () => {
    setShowMessages((prev) => !prev);
    setShowNotification(false);
    setShowProfile(false);
  };

  return (
    <header
      className="
        relative
        z-[100]
        w-full
        h-20
        bg-white
        dark:bg-slate-900
        border-b
        border-gray-200
        dark:border-slate-800
        flex
        items-center
        justify-between
        px-6
        shadow-sm
        transition-colors
        duration-300
      "
    >
      {/* ================= SEARCH ================= */}

      <div className="relative w-96 max-w-[45%]">
        <FaSearch
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            dark:text-gray-500
          "
        />

        <input
          type="text"
          placeholder="Search products, orders..."
          className="
            w-full
            pl-11
            pr-4
            py-3
            rounded-xl
            border
            border-gray-200
            dark:border-slate-700
            bg-gray-50
            dark:bg-slate-800
            text-gray-800
            dark:text-white
            placeholder-gray-400
            outline-none
            focus:ring-2
            focus:ring-blue-500
            transition
          "
        />
      </div>

      {/* ================= RIGHT SIDE ================= */}

      <div className="flex items-center gap-4">

        {/* Theme */}

        <ThemeToggle />

        {/* ================= MESSAGE ================= */}

        <div
          ref={messageRef}
          className="relative"
        >
          <button
            type="button"
            onClick={handleMessages}
            className="
              relative
              w-12
              h-12
              rounded-xl
              bg-gray-100
              dark:bg-slate-800
              hover:bg-blue-100
              dark:hover:bg-slate-700
              text-gray-700
              dark:text-gray-200
              flex
              items-center
              justify-center
              transition-all
              duration-200
              hover:scale-105
            "
          >
            <FaEnvelope size={18} />

            <span
              className="
                absolute
                -top-1
                -right-1
                w-5
                h-5
                rounded-full
                bg-red-500
                text-white
                text-xs
                font-bold
                flex
                items-center
                justify-center
              "
            >
              3
            </span>
          </button>

          {showMessages && (
            <div
              className="
                absolute
                right-0
                top-14
                w-80
                bg-white
                dark:bg-slate-900
                border
                border-gray-200
                dark:border-slate-700
                rounded-2xl
                shadow-2xl
                overflow-hidden
                z-[9999]
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-5
                  py-4
                  border-b
                  border-gray-200
                  dark:border-slate-700
                "
              >
                <h3 className="font-bold text-gray-800 dark:text-white">
                  Messages
                </h3>

                <button
                  onClick={() => setShowMessages(false)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-4 space-y-3">

                <div className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FaEnvelope />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      New message
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You have a new message.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <FaCheckCircle />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      Order completed
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Order ORD-1001 was completed.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* ================= NOTIFICATION ================= */}

        <div
          ref={notificationRef}
          className="relative"
        >
          <button
            type="button"
            onClick={handleNotification}
            className="
              relative
              w-12
              h-12
              rounded-xl
              bg-gray-100
              dark:bg-slate-800
              hover:bg-blue-100
              dark:hover:bg-slate-700
              text-gray-700
              dark:text-gray-200
              flex
              items-center
              justify-center
              transition-all
              duration-200
              hover:scale-105
              cursor-pointer
            "
          >
            <FaBell size={19} />

            <span
              className="
                absolute
                -top-1
                -right-1
                w-5
                h-5
                rounded-full
                bg-blue-600
                text-white
                text-xs
                font-bold
                flex
                items-center
                justify-center
              "
            >
              5
            </span>
          </button>

          {showNotification && (
            <div
              className="
                absolute
                right-0
                top-14
                w-96
                max-w-[90vw]
                bg-white
                dark:bg-slate-900
                border
                border-gray-200
                dark:border-slate-700
                rounded-2xl
                shadow-2xl
                overflow-hidden
                z-[9999]
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-5
                  py-4
                  border-b
                  border-gray-200
                  dark:border-slate-700
                "
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                    Notifications
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You have 5 new notifications
                  </p>
                </div>

                <button
                  onClick={() => setShowNotification(false)}
                  className="
                    text-gray-400
                    hover:text-red-500
                    transition
                  "
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-3 space-y-2">

                {/* Notification 1 */}

                <div
                  className="
                    flex
                    gap-3
                    p-3
                    rounded-xl
                    hover:bg-gray-50
                    dark:hover:bg-slate-800
                    cursor-pointer
                    transition
                  "
                >
                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-red-100
                      text-red-600
                      flex
                      items-center
                      justify-center
                      flex-shrink-0
                    "
                  >
                    <FaBoxOpen />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      Low Stock Alert
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Gaming Laptop stock is running low.
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      5 minutes ago
                    </p>
                  </div>
                </div>

                {/* Notification 2 */}

                <div
                  className="
                    flex
                    gap-3
                    p-3
                    rounded-xl
                    hover:bg-gray-50
                    dark:hover:bg-slate-800
                    cursor-pointer
                    transition
                  "
                >
                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-green-100
                      text-green-600
                      flex
                      items-center
                      justify-center
                      flex-shrink-0
                    "
                  >
                    <FaShoppingCart />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      New Order
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      A new order ORD-1005 has been placed.
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      20 minutes ago
                    </p>
                  </div>
                </div>

                {/* Notification 3 */}

                <div
                  className="
                    flex
                    gap-3
                    p-3
                    rounded-xl
                    hover:bg-gray-50
                    dark:hover:bg-slate-800
                    cursor-pointer
                    transition
                  "
                >
                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-blue-100
                      text-blue-600
                      flex
                      items-center
                      justify-center
                      flex-shrink-0
                    "
                  >
                    <FaCheckCircle />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      Order Completed
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Order ORD-1001 has been completed.
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      1 hour ago
                    </p>
                  </div>
                </div>

              </div>

              <div
                className="
                  border-t
                  border-gray-200
                  dark:border-slate-700
                  p-3
                "
              >
                <button
                  onClick={() => setShowNotification(false)}
                  className="
                    w-full
                    py-2
                    text-blue-600
                    dark:text-blue-400
                    font-semibold
                    hover:bg-blue-50
                    dark:hover:bg-slate-800
                    rounded-xl
                    transition
                  "
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= ADMIN PROFILE ================= */}

        <div
          ref={profileRef}
          className="relative"
        >
          <button
            type="button"
            onClick={handleProfile}
            className="
              flex
              items-center
              gap-3
              cursor-pointer
              rounded-xl
              px-2
              py-2
              hover:bg-gray-100
              dark:hover:bg-slate-800
              transition-all
              duration-200
            "
          >
            <FaUserCircle
              size={44}
              className="text-blue-600"
            />

            <div className="text-left hidden md:block">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Admin
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Administrator
              </p>
            </div>
          </button>

          {showProfile && (
            <div
              className="
                absolute
                right-0
                top-16
                w-80
                bg-white
                dark:bg-slate-900
                border
                border-gray-200
                dark:border-slate-700
                rounded-2xl
                shadow-2xl
                overflow-hidden
                z-[9999]
              "
            >
              {/* Admin Header */}

              <div
                className="
                  px-5
                  py-5
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  text-white
                "
              >
                <div className="flex items-center gap-3">

                  <FaUserCircle size={50} />

                  <div>
                    <h3 className="text-lg font-bold">
                      Admin
                    </h3>

                    <p className="text-sm text-blue-100">
                      Administrator
                    </p>
                  </div>

                </div>
              </div>

              {/* Admin Information */}

              <div className="p-4">

                <div className="mb-4">
                  <p className="text-xs text-gray-400 uppercase">
                    Email
                  </p>

                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    admin@gmail.com
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-400 uppercase">
                    Role
                  </p>

                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    System Administrator
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowProfile(false);
                    window.location.href = "/admin-dashboard/profile";
                  }}
                  className="
                    w-full
                    py-3
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    font-semibold
                    transition
                  "
                >
                  View Profile
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