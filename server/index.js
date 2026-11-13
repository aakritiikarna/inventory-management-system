import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./db/connection.js";

import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js";
import dashboardRoutes from "./routes/dashboard.js";
import branchRoutes from "./routes/branch.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const PORT = process.env.PORT || 3000;
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

// ======================================
// CORS
// ======================================
// Vite auto-increments its port (5173, 5174, 5175...) whenever the default
// is already in use, which happens constantly in local dev. A single
// hardcoded origin here silently breaks every API call — including ones
// that don't obviously look like a CORS failure — the moment the frontend
// starts on a different port than expected.
const DEV_ORIGIN_REGEX = /^http:\/\/(localhost|127\.0\.0\.1):(517[0-9]|3000)$/;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (curl, server-to-server, no Origin header)
      if (
        !origin ||
        DEV_ORIGIN_REGEX.test(origin) ||
        allowedOrigins.has(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ======================================
// BODY PARSER
// ======================================
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ======================================
// STATIC FILE SERVING (product & profile images)
// ======================================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================================
// DATABASE
// ======================================
await connectDB();

// ======================================
// ROOT
// ======================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Inventory Management API is running",
  });
});

// ======================================
// TEST DATABASE
// ======================================
app.get("/api/test-db", (req, res) => {
  const state = mongoose.connection.readyState;

  if (state === 1) {
    return res.status(200).json({
      success: true,
      message: "MongoDB is connected successfully",
    });
  }

  return res.status(500).json({
    success: false,
    message: "MongoDB is not connected",
    readyState: state,
  });
});

// ======================================
// AUTH ROUTES
// ======================================
app.use("/api/auth", authRoutes);

// ======================================
// CATEGORY ROUTES
// ======================================
app.use("/api/categories", categoryRoutes);

// ======================================
// PRODUCT ROUTES
// ======================================
app.use("/api/products", productRoutes);

// ======================================
// SUPPLIER ROUTES
// ======================================
app.use("/api/suppliers", supplierRoutes);

// ======================================
// USER ROUTES
// ======================================
app.use("/api/users", userRoutes);

// ======================================
// ORDER ROUTES
// ======================================
app.use("/api/orders", orderRoutes);

// ======================================
// DASHBOARD ROUTES
// ======================================
app.use("/api/dashboard", dashboardRoutes);

// ======================================
// BRANCH ROUTES
// ======================================
app.use("/api/branches", branchRoutes);
app.use("/api/inventory", inventoryRoutes);

// ======================================
// 404 HANDLER
// ======================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ======================================
// ERROR HANDLER
// ======================================
app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error);

  res.status(500).json({
    success: false,
    message:
      error.message || "Internal server error",
  });
});

// ======================================
// START SERVER
// ======================================
app.listen(PORT, (error) => {
  // Express 5 passes startup failures (e.g. EADDRINUSE when another program
  // already uses this port) to this callback. Ignoring the argument made the
  // server print "running" even though it never started listening.
  if (error) {
    console.error(`Failed to start server on port ${PORT}: ${error.message}`);
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Close the other program using it, or change PORT in server/.env.`
      );
    }
    process.exit(1);
  }

  console.log(
    `Server is running on http://localhost:${PORT}`
  );
});
