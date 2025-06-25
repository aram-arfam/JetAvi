import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";

const AwbSummary = ({ formData, activeTab, onTabChange }) => {
  // Format address as string
  const formatAddress = (address) => {
    if (!address) return "Not provided";
    const parts = [
      address.street,
      address.city,
      address.state,
      address.country,
      address.postalCode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not provided";
  };

  const tabPanels = [
    // Basic Info Panel
    <Box key="basic" sx={{ p: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              AWB Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Airline"
                  secondary={
                    formData.airline
                      ? formData.airline.split("_")[0]
                      : "Not provided"
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="AWB Number"
                  secondary={formData.awbNo || "Not generated"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="MAWB Number"
                  secondary={formData.mawbNo || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Flight Number"
                  secondary={formData.flightNumber || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Company"
                  secondary={formData.company || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Customer"
                  secondary={formData.customer || "Not provided"}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Status Information
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                label={formData.status || "Request"}
                color={
                  formData.status === "Departure" ||
                  formData.status === "Arrival"
                    ? "success"
                    : "primary"
                }
                variant="filled"
              />
              <Chip
                label={formData.approvalStatus || "Pending"}
                color={
                  formData.approvalStatus === "Approved" ? "success" : "default"
                }
              />
              {formData.priorityShipment && (
                <Chip label="Priority" color="error" />
              )}
            </Stack>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Delivery Type"
                  secondary={formData.delivery || "Not specified"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Special Handling"
                  secondary={formData.specialHandling || "No"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Freight Charges"
                  secondary={formData.freightCharges || "Not specified"}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>,

    // Shipment Details Panel
    <Box key="shipment" sx={{ p: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Shipper Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Name"
                  secondary={formData.shipperName || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Contact"
                  secondary={formData.shipperContactNumber || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Address"
                  secondary={formatAddress(formData.shipperAddress)}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Consignee Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Name"
                  secondary={formData.consigneeName || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Contact"
                  secondary={formData.consigneeContactNumber || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Address"
                  secondary={formatAddress(formData.consigneeAddress)}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>,

    // Cargo Details Panel
    <Box key="cargo" sx={{ p: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Route Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Origin"
                  secondary={formData.origin || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Destination"
                  secondary={formData.destination || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Ready Date"
                  secondary={
                    formData.readyDate
                      ? new Date(formData.readyDate).toLocaleString()
                      : "Not provided"
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Arrival Date"
                  secondary={
                    formData.arrivalDate
                      ? new Date(formData.arrivalDate).toLocaleString()
                      : "Not provided"
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Cargo Specifications
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Pieces"
                  secondary={formData.pieces || "0"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Weight (kg)"
                  secondary={formData.weight || "0"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Chargeable Weight (kg)"
                  secondary={formData.chargeableWeight || "Same as weight"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Volume (m³)"
                  secondary={formData.volume || "Not provided"}
                />
              </ListItem>
              {formData.weightDiscrepancy && (
                <ListItem>
                  <Chip
                    label="Weight Discrepancy"
                    color="warning"
                    size="small"
                  />
                </ListItem>
              )}
              {formData.qualityCheck && (
                <ListItem>
                  <Chip
                    label="Quality Check Required"
                    color="info"
                    size="small"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>,

    // Customs & Insurance Panel
    <Box key="customs" sx={{ p: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Customs Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Customs Declaration"
                  secondary={formData.customsDeclaration || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="HS Code"
                  secondary={formData.hsCode || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Customs Clearance"
                  secondary={formData.customsClearance || "Pending"}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Insurance Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Insurance Status"
                  secondary={formData.insurance || "Not provided"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Policy Number"
                  secondary={
                    formData.insuranceDetails?.policyNumber || "Not provided"
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Insurance Company"
                  secondary={
                    formData.insuranceDetails?.insuranceCompany ||
                    "Not provided"
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Coverage Amount"
                  secondary={
                    formData.insuranceDetails?.coverageAmount
                      ? `$${formData.insuranceDetails.coverageAmount}`
                      : "Not provided"
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Policy Date"
                  secondary={
                    formData.insuranceDetails?.policyDate
                      ? new Date(
                          formData.insuranceDetails.policyDate
                        ).toLocaleDateString()
                      : "Not provided"
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>,
  ];

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={onTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ backgroundColor: "background.paper" }}
        >
          <Tab label="Basic Info" />
          <Tab label="Shipper/Consignee" />
          <Tab label="Cargo Details" />
          <Tab label="Customs & Insurance" />
        </Tabs>
      </Box>
      {tabPanels[activeTab]}
    </>
  );
};

export default AwbSummary;
