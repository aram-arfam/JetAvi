import React, { useState, useMemo } from "react";
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
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Edit,
  Visibility,
  ErrorOutline,
  Delete,
  People,
  AdminPanelSettings,
  PersonOutline,
  Save,
} from "@mui/icons-material";
import useUserManagement from "../hooks/useUserManagement";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import { formatDate } from "../utils/adminUtils";

const UserManagement = () => {
  const theme = useTheme();
  const {
    loading,
    error,
    users,
    filterUsers,
    refreshData,
    updateUser,
    deleteUser,
  } = useUserManagement();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const filteredUsers = filterUsers(searchQuery);

  // User statistics
  const userStats = useMemo(() => {
    if (!users) return { total: 0, admin: 0, regular: 0 };

    return {
      total: users.length,
      admin: users.filter((user) => user.role === "admin").length,
      regular: users.filter((user) => user.role !== "admin").length,
    };
  }, [users]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleDialogOpen = (type, user) => {
    setDialogType(type);
    setSelectedUser(user);
    if (type === "edit") {
      setEditFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
      });
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDialogType("");
    setSelectedUser(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveUser = async () => {
    if (!selectedUser?._id) return;

    setActionLoading(true);
    try {
      const success = await updateUser(selectedUser._id, editFormData);
      if (success) {
        refreshData();
        handleDialogClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?._id) return;

    setActionLoading(true);
    try {
      const success = await deleteUser(selectedUser._id);
      if (success) {
        refreshData();
        handleDialogClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const renderRoleChip = (role = "user") => (
    <Chip
      label={role}
      color={role === "admin" ? "primary" : "default"}
      size="small"
      icon={
        role === "admin" ? (
          <AdminPanelSettings fontSize="small" />
        ) : (
          <PersonOutline fontSize="small" />
        )
      }
    />
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <PageHeader
          title="User Management"
          subtitle="Manage users and view statistics"
        />

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <People color="primary" />
                  <Typography variant="h4">{userStats.total}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Admin Users
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AdminPanelSettings color="primary" />
                  <Typography variant="h4">{userStats.admin}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Regular Users
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PersonOutline color="primary" />
                  <Typography variant="h4">{userStats.regular}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <SearchBar
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </Paper>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
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

        <Paper elevation={3}>
          <TableContainer>
            {loading ? (
              <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table>
                <TableHead sx={{}}>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Registration Date</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((user) => (
                        <TableRow key={user._id} hover>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <Avatar
                                sx={{ bgcolor: theme.palette.primary.main }}
                              >
                                {user.name?.[0]?.toUpperCase() || "?"}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">
                                  {user.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {user.email}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>{renderRoleChip(user.role)}</TableCell>
                          <TableCell>
                            {user.createdAt
                              ? formatDate(user.createdAt)
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {user.lastLogin
                              ? formatDate(user.lastLogin)
                              : "Never"}
                          </TableCell>
                          <TableCell align="right">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="flex-end"
                            >
                              <Tooltip title="View Details">
                                <IconButton
                                  color="info"
                                  size="small"
                                  onClick={() => handleDialogOpen("view", user)}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit User">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => handleDialogOpen("edit", user)}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete User">
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() =>
                                    handleDialogOpen("delete", user)
                                  }
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" sx={{ py: 3 }}>
                          {searchQuery
                            ? "No matching users found"
                            : "No users available"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
            <TablePagination
              component="div"
              count={filteredUsers.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
        </Paper>

        {/* View User Dialog */}
        <Dialog
          open={openDialog && dialogType === "view"}
          onClose={handleDialogClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>User Details</DialogTitle>
          <DialogContent dividers>
            {selectedUser && (
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {selectedUser.name?.[0]?.toUpperCase() || "?"}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedUser.name}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {selectedUser.email}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Role
                    </Typography>
                    <Typography variant="body1">
                      {selectedUser.role || "user"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="body1">
                      {selectedUser.status || "active"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Joined
                    </Typography>
                    <Typography variant="body1">
                      {selectedUser.createdAt
                        ? formatDate(selectedUser.createdAt)
                        : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Login
                    </Typography>
                    <Typography variant="body1">
                      {selectedUser.lastLogin
                        ? formatDate(selectedUser.lastLogin)
                        : "Never"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Close</Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                handleDialogClose();
                handleDialogOpen("edit", selectedUser);
              }}
            >
              Edit User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog
          open={openDialog && dialogType === "edit"}
          onClose={handleDialogClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent dividers>
            {selectedUser && (
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleEditChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={editFormData.email || ""}
                  onChange={handleEditChange}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={editFormData.role || "user"}
                    label="Role"
                    onChange={handleEditChange}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              color="primary"
              variant="contained"
              disabled={actionLoading}
              startIcon={<Save />}
            >
              {actionLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog
          open={openDialog && dialogType === "delete"}
          onClose={handleDialogClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent dividers>
            <Typography>
              Are you sure you want to delete the user{" "}
              <strong>{selectedUser?.name}</strong>? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              color="error"
              variant="contained"
              disabled={actionLoading}
              startIcon={<Delete />}
            >
              {actionLoading ? "Deleting..." : "Delete User"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default UserManagement;
