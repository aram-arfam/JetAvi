import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import useAirportForm from "../hooks/useAirportForm";
import AirportForm from "../components/AirportForm";

const AddAirport = () => {
  const { formData, formErrors, formSubmitted, handleChange, handleSubmit } =
    useAirportForm();

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header Actions */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <IconButton
              color="primary"
              onClick={() => window.location.reload()}
            >
              <RefreshIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
            >
              Save Airport
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Form */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Add New Airport
        </Typography>
        <form onSubmit={handleSubmit}>
          <AirportForm
            formData={formData}
            formErrors={formErrors}
            formSubmitted={formSubmitted}
            handleChange={handleChange}
          />
        </form>
      </Paper>
    </Box>
  );
};

export default AddAirport;
