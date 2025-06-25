import React from "react";
import { Box, Typography } from "@mui/material";

const PageHeader = ({ title, subtitle }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 1,
          background: "linear-gradient(45deg, #EAB308, #FDE047)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  );
};

export default PageHeader;
