import * as React from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
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
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useTheme } from "@mui/material/styles";
import { formatPieceDimensions } from "../utils/handlers.jsx";

const columns = [
  { id: "pieceNumber", label: "Piece No.", align: 'center', minWidth: 80 },
  { id: "actualWeight", label: "Actual Wt (kg)", align: 'center', minWidth: 120 },
  { id: "chargeableWeight", label: "Chg. Wt (kg)", align: 'center', minWidth: 120 },
  { id: "dimensions", label: "Dimensions (cm)", align: 'center', minWidth: 150 },
  { id: "baseRate", label: "Base Rate", align: 'center', minWidth: 100 },
  { id: "fuelSurcharge", label: "Fuel Surcharge", align: 'center', minWidth: 100 },
  { id: "securitySurcharge", label: "Security Surcharge", align: 'center', minWidth: 100 },
  { id: "otherCharges", label: "Other Charges", align: 'center', minWidth: 100 },
  { id: "total", label: "Total", align: 'center', minWidth: 120 },
  { id: "actions", label: "Actions", align: 'center', minWidth: 80 },
];

const formatValue = (value) => value ?? '---';

const RateEditModal = ({ open, handleClose, piece, onSave, currency = "USD" }) => {
    const theme = useTheme();
    const [rates, setRates] = React.useState({
      baseRate: piece?.rates?.baseCharge || 0,
      fuelSurcharge: piece?.rates?.fuelSurcharge || 0,
      securitySurcharge: piece?.rates?.securitySurcharge || 0,
      otherCharges: piece?.rates?.otherCharges || 0,
    });
  
    React.useEffect(() => {
      if (piece) {
        setRates({
          baseRate: piece?.rates?.baseCharge || 0,
          fuelSurcharge: piece?.rates?.fuelSurcharge || 0,
          securitySurcharge: piece?.rates?.securitySurcharge || 0,
          otherCharges: piece?.rates?.otherCharges || 0,
        });
      }
    }, [piece]);
  
    const handleChange = (field) => (event) => {
      const value = event.target.value;
      setRates((prev) => ({
        ...prev,
        [field]: value === "" ? 0 : Number(value),
      }));
    };
  
    
  
    const handleSaveRates = () => {
      onSave(piece._id, {
        baseCharge: rates.baseRate,
        fuelSurcharge: rates.fuelSurcharge,
        securitySurcharge: rates.securitySurcharge,
        otherCharges: rates.otherCharges,
        total: piece?.rates?.totalRate,
      });
      handleClose();
    };
  
    if (!piece) return null;
  
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: "white" }}>
          <Box display="flex" alignItems="center">
            <AttachMoneyIcon sx={{ mr: 1 }} />
            Edit Rates for Piece #{piece.pieceNumber}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ 
                bgcolor: alpha(theme.palette.info.light, 0.1), 
                p: 2, 
                borderRadius: 1,
                mb: 2 
              }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Piece Details:
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Actual Weight: <b>{piece.actualWeight} kg</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Chargeable Weight: <b>{piece.chargeableWeight} kg</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Dimensions: <b>{formatPieceDimensions(piece)}</b>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
  
            <Grid item xs={12} md={6}>
              <TextField
                label="Base Rate"
                type="number"
                value={rates.baseRate}
                onChange={handleChange("baseRate")}
                fullWidth
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>{currency}</span>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Fuel Surcharge"
                type="number"
                value={rates.fuelSurcharge}
                onChange={handleChange("fuelSurcharge")}
                fullWidth
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>{currency}</span>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Security Surcharge"
                type="number"
                value={rates.securitySurcharge}
                onChange={handleChange("securitySurcharge")}
                fullWidth
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>{currency}</span>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Other Charges"
                type="number"
                value={rates.otherCharges}
                onChange={handleChange("otherCharges")}
                fullWidth
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>{currency}</span>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                bgcolor: alpha(theme.palette.success.light, 0.1), 
                p: 2, 
                borderRadius: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <Typography variant="subtitle1">Total Charges:</Typography>
                <Typography variant="h5" color="success.main">
                  {currency} {piece?.rates?.totalRate}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveRates}
            variant="contained"
            color="primary"
            startIcon={<AttachMoneyIcon />}
          >
            Save Rates
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default function AwbRatesTable({
  data = [],
  handleRatesSave,
  filteredAndSortedPieces,
  currency = "USD",
}) {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedPiece, setSelectedPiece] = React.useState(null);

  const displayData = filteredAndSortedPieces || data;

  const handleOpenModal = (piece) => {
    setSelectedPiece(piece);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPiece(null);
  };

  

  // Use theme styling constants from AwbPiecesTable
  const headerCellStyle = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: "bold",
    borderBottom: `1px solid ${alpha(theme.palette.primary.contrastText, 0.2)}`,
    padding: "12px 8px", // Consistent padding
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  // Base style for body cells, alignment forced to center below
  const bodyCellStyleBase = {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: "8px 8px", // Consistent padding
    fontSize: "0.875rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    verticalAlign: 'middle',
  };

  const formatCurrencyDisplay = (value) => {
    const num = Number(value);
    // Show '---' for 0 or invalid numbers in the table for clarity
    return isNaN(num) || num === 0 ? '---' : `${currency} ${num.toFixed(2)}`;
  };

  return (
    <React.Fragment>
      <Paper
        sx={{ width: "100%", border: `1px solid ${theme.palette.divider}` }} // Match Paper style
        variant="outlined" // Match Paper style
      >
        {/* Optional: Add a consistent header like in AwbPiecesTable if desired, or remove this one */}
        <Box sx={{
          p: 1.5, // Consistent padding
          backgroundColor: alpha(theme.palette.primary.main, 0.05), // Subtle theme background
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="medium" color="primary.dark">
            AWB Piece Rates
          </Typography>
        </Box>

        <TableContainer> {/* No maxHeight */}
          <Table stickyHeader aria-label="rates table" sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "center"} // Use defined align or default center
                    sx={{ ...headerCellStyle, minWidth: column.minWidth }}
                    // onClick={() => column.id !== "actions" && handleSort?.(column.id)} // Sorting handler removed
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayData.length > 0 ? (
                displayData.map((row, rowIndex) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row._id || `rate-${rowIndex}`} // Use unique ID
                      onClick={(e) => {
                         // Prevent modal opening if clicking specifically on the button inside actions cell
                         if (!e.target.closest('button')) {
                            handleOpenModal(row);
                         }
                      }}
                      sx={{
                        cursor: "pointer",
                        '&:last-child td, &:last-child th': { borderBottom: 0 }, // Remove last border
                        '&:hover': { backgroundColor: theme.palette.action.hover } // Consistent hover
                      }}
                    >
                      {columns.map((column) => {
                        // Handle Actions Column
                        if (column.id === "actions") {
                          return (
                            <TableCell
                              key={column.id}
                              align="center"
                              sx={{ ...bodyCellStyleBase }}
                            >
                              <Tooltip title="Edit Rates">
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row click
                                    handleOpenModal(row);
                                  }}
                                  color="primary"
                                  size="small" // Consistent size
                                >
                                  <EditIcon fontSize="small"/>
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          );
                        }

                        // --- Calculate Value for Display ---
                        let displayValue;
                        let rawValue; // Store raw value for tooltip if needed

                        if (column.id === "dimensions") {
                           rawValue = formatPieceDimensions(row);
                           displayValue = rawValue;
                        } else if (column.id === "total") {
                           rawValue = row.rates?.totalRate || 0;
                           displayValue = formatCurrencyDisplay(rawValue);
                        } else if (["baseRate", "fuelSurcharge", "securitySurcharge", "otherCharges"].includes(column.id)) {
                           const rateKey = column.id === "baseRate" ? "baseCharge" : column.id;
                           rawValue = row.rates?.[rateKey] || 0;
                           displayValue = formatCurrencyDisplay(rawValue);
                        } else if (column.id === 'actualWeight' || column.id === 'chargeableWeight') {
                           rawValue = row[column.id];
                           const numValue = Number(rawValue);
                           displayValue = isNaN(numValue) ? '---' : numValue.toFixed(2);
                        } else {
                           rawValue = row[column.id];
                           displayValue = formatValue(rawValue);
                        }

                        // --- Apply Styles ---
                        return (
                          <TableCell
                            key={column.id}
                            align="center" // Force center alignment
                            sx={{
                                ...bodyCellStyleBase,
                                // Optional: Add success color to total like before if desired
                                ...(column.id === 'total' && { fontWeight: 'medium', color: theme.palette.primary.dark }), // Example: Style total
                             }}
                          >
                             <Tooltip title={String(rawValue)} placement="top" arrow disableHoverListener={String(rawValue)?.length < 10}>
                               <span>{displayValue}</span>
                             </Tooltip>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
               ) : (
                 <TableRow>
                   <TableCell
                     colSpan={columns.length}
                     sx={{ textAlign: "center", py: 4, color: "text.secondary", borderBottom: 'none' }}
                   >
                     No rate data available for pieces.
                   </TableCell>
                 </TableRow>
               )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination Removed */}
      </Paper>

      <RateEditModal
        open={modalOpen}
        handleClose={handleCloseModal}
        piece={selectedPiece}
        onSave={handleRatesSave}
        currency={currency}
      />
    </React.Fragment>
  );
}

// Keep PropTypes if useful
AwbRatesTable.propTypes = {
  data: PropTypes.array,
  handleRatesSave: PropTypes.func.isRequired,
  // handleSort: PropTypes.func,
  filteredAndSortedPieces: PropTypes.array,
  currency: PropTypes.string,
};

AwbRatesTable.defaultProps = {
    data: [],
    currency: 'USD'
};