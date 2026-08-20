import express from "express";

import {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

const router = express.Router();

// GET all suppliers
router.get("/", getSuppliers);

// POST new supplier
router.post("/", addSupplier);

// PUT update supplier
router.put("/:id", updateSupplier);

// DELETE supplier
router.delete("/:id", deleteSupplier);

export default router;