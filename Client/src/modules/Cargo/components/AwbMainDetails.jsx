import React from "react";
import { Paper, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import SelectField from "../../../components/SelectField";
import ReadOnlyField from "../../../components/ReadOnlyField";

const AwbMainDetails = ({
  loading,
  awbDetails = {},
  handleAwbDetailsChange,
  statusOptions,
}) => {
  if (loading || !awbDetails) {
    return (
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
      <Grid container spacing={3}> 
        <Grid item xs={12} md={3}>
          <ReadOnlyField
            label="Airline"
            value={awbDetails?.airline ? awbDetails.airline.split("_")[0] : ""}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <ReadOnlyField
            label="AWB No."
            value={awbDetails?.awbNo || ""}
            endAdornment={loading && <CircularProgress size={20} />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <ReadOnlyField
            label="Customer"
            name="customer"
            value={awbDetails?.customer || ""}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <ReadOnlyField
            label="Agent/Broker"
            name="agentBroker"
            value={awbDetails?.agentBroker || ""}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={2}>
          <ReadOnlyField
            label="Origin"
            name="origin"
            value={awbDetails?.origin || ""}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <ReadOnlyField
            label="Destination"
            name="destination"
            value={awbDetails?.destination || ""}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <ReadOnlyField
            label="Pieces"
            name="pieces"
            value={awbDetails?.pieces || "0"}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <ReadOnlyField
            label="Weight (kg)"
            name="weight"
            value={awbDetails?.weight || "0"}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <ReadOnlyField
            label="Volume (m³)"
            name="volume"
            value={awbDetails?.volume || "0"}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <ReadOnlyField
            label="MAWB No."
            name="mawbNo"
            value={awbDetails?.mawbNo || ""}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <SelectField
            label="Status"
            name="status"
            value={awbDetails?.status || ""}
            onChange={handleAwbDetailsChange("status")}
            options={statusOptions.map((status) => ({
              label: status,
              value: status,
            }))}
            disabled={loading}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AwbMainDetails;
