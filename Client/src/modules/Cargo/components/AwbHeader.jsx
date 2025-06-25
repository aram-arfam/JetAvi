import React from "react";
import {
  Paper,
  Grid,
  IconButton,
  Button,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import FlightIcon from "@mui/icons-material/Flight";

// Status Color Mapping
const statusColors = {
  Request: "gray",
  Waiting: "orange",
  "Not-Complete": "red",
  Planned: "blue",
  Unplanned: "purple",
  "Off-Loaded": "pink",
  Departure: "teal",
  Transit: "cyan",
  Arrival: "green",
  Forward: "lightgreen",
  POD: "yellow",
  Standby: "brown",
  Missing: "black",
  Canceled: "darkred",
};

const AwbHeader = ({ loading, awbDetails, onSave, handleRefresh }) => {
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const handleRefreshClick = () => {
    if (handleRefresh) {
      handleRefresh();
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
      }}
      elevation={3}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Refresh Button */}
        <Grid item>
          <Tooltip title="Refresh AWB Data">
            <IconButton color="primary" onClick={handleRefreshClick}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Grid>

        {/* AWB Number Display */}
        <Grid item>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h3" fontWeight="bold" color="primary.main">
              AWB No: {awbDetails?.awbNo || "N/A"}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs />

        {/* AWB Status Display */}
        <Grid item>
          <Box
            sx={{
              bgcolor: awbDetails?.status
                ? statusColors[awbDetails.status] || "gray"
                : "gray",
              color: "white",
              fontWeight: "bold",
              px: 2,
              py: 1,
              borderRadius: 2,
              textAlign: "center",
              minWidth: 100,
            }}
          >
            <Typography variant="body1">
              {awbDetails?.status || "Unknown"}
            </Typography>
          </Box>
        </Grid>

        {/* Save Button */}
        <Grid item>
          <Tooltip title="Save AWB Changes">
            <Button
              variant="contained"
              sx={{
                bgcolor: "green",
                color: "white",
                "&:hover": { bgcolor: "darkgreen" },
              }}
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={loading}
            >
              Save AWB
            </Button>
          </Tooltip>
        </Grid>

        {/* Last Saved Time */}
        {awbDetails?.updatedAt && (
          <Grid item>
            <Typography variant="caption" color="text.secondary">
              Updated:{" "}
              {new Date(awbDetails.updatedAt).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default AwbHeader;
