import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast, extractErrorMessage } from "../hooks/useToast";

const INITIAL_FORM = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  password_confirm: "",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(form);
      toast.success("Account created");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-teal-400 font-mono text-2xl font-bold">◆</span>
          <span className="text-xl font-semibold text-white tracking-tight">StockPilot</span>
        </div>

        <div className="card">
          <h1 className="text-lg font-semibold text-ink-900 mb-1">Create your account</h1>
          <p className="text-sm text-slate-500 mb-6">
            New accounts are created with Staff access. An admin can grant additional permissions later.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First name</label>
                <input className="input" value={form.first_name} onChange={update("first_name")} />
              </div>
              <div>
                <label className="label">Last name</label>
                <input className="input" value={form.last_name} onChange={update("last_name")} />
              </div>
            </div>
            <div>
              <label className="label">Username</label>
              <input className="input" value={form.username} onChange={update("username")} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={update("email")} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Password</label>
                <input type="password" className="input" value={form.password} onChange={update("password")} required />
              </div>
              <div>
                <label className="label">Confirm password</label>
                <input
                  type="password"
                  className="input"
                  value={form.password_confirm}
                  onChange={update("password_confirm")}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
