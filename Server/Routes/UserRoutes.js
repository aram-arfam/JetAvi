import express from "express";
import { getUserDetails, getAllUsers } from "../Controller/UserController.js";
import { protect, adminOnly } from "../Middleware/UserAuth.js";

const router = express.Router();

// Get user details (only logged-in users)
router.get("/:id", protect, getUserDetails);

// Get all users (Admin only)
router.get("/", protect, adminOnly, getAllUsers);

export default router;
