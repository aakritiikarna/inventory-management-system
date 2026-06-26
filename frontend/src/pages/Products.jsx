import { useEffect, useState } from "react";
import { productApi, supplierApi } from "../api/endpoints";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import SearchFilterBar from "../components/SearchFilterBar";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage, useToast } from "../hooks/useToast";

const EMPTY_FORM = {
  sku: "",
  name: "",
  category: "",
  description: "",
  cost_price: "",
  selling_price: "",
  supplier: "",
  barcode: "",
  is_active: true,
};
const PAGE_SIZE = 20;

export default function Products() {
  const { hasRole } = useAuth();
  const canEdit = hasRole("ADMIN", "WAREHOUSE_MANAGER");
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    productApi.listCategories().then(({ data }) => setCategories(data.results ?? data));
    supplierApi.list({ status: "ACTIVE", page_size: 100 }).then(({ data }) => setSuppliers(data.results ?? data));
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    productApi
      .list({ page, search, category: categoryFilter || undefined, page_size: PAGE_SIZE })
      .then(({ data }) => {
        setRows(data.results ?? data);
        setCount(data.count ?? (data.results ?? data).length);
      })
      .catch((err) => toast.error(extractErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  useEffect(fetchData, [page, search, categoryFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      sku: row.sku,
      name: row.name,
      category: row.category || "",
      description: row.description || "",
      cost_price: row.cost_price,
      selling_price: row.selling_price,
      supplier: row.supplier || "",
      barcode: row.barcode || "",
      is_active: row.is_active,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        category: form.category || null,
        supplier: form.supplier || null,
        barcode: form.barcode || null,
      };
      if (editingId) {
        await productApi.update(editingId, payload);
        toast.success("Product updated");
      } else {
        await productApi.create(payload);
        toast.success("Product created");
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete product "${row.name}"?`)) return;
    try {
      await productApi.remove(row.id);
      toast.success("Product deleted");
      fetchData();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const columns = [
    { key: "sku", header: "SKU", render: (row) => <span className="font-mono text-xs">{row.sku}</span> },
    { key: "name", header: "Name" },
    { key: "category_name", header: "Category" },
    { key: "supplier_name", header: "Supplier" },
    {
      key: "cost_price",
      header: "Cost",
      render: (row) => <span className="font-mono">${Number(row.cost_price).toFixed(2)}</span>,
    },
    {
      key: "selling_price",
      header: "Price",
      render: (row) => <span className="font-mono">${Number(row.selling_price).toFixed(2)}</span>,
    },
    ...(canEdit
      ? [
          {
            key: "actions",
            header: "",
            render: (row) => (
              <div className="flex gap-3 text-sm">
                <button className="text-teal-600 hover:text-teal-700 font-medium" onClick={() => openEdit(row)}>
                  Edit
                </button>
                <button className="text-rose-600 hover:text-rose-700 font-medium" onClick={() => handleDelete(row)}>
                  Delete
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <SearchFilterBar
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        filters={[
          {
            label: "All categories",
            value: categoryFilter,
            onChange: (v) => {
              setPage(1);
              setCategoryFilter(v);
            },
            options: categories.map((c) => ({ value: String(c.id), label: c.name })),
          },
        ]}
        actions={
          canEdit && (
            <button className="btn-primary" onClick={openCreate}>
              + Add Product
            </button>
          )
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        emptyMessage="No products found."
        pagination={{ count, page, pageSize: PAGE_SIZE, onPageChange: setPage }}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Product" : "Add Product"}
        widthClass="max-w-2xl"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">SKU</label>
              <input className="input font-mono" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </div>
            <div>
              <label className="label">Barcode</label>
              <input
                className="input font-mono"
                value={form.barcode}
                onChange={(e) => setForm({ ...form, barcode: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">Product Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Supplier</label>
              <select className="input" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}>
                <option value="">None</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Cost Price</label>
              <input
                type="number"
                step="0.01"
                className="input"
                value={form.cost_price}
                onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Selling Price</label>
              <input
                type="number"
                step="0.01"
                className="input"
                value={form.selling_price}
                onChange={(e) => setForm({ ...form, selling_price: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Active
          </label>
        </div>
      </Modal>
    </div>
  );
}
