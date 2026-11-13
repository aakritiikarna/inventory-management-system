import express from "express";

import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

// Orders/shipments are internal operations — admin only, reads included.
router.use(authMiddleware, requireRole("admin"));

/* Get All */
router.get("/", getOrders);

/* Get Single */
router.get("/:id", getOrder);

/* Create (admin/user only) */
router.post("/", createOrder);

/* Update (admin/user only) */
router.put("/:id", updateOrder);

/* Delete (admin only) */
router.delete("/:id", requireRole("admin"), deleteOrder);

export default router;
