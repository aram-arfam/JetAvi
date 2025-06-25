import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlane, FaBoxes, FaUserShield } from "react-icons/fa";
import { AviContext } from "../../Context/AviContext";
import { Box, Container, Typography, Paper, Grid } from "@mui/material";

const modules = [
  {
    name: "Cargo Management",
    icon: <FaBoxes size={40} />,
    description: "Manage cargo logistics, tracking, and operations.",
    path: "/cargo-management",
  },

  {
    name: "Airport Management",
    icon: <FaPlane size={40} />,
    description: "Monitor flight plans, crew assignments, and air traffic.",
    path: "/airport-management",
  },
];

const MotionPaper = motion.create(Paper);
export default function HomePage() {
  const { userData } = useContext(AviContext);
  console.log("User data:", userData);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        py: 2,
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={3}
          sx={{
            p: 8,
            borderRadius: 4,
            bgcolor: "secondary.main",
            pt: 4,
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}20`,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              textAlign: "center",
              mb: 8,
              color: "primary.main",
              fontWeight: "bold",
              textShadow: (theme) =>
                `2px 2px 4px ${theme.palette.primary.main}30`,
              letterSpacing: 2,
            }}
          >
            Dashboard
          </Typography>

          <Grid container spacing={4}>
            {modules.map((module, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionPaper
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    p: 6,
                    minHeight: "250px",
                    borderRadius: 4,
                    bgcolor: "background.default",
                    border: 1,
                    borderColor: "divider",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    textAlign: "center",
                    transition: "all 0.3s ease-in-out",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: (theme) =>
                        `0 12px 32px ${theme.palette.primary.main}30`,
                      borderColor: "primary.main",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "4px",
                      background: (theme) =>
                        `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.3s ease-in-out",
                    },
                    "&:hover::before": {
                      transform: "scaleX(1)",
                    },
                  }}
                  onClick={() => navigate(module.path)}
                >
                  <Box
                    sx={{
                      color: "primary.main",
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                      transform: "scale(1)",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    {module.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      mb: 2,
                      fontWeight: "medium",
                      whiteSpace: "nowrap",
                      color: "text.primary",
                      transition: "color 0.3s ease-in-out",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    {module.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ flexGrow: 1 }}
                  >
                    {module.description}
                  </Typography>
                </MotionPaper>
              </Grid>
            ))}

            {userData?.role === "admin" && (
              <Grid item xs={12} md={4}>
                <MotionPaper
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    p: 6,
                    minHeight: "250px",
                    borderRadius: 4,
                    bgcolor: "background.default",
                    border: 1,
                    borderColor: "divider",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    textAlign: "center",
                    transition: "all 0.3s ease-in-out",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: (theme) =>
                        `0 12px 32px ${theme.palette.primary.main}30`,
                      borderColor: "primary.main",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "4px",
                      background: (theme) =>
                        `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.3s ease-in-out",
                    },
                    "&:hover::before": {
                      transform: "scaleX(1)",
                    },
                  }}
                  onClick={() => navigate("/admin")}
                >
                  <Box
                    sx={{
                      color: "primary.main",
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                      transform: "scale(1)",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <FaUserShield size={40} />
                  </Box>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      mb: 2,
                      fontWeight: "medium",
                      whiteSpace: "nowrap",
                      color: "text.primary",
                      transition: "color 0.3s ease-in-out",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    Admin Settings
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ flexGrow: 1 }}
                  >
                    Manage Everything
                  </Typography>
                </MotionPaper>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
