import userModel from "../Models/UserModel.js"; // ✅ Ensure correct import

// ✅ Get all pending user accounts
export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await userModel.find({ isApproved: false });
    res.status(200).json(pendingUsers);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Approve user account
export const approveUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findByIdAndUpdate(
      userId,
      { isApproved: true },
      { new: true }
    );

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res
      .status(200)
      .json({ success: true, message: "User approved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Delete user (Reject Request)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findByIdAndDelete(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all users (for user management)
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all approved users
    const users = await userModel.find({ isApproved: true });

    // Remove sensitive information like password before sending
    const sanitizedUsers = users.map((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    });

    res.status(200).json(sanitizedUsers);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Update user information
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Prevent updating sensitive fields
    delete updates.password;

    const user = await userModel.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: userObj,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};


