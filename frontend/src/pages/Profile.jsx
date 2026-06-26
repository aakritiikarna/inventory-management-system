import { useState } from "react";
import { authApi } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage, useToast } from "../hooks/useToast";

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "", new_password_confirm: "" });
  const [isSavingPw, setIsSavingPw] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const { data } = await authApi.updateProfile(form);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsSavingPw(true);
    try {
      await authApi.changePassword(pwForm);
      toast.success("Password changed");
      setPwForm({ old_password: "", new_password: "", new_password_confirm: "" });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSavingPw(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
      <form onSubmit={handleProfileSave} className="card space-y-4">
        <h2 className="text-sm font-semibold text-ink-900">Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">First name</label>
            <input className="input" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </div>
          <div>
            <label className="label">Last name</label>
            <input className="input" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Phone Number</label>
          <input className="input" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          Role: <span className="badge bg-slate-100 text-slate-700">{user?.role}</span>
        </div>
        <button type="submit" className="btn-primary" disabled={isSavingProfile}>
          {isSavingProfile ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <form onSubmit={handlePasswordChange} className="card space-y-4">
        <h2 className="text-sm font-semibold text-ink-900">Change Password</h2>
        <div>
          <label className="label">Current Password</label>
          <input
            type="password"
            className="input"
            value={pwForm.old_password}
            onChange={(e) => setPwForm({ ...pwForm, old_password: e.target.value })}
          />
        </div>
        <div>
          <label className="label">New Password</label>
          <input
            type="password"
            className="input"
            value={pwForm.new_password}
            onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Confirm New Password</label>
          <input
            type="password"
            className="input"
            value={pwForm.new_password_confirm}
            onChange={(e) => setPwForm({ ...pwForm, new_password_confirm: e.target.value })}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={isSavingPw}>
          {isSavingPw ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
