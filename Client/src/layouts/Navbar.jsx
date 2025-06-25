import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Tooltip,
  Container,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Settings,
} from "@mui/icons-material";
import { AviContext } from "../Context/AviContext";
import { authService } from "../services/api";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";

const Navbar = ({ drawerWidth, onDrawerToggle }) => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(AviContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUserData(null);
      navigate("/landing");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout error:", error);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: "background.paper",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        borderBottom: "1px solid",
        borderColor: "divider",
        borderRadius: 0,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between", px: 3, minHeight: 64 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={onDrawerToggle}
              sx={{
                mr: 2,
                display: { md: "none" },
                "&:hover": {
                  bgcolor: "action.hover",
                },
                padding: 1,
                borderRadius: 0,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "8px",
              transition: "box-shadow 0.3s ease-in-out",

              "&:hover": {
                boxShadow: "0px 0px 12px rgba(234, 179, 8, 0.6)", // Subtle gold glow
              },
            }}
            onClick={() => navigate("/homepage")}
          >
            {/* Logo */}
            <Box
              component="img"
              src={logo}
              alt="JetAvi Logo"
              sx={{
                height: 46,
                width: "auto",
                objectFit: "contain",
              }}
            />

            {/* Branding Name */}
            <Typography
              variant="h1"
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                letterSpacing: 1.5,
                display: { xs: "none", sm: "block" },
                fontFamily: "'Poppins', sans-serif",
                textTransform: "uppercase",
                fontSize: "20px",
                background: "linear-gradient(45deg, #EAB308, #FDE047)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              JET AVI
            </Typography>
          </Box>

          <Box>
            <IconButton
              onClick={handleMenu}
              size="large"
              color="primary"
              sx={{
                "&:hover": {
                  bgcolor: "action.hover",
                },
                padding: 1,
                borderRadius: 0,
              }}
            >
              {userData?.avatar ? (
                <Avatar
                  src={userData.avatar}
                  alt={userData?.name}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <AccountCircle sx={{ fontSize: 32 }} />
              )}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Box sx={{ py: 1.5, px: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",

                    mb: 0.5,
                  }}
                >
                  {userData?.name
                    ? userData.name.charAt(0).toUpperCase() +
                      userData.name.slice(1).toLowerCase()
                    : ""}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",

                    letterSpacing: 0.5,
                  }}
                >
                  {userData?.role
                    ? userData.role.charAt(0).toUpperCase() +
                      userData.role.slice(1).toLowerCase()
                    : "User"}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/profile");
                }}
              >
                <Settings fontSize="small" sx={{ mr: 2 }} />
                Profile Settings
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleClose();
                  handleLogout();
                }}
                sx={{ color: "error.main" }}
              >
                <Logout fontSize="small" sx={{ mr: 2 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
