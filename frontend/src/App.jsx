import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

const Login = lazy(() => import("./pages/Login"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Categories = lazy(() => import("./pages/Categories"));
const Suppliers = lazy(() => import("./pages/Suppliers"));
const Orders = lazy(() => import("./pages/Orders"));
const Reports = lazy(() => import("./pages/Reports"));
const Users = lazy(() => import("./pages/Users"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Branches = lazy(() => import("./pages/Branches"));

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Loader from "./components/common/Loader";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { useAuth } from "./context/AuthContext";
import { DashboardProvider } from "./context/DashboardContext";

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader text="Loading page..." />
  </div>
);

// Sends the visitor straight to the right place based on real auth state,
// instead of bouncing through /admin-dashboard first (which caused a
// login-page flash for logged-out visitors).
const RootRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={user ? "/admin-dashboard" : "/login"} replace />;
};

// Dashboard data is fetched only once a user is authenticated (never on
// /login), and keyed by user id so logging out and back in as a different
// user remounts it — a staff account can never inherit the previous
// admin's revenue/stock data from memory.
const AuthenticatedShell = () => {
  const { user } = useAuth();
  return (
    <DashboardProvider key={user?._id}>
      <DashboardLayout />
    </DashboardProvider>
  );
};

function App() {
  return (
    <ErrorBoundary label="the application">
      <Suspense fallback={<PageFallback />}>
      <Routes>

        {/* =========================
            HOME
        ========================== */}

        <Route
          path="/"
          element={<RootRedirect />}
        />

        {/* =========================
            LOGIN
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =========================
            UNAUTHORIZED
        ========================== */}

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        {/* =========================
            ADMIN DASHBOARD
        ========================== */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoutes>
              <AuthenticatedShell />
            </ProtectedRoutes>
          }
        >

          {/* Dashboard */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* Products */}
          <Route
            path="products"
            element={<Products />}
          />

          {/* Categories (admin only) */}
          <Route
            path="categories"
            element={
              <ProtectedRoutes requireRole={["admin"]}>
                <Categories />
              </ProtectedRoutes>
            }
          />

          {/* Suppliers (admin only) */}
          <Route
            path="suppliers"
            element={
              <ProtectedRoutes requireRole={["admin"]}>
                <Suppliers />
              </ProtectedRoutes>
            }
          />

          {/* Orders (admin only) */}
          <Route
            path="orders"
            element={
              <ProtectedRoutes requireRole={["admin"]}>
                <Orders />
              </ProtectedRoutes>
            }
          />

          {/* Users (admin only) */}
          <Route
            path="users"
            element={
              <ProtectedRoutes requireRole={["admin"]}>
                <Users />
              </ProtectedRoutes>
            }
          />

          {/* Branches (admin only) */}
          <Route
            path="branches"
            element={
              <ProtectedRoutes requireRole={["admin"]}>
                <Branches />
              </ProtectedRoutes>
            }
          />

          {/* Inventory (admin only) */}
          <Route
            path="inventory"
            element={
              <ProtectedRoutes requireRole={["admin"]}>
                <Inventory />
              </ProtectedRoutes>
            }
          />

          {/* Reports (admin only) */}
          <Route
            path="reports"
            element={
              <ProtectedRoutes requireRole={["admin"]}>
                <Reports />
              </ProtectedRoutes>
            }
          />

          {/* Profile */}
          <Route
            path="profile"
            element={<Profile />}
          />

          {/* Settings */}
          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>

        {/* =========================
            404
        ========================== */}

        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                404 - Page Not Found
              </h1>
            </div>
          }
        />

      </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
