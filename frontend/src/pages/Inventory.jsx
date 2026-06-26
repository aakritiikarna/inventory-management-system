import { useEffect, useState } from "react";
import { productApi, stockApi, warehouseApi } from "../api/endpoints";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import SearchFilterBar from "../components/SearchFilterBar";
import StatusBadge from "../components/StatusBadge";
import { extractErrorMessage, useToast } from "../hooks/useToast";

const PAGE_SIZE = 20;
const EMPTY_TXN = {
  transaction_type: "STOCK_IN",
  product: "",
  warehouse: "",
  destination_warehouse: "",
  quantity: "",
  adjustment_delta: "",
  reference_note: "",
};

export default function Inventory() {
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_TXN);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    warehouseApi.list({ page_size: 100 }).then(({ data }) => setWarehouses(data.results ?? data));
    productApi.list({ page_size: 200 }).then(({ data }) => setProducts(data.results ?? data));
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    stockApi
      .listItems({
        page,
        search,
        warehouse: warehouseFilter || undefined,
        low_stock: lowStockOnly ? "true" : undefined,
        page_size: PAGE_SIZE,
      })
      .then(({ data }) => {
        setRows(data.results ?? data);
        setCount(data.count ?? (data.results ?? data).length);
      })
      .catch((err) => toast.error(extractErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  useEffect(fetchData, [page, search, warehouseFilter, lowStockOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  const openTransaction = () => {
    setForm(EMPTY_TXN);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        transaction_type: form.transaction_type,
        product: form.product,
        warehouse: form.warehouse,
        quantity: form.transaction_type === "ADJUSTMENT" ? 0 : Number(form.quantity),
        reference_note: form.reference_note || null,
      };
      if (form.transaction_type === "TRANSFER") {
        payload.destination_warehouse = form.destination_warehouse;
        payload.quantity = Number(form.quantity);
      }
      if (form.transaction_type === "ADJUSTMENT") {
        payload.adjustment_delta = Number(form.adjustment_delta);
        payload.quantity = Math.abs(Number(form.adjustment_delta)) || 1;
      }
      await stockApi.createTransaction(payload);
      toast.success("Transaction recorded");
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    { key: "product_sku", header: "SKU", render: (row) => <span className="font-mono text-xs">{row.product_sku}</span> },
    { key: "product_name", header: "Product" },
    { key: "warehouse_name", header: "Warehouse" },
    { key: "current_stock", header: "Current", render: (row) => <span className="font-mono">{row.current_stock}</span> },
    { key: "reserved_stock", header: "Reserved", render: (row) => <span className="font-mono">{row.reserved_stock}</span> },
    { key: "available_stock", header: "Available", render: (row) => <span className="font-mono">{row.available_stock}</span> },
    { key: "minimum_stock_level", header: "Min Level", render: (row) => <span className="font-mono">{row.minimum_stock_level}</span> },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.is_low_stock ? "LOW" : "OK"} /> },
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
            label: "All warehouses",
            value: warehouseFilter,
            onChange: (v) => {
              setPage(1);
              setWarehouseFilter(v);
            },
            options: warehouses.map((w) => ({ value: String(w.id), label: w.name })),
          },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => {
                  setPage(1);
                  setLowStockOnly(e.target.checked);
                }}
              />
              Low stock only
            </label>
            <button className="btn-primary" onClick={openTransaction}>
              + New Transaction
            </button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        emptyMessage="No stock records found."
        pagination={{ count, page, pageSize: PAGE_SIZE, onPageChange: setPage }}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Stock Transaction"
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
          <div>
            <label className="label">Transaction Type</label>
            <select
              className="input"
              value={form.transaction_type}
              onChange={(e) => setForm({ ...form, transaction_type: e.target.value })}
            >
              <option value="STOCK_IN">Stock In</option>
              <option value="STOCK_OUT">Stock Out</option>
              <option value="ADJUSTMENT">Adjustment</option>
              <option value="TRANSFER">Transfer Between Warehouses</option>
            </select>
          </div>
          <div>
            <label className="label">Product</label>
            <select className="input" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.sku} — {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{form.transaction_type === "TRANSFER" ? "From Warehouse" : "Warehouse"}</label>
              <select className="input" value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value })}>
                <option value="">Select warehouse</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            {form.transaction_type === "TRANSFER" && (
              <div>
                <label className="label">To Warehouse</label>
                <select
                  className="input"
                  value={form.destination_warehouse}
                  onChange={(e) => setForm({ ...form, destination_warehouse: e.target.value })}
                >
                  <option value="">Select warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {form.transaction_type === "ADJUSTMENT" ? (
            <div>
              <label className="label">Adjustment (+/-)</label>
              <input
                type="number"
                className="input"
                placeholder="e.g. -5 or 10"
                value={form.adjustment_delta}
                onChange={(e) => setForm({ ...form, adjustment_delta: e.target.value })}
              />
            </div>
          ) : (
            <div>
              <label className="label">Quantity</label>
              <input
                type="number"
                className="input"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="label">Reference Note</label>
            <input
              className="input"
              placeholder="Optional"
              value={form.reference_note}
              onChange={(e) => setForm({ ...form, reference_note: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
