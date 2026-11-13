import { useEffect, useState } from "react";
import {
  FaDownload,
  FaSyncAlt,
  FaDollarSign,
  FaShoppingCart,
  FaBoxOpen,
  FaWarehouse,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { useDashboard } from "../context/DashboardContext";
import { useCurrency } from "../context/CurrencyContext";
import { DEMO_MONTHLY_REVENUE, DEMO_ORDER_STATUS, DEMO_CATEGORY_SALES, DEMO_USER_GROWTH } from "../data/demoData";
import DemoDataBadge from "../components/common/DemoDataBadge";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { getBranchAnalytics } from "../services/branchService";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

const PIE_COLORS = ["#2563eb", "#f59e0b", "#6366f1", "#10b981", "#ef4444", "#14b8a6"];

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString(undefined, { month: "short", day: "numeric" });



const toCsv = (rows, headers) => {
  const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))];
  return lines.join("\n");
};

const downloadCsv = (filename, csv) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const Reports = () => {
  const { formatMoney: currency } = useCurrency();
  const {
    stats,
    revenueTrend,
    userGrowth,
    statusCounts,
    categoryCounts,
    topProducts,
    loading,
    reloadDashboard,
  } = useDashboard();

  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBranches = async () => {
    try {
      setBranchesLoading(true);
      const { data } = await getBranchAnalytics();
      setBranches(data.branches || []);
    } catch (err) {
      console.error("BRANCH ANALYTICS ERROR:", err);
    } finally {
      setBranchesLoading(false);
    }
  };

  useEffect(() => {
    // The fetch manages loading state while its request is in flight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBranches();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([reloadDashboard(), fetchBranches()]);
    setRefreshing(false);
  };

  const realRevenueData = revenueTrend.map((p) => ({ label: formatDate(p.date), revenue: p.revenue }));
  const realStatusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const realCategoryData = Object.entries(categoryCounts).map(([name, products]) => ({ name, products }));

  const usingDemoRevenue = !loading && realRevenueData.length < 3;
  const usingDemoStatus = !loading && realStatusData.length === 0;
  const usingDemoCategory = !loading && realCategoryData.length === 0;

  const revenueChartData = usingDemoRevenue ? DEMO_MONTHLY_REVENUE : realRevenueData;
  const statusChartData = usingDemoStatus
    ? DEMO_ORDER_STATUS.map((d) => ({ name: d.name, value: d.value }))
    : realStatusData;
  const categoryChartData = usingDemoCategory ? DEMO_CATEGORY_SALES : realCategoryData;

  const monthLabel = (ym) => {
    const [y, m] = ym.split("-");
    return new Date(Number(y), Number(m) - 1).toLocaleDateString(undefined, { month: "short" });
  };
  const realUserGrowth = (userGrowth || []).map((p) => ({ label: monthLabel(p.month), users: p.users }));
  const usingDemoUserGrowth = !loading && realUserGrowth.length < 3;
  const userGrowthChartData = usingDemoUserGrowth ? DEMO_USER_GROWTH : realUserGrowth;

  const handleExportBranches = () => {
    if (branches.length === 0) return;
    const csv = toCsv(
      branches.map((b) => ({
        name: b.name,
        city: b.city,
        status: b.status,
        orders: b.orders,
        totalStock: b.totalStock,
        inventoryValue: b.inventoryValue,
        lowStockCount: b.lowStockCount,
      })),
      ["name", "city", "status", "orders", "totalStock", "inventoryValue", "lowStockCount"]
    );
    downloadCsv("branch-report.csv", csv);
  };

  const handleExportTopProducts = () => {
    if (topProducts.length === 0) return;
    const csv = toCsv(
      topProducts.map((p) => ({
        productName: p.product?.productName,
        category: p.product?.category,
        unitsSold: p.unitsSold,
      })),
      ["productName", "category", "unitsSold"]
    );
    downloadCsv("top-products.csv", csv);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Real-time figures computed from your live orders, products, and branches.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-60"
        >
          <FaSyncAlt className={refreshing ? "animate-spin" : ""} size={13} /> Refresh
        </button>
      </div>

      {/* SUMMARY STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: currency(stats.totalRevenue), icon: <FaDollarSign />, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" },
          { label: "Total Orders", value: stats.totalOrders, icon: <FaShoppingCart />, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400" },
          { label: "Inventory Value", value: currency(stats.inventoryValue), icon: <FaWarehouse />, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400" },
          { label: "Products Tracked", value: stats.totalProducts, icon: <FaBoxOpen />, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400" },
        ].map((c) => (
          <div key={c.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${c.color}`}>{c.icon}</div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{loading ? "—" : c.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{c.label}</p>
          </div>
        ))}
      </div>

      {/* REVENUE + STATUS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Revenue Over Time</h2>
            {usingDemoRevenue && <DemoDataBadge />}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {usingDemoRevenue ? "Sample monthly revenue — shown until enough real orders exist." : "Based on orders placed, most recent active days."}
          </p>

          {loading ? (
            <div className="h-[280px] rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
          ) : (
            <ErrorBoundary label="the revenue chart" compact>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="repRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-800" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" className="text-gray-400" />
                <YAxis tick={{ fontSize: 12 }} stroke="currentColor" className="text-gray-400" />
                <Tooltip formatter={(v) => [currency(v), "Revenue"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fill="url(#repRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
            </ErrorBoundary>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Orders by Status</h2>
            {usingDemoStatus && <DemoDataBadge />}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {usingDemoStatus ? "Sample distribution — no orders recorded yet." : "Distribution of order statuses."}
          </p>

          {loading ? (
            <div className="h-[220px] rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
          ) : (
            <ErrorBoundary label="the order status chart" compact>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3}>
                  {statusChartData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            </ErrorBoundary>
          )}
        </div>
      </div>

      {/* CATEGORY + TOP PRODUCTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Products by Category</h2>
            {usingDemoCategory && <DemoDataBadge />}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {usingDemoCategory ? "Sample category breakdown — add products to see real data." : "Catalog size across categories."}
          </p>

          {loading ? (
            <div className="h-[260px] rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
          ) : (
            <ErrorBoundary label="the category chart" compact>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-800" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="currentColor" className="text-gray-400" />
                <YAxis tick={{ fontSize: 12 }} stroke="currentColor" className="text-gray-400" allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }} />
                <Bar dataKey="products" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            </ErrorBoundary>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Top Products</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">By units sold across all orders.</p>
            </div>
            <button
              onClick={handleExportTopProducts}
              disabled={topProducts.length === 0}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-40 cursor-pointer"
            >
              <FaDownload size={11} /> CSV
            </button>
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 rounded-lg bg-gray-100 dark:bg-slate-800 animate-pulse" />)}
            </div>
          ) : topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No sales recorded yet.</p>
          ) : (
            <ul className="space-y-2">
              {topProducts.map((p, i) => (
                <li key={p.product?._id || i} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/60">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs font-semibold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{p.product?.productName}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white whitespace-nowrap ml-2">{p.unitsSold} sold</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* USER GROWTH */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">User Growth</h2>
          {usingDemoUserGrowth && <DemoDataBadge />}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {usingDemoUserGrowth ? "Sample monthly signups — will switch to real data as more accounts are created." : "New accounts created per month."}
        </p>

        {loading ? (
          <div className="h-[240px] rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
        ) : (
          <ErrorBoundary label="the user growth chart" compact>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={userGrowthChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-slate-800" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" className="text-gray-400" />
              <YAxis tick={{ fontSize: 12 }} stroke="currentColor" className="text-gray-400" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }} />
              <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          </ErrorBoundary>
        )}
      </div>

      {/* BRANCH PERFORMANCE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Branch Performance</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Orders and inventory value by branch (demo data).</p>
          </div>
          <button
            onClick={handleExportBranches}
            disabled={branches.length === 0}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-40 cursor-pointer"
          >
            <FaDownload size={11} /> CSV
          </button>
        </div>

        {branchesLoading ? (
          <Loader text="Loading branch analytics..." />
        ) : branches.length === 0 ? (
          <EmptyState title="No branches yet" description="Add branches from the Branches page to see performance here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Branch</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Stock Units</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Inventory Value</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Low Stock</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((b) => (
                  <tr key={b._id} className="border-t border-gray-100 dark:border-slate-800">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 dark:text-gray-100">{b.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{b.city}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{b.orders}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{b.totalStock}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{currency(b.inventoryValue)}</td>
                    <td className="px-4 py-3">
                      {b.lowStockCount > 0 ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">{b.lowStockCount}</span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
