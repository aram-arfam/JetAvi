import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AviContext } from "../Context/AviContext";
import { authService } from "../services/api";
import { toast } from "react-toastify";
import { Box, CircularProgress, Typography } from "@mui/material";

const ProtectedRoute = () => {
  const { userData, setUserData } = useContext(AviContext);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.verifyToken();
        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          setUserData(null);
          toast.error("Please log in");
        }
      } catch (error) {
        setUserData(null);
        console.error("Authentication error:", error);
        toast.error("Please log in");
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [setUserData]);

  if (isChecking) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          bgcolor: "background.default",
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body1" color="text.secondary">
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  return userData ? <Outlet /> : <Navigate to="/landing" />;
};

export default ProtectedRoute;
