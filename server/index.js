import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import connectDB from "./db/connection.js";

import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";

const app = express();

const PORT = process.env.PORT || 3000;

// ======================================
// CORS
// ======================================
app.use(
  cors({
    origin: "http://localhost:5173",
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
      database: mongoose.connection.name,
      host: mongoose.connection.host,
    });
  }

  return res.status(500).json({
    success: false,
    message: "MongoDB is not connected",
    readyState: state,
  });
});

// ======================================
// CATEGORY ROUTES
// ======================================
app.use(
  "/api/categories",
  categoryRoutes
);

// ======================================
// PRODUCT ROUTES
// ======================================
app.use(
  "/api/products",
  productRoutes
);

// ======================================
// SUPPLIER ROUTES
// ======================================
app.use(
  "/api/suppliers",
  supplierRoutes
);

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
app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`
  );
});