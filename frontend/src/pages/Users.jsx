import { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaUserShield,
  FaCamera,
} from "react-icons/fa";

import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/common/Modal";
import ConfirmModal from "../components/common/ConfirmModal";
import SearchBar from "../components/common/SearchBar";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import StatusBadge from "../components/common/StatusBadge";
import Avatar from "../components/common/Avatar";
import toast from "react-hot-toast";

const ROLES = ["admin", "user", "customer"];

const roleLabel = (role) =>
  ({ admin: "Admin", user: "Staff", customer: "Customer" }[role] || role);

const roleStatus = (role) =>
  ({ admin: "Active", user: "Processing", customer: "Draft" }[role]);

const emptyForm = {
  name: "",
  email: "",
  password: "",
  address: "",
  role: "customer",
};

const Users = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get("/users");
      setUsers(data.users || []);
    } catch (err) {
      console.error("FETCH USERS ERROR:", err);
      setError(err.response?.data?.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // The fetch manages loading state while its request is in flight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.address?.toLowerCase().includes(term);
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      address: user.address || "",
      role: user.role || "customer",
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("address", formData.address);
      payload.append("role", formData.role);
      if (formData.password) payload.append("password", formData.password);
      if (imageFile) payload.append("profileImage", imageFile);

      if (editingUser) {
        await API.put(`/users/${editingUser._id}`, payload);
      } else {
        if (!formData.password) {
          toast.error("Password is required for a new user");
          setSaving(false);
          return;
        }
        await API.post("/users", payload);
      }

      toast.success(editingUser ? "User updated" : "User added");
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error("SAVE USER ERROR:", err);
      toast.error(err.response?.data?.message || "Unable to save user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await API.delete(`/users/${confirmDelete._id}`);
      toast.success("User deleted");
      setConfirmDelete(null);
      fetchUsers();
    } catch (err) {
      console.error("DELETE USER ERROR:", err);
      toast.error(err.response?.data?.message || "Unable to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage staff and customer accounts.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition cursor-pointer"
        >
          <FaPlus size={14} /> Add User
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{roleLabel(r)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader text="Loading users..." />
      ) : error ? (
        <EmptyState title="Couldn't load users" description={error} buttonText="Retry" onClick={fetchUsers} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState title="No users found" description="Try adjusting your search or add a new user." buttonText="Add User" onClick={openAddModal} />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-gray-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Joined</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} src={u.profileImage} size={44} />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{u.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={roleStatus(u.role)} />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{roleLabel(u.role)}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-[200px] truncate">{u.address || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setViewUser(u)} className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition cursor-pointer flex items-center justify-center" title="View">
                          <FaEye size={13} />
                        </button>
                        <button onClick={() => openEditModal(u)} className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition cursor-pointer flex items-center justify-center" title="Edit">
                          <FaEdit size={13} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(u)}
                          disabled={u._id === currentUser?._id}
                          className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white transition cursor-pointer flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                          title={u._id === currentUser?._id ? "You can't delete your own account" : "Delete"}
                        >
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

      {/* ADD/EDIT MODAL */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingUser ? "Edit User" : "Add User"} width="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-slate-700" />
              ) : editingUser ? (
                <Avatar name={editingUser.name} src={editingUser.profileImage} size={64} />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400">
                  <FaUserShield size={22} />
                </div>
              )}
              <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow">
                <FaCamera size={11} />
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG or WEBP. Max 5MB.<br />Leave blank to use initials.</p>
          </div>

          <input name="name" value={formData.name} onChange={handleChange} placeholder="Full name" required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="password" type="password" value={formData.password} onChange={handleChange}
            placeholder={editingUser ? "New password (leave blank to keep current)" : "Password"} required={!editingUser}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          <select name="role" value={formData.role} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
            {ROLES.map((r) => (
              <option key={r} value={r}>{roleLabel(r)}</option>
            ))}
          </select>

          <button type="submit" disabled={saving}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition disabled:opacity-60 cursor-pointer">
            {saving ? "Saving..." : editingUser ? "Save Changes" : "Add User"}
          </button>
        </form>
      </Modal>

      {/* VIEW MODAL */}
      <Modal isOpen={!!viewUser} onClose={() => setViewUser(null)} title="User Details" width="max-w-md">
        {viewUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={viewUser.name} src={viewUser.profileImage} size={64} />
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{viewUser.name}</p>
                <StatusBadge status={roleStatus(viewUser.role)} />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{roleLabel(viewUser.role)}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500 dark:text-gray-400">Email:</span> <span className="text-gray-800 dark:text-gray-100">{viewUser.email}</span></p>
              <p><span className="text-gray-500 dark:text-gray-400">Address:</span> <span className="text-gray-800 dark:text-gray-100">{viewUser.address || "—"}</span></p>
              <p><span className="text-gray-500 dark:text-gray-400">Joined:</span> <span className="text-gray-800 dark:text-gray-100">{viewUser.createdAt ? new Date(viewUser.createdAt).toLocaleString() : "—"}</span></p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${confirmDelete?.name}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Users;
