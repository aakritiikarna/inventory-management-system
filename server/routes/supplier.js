import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

const router = express.Router();

// Add Supplier
router.post("/add", authMiddleware, addSupplier);

// Get All Suppliers
router.get("/", authMiddleware, getSuppliers);

// Update Supplier
router.put("/update/:id", authMiddleware, updateSupplier);

// Delete Supplier
router.delete("/delete/:id", authMiddleware, deleteSupplier);

export default router;