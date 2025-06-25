import * as React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  alpha,
  Divider,     // Added Divider
  Stack,       // Added Stack
  InputAdornment // Added InputAdornment
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PriceChangeIcon from '@mui/icons-material/PriceChange'; // Added for Generator
import { useTheme } from "@mui/material/styles";
import { formatPieceDimensions } from "../utils/handlers.jsx"; // Ensure path is correct

// Helper to get numeric value (treat empty string as 0)
const getNumericRate = (value) => (value === '' || value === null || value === undefined ? 0 : Number(value));

// Helper to format display value (show empty if 0 or null/undefined)
const formatDisplayValue = (value) => (value === 0 || value === null || value === undefined ? '' : value);

const RateEditModal = ({ open, handleClose, piece, onSave, currency = "USD" }) => {
  const theme = useTheme();

  // State for the primary rate fields (stores strings to allow easy input)
  const [rates, setRates] = React.useState({
    baseRate: '',
    fuelSurcharge: '',
    securitySurcharge: '',
    otherCharges: '',
  });

  // State for the optional piece-level base rate generator input
  const [modalBaseRateKg, setModalBaseRateKg] = React.useState('');

  // Effect to populate state when the piece prop changes
  React.useEffect(() => {
    if (piece && piece.rates) {
      setRates({
        baseRate: formatDisplayValue(piece.rates.baseCharge),
        fuelSurcharge: formatDisplayValue(piece.rates.fuelSurcharge),
        securitySurcharge: formatDisplayValue(piece.rates.securitySurcharge),
        otherCharges: formatDisplayValue(piece.rates.otherCharges),
      });
      // Optionally pre-fill base rate per kg if available
      setModalBaseRateKg(formatDisplayValue(piece.rates.baseRatePerKg));
    } else {
      // Reset if no piece or no rates
      setRates({ baseRate: '', fuelSurcharge: '', securitySurcharge: '', otherCharges: '' });
      setModalBaseRateKg('');
    }
  }, [piece]); // Depend only on piece

  // Handles changes in the main rate input fields
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    // Allow empty string, numbers, and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setRates((prev) => ({
        ...prev,
        [field]: value, // Store the raw string value
      }));
    }
  };

  // Handles changes in the optional base rate per kg input
  const handleBaseRateKgChange = (event) => {
      const value = event.target.value;
      if (/^\d*\.?\d*$/.test(value)) {
         setModalBaseRateKg(value);
      }
  };

  // Calculates the total based on current state values
  const calculateTotal = () => {
    return (
      getNumericRate(rates.baseRate) +
      getNumericRate(rates.fuelSurcharge) +
      getNumericRate(rates.securitySurcharge) +
      getNumericRate(rates.otherCharges)
    );
  };

  // Generates the Base Rate field based on the modal's Base Rate/Kg input
  const handleGeneratePieceBaseRate = () => {
      const baseKg = getNumericRate(modalBaseRateKg);
      const chgWt = getNumericRate(piece?.chargeableWeight);

      if (baseKg > 0 && chgWt > 0) {
          const calculatedBaseRate = (baseKg * chgWt).toFixed(2); // Calculate and format
          setRates(prev => ({
              ...prev,
              baseRate: calculatedBaseRate // Update the baseRate field state
          }));
      } else {
          // Maybe show an error or notification?
          console.warn("Cannot generate base rate: Base Rate/Kg or Chargeable Weight is missing or zero.");
          // Optionally clear the base rate field if generation fails?
          // setRates(prev => ({ ...prev, baseRate: '' }));
      }
  };

  // Calls the onSave prop with formatted data
  const handleSaveRates = () => {
    if (!piece?._id) return; // Guard clause

    // Pass numeric values to the parent save handler
    onSave(piece._id, {
      baseCharge: getNumericRate(rates.baseRate),
      fuelSurcharge: getNumericRate(rates.fuelSurcharge),
      securitySurcharge: getNumericRate(rates.securitySurcharge),
      otherCharges: getNumericRate(rates.otherCharges),
      // Optionally include baseRatePerKg if you modified it
      baseRatePerKg: getNumericRate(modalBaseRateKg) // Send the numeric value
      // Total is usually derived, not saved directly
    });
    handleClose(); // Close modal after calling save
  };

  // Don't render if no piece data is available
  if (!piece) return null;

  const pieceChargeableWeight = getNumericRate(piece.chargeableWeight);

  return (
    // Adjusted maxWidth and removed fullWidth for potentially better scaling
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, py: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AttachMoneyIcon />
          <Typography variant="h6">Edit Rates for Piece #{piece.pieceNumber}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: '20px !important' }}> {/* MUI override */}
        {/* Piece Details Section */}
        <Box sx={{
            bgcolor: alpha(theme.palette.grey[200], 0.5),
            p: 1.5, borderRadius: 1, border: `1px solid ${theme.palette.divider}`, mb: 2
        }}>
            <Typography variant="body2" fontWeight="medium" color="text.secondary" gutterBottom>
                Piece Details:
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.5, sm: 2 }} justifyContent="space-around">
                <Typography variant="caption" color="text.secondary">
                    Actual Wt: <b>{formatValue(piece.actualWeight)} kg</b>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Chargeable Wt: <b>{formatValue(piece.chargeableWeight)} kg</b>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Dimensions: <b>{formatPieceDimensions(piece)}</b>
                </Typography>
            </Stack>
        </Box>

        {/* Optional Piece-Level Base Rate Generator */}
        <Box sx={{ mb: 2, p: 1.5, border: `1px dashed ${theme.palette.divider}`, borderRadius: 1 }}>
           <Grid container spacing={1} alignItems="flex-end">
              <Grid item xs={12} sm={7}>
                 <TextField
                    label="Base Rate per Kg (Optional)"
                    type="number"
                    value={modalBaseRateKg}
                    onChange={handleBaseRateKgChange}
                    fullWidth
                    size="small"
                    InputProps={{
                       startAdornment: <InputAdornment position="start"><Typography variant="body2" color="text.secondary">{currency}</Typography></InputAdornment>,
                    }}
                    inputProps={{ step: "0.01" }}
                 />
              </Grid>
              <Grid item xs={12} sm={5}>
                 <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    fullWidth
                    onClick={handleGeneratePieceBaseRate}
                    disabled={!modalBaseRateKg || pieceChargeableWeight <= 0}
                    startIcon={<PriceChangeIcon />}
                 >
                    Generate Base Rate
                 </Button>
              </Grid>
              {pieceChargeableWeight <= 0 && !modalBaseRateKg && (
                  <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" sx={{textAlign: 'center', display: 'block'}}>
                          (Enter Base Rate/Kg and ensure piece has Chargeable Wt 0 to generate)
                      </Typography>
                  </Grid>
              )}
           </Grid>
        </Box>

        <Divider sx={{ my: 2 }}><Chip label="Rate Components" size="small" /></Divider>

        {/* Main Rate Fields */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Base Rate"
              type="number"
              value={rates.baseRate} // Bind to state (string)
              onChange={handleChange("baseRate")}
              fullWidth
              size="small"
              required // Indicate it's usually required
              InputProps={{
                startAdornment: <InputAdornment position="start"><Typography variant="body2" color="text.secondary">{currency}</Typography></InputAdornment>,
              }}
              inputProps={{ step: "0.01" }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Fuel Surcharge"
              type="number"
              value={rates.fuelSurcharge}
              onChange={handleChange("fuelSurcharge")}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start"><Typography variant="body2" color="text.secondary">{currency}</Typography></InputAdornment>,
              }}
              inputProps={{ step: "0.01" }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Security Surcharge"
              type="number"
              value={rates.securitySurcharge}
              onChange={handleChange("securitySurcharge")}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start"><Typography variant="body2" color="text.secondary">{currency}</Typography></InputAdornment>,
              }}
              inputProps={{ step: "0.01" }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Other Charges"
              type="number"
              value={rates.otherCharges}
              onChange={handleChange("otherCharges")}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start"><Typography variant="body2" color="text.secondary">{currency}</Typography></InputAdornment>,
              }}
              inputProps={{ step: "0.01" }}
            />
          </Grid>

          {/* Total Display */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Box sx={{
              p: 1.5, borderRadius: 1, display: "flex", justifyContent: "flex-end", alignItems: "center"
            }}>
              <Typography variant="body1" fontWeight="medium" sx={{ mr: 1 }}>Total Piece Charges:</Typography>
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                {currency} {calculateTotal().toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={handleClose} color="inherit" size="small">
          Cancel
        </Button>
        <Button
          onClick={handleSaveRates}
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AttachMoneyIcon />}
        >
          Save Piece Rates
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Keep PropTypes if needed
RateEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  piece: PropTypes.object, // Piece can be null initially
  onSave: PropTypes.func.isRequired,
  currency: PropTypes.string,
};


export default RateEditModal; // Assuming this is defined within AwbRatesTable file or imported separately