import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner, FaBoxes } from "react-icons/fa";

import API from "../api/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Already signed in — no reason to show the login form again
  useEffect(() => {
    if (user) {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await API.post("/auth/login", { email, password });

      if (data.success) {
        login(data.user, data.token);
        // Every role lands in the same app shell — what each one can see and
        // do inside it is decided by role (route guards + the API). There
        // is no separate /customer-dashboard route, so sending customers
        // there used to drop them on the 404 page.
        navigate("/admin-dashboard");
      } else {
        setError(data.message || "Unable to sign in");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* LEFT — BRAND PANEL (hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-gray-900 dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }} />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-gray-900 flex items-center justify-center font-bold text-lg">
            <FaBoxes />
          </div>
          <div>
            <h1 className="text-white font-semibold tracking-tight">Inventory Pro</h1>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold text-white leading-snug">
            Run your inventory like a real business.
          </h2>
          <p className="text-gray-400 mt-4 leading-relaxed">
            Track stock, orders, suppliers, and branches across your organization —
            all from one clean, dependable dashboard.
          </p>
        </div>

        <p className="relative text-xs text-gray-500">
          © {new Date().getFullYear()} Inventory Pro. All demo data.
        </p>
      </div>

      {/* RIGHT — LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-bold text-lg">
              <FaBoxes />
            </div>
            <h1 className="text-gray-900 dark:text-white font-semibold tracking-tight">Inventory Pro</h1>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome back</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
            Sign in to your account to continue.
          </p>

          {error && (
            <div className="mt-6 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:opacity-90 transition disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading && <FaSpinner className="animate-spin" size={14} />}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
