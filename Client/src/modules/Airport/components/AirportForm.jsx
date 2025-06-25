import React from "react";
import {
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  Typography,
  Divider,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const AirportForm = ({
  formData,
  formErrors,
  formSubmitted,
  handleChange,
  readOnly = false,
}) => {
  // Helper function to handle nested object field changes
  const handleNestedChange = (arrayName, index, field, value) => {
    // Make sure the array exists and has the right structure
    const newArray = [...(formData[arrayName] || [])];
    
    // Ensure the item at the index exists
    if (!newArray[index]) {
      if (arrayName === "runways") {
        newArray[index] = { lengthMeters: "", surfaceType: "" };
      } else {
        newArray[index] = "";
      }
    }
    
    // Update the field
    newArray[index] = { ...newArray[index], [field]: value };
    
    handleChange({
      target: {
        name: arrayName,
        value: newArray,
      },
    });
  };

  // Helper function to handle array field changes
  const handleArrayChange = (arrayName, index, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = value;
    handleChange({
      target: {
        name: arrayName,
        value: newArray,
      },
    });
  };

  // Helper function to add new array item
  const addArrayItem = (arrayName) => {
    // Special handling for runways which is an array of objects
    if (arrayName === "runways") {
      handleChange({
        target: {
          name: arrayName,
          value: [
            ...formData[arrayName],
            { lengthMeters: "", surfaceType: "" },
          ],
        },
      });
    } else {
      // For simple string arrays
      handleChange({
        target: {
          name: arrayName,
          value: [...formData[arrayName], ""],
        },
      });
    }
  };

  // Helper function to remove array item
  const removeArrayItem = (arrayName, index) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    handleChange({
      target: {
        name: arrayName,
        value: newArray,
      },
    });
  };

  return (
    <Grid container spacing={3}>
      {/* Basic Information Section */}
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          Basic Information
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="ICAO Code"
          name="icao"
          value={formData.icao}
          onChange={handleChange}
          required
          error={formSubmitted && (formErrors.icao || !formData.icao)}
          helperText={
            formSubmitted && (formErrors.icao || (!formData.icao && "Required"))
          }
          inputProps={{
            maxLength: 4,
            style: { textTransform: "uppercase" },
            readOnly,
          }}
          placeholder="EGLL"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="IATA Code"
          name="iata"
          value={formData.iata}
          onChange={handleChange}
          required
          error={formSubmitted && (formErrors.iata || !formData.iata)}
          helperText={
            formSubmitted && (formErrors.iata || (!formData.iata && "Required"))
          }
          inputProps={{
            maxLength: 3,
            style: { textTransform: "uppercase" },
            readOnly,
          }}
          placeholder="LHR"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Airport Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          error={formSubmitted && (formErrors.name || !formData.name)}
          helperText={
            formSubmitted && (formErrors.name || (!formData.name && "Required"))
          }
          placeholder="London Heathrow Airport"
          inputProps={{ readOnly }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          error={formSubmitted && (formErrors.city || !formData.city)}
          helperText={
            formSubmitted && (formErrors.city || (!formData.city && "Required"))
          }
          placeholder="London"
          inputProps={{ readOnly }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          error={formSubmitted && (formErrors.country || !formData.country)}
          helperText={
            formSubmitted &&
            (formErrors.country || (!formData.country && "Required"))
          }
          placeholder="United Kingdom"
          inputProps={{ readOnly }}
        />
      </Grid>

      {/* Time and Operations Section */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          Time and Operations
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Timezone"
          name="timezone"
          value={formData.timezone}
          onChange={handleChange}
          required
          error={formSubmitted && (formErrors.timezone || !formData.timezone)}
          helperText={
            formSubmitted &&
            (formErrors.timezone || (!formData.timezone && "Required"))
          }
          placeholder="Europe/London"
          inputProps={{ readOnly }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Opening Hours"
          name="openingHours"
          value={formData.openingHours}
          onChange={handleChange}
          required
          error={
            formSubmitted && (formErrors.openingHours || !formData.openingHours)
          }
          helperText={
            formSubmitted &&
            (formErrors.openingHours || (!formData.openingHours && "Required"))
          }
          placeholder="24/7"
          inputProps={{ readOnly }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.open24}
              onChange={handleChange}
              name="open24"
              disabled={readOnly}
            />
          }
          label="Open 24 Hours"
        />
      </Grid>

      {/* Infrastructure Section */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          Infrastructure
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Operator"
          name="operator"
          value={formData.operator}
          onChange={handleChange}
          placeholder="Heathrow Airport Holdings"
          inputProps={{ readOnly }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Tarmac Type"
          name="tarmac"
          value={formData.tarmac}
          onChange={handleChange}
          placeholder="Asphalt"
          inputProps={{ readOnly }}
        />
      </Grid>

      {/* Runways Section */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Runways
        </Typography>
        {formData.runways.map((runway, index) => (
          <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Length (meters)"
              name={`runways[${index}].lengthMeters`}
              value={runway.lengthMeters}
              onChange={(e) =>
                handleNestedChange(
                  "runways",
                  index,
                  "lengthMeters",
                  e.target.value
                )
              }
              type="number"
              error={
                formSubmitted && formErrors[`runways.${index}.lengthMeters`]
              }
              helperText={
                formSubmitted && formErrors[`runways.${index}.lengthMeters`]
              }
              inputProps={{ readOnly }}
            />
            <TextField
              fullWidth
              label="Surface Type"
              name={`runways[${index}].surfaceType`}
              value={runway.surfaceType}
              onChange={(e) =>
                handleNestedChange(
                  "runways",
                  index,
                  "surfaceType",
                  e.target.value
                )
              }
              placeholder="Asphalt"
              inputProps={{ readOnly }}
            />
            {!readOnly && (
              <IconButton
                color="error"
                onClick={() => removeArrayItem("runways", index)}
                disabled={formData.runways.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
        {!readOnly && (
          <Button
            startIcon={<AddIcon />}
            onClick={() => addArrayItem("runways")}
            sx={{ mt: 1 }}
          >
            Add Runway
          </Button>
        )}
      </Grid>

      {/* Cargo Facilities Section */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          Cargo Facilities
        </Typography>
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.cargoFacilities.warehouse}
              onChange={handleChange}
              name="cargoFacilities.warehouse"
              disabled={readOnly}
            />
          }
          label="Warehouse"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.cargoFacilities.customsClearance}
              onChange={handleChange}
              name="cargoFacilities.customsClearance"
              disabled={readOnly}
            />
          }
          label="Customs Clearance"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.cargoFacilities.coldStorage}
              onChange={handleChange}
              name="cargoFacilities.coldStorage"
              disabled={readOnly}
            />
          }
          label="Cold Storage"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.cargoFacilities.hazmatHandling}
              onChange={handleChange}
              name="cargoFacilities.hazmatHandling"
              disabled={readOnly}
            />
          }
          label="Hazmat Handling"
        />
      </Grid>

      {/* Handling Agent Section */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          Handling Agent
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Name"
          name="handlingAgent.name"
          value={formData.handlingAgent.name}
          onChange={handleChange}
          inputProps={{ readOnly }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Contact Number"
          name="handlingAgent.contactNumber"
          value={formData.handlingAgent.contactNumber}
          onChange={handleChange}
          inputProps={{ readOnly }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Email"
          name="handlingAgent.email"
          value={formData.handlingAgent.email}
          onChange={handleChange}
          error={formSubmitted && formErrors["handlingAgent.email"]}
          helperText={formSubmitted && formErrors["handlingAgent.email"]}
          inputProps={{ readOnly }}
        />
      </Grid>

      {/* Freight Handling Section */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          Freight Handling
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.freightHandling.prepaid}
              onChange={handleChange}
              name="freightHandling.prepaid"
              disabled={readOnly}
            />
          }
          label="Prepaid"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.freightHandling.collect}
              onChange={handleChange}
              name="freightHandling.collect"
              disabled={readOnly}
            />
          }
          label="Collect"
        />
      </Grid>

      {/* Special Handling Section */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          Special Handling
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.specialHandling.liveAnimals}
              onChange={handleChange}
              name="specialHandling.liveAnimals"
              disabled={readOnly}
            />
          }
          label="Live Animals"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.specialHandling.perishableGoods}
              onChange={handleChange}
              name="specialHandling.perishableGoods"
              disabled={readOnly}
            />
          }
          label="Perishable Goods"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.specialHandling.oversizedCargo}
              onChange={handleChange}
              name="specialHandling.oversizedCargo"
              disabled={readOnly}
            />
          }
          label="Oversized Cargo"
        />
      </Grid>

      {/* Capacity and Operations Section */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          Capacity and Operations
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Max Cargo Weight (kg)"
          name="maxCargoWeightKg"
          value={formData.maxCargoWeightKg}
          onChange={handleChange}
          required
          type="number"
          error={
            formSubmitted &&
            (formErrors.maxCargoWeightKg || !formData.maxCargoWeightKg)
          }
          helperText={
            formSubmitted &&
            (formErrors.maxCargoWeightKg ||
              (!formData.maxCargoWeightKg && "Required"))
          }
          inputProps={{ readOnly }}
        />
      </Grid>

      {/* Airlines Serviced Section */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Airlines Serviced
        </Typography>
        {formData.airlinesServiced.map((airline, index) => (
          <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label={`Airline ${index + 1}`}
              value={airline}
              onChange={(e) =>
                handleArrayChange("airlinesServiced", index, e.target.value)
              }
              inputProps={{ readOnly }}
            />
            {!readOnly && (
              <IconButton
                color="error"
                onClick={() => removeArrayItem("airlinesServiced", index)}
                disabled={formData.airlinesServiced.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
        {!readOnly && (
          <Button
            startIcon={<AddIcon />}
            onClick={() => addArrayItem("airlinesServiced")}
            sx={{ mt: 1 }}
          >
            Add Airline
          </Button>
        )}
      </Grid>

      {/* Major Routes Section */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Major Routes
        </Typography>
        {formData.majorRoutes.map((route, index) => (
          <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label={`Route ${index + 1}`}
              value={route}
              onChange={(e) =>
                handleArrayChange("majorRoutes", index, e.target.value)
              }
              placeholder="DXB-JFK"
              inputProps={{ readOnly }}
            />
            {!readOnly && (
              <IconButton
                color="error"
                onClick={() => removeArrayItem("majorRoutes", index)}
                disabled={formData.majorRoutes.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
        {!readOnly && (
          <Button
            startIcon={<AddIcon />}
            onClick={() => addArrayItem("majorRoutes")}
            sx={{ mt: 1 }}
          >
            Add Route
          </Button>
        )}
      </Grid>

      {/* Customs Section */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          Customs and Regulations
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.customs}
              onChange={handleChange}
              name="customs"
              disabled={readOnly}
            />
          }
          label="Customs Available"
        />
      </Grid>
    </Grid>
  );
};

export default AirportForm;
