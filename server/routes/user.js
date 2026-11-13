import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";
import { uploadProfileImage, handleUpload } from "../middleware/uploadMiddleware.js";

import {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.use(authMiddleware);

// Get All Users (admin only)
router.get("/", requireRole("admin"), getUsers);

// Get Single User (admin, or the user viewing their own profile)
router.get("/:id", (req, res, next) => {
  if (req.user.role === "admin" || String(req.user._id) === req.params.id) {
    return next();
  }
  return res.status(403).json({ success: false, message: "Not authorized" });
}, getUser);

// Add User (admin only)
router.post("/", requireRole("admin"), handleUpload(uploadProfileImage), addUser);

// Update User (admin, or the user updating their own profile)
router.put("/:id", (req, res, next) => {
  if (req.user.role === "admin" || String(req.user._id) === req.params.id) {
    return next();
  }
  return res.status(403).json({ success: false, message: "Not authorized" });
}, handleUpload(uploadProfileImage), updateUser);

// Delete User (admin only)
router.delete("/:id", requireRole("admin"), deleteUser);

export default router;
