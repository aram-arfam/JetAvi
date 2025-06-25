import React from "react";
import { Paper, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
    </Paper>
  );
};

export default SearchBar;
