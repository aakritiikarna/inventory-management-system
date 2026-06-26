import { useEffect, useState } from "react";
import { warehouseApi } from "../api/endpoints";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import SearchFilterBar from "../components/SearchFilterBar";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage, useToast } from "../hooks/useToast";

const EMPTY_FORM = { name: "", location: "", capacity: "", manager: "" };
const PAGE_SIZE = 20;

export default function Warehouses() {
  const { hasRole } = useAuth();
  const canEdit = hasRole("ADMIN", "WAREHOUSE_MANAGER");
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = () => {
    setIsLoading(true);
    warehouseApi
      .list({ page, search, page_size: PAGE_SIZE })
      .then(({ data }) => {
        setRows(data.results ?? data);
        setCount(data.count ?? (data.results ?? data).length);
      })
      .catch((err) => toast.error(extractErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  useEffect(fetchData, [page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      location: row.location,
      capacity: row.capacity,
      manager: row.manager || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { ...form, manager: form.manager || null, capacity: Number(form.capacity) };
      if (editingId) {
        await warehouseApi.update(editingId, payload);
        toast.success("Warehouse updated");
      } else {
        await warehouseApi.create(payload);
        toast.success("Warehouse created");
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
    if (!window.confirm(`Delete warehouse "${row.name}"?`)) return;
    try {
      await warehouseApi.remove(row.id);
      toast.success("Warehouse deleted");
      fetchData();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "location", header: "Location" },
    { key: "capacity", header: "Capacity", render: (row) => <span className="font-mono">{row.capacity}</span> },
    {
      key: "current_utilization",
      header: "Utilization",
      render: (row) => (
        <span className="font-mono">
          {row.current_utilization} / {row.capacity}
        </span>
      ),
    },
    { key: "manager_name", header: "Manager" },
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
        actions={
          canEdit && (
            <button className="btn-primary" onClick={openCreate}>
              + Add Warehouse
            </button>
          )
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        emptyMessage="No warehouses found."
        pagination={{ count, page, pageSize: PAGE_SIZE, onPageChange: setPage }}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Warehouse" : "Add Warehouse"}
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
            <label className="label">Warehouse Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Capacity</label>
              <input
                type="number"
                className="input"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Manager (User ID)</label>
              <input
                type="number"
                className="input"
                value={form.manager}
                onChange={(e) => setForm({ ...form, manager: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
