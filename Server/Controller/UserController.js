import userModel from "../Models/UserModel.js"; // Import at the top

// Get user details by ID
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from request params
    const user = await userModel.findById(userId).select("-password"); // Use `userModel`, not `User`

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password"); // Use `userModel`, not `User`
    res.status(200).json({ success: true, users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
