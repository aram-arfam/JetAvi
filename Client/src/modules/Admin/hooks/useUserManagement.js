import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { adminService } from "../services/adminService";

/**
 * Custom hook for managing user data operations
 * Provides methods for fetching, approving, rejecting, updating, and deleting users
 */
const useUserManagement = (initialUsers = []) => {
  const [users, setUsers] = useState(initialUsers);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch pending users from the API
   */
  const fetchPendingUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await adminService.getPendingUsers();
      setPendingUsers(data);
    } catch (err) {
      console.error("Error fetching pending users:", err);
      setError("Failed to load pending users. Please try again later.");
      toast.error("Failed to load pending users");
    } finally {
      setLoading(false);
    }
  }, []);

  const approveUser = useCallback(
    async (userId) => {
      if (!userId) {
        toast.error("User ID is required");
        return false;
      }

      setLoading(true);
      try {
        await adminService.approveUser(userId);

        // Update local state
        setPendingUsers((prev) => prev.filter((user) => user._id !== userId));

        // Refresh the users list
        await fetchUsers();

        toast.success("User approved successfully");
        return true;
      } catch (err) {
        console.error("Error approving user:", err);
        toast.error(err.message || "Failed to approve user");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  const rejectUser = useCallback(async (userId) => {
    if (!userId) {
      toast.error("User ID is required");
      return false;
    }

    setLoading(true);
    try {
      await adminService.rejectUser(userId);

      // Update local state
      setPendingUsers((prev) => prev.filter((user) => user._id !== userId));

      toast.success("User rejected successfully");
      return true;
    } catch (err) {
      console.error("Error rejecting user:", err);
      toast.error(err.message || "Failed to reject user");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a user's information
   * @param {string} userId - ID of the user to update
   * @param {Object} userData - Updated user data
   * @returns {Promise<boolean>} Success status
   */
  const updateUser = useCallback(async (userId, userData) => {
    if (!userId || !userData) {
      toast.error("User ID and data are required");
      return false;
    }

    setLoading(true);
    try {
      await adminService.updateUser(userId, userData);

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, ...userData } : user
        )
      );

      toast.success("User updated successfully");
      return true;
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error(err.message || "Failed to update user");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a user account
   * @param {string} userId - ID of the user to delete
   * @returns {Promise<boolean>} Success status
   */
  const deleteUser = useCallback(async (userId) => {
    if (!userId) {
      toast.error("User ID is required");
      return false;
    }

    setLoading(true);
    try {
      await adminService.deleteUser(userId);

      // Update local state
      setUsers((prev) => prev.filter((user) => user._id !== userId));

      toast.success("User deleted successfully");
      return true;
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.message || "Failed to delete user");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Filter users based on search query
   * @param {string} query - Search query
   * @returns {Array} Filtered users
   */
  const filterUsers = useCallback(
    (query) => {
      if (!query) return users;

      const lowercaseQuery = query.toLowerCase();
      return users.filter((user) =>
        Object.entries(user).some(([key, value]) => {
          // Only search through string values and exclude internal fields
          return (
            value &&
            typeof value === "string" &&
            !key.startsWith("_") &&
            value.toLowerCase().includes(lowercaseQuery)
          );
        })
      );
    },
    [users]
  );

  /**
   * Filter pending users based on search query
   * @param {string} query - Search query
   * @returns {Array} Filtered pending users
   */
  const filterPendingUsers = useCallback(
    (query) => {
      if (!query) return pendingUsers;

      const lowercaseQuery = query.toLowerCase();
      return pendingUsers.filter((user) =>
        Object.entries(user).some(([key, value]) => {
          // Only search through string values and exclude internal fields
          return (
            value &&
            typeof value === "string" &&
            !key.startsWith("_") &&
            value.toLowerCase().includes(lowercaseQuery)
          );
        })
      );
    },
    [pendingUsers]
  );

  // Fetch data when the refresh trigger changes
  useEffect(() => {
    fetchUsers();
    fetchPendingUsers();
  }, [fetchUsers, fetchPendingUsers, refreshTrigger]);

  return {
    users,
    pendingUsers,
    loading,
    error,
    fetchUsers,
    fetchPendingUsers,
    approveUser,
    rejectUser,
    updateUser,
    deleteUser,
    filterUsers,
    filterPendingUsers,
    refreshData,
  };
};

export default useUserManagement;
