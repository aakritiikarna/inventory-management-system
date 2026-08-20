import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/add", authMiddleware, addCategory);

router.get("/", authMiddleware, getCategories);

router.put("/update/:id", authMiddleware, updateCategory);

router.delete("/delete/:id", authMiddleware, deleteCategory);

export default router;