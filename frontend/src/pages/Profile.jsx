import { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaShieldAlt,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";

import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/common/Avatar";

const roleLabel = (role) =>
  ({ admin: "Administrator", user: "Staff", customer: "Customer" }[role] || role || "—");

const Profile = () => {
  const { user, login } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    address: user?.address || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirm: "" });
  const [changingPassword, setChangingPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition";

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("address", form.address);
      if (imageFile) payload.append("profileImage", imageFile);

      const { data } = await API.put(`/users/${user._id}`, payload);

      // Refresh the locally stored session so the navbar/avatar update immediately
      login(data.user, localStorage.getItem("pos-token"));

      toast.success("Profile updated");
      setEditing(false);
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("UPDATE PROFILE ERROR:", err);
      toast.error(err.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: user?.name || "", address: user?.address || "" });
    setImageFile(null);
    setImagePreview(null);
    setEditing(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!passwordForm.newPassword || !passwordForm.confirm) {
      toast.error("Please fill in both password fields.");
      return;
    }
    if (passwordForm.newPassword.length < 4) {
      toast.error("Password should be at least 4 characters.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setSavingPassword(true);
      await API.put(`/users/${user._id}`, { password: passwordForm.newPassword });
      toast.success("Password updated");
      setPasswordForm({ newPassword: "", confirm: "" });
      setChangingPassword(false);
    } catch (err) {
      console.error("UPDATE PASSWORD ERROR:", err);
      toast.error(err.response?.data?.message || "Unable to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage your personal information and account settings.
          </p>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition cursor-pointer"
          >
            <FaEdit size={13} /> Edit Profile
          </button>
        )}
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
        {editing ? (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-20 h-20 rounded-full object-cover border border-gray-200 dark:border-slate-700" />
                ) : (
                  <Avatar name={user.name} src={user.profileImage} size={80} />
                )}
                <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow">
                  <FaCamera size={12} />
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG or WEBP. Max 5MB.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition disabled:opacity-60 cursor-pointer"
              >
                {saving ? <FaSpinner className="animate-spin" size={13} /> : <FaSave size={13} />}
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-300 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <FaTimes size={13} /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Avatar name={user.name} src={user.profileImage} size={80} />
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user.name}</h2>
              <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <FaShieldAlt size={10} /> {roleLabel(user.role)}
              </span>

              <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p className="flex items-center gap-2"><FaEnvelope className="text-gray-400" size={13} /> {user.email}</p>
                <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" size={13} /> {user.address || "No address on file"}</p>
                {user.createdAt && (
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" size={13} /> Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PASSWORD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Password</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Change your account password.
            </p>
          </div>
          {!changingPassword && (
            <button
              onClick={() => setChangingPassword(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Change password
            </button>
          )}
        </div>

        {changingPassword && (
          <form onSubmit={handlePasswordUpdate} className="mt-4 space-y-3">
            <input
              type="password"
              placeholder="New password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className={inputClass}
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              className={inputClass}
              required
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={savingPassword}
                className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-medium disabled:opacity-60 cursor-pointer"
              >
                {savingPassword && <FaSpinner className="animate-spin" size={13} />}
                {savingPassword ? "Updating..." : "Update password"}
              </button>
              <button
                type="button"
                onClick={() => { setChangingPassword(false); setPasswordForm({ newPassword: "", confirm: "" }); }}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
