import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { People, Warning, CheckCircle } from "@mui/icons-material";
import { AviContext } from "../../../Context/AviContext";
import PageHeader from "../components/PageHeader";
import { adminService } from "../services/adminService";

import { motion } from "framer-motion";
const MotionPaper = motion.create(Paper);

const AdminCard = ({ title, description, icon, path, color }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <MotionPaper
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      sx={{
        p: 3,
        height: "100%",
        cursor: "pointer",
        background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.primary.dark}10 100%)`,
        border: `1px solid ${theme.palette.primary.main}20`,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: `0 8px 24px ${theme.palette.primary.main}20`,
          border: `1px solid ${theme.palette.primary.main}40`,
        },
      }}
      onClick={() => navigate(path)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}20`,
            color: color,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </MotionPaper>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Paper
      sx={{
        p: 3,
        height: "100%",
        background: `linear-gradient(135deg, ${color}10 0%, ${color}20 100%)`,
        border: `1px solid ${color}30`,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: `${color}20`,
            color: color,
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: color }}>
        {value}
      </Typography>
    </Paper>
  );
};

const AdminDashboard = () => {
  const { userData } = useContext(AviContext);
  const theme = useTheme();


  const [stats, setStats] = useState({
    totalAWBs: 0,
    activeAWBs: 0,
    pendingAWBs: 0,
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching stats..."); // Add this log
        const data = await adminService.getAWBStats();
        const { totalAWBs, activeAWBs, pendingAWBs } = data;
        setStats({ totalAWBs, activeAWBs, pendingAWBs });
        console.log("Stats received:", data); // Add this log
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
  
    fetchStats();
  }, []);

  const adminModules = [
    {
      title: "User Management",
      description: "Manage user accounts, roles, and permissions",
      icon: <People fontSize="large" />,
      path: "/admin/users",
      color: theme.palette.primary.main,
    },
    {
      title: "Account Approvals",
      description: "Review and approve pending user registrations",
      icon: <People fontSize="large" />,
      path: "/admin/approvals",
      color: theme.palette.warning.main,
    },
  ];

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
          title="Admin Dashboard"
          subtitle={`Welcome back, ${userData?.name || "Admin"}`}
        />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total AWBS"
              value={stats.totalAWBs}
              icon={<People />}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending AWBS"
              value={stats.pendingAWBs}
              icon={<Warning />}
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active AWBS"
              value={stats.activeAWBs}
              icon={<CheckCircle />}
              color={theme.palette.success.main}
            />
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Admin Modules
        </Typography>

        <Grid container spacing={3}>
          {adminModules.map((module, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <AdminCard {...module} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
