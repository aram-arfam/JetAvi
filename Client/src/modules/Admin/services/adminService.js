import api from "../../../services/api";

export const adminService = {
  getPendingUsers: async () => {
    try {
      const response = await api.get("/api/admin/pending-accounts");
      return response.data;
    } catch (error) {
      console.error("Error fetching pending users:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch pending users"
      );
    }
  },

  approveUser: async (userId) => {
    if (!userId) throw new Error("User ID is required");

    try {
      const response = await api.put(`/api/admin/approve-user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error approving user:", error);
      throw new Error(
        error.response?.data?.message || "Failed to approve user"
      );
    }
  },

  rejectUser: async (userId) => {
    if (!userId) throw new Error("User ID is required");

    try {
      const response = await api.delete(`/api/admin/delete-user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error rejecting user:", error);
      throw new Error(error.response?.data?.message || "Failed to reject user");
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get("/api/admin/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  },

  updateUser: async (userId, userData) => {
    if (!userId) throw new Error("User ID is required");
    if (!userData) throw new Error("User data is required");

    try {
      const response = await api.put(`/api/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
  },

  deleteUser: async (userId) => {
    if (!userId) throw new Error("User ID is required");

    try {
      const response = await api.delete(`/api/admin//delete-user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }
  },

 
  getAWBStats: async () => {
    try {
      const response = await api.get("/api/awbs/awbs/stats");
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response); // Enhanced error logging
      throw new Error(
        error.response?.data?.message || "Failed to fetch dashboard statistics"
      );
    }
  },
};

export default adminService;
