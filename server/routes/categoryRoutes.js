import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// GET ALL CATEGORIES
router.get("/", getCategories);

// GET SINGLE CATEGORY
router.get("/:id", getCategoryById);

// CREATE CATEGORY (admin only)
router.post("/", requireRole("admin"), createCategory);

// UPDATE CATEGORY (admin only)
router.put("/:id", requireRole("admin"), updateCategory);

// DELETE CATEGORY (admin only)
router.delete("/:id", requireRole("admin"), deleteCategory);

export default router;
