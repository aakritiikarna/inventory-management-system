import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/products": "Products",
  "/suppliers": "Suppliers",
  "/warehouses": "Warehouses",
  "/inventory": "Inventory",
  "/purchase-orders": "Purchase Orders",
  "/reports": "Reports",
  "/profile": "Profile",
};

const MOBILE_NAV_ITEMS = [
  { to: "/", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/suppliers", label: "Suppliers" },
  { to: "/warehouses", label: "Warehouses" },
  { to: "/inventory", label: "Inventory" },
  { to: "/purchase-orders", label: "Purchase Orders" },
  { to: "/reports", label: "Reports" },
];

export default function MainLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const title = PAGE_TITLES[window.location.pathname] || "StockPilot";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-ink-950 text-slate-200 p-4">
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-white">StockPilot</span>
              <button onClick={() => setMobileNavOpen(false)} className="text-slate-400" aria-label="Close menu">
                ✕
              </button>
            </div>
            <nav className="space-y-1">
              {MOBILE_NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive ? "bg-teal-600/15 text-teal-300" : "text-slate-400 hover:bg-ink-800"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </div>
  );
}
