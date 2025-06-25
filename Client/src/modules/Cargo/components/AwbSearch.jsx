import React from "react";
import {
  Paper,
  Grid,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventIcon from "@mui/icons-material/Event";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const AwbSearch = ({
  airlineSearch,
  setAirlineSearch,
  customerSearch,
  setCustomerSearch,
  originSearch,
  setOriginSearch,
  destinationSearch,
  setDestinationSearch,
  selectedStatuses,
  setSelectedStatuses,
  availableStatuses,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onApplyDateFilter,
  onClearDateFilter,
  searchQuery,
  setSearchQuery,
}) => {
  const handleStatusChange = (status) => {
    setSelectedStatuses((prev) => {
      const newStatuses = { ...prev };
      if (newStatuses[status]) {
        delete newStatuses[status];
      } else {
        newStatuses[status] = true;
      }
      return newStatuses;
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Search Fields Box */}
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {/* Precision Search Fields */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Airline"
              value={airlineSearch}
              onChange={(e) => setAirlineSearch(e.target.value)}
              placeholder="Search by airline name"
              InputProps={{
                endAdornment: airlineSearch && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setAirlineSearch("")}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Customer"
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              placeholder="Search by customer name"
              InputProps={{
                endAdornment: customerSearch && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setCustomerSearch("")}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Origin"
              value={originSearch}
              onChange={(e) => setOriginSearch(e.target.value)}
              placeholder="Search by origin"
              InputProps={{
                endAdornment: originSearch && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setOriginSearch("")}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Destination"
              value={destinationSearch}
              onChange={(e) => setDestinationSearch(e.target.value)}
              placeholder="Search by destination"
              InputProps={{
                endAdornment: destinationSearch && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setDestinationSearch("")}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Universal Search */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Universal Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all fields"
              InputProps={{
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery("")}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Date Range Selectors */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="From Date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventIcon fontSize="small" color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="To Date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventAvailableIcon fontSize="small" color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={1} sx={{ height: "100%" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onApplyDateFilter}
                    startIcon={<PlayArrowIcon />}
                    sx={{ flex: 1 }}
                  >
                    Go
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={onClearDateFilter}
                    sx={{ minWidth: "40px", width: "40px", p: 0 }}
                  >
                    ✖
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Status Filters Box */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Status Filters
        </Typography>
        <FormGroup row>
          {availableStatuses.map((status) => (
            <FormControlLabel
              key={status}
              control={
                <Checkbox
                  checked={!!selectedStatuses[status]}
                  onChange={() => handleStatusChange(status)}
                  name={status}
                />
              }
              label={status}
            />
          ))}
        </FormGroup>
      </Paper>
    </Box>
  );
};

export default AwbSearch;
