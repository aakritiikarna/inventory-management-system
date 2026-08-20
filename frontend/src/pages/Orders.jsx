import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaTrash,
  FaFilePdf,
  FaTimes,
  FaShoppingCart,
  FaUser,
  FaBox,
  FaDownload,
} from "react-icons/fa";
import jsPDF from "jspdf";

const Orders = () => {
  const [search, setSearch] = useState("");

  const [orders, setOrders] = useState([
    {
      id: "ORD-1001",
      customer: "Rahul Sharma",
      product: "Gaming Laptop",
      quantity: 1,
      price: 1250,
      status: "Completed",
      date: "06 Aug 2026",
    },
    {
      id: "ORD-1002",
      customer: "Amit Kumar",
      product: "Wireless Mouse",
      quantity: 2,
      price: 45,
      status: "Pending",
      date: "05 Aug 2026",
    },
    {
      id: "ORD-1003",
      customer: "Priya Singh",
      product: "Mechanical Keyboard",
      quantity: 3,
      price: 120,
      status: "Shipped",
      date: "05 Aug 2026",
    },
    {
      id: "ORD-1004",
      customer: "Rohit Verma",
      product: "Monitor 27 Inch",
      quantity: 1,
      price: 320,
      status: "Cancelled",
      date: "04 Aug 2026",
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [formData, setFormData] = useState({
    customer: "",
    product: "",
    quantity: 1,
    price: "",
    status: "Pending",
  });

  const filteredOrders = useMemo(() => {
    const value = search.toLowerCase();

    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(value) ||
        order.customer.toLowerCase().includes(value) ||
        order.product.toLowerCase().includes(value) ||
        order.status.toLowerCase().includes(value)
    );
  }, [orders, search]);

  // ---------------------------------------------
  // FORM HANDLING
  // ---------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ---------------------------------------------
  // CREATE ORDER
  // ---------------------------------------------

  const createOrder = (e) => {
    e.preventDefault();

    if (
      !formData.customer.trim() ||
      !formData.product.trim() ||
      !formData.price ||
      !formData.quantity
    ) {
      alert("Please fill all order details.");
      return;
    }

    const nextNumber =
      1001 +
      orders.length +
      Math.floor(Math.random() * 20);

    const newOrder = {
      id: `ORD-${nextNumber}`,
      customer: formData.customer,
      product: formData.product,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      status: formData.status,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    setOrders((previous) => [newOrder, ...previous]);

    setSelectedOrder(newOrder);

    setFormData({
      customer: "",
      product: "",
      quantity: 1,
      price: "",
      status: "Pending",
    });

    setShowCreateModal(false);

    // Automatically generate PDF after creating order
    setTimeout(() => {
      generateBill(newOrder);
    }, 300);
  };

  // ---------------------------------------------
  // DELETE ORDER
  // ---------------------------------------------

  const deleteOrder = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    setOrders((previous) =>
      previous.filter((order) => order.id !== id)
    );

    if (selectedOrder?.id === id) {
      setSelectedOrder(null);
    }
  };

  // ---------------------------------------------
  // GENERATE PDF BILL
  // ---------------------------------------------

  const generateBill = (order) => {
    const doc = new jsPDF();

    const total = order.quantity * order.price;

    // -----------------------------------------
    // HEADER
    // -----------------------------------------

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");

    doc.text("INVENTORY PRO", 20, 18);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text("Inventory Management System", 20, 27);

    // -----------------------------------------
    // BILL TITLE
    // -----------------------------------------

    doc.setTextColor(20, 20, 20);

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");

    doc.text("ORDER BILL", 20, 52);

    // -----------------------------------------
    // ORDER INFORMATION
    // -----------------------------------------

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(`Order ID: ${order.id}`, 20, 64);
    doc.text(`Date: ${order.date}`, 20, 72);
    doc.text(`Status: ${order.status}`, 20, 80);

    // -----------------------------------------
    // CUSTOMER
    // -----------------------------------------

    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER INFORMATION", 20, 95);

    doc.setFont("helvetica", "normal");

    doc.text(`Customer Name: ${order.customer}`, 20, 105);

    // -----------------------------------------
    // TABLE HEADER
    // -----------------------------------------

    doc.setFillColor(241, 245, 249);
    doc.rect(20, 118, 170, 12, "F");

    doc.setFont("helvetica", "bold");

    doc.text("Product", 25, 126);
    doc.text("Qty", 105, 126);
    doc.text("Price", 130, 126);
    doc.text("Total", 165, 126);

    // -----------------------------------------
    // PRODUCT
    // -----------------------------------------

    doc.setFont("helvetica", "normal");

    doc.text(order.product, 25, 140);
    doc.text(String(order.quantity), 108, 140);
    doc.text(`$${order.price.toFixed(2)}`, 128, 140);
    doc.text(`$${total.toFixed(2)}`, 163, 140);

    // -----------------------------------------
    // LINE
    // -----------------------------------------

    doc.setDrawColor(200, 200, 200);

    doc.line(20, 148, 190, 148);

    // -----------------------------------------
    // TOTAL
    // -----------------------------------------

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text("Grand Total:", 120, 165);

    doc.text(`$${total.toFixed(2)}`, 165, 165);

    // -----------------------------------------
    // FOOTER
    // -----------------------------------------

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.setTextColor(100, 100, 100);

    doc.text(
      "Thank you for your order!",
      20,
      190
    );

    doc.text(
      "Inventory Pro - Inventory Management System",
      20,
      198
    );

    // -----------------------------------------
    // SAVE PDF
    // -----------------------------------------

    doc.save(`${order.id}-bill.pdf`);
  };

  // ---------------------------------------------
  // STATUS COLOR
  // ---------------------------------------------

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

      case "Shipped":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

      case "Cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6 pb-10">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Orders
          </h1>

          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Manage customer orders and generate order bills
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition"
        >
          <FaPlus />
          Create Order
        </motion.button>
      </motion.div>

      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800"
      >
        <div className="relative max-w-md">

          <FaSearch className="absolute left-4 top-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

        </div>
      </motion.div>

      {/* ================================================= */}
      {/* ORDERS TABLE */}
      {/* ================================================= */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100 dark:bg-slate-800">

              <tr>

                <th className="text-left p-5 text-slate-800 dark:text-white font-semibold">
                  Order ID
                </th>

                <th className="text-left p-5 text-slate-800 dark:text-white font-semibold">
                  Customer
                </th>

                <th className="text-left p-5 text-slate-800 dark:text-white font-semibold">
                  Product
                </th>

                <th className="text-left p-5 text-slate-800 dark:text-white font-semibold">
                  Amount
                </th>

                <th className="text-left p-5 text-slate-800 dark:text-white font-semibold">
                  Status
                </th>

                <th className="text-left p-5 text-slate-800 dark:text-white font-semibold">
                  Date
                </th>

                <th className="text-center p-5 text-slate-800 dark:text-white font-semibold">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredOrders.map((order, index) => {

                const total =
                  order.quantity * order.price;

                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                  >

                    <td className="p-5 font-semibold text-slate-900 dark:text-white">
                      {order.id}
                    </td>

                    <td className="p-5 text-slate-700 dark:text-slate-300">
                      {order.customer}
                    </td>

                    <td className="p-5 text-slate-700 dark:text-slate-300">
                      {order.product}
                    </td>

                    <td className="p-5 font-semibold text-blue-600 dark:text-blue-400">
                      ${total.toFixed(2)}
                    </td>

                    <td className="p-5">

                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </td>

                    <td className="p-5 text-slate-600 dark:text-slate-400">
                      {order.date}
                    </td>

                    <td className="p-5">

                      <div className="flex justify-center gap-2">

                        {/* VIEW */}

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          title="View Order"
                          className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                        >
                          <FaEye />
                        </motion.button>

                        {/* PDF */}

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            generateBill(order)
                          }
                          title="Generate Bill"
                          className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition"
                        >
                          <FaFilePdf />
                        </motion.button>

                        {/* DELETE */}

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            deleteOrder(order.id)
                          }
                          title="Delete Order"
                          className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition"
                        >
                          <FaTrash />
                        </motion.button>

                      </div>

                    </td>

                  </motion.tr>
                );
              })}

            </tbody>

          </table>

          {filteredOrders.length === 0 && (
            <div className="py-16 text-center">

              <FaShoppingCart className="mx-auto text-4xl text-slate-300 dark:text-slate-600 mb-4" />

              <p className="text-slate-500 dark:text-slate-400">
                No orders found.
              </p>

            </div>
          )}

        </div>

      </motion.div>

      {/* ================================================= */}
      {/* CREATE ORDER MODAL */}
      {/* ================================================= */}

      <AnimatePresence>

        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowCreateModal(false)}
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
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6"
            >

              {/* Modal Header */}

              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Create New Order
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Add customer and product details
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <FaTimes />
                </button>

              </div>

              <form
                onSubmit={createOrder}
                className="space-y-4"
              >

                {/* Customer */}

                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Customer Name
                  </label>

                  <div className="relative">

                    <FaUser className="absolute left-4 top-4 text-slate-400" />

                    <input
                      name="customer"
                      value={formData.customer}
                      onChange={handleChange}
                      placeholder="Enter customer name"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>
                </div>

                {/* Product */}

                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Product
                  </label>

                  <div className="relative">

                    <FaBox className="absolute left-4 top-4 text-slate-400" />

                    <input
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>
                </div>

                {/* Quantity + Price */}

                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Quantity
                    </label>

                    <input
                      type="number"
                      min="1"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>

                  <div>

                    <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>

                </div>

                {/* Status */}

                <div>

                  <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>Shipped</option>
                    <option>Cancelled</option>
                  </select>

                </div>

                {/* Buttons */}

                <div className="flex gap-3 pt-4">

                  <button
                    type="button"
                    onClick={() =>
                      setShowCreateModal(false)
                    }
                    className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <FaPlus />
                    Create & Generate Bill
                  </motion.button>

                </div>

              </form>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* ================================================= */}
      {/* VIEW ORDER MODAL */}
      {/* ================================================= */}

      <AnimatePresence>

        {selectedOrder && !showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedOrder(null)}
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
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6"
            >

              <div className="flex justify-between items-center mb-6">

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Order Details
                  </h2>

                  <p className="text-blue-600 dark:text-blue-400 font-semibold">
                    {selectedOrder.id}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSelectedOrder(null)
                  }
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <FaTimes />
                </button>

              </div>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Customer
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedOrder.customer}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Product
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedOrder.product}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Quantity
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedOrder.quantity}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Price
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    ${selectedOrder.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-4">

                  <span className="font-bold text-slate-900 dark:text-white">
                    Total
                  </span>

                  <span className="font-bold text-xl text-blue-600">
                    $
                    {(
                      selectedOrder.quantity *
                      selectedOrder.price
                    ).toFixed(2)}
                  </span>

                </div>

              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  generateBill(selectedOrder)
                }
                className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <FaDownload />
                Download Bill PDF
              </motion.button>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default Orders;