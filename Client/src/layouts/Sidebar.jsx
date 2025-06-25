import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import {
  LocalShipping,
  Flight,
  LocationOn,
  Settings,
  SupervisorAccount,
  Dashboard,
  LocalAirport,
  Description,
  AddBox,
  Storage,
} from "@mui/icons-material";

const navigation = [
  {
    title: "Dashboard",
    items: [{ name: "Overview", icon: <Dashboard />, path: "/homepage" }],
  },
  {
    title: "Cargo Management",
    items: [
      {
        name: "AWB Planning",
        icon: <Description />,
        path: "/cargo-management/awb-planning",
      },
      {
        name: "AWB Generation",
        icon: <AddBox />,
        path: "/cargo-management/awb-generation",
      },
      {
        name: "AWB Database",
        icon: <Storage />,
        path: "/cargo-management/awb-database",
      },
    ],
  },
  {
    title: "Airport",
    items: [
      {
        name: "Add Airport",
        icon: <LocalAirport />,
        path: "/airport-management/add-airport",
      },
      {
        name: "Airport Database",
        icon: <Storage />,
        path: "/airport-management/airport-database",
      },
    ],
  },
  {
    title: "Administration",
    items: [{ name: "Settings", icon: <Settings />, path: "/admin" }],
  },
];

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <Box
      sx={{
        pt: 3,
        height: "100%",
        bgcolor: "background.paper",
        borderRadius: 0,
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "all 0.2s ease-in-out",
      }}
    >
      {/* Logo or Brand */}
      <Box sx={{ px: 3, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            fontWeight: "bold",
            letterSpacing: 1,
            fontFamily: "'Poppins'",
            textShadow: "0 0 10px rgba(234, 179, 8, 0.3)",
          }}
        >
          Jet Aviation ERM
        </Typography>
      </Box>

      {/* Navigation Items */}
      <Box sx={{ overflowY: "auto", height: "calc(100% - 64px)" }}>
        {navigation.map((section) => (
          <Box key={section.title} sx={{ mb: 2 }}>
            <Typography
              variant="overline"
              sx={{
                px: 3,
                py: 1.5,
                display: "block",
                color: "text.secondary",
                letterSpacing: 1,
                fontWeight: 500,
                fontSize: "0.75rem",
                textTransform: "uppercase",
              }}
            >
              {section.title}
            </Typography>

            <List sx={{ px: 2 }}>
              {section.items.map((item) => (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: "rgba(234, 179, 8, 0.1)",
                        transform: "translateX(4px)",
                      },
                      "&.Mui-selected": {
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        "&:hover": {
                          bgcolor: "primary.dark",
                          transform: "translateX(4px)",
                        },
                        "& .MuiListItemIcon-root": {
                          color: "inherit",
                        },
                        boxShadow: "0 0 15px rgba(234, 179, 8, 0.3)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color:
                          location.pathname === item.path
                            ? "inherit"
                            : "primary.main",
                        transition: "color 0.2s ease-in-out",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: location.pathname === item.path ? 600 : 400,
                        letterSpacing: 0.5,
                        transition: "all 0.2s ease-in-out",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Divider
              sx={{
                mx: 2,
                my: 1,
                borderColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  borderColor: "rgba(234, 179, 8, 0.3)",
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;
