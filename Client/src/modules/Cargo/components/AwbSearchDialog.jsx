import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  CircularProgress,
  TextField
} from "@mui/material";


const AwbSearchDialog = ({
  open,
  onClose,
  loading,
  tempAwbNo,
  setTempAwbNo,
  handleAwbSubmit,
}) => {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle>Enter AWB Number</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="AWB No."
                value={tempAwbNo}
                onChange={(e) => setTempAwbNo(e.target.value.toUpperCase())}
                placeholder="XXX-XXXXXXXX"
                disabled={loading}
                InputProps={{
                  endAdornment: loading && <CircularProgress size={20} />,
                }}
                helperText="Format: XXX-XXXXXXXX (e.g., 157-12345678)"
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleAwbSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search AWB"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AwbSearchDialog;
