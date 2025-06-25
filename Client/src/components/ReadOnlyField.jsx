import React from "react";
import { TextField } from "@mui/material";

const ReadOnlyField = ({
  label,
  value,
  endAdornment,

  ...props
}) => {
  return (
    <TextField
      fullWidth
      label={label}
      value={value || ""}
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "rgba(255, 255, 255, 0.23)",
          },
          "&:hover fieldset": {
            borderColor: "primary.main",
          },
          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
          },
        },
        "& .MuiInputLabel-root": {
          color: "primary.main",
        },
        "& .MuiInputBase-input": {
          color: "text.primary",
        },
      }}
      InputProps={{
        readOnly: true,
        endAdornment: endAdornment,
        ...props.InputProps,
      }}
    />
  );
};

export default ReadOnlyField;
