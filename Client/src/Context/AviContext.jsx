import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { authService } from "../services/api";
import { CircularProgress, Box } from "@mui/material";

export const AviContext = createContext();

export const AviProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authService.verifyToken();
        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setError(error.message);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#121212",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <AviContext.Provider value={{ userData, setUserData, error, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AviContext.Provider>
  );
};

AviProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AviProvider;
