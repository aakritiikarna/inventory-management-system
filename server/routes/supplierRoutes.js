import express from "express";

import {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

// Supplier data is internal — admin only, reads included.
router.use(authMiddleware, requireRole("admin"));

// GET all suppliers
router.get("/", getSuppliers);

// POST new supplier (admin/user only)
router.post("/", addSupplier);

// PUT update supplier (admin/user only)
router.put("/:id", updateSupplier);

// DELETE supplier (admin only)
router.delete("/:id", requireRole("admin"), deleteSupplier);

export default router;
