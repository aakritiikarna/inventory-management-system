import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// CREATE CATEGORY
router.post("/", createCategory);

// GET ALL CATEGORIES
router.get("/", getCategories);

// GET SINGLE CATEGORY
router.get("/:id", getCategoryById);

// UPDATE CATEGORY
router.put("/:id", updateCategory);

// DELETE CATEGORY
router.delete("/:id", deleteCategory);

// IMPORTANT:
// Export router as DEFAULT
export default router;