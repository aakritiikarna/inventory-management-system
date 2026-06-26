import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";

export default function Navbar({ title, onOpenMobileNav }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 lg:px-8 bg-white border-b border-slate-200">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 -ml-2 text-slate-500"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
        >
          ☰
        </button>
        <h1 className="text-lg font-semibold text-ink-900">{title}</h1>
      </div>

      <div className="relative">
        <button
          className="btn-secondary"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={menuOpen}
        >
          Account
          <span className="text-xs">▾</span>
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white shadow-card overflow-hidden"
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50"
              onClick={() => {
                setMenuOpen(false);
                navigate("/profile");
              }}
            >
              Profile
            </button>
            <button
              className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
