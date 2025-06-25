import React from "react";
import {
  Paper,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const AirportSearch = ({
  searchQuery,
  setSearchQuery,
  icaoSearch,
  setIcaoSearch,
  iataSearch,
  setIataSearch,
  citySearch,
  setCitySearch,
  countrySearch,
  setCountrySearch,
}) => {
  const handleClear = (setter) => {
    setter("");
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }} elevation={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="ICAO Code"
            value={icaoSearch}
            onChange={(e) => setIcaoSearch(e.target.value)}
            InputProps={{
              endAdornment: icaoSearch && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleClear(setIcaoSearch)}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            placeholder="Search by ICAO"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="IATA Code"
            value={iataSearch}
            onChange={(e) => setIataSearch(e.target.value)}
            InputProps={{
              endAdornment: iataSearch && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleClear(setIataSearch)}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            placeholder="Search by IATA"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="City"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            InputProps={{
              endAdornment: citySearch && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleClear(setCitySearch)}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            placeholder="Search by City"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Country"
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
            InputProps={{
              endAdornment: countrySearch && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleClear(setCountrySearch)}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            placeholder="Search by Country"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Universal Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleClear(setSearchQuery)}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            placeholder="Search across all fields..."
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AirportSearch;
