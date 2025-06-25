import React from "react";
import {
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
} from "@mui/material";
import { formatDateTimeForInput } from "../utils/handlers.jsx";

const AwbForm = ({
  formData,
  handleFieldChange,
  handleSubmit,
  hideSubmitButton = false,
}) => {
  // Select field configurations
  const selectFields = {
    airline: {
      label: "Select Airline",
      options: [
        "Emirates_176",
        "Qatar Airways Cargo_157",
        "Lufthansa Cargo_020",
        "Turkish Airlines Cargo_235",
        "Air France Cargo_057",
        "British Airways Cargo_125",
        "Singapore Airlines Cargo_618",
        "Cathay Pacific Cargo_160",
        "Korean Air Cargo_180",
        "Etihad Cargo_607",
      ],
      required: true,
    },
    delivery: {
      label: "Delivery Type",
      options: [
        "Airport Pickup",
        "Door-to-Door Delivery",
        "Warehouse Pickup",
        "Port-to-Port",
        "Terminal Handling",
        "Courier Service",
        "Freight Forwarder Pickup",
      ],
    },
    status: {
      label: "Status",
      options: [
        "Request",
        "Waiting",
        "Not-Complete",
        "Planned",
        "Unplanned",
        "Off-Loaded",
        "Departure",
        "Transit",
        "Arrival",
        "Forward",
        "POD",
        "Standby",
        "Missing",
        "Canceled",
      ],
    },
    customsClearance: {
      label: "Customs Clearance",
      options: ["Pending", "Cleared", "Held"],
    },
    specialHandling: {
      label: "Special Handling",
      options: ["Yes", "No", "Fragile"],
    },
    approvalStatus: {
      label: "Approval Status",
      options: ["Pending", "Approved", "Rejected"],
    },
    insurance: {
      label: "Insurance",
      options: ["Paid", "Approved", "Declined", "Expired"],
    },
    freightCharges: {
      label: "Freight Charges Type",
      options: ["Prepaid", "Collect"],
    },
  };

  // Checkbox field configurations
  const checkboxFields = [
    { name: "weightDiscrepancy", label: "Weight Discrepancy" },
    { name: "priorityShipment", label: "Priority Shipment" },
    { name: "qualityCheck", label: "Quality Check" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* Section 1: Basic AWB Information */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            1. Basic AWB Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Select Airline"
                name="airline"
                value={formData?.airline || ""}
                onChange={handleFieldChange("airline")}
                required
              >
                {selectFields.airline.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.split("_")[0]}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="AWB No"
                name="awbNo"
                value={formData?.awbNo || ""}
                readOnly
                placeholder={
                  formData?.airline
                    ? `${formData?.airline.split("_")[1]}-XXXXXXXX`
                    : "XXX-XXXXXXXX"
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Flight Number"
                name="flightNumber"
                value={formData?.flightNumber || ""}
                onChange={handleFieldChange("flightNumber")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MAWB No"
                name="mawbNo"
                value={formData?.mawbNo || ""}
                readOnly
                placeholder={
                  formData?.airline
                    ? `${formData?.airline.split("_")[1]}-XXXXXXXX`
                    : "XXX-XXXXXXXX"
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={formData?.company || ""}
                onChange={handleFieldChange("company")}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Agent/Broker"
                name="agentBroker"
                value={formData?.agentBroker || ""}
                onChange={handleFieldChange("agentBroker")}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                name="customer"
                value={formData?.customer || ""}
                onChange={handleFieldChange("customer")}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Contact"
                name="customerContactNumber"
                value={formData?.customerContactNumber || ""}
                onChange={handleFieldChange("customerContactNumber")}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formData?.status || ""}
                onChange={handleFieldChange("status")}
              >
                {selectFields.status.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Grid>

        {/* Section 2: Shipper Information */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            2. Shipper Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Shipper Name"
                name="shipperName"
                value={formData?.shipperName || ""}
                onChange={handleFieldChange("shipperName")}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Shipper Contact Number"
                name="shipperContactNumber"
                value={formData?.shipperContactNumber || ""}
                onChange={handleFieldChange("shipperContactNumber")}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Street"
                    name="shipperAddress.street"
                    value={formData?.shipperAddress?.street || ""}
                    onChange={handleFieldChange("shipperAddress.street")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="shipperAddress.city"
                    value={formData?.shipperAddress?.city || ""}
                    onChange={handleFieldChange("shipperAddress.city")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="shipperAddress.state"
                    value={formData?.shipperAddress?.state || ""}
                    onChange={handleFieldChange("shipperAddress.state")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="shipperAddress.country"
                    value={formData?.shipperAddress?.country || ""}
                    onChange={handleFieldChange("shipperAddress.country")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    name="shipperAddress.postalCode"
                    value={formData?.shipperAddress?.postalCode || ""}
                    onChange={handleFieldChange("shipperAddress.postalCode")}
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Section 3: Consignee Information */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            3. Consignee Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Consignee Name"
                name="consigneeName"
                value={formData?.consigneeName || ""}
                onChange={handleFieldChange("consigneeName")}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Consignee Contact Number"
                name="consigneeContactNumber"
                value={formData?.consigneeContactNumber || ""}
                onChange={handleFieldChange("consigneeContactNumber")}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Street"
                    name="consigneeAddress.street"
                    value={formData?.consigneeAddress?.street || ""}
                    onChange={handleFieldChange("consigneeAddress.street")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="consigneeAddress.city"
                    value={formData?.consigneeAddress?.city || ""}
                    onChange={handleFieldChange("consigneeAddress.city")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="consigneeAddress.state"
                    value={formData?.consigneeAddress?.state || ""}
                    onChange={handleFieldChange("consigneeAddress.state")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="consigneeAddress.country"
                    value={formData?.consigneeAddress?.country || ""}
                    onChange={handleFieldChange("consigneeAddress.country")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    name="consigneeAddress.postalCode"
                    value={formData?.consigneeAddress?.postalCode || ""}
                    onChange={handleFieldChange("consigneeAddress.postalCode")}
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Section 4: Cargo Details */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            4. Cargo Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Origin"
                name="origin"
                value={formData?.origin || ""}
                onChange={handleFieldChange("origin")}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Destination"
                name="destination"
                value={formData?.destination || ""}
                onChange={handleFieldChange("destination")}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Pieces"
                name="pieces"
                type="number"
                value={formData?.pieces || ""}
                onChange={handleFieldChange("pieces")}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData?.weight || ""}
                onChange={handleFieldChange("weight")}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Chargeable Weight"
                name="chargeableWeight"
                type="number"
                value={formData?.chargeableWeight || ""}
                onChange={handleFieldChange("chargeableWeight")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Volume (m³)"
                name="volume"
                type="number"
                value={formData?.volume || ""}
                onChange={handleFieldChange("volume")}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ready Date & Time"
                name="readyDate"
                type="datetime-local"
                value={formatDateTimeForInput(formData?.readyDate)}
                onChange={handleFieldChange("readyDate")}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Arrival Date & Time"
                name="arrivalDate"
                type="datetime-local"
                value={formatDateTimeForInput(formData?.arrivalDate)}
                onChange={handleFieldChange("arrivalDate")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Section 5: Customs & Insurance */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            5. Customs & Insurance Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customs Declaration"
                name="customsDeclaration"
                value={formData?.customsDeclaration || ""}
                onChange={handleFieldChange("customsDeclaration")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="HS Code"
                name="hsCode"
                value={formData?.hsCode || ""}
                onChange={handleFieldChange("hsCode")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Customs Clearance"
                name="customsClearance"
                value={formData?.customsClearance || ""}
                onChange={handleFieldChange("customsClearance")}
              >
                {selectFields.customsClearance.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Insurance Status"
                name="insurance"
                value={formData?.insurance || ""}
                onChange={handleFieldChange("insurance")}
              >
                {selectFields.insurance.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Insurance Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Policy Number"
                    name="insuranceDetails.policyNumber"
                    value={formData?.insuranceDetails?.policyNumber || ""}
                    onChange={handleFieldChange(
                      "insuranceDetails.policyNumber"
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Coverage Amount"
                    name="insuranceDetails.coverageAmount"
                    type="number"
                    value={formData?.insuranceDetails?.coverageAmount || ""}
                    onChange={handleFieldChange(
                      "insuranceDetails.coverageAmount"
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Insurance Company"
                    name="insuranceDetails.insuranceCompany"
                    value={formData?.insuranceDetails?.insuranceCompany || ""}
                    onChange={handleFieldChange(
                      "insuranceDetails.insuranceCompany"
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Policy Date"
                    name="insuranceDetails.policyDate"
                    type="datetime-local"
                    value={formatDateTimeForInput(formData?.insuranceDetails?.policyDate || "")}
                    onChange={handleFieldChange("insuranceDetails.policyDate")}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Section 6: Additional Information */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            6. Additional Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Delivery Type"
                name="delivery"
                value={formData?.delivery || ""}
                onChange={handleFieldChange("delivery")}
              >
                {selectFields.delivery.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Special Handling"
                name="specialHandling"
                value={formData?.specialHandling || ""}
                onChange={handleFieldChange("specialHandling")}
              >
                {selectFields.specialHandling.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Freight Charges Type"
                name="freightCharges"
                value={formData?.freightCharges || ""}
                onChange={handleFieldChange("freightCharges")}
                required
              >
                {selectFields.freightCharges.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Approval Status"
                name="approvalStatus"
                value={formData?.approvalStatus || ""}
                onChange={handleFieldChange("approvalStatus")}
              >
                {selectFields.approvalStatus.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <FormGroup row sx={{ gap: 2 }}>
                {checkboxFields.map(({ name, label }) => (
                  <FormControlLabel
                    key={name}
                    control={
                      <Checkbox
                        checked={formData?.[name] || false}
                        onChange={handleFieldChange(name)}
                        sx={{
                          "&.Mui-checked": {
                            color: "primary.main",
                          },
                        }}
                      />
                    }
                    label={label}
                  />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
        </Grid>

        {/* Submit button - optional */}
        {!hideSubmitButton && (
          <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                px: 6,
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              Submit
            </Button>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default AwbForm;
