import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import { Add as AddIcon, Storage as StorageIcon } from "@mui/icons-material";

const MotionCard = motion.create(Card);

const modules = [
  {
    name: "Add Airport",
    path: "/airport-management/add-airport",
    description: "Add new airports to the system",
    icon: AddIcon,
    color: "#EAB308", // Yellow
  },
  {
    name: "Airport Database",
    path: "/airport-management/airport-database",
    description: "View and manage airport records",
    icon: StorageIcon,
    color: "#3B82F6", // Blue
  },
];

export default function AirportMgmt() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: "linear-gradient(45deg, #EAB308, #FDE047)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Airport Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your airport operations efficiently
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Grid item xs={12} md={6} key={index}>
                <MotionCard
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    height: "100%",
                    background: `linear-gradient(135deg, ${module.color}10 0%, ${module.color}20 100%)`,
                    border: `1px solid ${module.color}30`,
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: `0 8px 24px ${module.color}40`,
                      border: `1px solid ${module.color}50`,
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(module.path)}
                    sx={{ height: "100%", p: 3 }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: `${module.color}20`,
                          color: module.color,
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <Icon sx={{ fontSize: 40 }} />
                      </Box>
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                        }}
                      >
                        {module.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {module.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </MotionCard>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
