import express from "express";
import { protect, adminOnly } from "../Middleware/AdminAuth.js";
import {
  getPendingUsers,
  approveUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../Controller/AdminController.js";

const router = express.Router();

// ✅ Get all pending users (Admins Only)
router.get("/pending-accounts", protect, adminOnly, getPendingUsers);

// ✅ Approve user (Admins Only)
router.put("/approve-user/:id", protect, adminOnly, approveUser);

// ✅ Delete user (Admins Only)
router.delete("/delete-user/:id", protect, adminOnly, deleteUser);

// Get all users (Admins Only)
router.get("/users", protect, adminOnly, getAllUsers);

// Update user (Admins Only)
router.put("/users/:id", protect, adminOnly, updateUser);


export default router;
