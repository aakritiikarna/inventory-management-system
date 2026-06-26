import { useEffect, useState } from "react";
import { productApi, purchaseOrderApi, supplierApi, warehouseApi } from "../api/endpoints";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import SearchFilterBar from "../components/SearchFilterBar";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage, useToast } from "../hooks/useToast";

const PAGE_SIZE = 20;
const EMPTY_LINE = { product: "", quantity: "", unit_cost: "" };
const EMPTY_FORM = { supplier: "", warehouse: "", date: new Date().toISOString().slice(0, 10), lines: [{ ...EMPTY_LINE }] };

export default function PurchaseOrders() {
  const { hasRole } = useAuth();
  const canManage = hasRole("ADMIN", "WAREHOUSE_MANAGER");
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    supplierApi.list({ status: "ACTIVE", page_size: 100 }).then(({ data }) => setSuppliers(data.results ?? data));
    warehouseApi.list({ page_size: 100 }).then(({ data }) => setWarehouses(data.results ?? data));
    productApi.list({ page_size: 200 }).then(({ data }) => setProducts(data.results ?? data));
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    purchaseOrderApi
      .list({ page, status: statusFilter || undefined, page_size: PAGE_SIZE })
      .then(({ data }) => {
        setRows(data.results ?? data);
        setCount(data.count ?? (data.results ?? data).length);
      })
      .catch((err) => toast.error(extractErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  useEffect(fetchData, [page, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const updateLine = (idx, field, value) => {
    const lines = [...form.lines];
    lines[idx] = { ...lines[idx], [field]: value };
    setForm({ ...form, lines });
  };

  const addLine = () => setForm({ ...form, lines: [...form.lines, { ...EMPTY_LINE }] });
  const removeLine = (idx) => setForm({ ...form, lines: form.lines.filter((_, i) => i !== idx) });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        supplier: form.supplier,
        warehouse: form.warehouse,
        date: form.date,
        lines: form.lines
          .filter((l) => l.product && l.quantity)
          .map((l) => ({ product: l.product, quantity: Number(l.quantity), unit_cost: Number(l.unit_cost) })),
      };
      await purchaseOrderApi.create(payload);
      toast.success("Purchase order created as Draft");
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const runAction = async (id, actionFn, successMsg) => {
    try {
      await actionFn(id);
      toast.success(successMsg);
      fetchData();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const columns = [
    { key: "po_number", header: "PO Number", render: (row) => <span className="font-mono text-xs">{row.po_number}</span> },
    { key: "supplier_name", header: "Supplier" },
    { key: "warehouse_name", header: "Warehouse" },
    { key: "date", header: "Date" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "total_amount",
      header: "Total",
      render: (row) => <span className="font-mono">${Number(row.total_amount).toFixed(2)}</span>,
    },
    ...(canManage
      ? [
          {
            key: "actions",
            header: "",
            render: (row) => (
              <div className="flex gap-3 text-sm">
                {row.status === "DRAFT" && (
                  <button
                    className="text-sky-600 hover:text-sky-700 font-medium"
                    onClick={() => runAction(row.id, purchaseOrderApi.approve, "Purchase order approved")}
                  >
                    Approve
                  </button>
                )}
                {row.status === "APPROVED" && (
                  <button
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                    onClick={() => runAction(row.id, purchaseOrderApi.receive, "Goods received, stock updated")}
                  >
                    Receive
                  </button>
                )}
                {row.status !== "RECEIVED" && row.status !== "CANCELLED" && (
                  <button
                    className="text-rose-600 hover:text-rose-700 font-medium"
                    onClick={() => runAction(row.id, purchaseOrderApi.cancel, "Purchase order cancelled")}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <SearchFilterBar
        search=""
        onSearchChange={() => {}}
        filters={[
          {
            label: "All statuses",
            value: statusFilter,
            onChange: (v) => {
              setPage(1);
              setStatusFilter(v);
            },
            options: [
              { value: "DRAFT", label: "Draft" },
              { value: "APPROVED", label: "Approved" },
              { value: "RECEIVED", label: "Received" },
              { value: "CANCELLED", label: "Cancelled" },
            ],
          },
        ]}
        actions={
          canManage && (
            <button className="btn-primary" onClick={openCreate}>
              + Create Purchase Order
            </button>
          )
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        emptyMessage="No purchase orders found."
        pagination={{ count, page, pageSize: PAGE_SIZE, onPageChange: setPage }}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Purchase Order"
        widthClass="max-w-3xl"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Creating..." : "Create as Draft"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Supplier</label>
              <select className="input" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}>
                <option value="">Select supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Receiving Warehouse</label>
              <select className="input" value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value })}>
                <option value="">Select warehouse</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Line Items</label>
              <button className="text-sm text-teal-600 font-medium" onClick={addLine}>
                + Add product
              </button>
            </div>
            <div className="space-y-2">
              {form.lines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <select
                    className="input col-span-6"
                    value={line.product}
                    onChange={(e) => updateLine(idx, "product", e.target.value)}
                  >
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.sku} — {p.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="input col-span-2"
                    placeholder="Qty"
                    value={line.quantity}
                    onChange={(e) => updateLine(idx, "quantity", e.target.value)}
                  />
                  <input
                    type="number"
                    step="0.01"
                    className="input col-span-3"
                    placeholder="Unit cost"
                    value={line.unit_cost}
                    onChange={(e) => updateLine(idx, "unit_cost", e.target.value)}
                  />
                  <button
                    className="col-span-1 text-rose-500 text-lg"
                    onClick={() => removeLine(idx)}
                    aria-label="Remove line"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
