import { useEffect, useState } from "react";
import { supplierApi } from "../api/endpoints";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import SearchFilterBar from "../components/SearchFilterBar";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage, useToast } from "../hooks/useToast";

const EMPTY_FORM = { name: "", contact_person: "", email: "", phone: "", address: "", status: "ACTIVE" };
const PAGE_SIZE = 20;

export default function Suppliers() {
  const { hasRole } = useAuth();
  const canEdit = hasRole("ADMIN", "WAREHOUSE_MANAGER");
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = () => {
    setIsLoading(true);
    supplierApi
      .list({ page, search, status: statusFilter || undefined, page_size: PAGE_SIZE })
      .then(({ data }) => {
        setRows(data.results ?? data);
        setCount(data.count ?? (data.results ?? data).length);
      })
      .catch((err) => toast.error(extractErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  useEffect(fetchData, [page, search, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      contact_person: row.contact_person || "",
      email: row.email,
      phone: row.phone,
      address: row.address || "",
      status: row.status,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingId) {
        await supplierApi.update(editingId, form);
        toast.success("Supplier updated");
      } else {
        await supplierApi.create(form);
        toast.success("Supplier created");
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
    if (!window.confirm(`Delete supplier "${row.name}"? This cannot be undone.`)) return;
    try {
      await supplierApi.remove(row.id);
      toast.success("Supplier deleted");
      fetchData();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "contact_person", header: "Contact Person" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
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
            label: "All statuses",
            value: statusFilter,
            onChange: (v) => {
              setPage(1);
              setStatusFilter(v);
            },
            options: [
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" },
            ],
          },
        ]}
        actions={
          canEdit && (
            <button className="btn-primary" onClick={openCreate}>
              + Add Supplier
            </button>
          )
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        emptyMessage="No suppliers found."
        pagination={{ count, page, pageSize: PAGE_SIZE, onPageChange: setPage }}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Supplier" : "Add Supplier"}
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
            <label className="label">Supplier Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Contact Person</label>
            <input
              className="input"
              value={form.contact_person}
              onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Address</label>
            <textarea
              className="input"
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
