import { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaEye,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserShield,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Users = () => {
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@gmail.com",
      phone: "9841234567",
      role: "Admin",
      status: "Active",
      joined: "2026-06-15",
    },
    {
      id: 2,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "9812345678",
      role: "Customer",
      status: "Active",
      joined: "2026-07-01",
    },
    {
      id: 3,
      name: "Priya Singh",
      email: "priya@gmail.com",
      phone: "9801234567",
      role: "Customer",
      status: "Active",
      joined: "2026-07-05",
    },
    {
      id: 4,
      name: "Amit Kumar",
      email: "amit@gmail.com",
      phone: "9861234567",
      role: "Manager",
      status: "Inactive",
      joined: "2026-07-10",
    },
    {
      id: 5,
      name: "Sneha Thapa",
      email: "sneha@gmail.com",
      phone: "9823456789",
      role: "Customer",
      status: "Active",
      joined: "2026-07-18",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Customer",
    status: "Active",
  });

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.phone.includes(value) ||
      user.role.toLowerCase().includes(value) ||
      user.status.toLowerCase().includes(value)
    );
  });

  // ==========================================
  // ADD USER
  // ==========================================

  const handleAddUser = () => {
    setEditingUser(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Customer",
      status: "Active",
    });

    setShowModal(true);
  };

  // ==========================================
  // EDIT USER
  // ==========================================

  const handleEdit = (user) => {
    setEditingUser(user);

    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });

    setShowModal(true);
  };

  // ==========================================
  // VIEW USER
  // ==========================================

  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDelete = (id) => {
    const user = users.find((item) => item.id === id);

    if (!user) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name}"?`
    );

    if (!confirmed) return;

    setUsers((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE USER
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // EDIT
    if (editingUser) {
      setUsers((previous) =>
        previous.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...formData,
              }
            : user
        )
      );
    }

    // ADD
    else {
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        joined: new Date()
          .toISOString()
          .split("T")[0],
      };

      setUsers((previous) => [
        ...previous,
        newUser,
      ]);
    }

    closeModal();
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Customer",
      status: "Active",
    });
  };

  return (
    <div className="space-y-6">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Users
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage all system users and their access
          </p>
        </div>

        <motion.button
          type="button"
          onClick={handleAddUser}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="
            flex
            items-center
            justify-center
            gap-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
            shadow-md
          "
        >
          <FaPlus />
          Add User
        </motion.button>

      </div>

      {/* =====================================
          SEARCH
      ===================================== */}

      <div
        className="
          bg-white
          dark:bg-slate-900
          border
          border-gray-200
          dark:border-slate-800
          rounded-2xl
          p-5
          shadow-sm
        "
      >

        <div className="relative w-full md:w-96">

          <FaSearch
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              pl-11
              pr-4
              py-3
              rounded-xl
              border
              border-gray-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              text-gray-800
              dark:text-white
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>

      </div>

      {/* =====================================
          USERS TABLE
      ===================================== */}

      <div
        className="
          bg-white
          dark:bg-slate-900
          border
          border-gray-200
          dark:border-slate-800
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 dark:bg-slate-800">

              <tr>

                <th className="text-left p-4 text-gray-800 dark:text-white">
                  User
                </th>

                <th className="text-left p-4 text-gray-800 dark:text-white">
                  Phone
                </th>

                <th className="text-left p-4 text-gray-800 dark:text-white">
                  Role
                </th>

                <th className="text-left p-4 text-gray-800 dark:text-white">
                  Status
                </th>

                <th className="text-left p-4 text-gray-800 dark:text-white">
                  Joined
                </th>

                <th className="text-center p-4 text-gray-800 dark:text-white">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.length > 0 ? (

                filteredUsers.map((user) => (

                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="
                      border-t
                      border-gray-200
                      dark:border-slate-700
                      hover:bg-gray-50
                      dark:hover:bg-slate-800
                      transition
                    "
                  >

                    {/* USER */}

                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-11
                            h-11
                            rounded-full
                            bg-blue-100
                            dark:bg-blue-900/40
                            text-blue-600
                            dark:text-blue-400
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <FaUser />
                        </div>

                        <div>

                          <p className="font-semibold text-gray-800 dark:text-white">
                            {user.name}
                          </p>

                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">

                            <FaEnvelope className="text-xs" />

                            {user.email}

                          </div>

                        </div>

                      </div>

                    </td>

                    {/* PHONE */}

                    <td className="p-4 text-gray-700 dark:text-gray-300">

                      <div className="flex items-center gap-2">

                        <FaPhone className="text-gray-400" />

                        {user.phone}

                      </div>

                    </td>

                    {/* ROLE */}

                    <td className="p-4">

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-2
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-semibold
                          ${
                            user.role === "Admin"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400"
                              : user.role === "Manager"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                              : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300"
                          }
                        `}
                      >

                        <FaUserShield />

                        {user.role}

                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="p-4">

                      <span
                        className={`
                          inline-flex
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-semibold
                          ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                          }
                        `}
                      >
                        {user.status}
                      </span>

                    </td>

                    {/* JOINED */}

                    <td className="p-4 text-gray-700 dark:text-gray-300">
                      {user.joined}
                    </td>

                    {/* ACTIONS */}

                    <td className="p-4">

                      <div className="flex justify-center gap-2">

                        {/* VIEW */}

                        <motion.button
                          type="button"
                          onClick={() =>
                            handleView(user)
                          }
                          whileHover={{
                            scale: 1.1,
                          }}
                          whileTap={{
                            scale: 0.9,
                          }}
                          title="View User"
                          className="
                            p-3
                            rounded-lg
                            bg-gray-100
                            dark:bg-slate-800
                            text-gray-600
                            dark:text-gray-300
                            hover:bg-gray-200
                            dark:hover:bg-slate-700
                          "
                        >
                          <FaEye />
                        </motion.button>

                        {/* EDIT */}

                        <motion.button
                          type="button"
                          onClick={() =>
                            handleEdit(user)
                          }
                          whileHover={{
                            scale: 1.1,
                          }}
                          whileTap={{
                            scale: 0.9,
                          }}
                          title="Edit User"
                          className="
                            p-3
                            rounded-lg
                            bg-blue-100
                            dark:bg-blue-900/40
                            text-blue-600
                            dark:text-blue-400
                            hover:bg-blue-200
                            dark:hover:bg-blue-800
                          "
                        >
                          <FaEdit />
                        </motion.button>

                        {/* DELETE */}

                        <motion.button
                          type="button"
                          onClick={() =>
                            handleDelete(user.id)
                          }
                          whileHover={{
                            scale: 1.1,
                          }}
                          whileTap={{
                            scale: 0.9,
                          }}
                          title="Delete User"
                          className="
                            p-3
                            rounded-lg
                            bg-red-100
                            dark:bg-red-900/40
                            text-red-600
                            dark:text-red-400
                            hover:bg-red-200
                            dark:hover:bg-red-800
                          "
                        >
                          <FaTrash />
                        </motion.button>

                      </div>

                    </td>

                  </motion.tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="
                      p-10
                      text-center
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    No users found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================
          ADD / EDIT USER MODAL
      ===================================== */}

      <AnimatePresence>

        {showModal && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-black/50
              backdrop-blur-sm
              p-4
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="
                w-full
                max-w-2xl
                bg-white
                dark:bg-slate-900
                rounded-2xl
                shadow-2xl
                overflow-hidden
              "
            >

              {/* MODAL HEADER */}

              <div
                className="
                  flex
                  justify-between
                  items-center
                  p-6
                  border-b
                  border-gray-200
                  dark:border-slate-700
                "
              >

                <div>

                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {editingUser
                      ? "Edit User"
                      : "Add User"}
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {editingUser
                      ? "Update user information"
                      : "Create a new system user"}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    w-10
                    h-10
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    text-gray-500
                    hover:bg-gray-100
                    dark:hover:bg-slate-800
                  "
                >
                  <FaTimes />
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5"
              >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* NAME */}

                  <div>

                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-gray-300
                        dark:border-slate-700
                        bg-white
                        dark:bg-slate-800
                        text-gray-800
                        dark:text-white
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                      "
                    />

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      Email *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="user@gmail.com"
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-gray-300
                        dark:border-slate-700
                        bg-white
                        dark:bg-slate-800
                        text-gray-800
                        dark:text-white
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                      "
                    />

                  </div>

                  {/* PHONE */}

                  <div>

                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      Phone *
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="98XXXXXXXX"
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-gray-300
                        dark:border-slate-700
                        bg-white
                        dark:bg-slate-800
                        text-gray-800
                        dark:text-white
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                      "
                    />

                  </div>

                  {/* ROLE */}

                  <div>

                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      Role
                    </label>

                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-gray-300
                        dark:border-slate-700
                        bg-white
                        dark:bg-slate-800
                        text-gray-800
                        dark:text-white
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                      "
                    >
                      <option>Customer</option>
                      <option>Manager</option>
                      <option>Admin</option>
                    </select>

                  </div>

                </div>

                {/* STATUS */}

                <div>

                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-gray-300
                      dark:border-slate-700
                      bg-white
                      dark:bg-slate-800
                      text-gray-800
                      dark:text-white
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>

                </div>

                {/* BUTTONS */}

                <div
                  className="
                    flex
                    justify-end
                    gap-3
                    pt-5
                    border-t
                    border-gray-200
                    dark:border-slate-700
                  "
                >

                  <button
                    type="button"
                    onClick={closeModal}
                    className="
                      px-5
                      py-3
                      rounded-xl
                      border
                      border-gray-300
                      dark:border-slate-700
                      text-gray-700
                      dark:text-gray-300
                      hover:bg-gray-100
                      dark:hover:bg-slate-800
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="
                      px-6
                      py-3
                      rounded-xl
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      font-semibold
                      shadow-md
                    "
                  >
                    {editingUser
                      ? "Update User"
                      : "Add User"}
                  </button>

                </div>

              </form>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

      {/* =====================================
          VIEW USER MODAL
      ===================================== */}

      <AnimatePresence>

        {showViewModal && selectedUser && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setShowViewModal(false)
            }
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-black/50
              backdrop-blur-sm
              p-4
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="
                w-full
                max-w-md
                bg-white
                dark:bg-slate-900
                rounded-2xl
                shadow-2xl
                overflow-hidden
              "
            >

              {/* USER HEADER */}

              <div
                className="
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  p-6
                  text-white
                "
              >

                <div className="flex items-center gap-4">

                  <div
                    className="
                      w-16
                      h-16
                      rounded-full
                      bg-white/20
                      flex
                      items-center
                      justify-center
                      text-2xl
                    "
                  >
                    <FaUser />
                  </div>

                  <div>

                    <h2 className="text-xl font-bold">
                      {selectedUser.name}
                    </h2>

                    <p className="text-sm opacity-90">
                      {selectedUser.role}
                    </p>

                  </div>

                </div>

              </div>

              {/* DETAILS */}

              <div className="p-6 space-y-4">

                <div className="flex items-center gap-3">

                  <FaEnvelope className="text-blue-600" />

                  <div>

                    <p className="text-xs text-gray-500">
                      Email
                    </p>

                    <p className="font-medium text-gray-800 dark:text-white">
                      {selectedUser.email}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <FaPhone className="text-blue-600" />

                  <div>

                    <p className="text-xs text-gray-500">
                      Phone
                    </p>

                    <p className="font-medium text-gray-800 dark:text-white">
                      {selectedUser.phone}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <FaUserShield className="text-blue-600" />

                  <div>

                    <p className="text-xs text-gray-500">
                      Role
                    </p>

                    <p className="font-medium text-gray-800 dark:text-white">
                      {selectedUser.role}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div
                    className={`
                      w-3
                      h-3
                      rounded-full
                      ${
                        selectedUser.status ===
                        "Active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }
                    `}
                  />

                  <div>

                    <p className="text-xs text-gray-500">
                      Status
                    </p>

                    <p className="font-medium text-gray-800 dark:text-white">
                      {selectedUser.status}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div className="w-3 h-3 rounded-full bg-blue-500" />

                  <div>

                    <p className="text-xs text-gray-500">
                      Joined
                    </p>

                    <p className="font-medium text-gray-800 dark:text-white">
                      {selectedUser.joined}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowViewModal(false)
                  }
                  className="
                    w-full
                    mt-3
                    py-3
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    font-semibold
                  "
                >
                  Close
                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};

export default Users;