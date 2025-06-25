/**
 * Utility functions for the Admin module
 */

/**
 * Format date to a readable format
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

/**
 * Get status color based on status value
 * @param {string} status - Status value
 * @returns {string} - Color for the status
 */
export const getStatusColor = (status) => {
  const statusColors = {
    active: "success",
    pending: "warning",
    blocked: "error",
    rejected: "error",
    inactive: "default",
  };

  return statusColors[status.toLowerCase()] || "default";
};

/**
 * Filter array of objects based on search query
 * @param {Array} items - Array of objects to filter
 * @param {string} query - Search query
 * @returns {Array} - Filtered array
 */
export const filterItems = (items, query) => {
  if (!query || query.trim() === "") return items;

  const lowercaseQuery = query.toLowerCase().trim();

  return items.filter((item) =>
    Object.values(item).some(
      (value) =>
        value && value.toString().toLowerCase().includes(lowercaseQuery)
    )
  );
};

/**
 * Generate avatar initials from name
 * @param {string} name - Full name
 * @returns {string} - Initials (up to 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return "?";

  const names = name.split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};
