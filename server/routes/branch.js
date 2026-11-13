import express from "express";

import {
  createBranch,
  getBranches,
  getBranch,
  updateBranch,
  deleteBranch,
  getBranchAnalytics,
} from "../controllers/branchController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

// Warehouse/branch data is internal — admin only, reads included.
router.use(authMiddleware, requireRole("admin"));

router.get("/analytics", getBranchAnalytics);
router.get("/", getBranches);
router.get("/:id", getBranch);
router.post("/", requireRole("admin"), createBranch);
router.put("/:id", requireRole("admin"), updateBranch);
router.delete("/:id", requireRole("admin"), deleteBranch);

export default router;
