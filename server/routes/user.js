import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  addUser,
  getUsers,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// ==========================
// User Routes
// ==========================

// Get All Users
router.get("/", authMiddleware, getUsers);

// Add User
router.post("/add", authMiddleware, addUser);

// Delete User
router.delete("/delete/:id", authMiddleware, deleteUser);

export default router;