import jwt from "jsonwebtoken";
import userModel from "../Models/UserModel.js"; // Ensure correct import

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Get token from cookies

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded.id).select("-password"); // Corrected `userModel.findById()`

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    next(); // Proceed to next middleware/controller
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, invalid token" });
  }
};

// Admin-only access middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Admin access only" });
  }
};
