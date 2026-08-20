import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Inventory from "./pages/Inventory";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Routes>

      {/* =========================
          HOME
      ========================== */}

      <Route
        path="/"
        element={<Navigate to="/admin-dashboard" replace />}
      />

      {/* =========================
          LOGIN
      ========================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* =========================
          ADMIN DASHBOARD
      ========================== */}

      <Route
        path="/admin-dashboard"
        element={<DashboardLayout />}
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

        {/* Categories */}
        <Route path="categories" element={<Categories />} />

        {/* Customers */}
        <Route
          path="customers"
          element={<Customers />}
        />

        {/* Suppliers */}
        <Route
          path="suppliers"
          element={<Suppliers />}
        />

        {/* Orders */}
        <Route
          path="orders"
          element={<Orders />}
        />

        {/* Users */}
        <Route
          path="users"
          element={<Users />}
        />

        {/* Inventory */}
        <Route
          path="inventory"
          element={<Inventory />}
        />

        {/* Reports */}
        <Route
          path="reports"
          element={<Reports />}
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
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-4xl font-bold">
              404 - Page Not Found
            </h1>
          </div>
        }
      />

    </Routes>
  );
}

export default App;