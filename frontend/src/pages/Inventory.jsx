import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaWarehouse, FaSpinner, FaBoxOpen } from "react-icons/fa";

import API from "../api/api";
import ProductImage from "../components/common/ProductImage";
import SearchBar from "../components/common/SearchBar";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import StatusBadge from "../components/common/StatusBadge";
import Modal from "../components/common/Modal";
import toast from "react-hot-toast";
import WarehouseInventory from "../components/inventory/WarehouseInventory";
import ShipmentsTable from "../components/inventory/ShipmentsTable";

const stockStatus = (stock, minStock) => {
  if (stock <= 0) return "Out of Stock";
  if (stock <= minStock) return "Low Stock";
  return "In Stock";
};

const Inventory = () => {
  const [tab, setTab] = useState("stock");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [adjustTarget, setAdjustTarget] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get("/products");
      setProducts(data.products || []);
    } catch (err) {
      console.error("FETCH INVENTORY ERROR:", err);
      setError(err.response?.data?.message || "Unable to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // The fetch manages loading state while its request is in flight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return products.filter((p) => {
      const status = stockStatus(p.stock, p.minStock ?? 5);
      const matchesSearch =
        p.productName?.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "All" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const summary = useMemo(() => {
    const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
    const lowStock = products.filter((p) => stockStatus(p.stock, p.minStock ?? 5) === "Low Stock").length;
    const outOfStock = products.filter((p) => stockStatus(p.stock, p.minStock ?? 5) === "Out of Stock").length;
    return { totalStock, lowStock, outOfStock, totalItems: products.length };
  }, [products]);

  const openAdjust = (product) => {
    setAdjustTarget(product);
    setNewStock(String(product.stock));
  };

  const handleAdjustSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await API.put(`/products/${adjustTarget._id}`, { stock: Number(newStock) });
      toast.success("Stock updated");
      setAdjustTarget(null);
      fetchProducts();
    } catch (err) {
      console.error("ADJUST STOCK ERROR:", err);
      toast.error(err.response?.data?.message || "Unable to update stock");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Inventory</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Stock levels across your catalog. Product details are managed on the Products page.
        </p>
      </div>

      <div role="tablist" aria-label="Inventory views" className="flex gap-1 border-b border-gray-200 dark:border-slate-800">
        {[
          ["stock", "All Stock"],
          ["warehouses", "By Warehouse"],
          ["shipments", "Shipments"],
        ].map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-semibold -mb-px border-b-2 transition cursor-pointer ${
              tab === key
                ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "warehouses" && <WarehouseInventory />}
      {tab === "shipments" && <ShipmentsTable />}

      {tab === "stock" && (
      <>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tracked Items", value: summary.totalItems, icon: <FaBoxOpen />, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" },
          { label: "Units in Stock", value: summary.totalStock, icon: <FaWarehouse />, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400" },
          { label: "Low Stock", value: summary.lowStock, icon: <FaWarehouse />, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400" },
          { label: "Out of Stock", value: summary.outOfStock, icon: <FaWarehouse />, color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400" },
        ].map((c) => (
          <div key={c.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${c.color}`}>{c.icon}</div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{c.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by product, SKU, category..." />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {loading ? (
        <Loader text="Loading inventory..." />
      ) : error ? (
        <EmptyState title="Couldn't load inventory" description={error} buttonText="Retry" onClick={fetchProducts} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No inventory items found" description="Add products from the Products page to see them here." />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="bg-gray-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Min</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Updated</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const status = stockStatus(p.stock, p.minStock ?? 5);
                  return (
                    <tr key={p._id} className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ProductImage product={p} size={44} />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{p.productName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.sku || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.branch?.name || "Unassigned"}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">{p.stock}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{p.minStock ?? 5}</td>
                      <td className="px-6 py-4"><StatusBadge status={status} /></td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openAdjust(p)}
                          className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition cursor-pointer inline-flex items-center justify-center"
                          title="Adjust stock"
                        >
                          <FaEdit size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={!!adjustTarget} onClose={() => setAdjustTarget(null)} title="Adjust Stock" width="max-w-sm">
        {adjustTarget && (
          <form onSubmit={handleAdjustSave} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Update stock for <span className="font-semibold text-gray-800 dark:text-white">{adjustTarget.productName}</span>
            </p>
            <input
              type="number"
              min="0"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {saving && <FaSpinner className="animate-spin" />} Save
            </button>
          </form>
        )}
      </Modal>
      </>
      )}
    </div>
  );
};

export default Inventory;
