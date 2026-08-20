import { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Customers = () => {
  const [search, setSearch] = useState("");

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "9841234567",
      address: "Kathmandu, Nepal",
      orders: 24,
      status: "Active",
    },
    {
      id: 2,
      name: "Aakriti Karki",
      email: "aakriti@gmail.com",
      phone: "9812345678",
      address: "Lalitpur, Nepal",
      orders: 18,
      status: "Active",
    },
    {
      id: 3,
      name: "Suman Thapa",
      email: "suman@gmail.com",
      phone: "9801234567",
      address: "Bhaktapur, Nepal",
      orders: 12,
      status: "Active",
    },
    {
      id: 4,
      name: "Priya Sharma",
      email: "priya@gmail.com",
      phone: "9861234567",
      address: "Pokhara, Nepal",
      orders: 8,
      status: "Inactive",
    },
    {
      id: 5,
      name: "Rohit Verma",
      email: "rohit@gmail.com",
      phone: "9823456789",
      address: "Biratnagar, Nepal",
      orders: 31,
      status: "Active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    orders: 0,
    status: "Active",
  });

  // =========================
  // SEARCH
  // =========================

  const filteredCustomers = customers.filter((customer) => {
    const value = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(value) ||
      customer.email.toLowerCase().includes(value) ||
      customer.phone.includes(value) ||
      customer.address.toLowerCase().includes(value)
    );
  });

  // =========================
  // ADD CUSTOMER
  // =========================

  const handleAddCustomer = () => {
    setEditingCustomer(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      orders: 0,
      status: "Active",
    });

    setShowModal(true);
  };

  // =========================
  // EDIT CUSTOMER
  // =========================

  const handleEdit = (customer) => {
    setEditingCustomer(customer);

    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      orders: customer.orders,
      status: customer.status,
    });

    setShowModal(true);
  };

  // =========================
  // DELETE CUSTOMER
  // =========================

  const handleDelete = (id) => {
    const customer = customers.find(
      (item) => item.id === id
    );

    if (!customer) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${customer.name}"?`
    );

    if (!confirmed) return;

    setCustomers((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // EDIT
    if (editingCustomer) {
      setCustomers((previous) =>
        previous.map((customer) =>
          customer.id === editingCustomer.id
            ? {
                ...customer,
                ...formData,
                orders: Number(formData.orders),
              }
            : customer
        )
      );
    }

    // ADD
    else {
      const newCustomer = {
        id: Date.now(),
        ...formData,
        orders: Number(formData.orders),
      };

      setCustomers((previous) => [
        ...previous,
        newCustomer,
      ]);
    }

    closeModal();
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    setShowModal(false);
    setEditingCustomer(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      orders: 0,
      status: "Active",
    });
  };

  return (
    <div className="space-y-6">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Customers
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage all your customers
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAddCustomer}
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
            transition
          "
        >
          <FaPlus />
          Add Customer
        </motion.button>

      </div>

      {/* =========================
          SEARCH
      ========================= */}

      <div
        className="
          bg-white
          dark:bg-slate-900
          rounded-2xl
          shadow-sm
          border
          border-gray-200
          dark:border-slate-800
          p-5
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
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              border
              border-gray-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              text-gray-800
              dark:text-white
              placeholder-gray-400
              rounded-xl
              py-3
              pl-11
              pr-4
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>

      </div>

      {/* =========================
          CUSTOMER TABLE
      ========================= */}

      <div
        className="
          bg-white
          dark:bg-slate-900
          rounded-2xl
          shadow-sm
          border
          border-gray-200
          dark:border-slate-800
          overflow-hidden
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 dark:bg-slate-800">

              <tr>

                <th className="text-left p-4 text-gray-800 dark:text-white">
                  Customer
                </th>

                <th className="text-left p-4 text-gray-800 dark:text-white">
                  Email
                </th>

                <th className="text-left p-4 text-gray-800 dark:text-white">
                  Phone
                </th>

                <th className="text-left p-4 text-gray-800 dark:text-white">
                  Address
                </th>

                <th className="text-left p-4 text-gray-800 dark:text-white">
                  Orders
                </th>

                <th className="text-left p-4 text-gray-800 dark:text-white">
                  Status
                </th>

                <th className="text-center p-4 text-gray-800 dark:text-white">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredCustomers.length > 0 ? (

                filteredCustomers.map((customer) => (

                  <motion.tr
                    key={customer.id}
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

                    {/* Customer */}

                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-11
                            h-11
                            rounded-xl
                            bg-purple-100
                            dark:bg-purple-900/40
                            text-purple-600
                            dark:text-purple-400
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <FaUser />
                        </div>

                        <div>

                          <p className="font-semibold text-gray-800 dark:text-white">
                            {customer.name}
                          </p>

                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Customer #{customer.id}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Email */}

                    <td className="p-4">

                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">

                        <FaEnvelope className="text-gray-400" />

                        {customer.email}

                      </div>

                    </td>

                    {/* Phone */}

                    <td className="p-4">

                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">

                        <FaPhone className="text-gray-400" />

                        {customer.phone}

                      </div>

                    </td>

                    {/* Address */}

                    <td className="p-4">

                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">

                        <FaMapMarkerAlt className="text-gray-400" />

                        {customer.address}

                      </div>

                    </td>

                    {/* Orders */}

                    <td className="p-4">

                      <span
                        className="
                          inline-flex
                          px-3
                          py-1
                          rounded-full
                          bg-blue-100
                          dark:bg-blue-900/40
                          text-blue-700
                          dark:text-blue-300
                          text-sm
                          font-semibold
                        "
                      >
                        {customer.orders}
                      </span>

                    </td>

                    {/* Status */}

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
                            customer.status === "Active"
                              ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                              : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"
                          }
                        `}
                      >
                        {customer.status}
                      </span>

                    </td>

                    {/* Actions */}

                    <td className="p-4">

                      <div className="flex justify-center gap-3">

                        <motion.button
                          whileHover={{
                            scale: 1.1,
                            y: -2,
                          }}
                          whileTap={{
                            scale: 0.9,
                          }}
                          onClick={() =>
                            handleEdit(customer)
                          }
                          title="Edit Customer"
                          className="
                            bg-blue-100
                            dark:bg-blue-900/40
                            hover:bg-blue-200
                            dark:hover:bg-blue-800
                            text-blue-600
                            dark:text-blue-400
                            p-3
                            rounded-lg
                            transition
                          "
                        >
                          <FaEdit />
                        </motion.button>

                        <motion.button
                          whileHover={{
                            scale: 1.1,
                            y: -2,
                          }}
                          whileTap={{
                            scale: 0.9,
                          }}
                          onClick={() =>
                            handleDelete(customer.id)
                          }
                          title="Delete Customer"
                          className="
                            bg-red-100
                            dark:bg-red-900/40
                            hover:bg-red-200
                            dark:hover:bg-red-800
                            text-red-600
                            dark:text-red-400
                            p-3
                            rounded-lg
                            transition
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
                    colSpan="7"
                    className="
                      p-10
                      text-center
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    No customers found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

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
              onClick={(e) => e.stopPropagation()}
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

              {/* Modal Header */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  p-6
                  border-b
                  border-gray-200
                  dark:border-slate-700
                "
              >

                <div>

                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {editingCustomer
                      ? "Edit Customer"
                      : "Add Customer"}
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {editingCustomer
                      ? "Update customer information"
                      : "Add a new customer"}
                  </p>

                </div>

                <button
                  onClick={closeModal}
                  className="
                    w-10
                    h-10
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    text-gray-500
                    dark:text-gray-400
                    hover:bg-gray-100
                    dark:hover:bg-slate-800
                    transition
                  "
                >
                  <FaTimes />
                </button>

              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5"
              >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Name */}

                  <div>

                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      Customer Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter customer name"
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

                  {/* Email */}

                  <div>

                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      Email *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="customer@gmail.com"
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

                  {/* Phone */}

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

                  {/* Orders */}

                  <div>

                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                      Total Orders
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="orders"
                      value={formData.orders}
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
                    />

                  </div>

                </div>

                {/* Address */}

                <div>

                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                    Address *
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter customer address"
                    rows="3"
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
                      resize-none
                    "
                  />

                </div>

                {/* Status */}

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

                {/* Buttons */}

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

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
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
                      font-medium
                    "
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
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
                    {editingCustomer
                      ? "Update Customer"
                      : "Add Customer"}
                  </motion.button>

                </div>

              </form>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};

export default Customers;