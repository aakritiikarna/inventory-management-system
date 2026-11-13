import express from "express";
import { getWarehouseInventory, getShipments } from "../controllers/inventoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

// Warehouse stock and shipments are internal — admin only, reads included.
router.use(authMiddleware, requireRole("admin"));

router.get("/warehouses", getWarehouseInventory);
router.get("/shipments", getShipments);

export default router;
