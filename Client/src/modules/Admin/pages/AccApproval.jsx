import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Avatar,
  Stack,
  Alert,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Visibility,
  Warning,
  ErrorOutline,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import useUserManagement from "../hooks/useUserManagement";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import { formatDate } from "../utils/adminUtils";

/**
 * Highlights text based on search query
 * @param {string} text - Text to highlight
 * @param {string} searchQuery - Search query
 * @returns {string|JSX.Element} - Highlighted text
 */
const highlightText = (text, searchQuery) => {
  if (!searchQuery || !text) return text;

  try {
    const textStr = text.toString();
    const cleanedQuery = searchQuery.toLowerCase().trim().replace(/\s+/g, " ");

    if (cleanedQuery === "") return textStr;

    let searchTerms = cleanedQuery.includes(" ")
      ? [
          cleanedQuery,
          ...cleanedQuery.split(" ").filter((word) => word.length > 0),
        ]
      : [cleanedQuery];

    // Remove duplicates and sort by length (descending)
    searchTerms = [...new Set(searchTerms)]
      .filter((term) => term.length > 0)
      .sort((a, b) => b.length - a.length);

    if (searchTerms.length === 0) return textStr;

    const pattern = searchTerms
      .map((term) => `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`)
      .join("|");

    const regex = new RegExp(pattern, "gi");
    const parts = textStr.split(regex);

    if (parts.length === 1) return textStr;

    return parts.map((part, index) => {
      // Check if part is null or undefined and provide a default empty string
      const partText = part || "";

      const isMatch = searchTerms.some(
        (term) => term && partText.toLowerCase() === term.toLowerCase()
      );

      return isMatch ? (
        <span
          key={index}
          style={{
            backgroundColor: "#FFD700",
            color: "#000",
            fontWeight: "bold",
            padding: "2px",
            borderRadius: "2px",
          }}
        >
          {partText}
        </span>
      ) : (
        partText
      );
    });
  } catch (error) {
    console.error("Error highlighting text:", error);
    return text;
  }
};

