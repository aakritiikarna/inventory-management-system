import { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaEye,
  FaTrash,
  FaEdit,
  FaTimes,
  FaShoppingCart,
  FaDownload,
  FaSpinner,
} from "react-icons/fa";

import API from "../api/api";
import ProductImage from "../components/common/ProductImage";
import { getBranches } from "../services/branchService";
import Modal from "../components/common/Modal";
import SearchBar from "../components/common/SearchBar";
import StatusBadge from "../components/common/StatusBadge";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import ConfirmModal from "../components/common/ConfirmModal";
import toast from "react-hot-toast";
import generateInvoice from "../utils/generateInvoive";
import { useCurrency } from "../context/CurrencyContext";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed"];

const emptyForm = {
  customer: "",
  shippingAddress: "",
  paymentStatus: "Pending",
  orderStatus: "Pending",
  branch: "",
  items: [{ product: "", quantity: 1, price: 0 }],
};

const Orders = () => {
  const { formatMoney } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const [viewOrder, setViewOrder] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes, branchesRes] = await Promise.all([
        API.get("/orders"),
        API.get("/products"),
        getBranches(),
      ]);
      setOrders(ordersRes.data.orders || []);
      setProducts(productsRes.data.products || []);
      setBranches(branchesRes.data.branches || []);
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // The fetch manages loading state while its request is in flight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, []);

  const filteredOrders = useMemo(() => {
    const term = search.toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        order.customer?.toLowerCase().includes(term) ||
        order._id?.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "All" || order.orderStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // ---------- form handling ----------

  const openAddModal = () => {
    setEditingOrder(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setFormData({
      customer: order.customer,
      shippingAddress: order.shippingAddress || "",
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      branch: order.branch?._id || order.branch || "",
      items: order.products.map((p) => ({
        product: p.product?._id || p.product,
        quantity: p.quantity,
        price: p.price,
      })),
    });
    setShowModal(true);
  };

  const updateItem = (index, field, value) => {
    setFormData((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };

      if (field === "product") {
        const product = products.find((p) => p._id === value);
        if (product) items[index].price = product.price;
      }

      return { ...prev, items };
    });
  };

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { product: "", quantity: 1, price: 0 }],
    }));
  };

  const removeItemRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const totalAmount = formData.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.items.some((item) => !item.product)) {
      toast.error("Please select a product for every line item.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        customer: formData.customer,
        shippingAddress: formData.shippingAddress,
        paymentStatus: formData.paymentStatus,
        orderStatus: formData.orderStatus,
        branch: formData.branch || null,
        products: formData.items.map((item) => ({
          product: item.product,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
        totalAmount,
      };

      if (editingOrder) {
        await API.put(`/orders/${editingOrder._id}`, payload);
      } else {
        await API.post("/orders", payload);
      }

      toast.success(editingOrder ? "Order updated" : "Order created");
      setShowModal(false);
      fetchAll();
    } catch (error) {
      console.error("SAVE ORDER ERROR:", error);
      toast.error(error.response?.data?.message || "Unable to save order");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await API.delete(`/orders/${confirmDelete._id}`);
      toast.success("Order deleted");
      setConfirmDelete(null);
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete order");
    }
  };

  const handleQuickStatus = async (order, orderStatus) => {
    try {
      await API.put(`/orders/${order._id}`, { orderStatus });
      toast.success(`Order marked as ${orderStatus}`);
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    }
  };

  const handlePrintInvoice = (order) => {
    const items = order.products.map((p) => ({
      name: p.product?.productName || "Product",
      sku: p.product?.sku || "",
      quantity: p.quantity,
      price: p.price,
    }));
    const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);

    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Invoice #${order._id.slice(-8).toUpperCase()}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #0f172a; padding: 40px; }
            .header { display: flex; justify-content: space-between; border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; }
            .header h1 { color: #2563eb; margin: 0; }
            .meta { color: #64748b; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #2563eb; color: white; text-align: left; padding: 10px; font-size: 13px; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            .totals { margin-top: 16px; text-align: right; }
            .totals p { margin: 4px 0; font-size: 14px; }
            .grand { font-size: 18px; font-weight: bold; color: #2563eb; }
            .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; background: #eff6ff; color: #2563eb; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Inventory Pro</h1>
              <p class="meta">Inventory Management System</p>
            </div>
            <div style="text-align:right">
              <h2>INVOICE</h2>
              <p class="meta">#${order._id.slice(-8).toUpperCase()}<br/>${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <p><strong>Bill To:</strong> ${order.customer}${order.shippingAddress ? `<br/>${order.shippingAddress}` : ""}</p>
          ${order.branch ? `<p><strong>Branch:</strong> ${order.branch.name} (${order.branch.city})</p>` : ""}
          <p><span class="badge">${order.orderStatus}</span> &nbsp; <span class="badge">${order.paymentStatus}</span></p>

          <table>
            <thead><tr><th>Product</th><th>SKU</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>
              ${items.map((i) => `<tr><td>${i.name}</td><td>${i.sku}</td><td>${i.quantity}</td><td>${formatMoney(i.price)}</td><td>${formatMoney(i.quantity * i.price)}</td></tr>`).join("")}
            </tbody>
          </table>

          <div class="totals">
            <p>Subtotal: ${formatMoney(subtotal)}</p>
            <p class="grand">Total: ${formatMoney(Number(order.totalAmount))}</p>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const handleDownloadInvoice = (order) => {
    generateInvoice({
      id: order._id.slice(-8).toUpperCase(),
      orderId: order._id,
      date: new Date(order.createdAt).toLocaleDateString(),
      paymentStatus: order.paymentStatus,
      status: order.orderStatus,
      customerName: order.customer,
      customerAddress: order.shippingAddress,
      branch: order.branch ? `${order.branch.name} (${order.branch.city})` : null,
      items: order.products.map((p) => ({
        name: p.product?.productName || "Product",
        sku: p.product?.sku,
        quantity: p.quantity,
        price: p.price,
      })),
    }, formatMoney);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {orders.length} order{orders.length === 1 ? "" : "s"} on record
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition cursor-pointer"
        >
          <FaPlus size={14} /> New Order
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer or order ID..."
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader text="Loading orders..." />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Try adjusting your search or create a new order."
          buttonText="New Order"
          onClick={openAddModal}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead className="bg-gray-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Order</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Items</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Payment</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Branch</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-gray-100">{order.customer}</td>
                    <td className="px-5 py-4">
                      <div className="flex -space-x-2">
                        {order.products.slice(0, 3).map((p, i) => (
                          <ProductImage
                            key={i}
                            product={p.product}
                            size={32}
                            rounded="rounded-full"
                            className="border-2 border-white dark:border-slate-900"
                          />
                        ))}
                        {order.products.length > 3 && (
                          <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 text-xs flex items-center justify-center border-2 border-white dark:border-slate-900 text-gray-500">
                            +{order.products.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-800 dark:text-gray-200">
                      {formatMoney(Number(order.totalAmount))}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={order.paymentStatus} /></td>
                    <td className="px-5 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleQuickStatus(order, e.target.value)}
                        className="text-xs font-semibold rounded-full px-2 py-1 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {order.branch?.name || <span className="text-gray-300 dark:text-gray-600">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setViewOrder(order)} title="View" className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition cursor-pointer">
                          <FaEye size={13} />
                        </button>
                        <button onClick={() => openEditModal(order)} title="Edit" className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-600 hover:text-white transition cursor-pointer">
                          <FaEdit size={13} />
                        </button>
                        <button onClick={() => setConfirmDelete(order)} title="Delete" className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition cursor-pointer">
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingOrder ? "Edit Order" : "New Order"}
        width="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              placeholder="Customer name"
              required
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={formData.shippingAddress}
              onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
              placeholder="Shipping address"
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.orderStatus}
              onChange={(e) => setFormData({ ...formData, orderStatus: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <select
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No branch assigned</option>
            {branches.map((b) => (
              <option key={b._id} value={b._id}>{b.name} — {b.city}</option>
            ))}
          </select>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Products</h3>
              <button type="button" onClick={addItemRow} className="text-sm text-blue-600 hover:underline cursor-pointer">
                + Add product
              </button>
            </div>

            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={item.product}
                    onChange={(e) => updateItem(index, "product", e.target.value)}
                    required
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.productName} ({formatMoney(p.price)}) — {p.stock} in stock
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                    className="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="w-20 text-sm text-gray-500 dark:text-gray-400 text-right">
                    {formatMoney(Number(item.quantity || 0) * Number(item.price || 0))}
                  </span>
                  {formData.items.length > 1 && (
                    <button type="button" onClick={() => removeItemRow(index)} className="text-red-500 hover:text-red-700 cursor-pointer">
                      <FaTimes size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Total</span>
            <span className="text-xl font-bold text-blue-600">{formatMoney(totalAmount)}</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
          >
            {saving && <FaSpinner className="animate-spin" />}
            {saving ? "Saving..." : editingOrder ? "Save Changes" : "Create Order"}
          </button>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={!!viewOrder}
        onClose={() => setViewOrder(null)}
        title={`Order #${viewOrder?._id.slice(-6).toUpperCase() || ""}`}
      >
        {viewOrder && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FaShoppingCart />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{viewOrder.customer}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{viewOrder.shippingAddress || "No address on file"}</p>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-2">
                <StatusBadge status={viewOrder.orderStatus} />
                <StatusBadge status={viewOrder.paymentStatus} />
              </div>
              {viewOrder.branch && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                  {viewOrder.branch.name} · {viewOrder.branch.city}
                </span>
              )}
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-800 border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden">
              {viewOrder.products.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductImage product={p.product} size={40} />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {p.product?.productName || "Product removed"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Qty {p.quantity} × {formatMoney(p.price)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {formatMoney(p.quantity * p.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t border-gray-200 dark:border-slate-800 pt-4">
              <span className="font-bold text-gray-900 dark:text-white">Total</span>
              <span className="font-bold text-xl text-blue-600">{formatMoney(Number(viewOrder.totalAmount))}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handlePrintInvoice(viewOrder)}
                className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <FaEye /> Print Invoice
              </button>
              <button
                onClick={() => handleDownloadInvoice(viewOrder)}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <FaDownload /> Download PDF
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Delete Order"
        message="Are you sure you want to delete this order? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Orders;
