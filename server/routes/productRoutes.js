import express from "express";

import {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";
import { uploadProductImage, handleUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// All product routes require a logged-in user
router.use(authMiddleware);

// GET all products
router.get("/", getProducts);

// GET single product
router.get("/:id", getProduct);

// ADD product (admin only)
router.post(
  "/",
  requireRole("admin"),
  handleUpload(uploadProductImage),
  addProduct
);

// UPDATE product (admin only)
router.put(
  "/:id",
  requireRole("admin"),
  handleUpload(uploadProductImage),
  updateProduct
);

// DELETE product (admin only)
router.delete("/:id", requireRole("admin"), deleteProduct);

export default router;