const AccApproval = () => {
  const theme = useTheme();
  const {
    loading,
    error,
    approveUser,
    rejectUser,
    filterPendingUsers,
    refreshData,
  } = useUserManagement();

  // Local state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(""); // "approve", "reject", or "view"
  const [actionLoading, setActionLoading] = useState(false);

  // Filter users based on search query
  const filteredUsers = filterPendingUsers(searchQuery);

  // Handle search input change
  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(0); // Reset to first page when searching
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Dialog handlers
  const handleDialogOpen = (type, user) => {
    setDialogType(type);
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDialogType("");
    setSelectedUser(null);
  };

  // View user details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDialogType("view");
    setOpenDialog(true);
  };

  // Handle approve/reject action
  const handleAction = async () => {
    if (!selectedUser || !selectedUser._id) {
      toast.error("Invalid user data");
      return;
    }

    setActionLoading(true);
    try {
      let success = false;

      if (dialogType === "approve") {
        success = await approveUser(selectedUser._id);
      } else if (dialogType === "reject") {
        success = await rejectUser(selectedUser._id);
      }

      if (success) {
        handleDialogClose();
        refreshData(); // Refresh data after successful action
      }
    } catch (error) {
      console.error("Action error:", error);
      toast.error(error.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  // Render user status chip
  const renderStatusChip = (status) => {
    return (
      <Chip
        label={status || "pending"}
        color="warning"
        size="small"
        icon={<Warning />}
      />
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <PageHeader
          title="Account Approvals"
          subtitle="Review and manage pending user registrations"
        />

        <Paper sx={{ p: 3, mb: 3 }}>
          <SearchBar
            placeholder="Search pending users..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </Paper>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={refreshData}
                startIcon={<ErrorOutline />}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>

                  <TableCell>Role</TableCell>
                  <TableCell>Submitted Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Avatar
                              sx={{
                                bgcolor: theme.palette.primary.main,
                              }}
                            >
                              {user.name ? user.name[0].toUpperCase() : "?"}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {highlightText(user.name, searchQuery)}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {highlightText(user.email, searchQuery)}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={highlightText(
                              user.role || "user",
                              searchQuery
                            )}
                            color={
                              user.role === "admin" ? "primary" : "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {user.createdAt
                            ? highlightText(
                                formatDate(user.createdAt),
                                searchQuery
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell>{renderStatusChip(user.status)}</TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => handleViewDetails(user)}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() =>
                                  handleDialogOpen("approve", user)
                                }
                              >
                                <CheckCircle />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDialogOpen("reject", user)}
                              >
                                <Cancel />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" sx={{ py: 3 }}>
                        {searchQuery
                          ? "No matching users found"
                          : "No pending users found"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* User Dialog - Approval, Rejection, or View Details */}
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          maxWidth={dialogType === "view" ? "sm" : "xs"}
          fullWidth
        >
          <DialogTitle>
            {dialogType === "approve"
              ? "Approve User Registration"
              : dialogType === "reject"
              ? "Reject User Registration"
              : "User Registration Details"}
          </DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Box sx={{ py: 2 }}>
                {dialogType === "view" ? (
                  // User details view
                  <>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ mb: 3 }}
                    >
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: theme.palette.primary.main,
                          fontSize: "1.5rem",
                        }}
                      >
                        {selectedUser.name
                          ? selectedUser.name[0].toUpperCase()
                          : "?"}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {selectedUser.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedUser.email}
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Role
                      </Typography>
                      <Chip
                        label={selectedUser.role || "user"}
                        color={
                          selectedUser.role === "admin" ? "primary" : "default"
                        }
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Registration Date
                      </Typography>
                      <Typography variant="body1">
                        {selectedUser.createdAt
                          ? new Date(selectedUser.createdAt).toLocaleString()
                          : "N/A"}
                      </Typography>
                    </Box>

                    {selectedUser.phone && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body1">
                          {selectedUser.phone}
                        </Typography>
                      </Box>
                    )}

                    {selectedUser.address && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Address
                        </Typography>
                        <Typography variant="body1">
                          {selectedUser.address}
                        </Typography>
                      </Box>
                    )}

                    {selectedUser.reason && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Reason for Registration
                        </Typography>
                        <Paper
                          variant="outlined"
                          sx={{ p: 2, mt: 1, bgcolor: "background.default" }}
                        >
                          <Typography variant="body2">
                            {selectedUser.reason}
                          </Typography>
                        </Paper>
                      </Box>
                    )}
                  </>
                ) : (
                  // Approval/Rejection confirmation
                  <>
                    <Typography variant="body1" gutterBottom>
                      Are you sure you want to{" "}
                      <strong>
                        {dialogType === "approve" ? "approve" : "reject"}
                      </strong>{" "}
                      the registration for:
                    </Typography>
                    <Box
                      sx={{
                        my: 2,
                        p: 2,
                        bgcolor: "background.default",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="h6" color="primary">
                        {selectedUser.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedUser.email}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Company: {selectedUser.company || "N/A"}
                      </Typography>
                    </Box>
                    {dialogType === "reject" && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        This action cannot be undone. The user will need to
                        register again.
                      </Alert>
                    )}
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} disabled={actionLoading}>
              {dialogType === "view" ? "Close" : "Cancel"}
            </Button>
            {dialogType === "view" ? (
              <>
                <Button
                  color="error"
                  onClick={() => {
                    handleDialogClose();
                    handleDialogOpen("reject", selectedUser);
                  }}
                >
                  Reject
                </Button>
                <Button
                  color="success"
                  variant="contained"
                  onClick={() => {
                    handleDialogClose();
                    handleDialogOpen("approve", selectedUser);
                  }}
                >
                  Approve
                </Button>
              </>
            ) : (
              <Button
                onClick={handleAction}
                color={dialogType === "approve" ? "success" : "error"}
                variant="contained"
                disabled={actionLoading}
                startIcon={
                  actionLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : dialogType === "approve" ? (
                    <CheckCircle />
                  ) : (
                    <Cancel />
                  )
                }
              >
                {dialogType === "approve" ? "Approve" : "Reject"}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AccApproval;
