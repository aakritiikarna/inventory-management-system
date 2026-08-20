import express from "express";

import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

/* Get All */

router.get("/", getOrders);

/* Get Single */

router.get("/:id", getOrder);

/* Create */

router.post("/", createOrder);

/* Update */

router.put("/:id", updateOrder);

/* Delete */

router.delete("/:id", deleteOrder);

export default router;