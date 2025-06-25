import jwt from "jsonwebtoken";
import userModel from "../Models/UserModel.js";

// ✅ Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Get token from cookies

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded.id).select("-password"); // Attach user data

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// ✅ Middleware to allow only Admin users
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Proceed if the user is an admin
  } else {
    res
      .status(403)
      .json({ success: false, message: "Access denied: Admins only" });
  }
};
