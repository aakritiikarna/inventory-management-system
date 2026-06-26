import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "▢" },
  { to: "/products", label: "Products", icon: "▣" },
  { to: "/suppliers", label: "Suppliers", icon: "◈" },
  { to: "/warehouses", label: "Warehouses", icon: "▤" },
  { to: "/inventory", label: "Inventory", icon: "▥" },
  { to: "/purchase-orders", label: "Purchase Orders", icon: "▦" },
  { to: "/reports", label: "Reports", icon: "▧" },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-ink-950 text-slate-200 h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-ink-800">
        <span className="text-teal-400 font-mono text-lg font-bold">◆</span>
        <span className="font-semibold tracking-tight text-white">StockPilot</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-600/15 text-teal-300"
                  : "text-slate-400 hover:bg-ink-800 hover:text-slate-100"
              }`
            }
          >
            <span className="font-mono text-base leading-none">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-ink-800">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-full bg-teal-600 flex items-center justify-center text-sm font-semibold text-white shrink-0">
            {(user?.first_name?.[0] || user?.username?.[0] || "U").toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-100 truncate">
              {user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user?.username}
            </p>
            <p className="text-xs text-slate-500 font-mono">{user?.role?.replace("_", " ")}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
