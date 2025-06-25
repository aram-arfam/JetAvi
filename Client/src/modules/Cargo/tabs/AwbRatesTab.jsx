import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardHeader,
  CardContent,
  Tooltip,
  useTheme,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  alpha,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import PaymentIcon from '@mui/icons-material/Payment';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalculateIcon from '@mui/icons-material/Calculate';

import { cargoService } from "../services/cargoService";
import ReadonlyField from "../../../components/ReadOnlyField";

const getCurrencyIcon = (currencyCode) => {
  const iconProps = { fontSize: "small", color: "action", sx: { verticalAlign: 'bottom', mr: 0.5 } };
  switch (currencyCode?.toUpperCase()) {
    case "USD": return <AttachMoneyIcon {...iconProps} />;
    case "EUR": return <EuroSymbolIcon {...iconProps} />;
    case "GBP": return <CurrencyPoundIcon {...iconProps} />;
    case "JPY": return <CurrencyYenIcon {...iconProps} />;
    case "CNY": return <CurrencyYenIcon {...iconProps} />;
    case "AED": return <PaymentIcon {...iconProps} />;
    default: return <PaymentIcon {...iconProps} />;
  }
};

const formatCurrency = (value, defaultValue = '---') => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num.toFixed(2);
};

const rateTypes = ["Normal Rate", "Quantity Discount", "ULD Container", "Express Cargo", "Class Cargo", "Specific Commodity"];
const classifications = ["General Cargo", "Valuable Cargo", "Perishable Cargo", "Dangerous Goods", "Heavy Cargo", "Live Animals"];
const iataZones = ["WITHIN_1", "BETWEEN_1_2", "WITHIN_2", "OTHER", "WITHIN_3", "BETWEEN_2_3", "WITHIN1_3"];
const currencies = ["USD", "EUR", "GBP", "JPY", "CNY", "AED"];

const FUEL_SURCHARGE_RATE_PER_KG = 0.15;
const FIXED_SECURITY_SURCHARGE = 20.00;

const AwbRatesTab = ({ awbId, awbNo }) => {
  const theme = useTheme();
  const [awbData, setAwbData] = useState(null);
  const [isEditingTotalAmount, setIsEditingTotalAmount] = useState(false);
  const [editableTotalAmount, setEditableTotalAmount] = useState("");
  const [isSavingManualTotal, setIsSavingManualTotal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rateGenError, setRateGenError] = useState(null);
  const [isGeneratingRate, setIsGeneratingRate] = useState(false);

  const [rateGeneratorInput, setRateGeneratorInput] = useState({
    baseRatePerKg: '',
    currency: 'USD',
    rateType: rateTypes[0],
    classification: classifications[0],
    iataZone: iataZones[3],
    otherCharges: '',
  });

  const fetchData = useCallback(async (showLoading = true) => {
    if (!awbId || !awbNo) {
       setLoading(false);
       setError(null);
       setAwbData(null);
       return;
    }
    if (showLoading) setLoading(true);
    setError(null);
    setRateGenError(null);
    try {
      const awbDetailsResult = await cargoService.getAwbByNo(awbNo);

      if (awbDetailsResult?.data?.data) {
          const fetchedAwbData = awbDetailsResult.data.data;
          setAwbData(fetchedAwbData);
          setRateGeneratorInput(prev => ({
              ...prev,
              baseRatePerKg: fetchedAwbData?.rates?.baseRatePerKg || '',
              currency: fetchedAwbData?.rates?.currency || fetchedAwbData?.currency || 'USD',
              rateType: fetchedAwbData?.rates?.rateType || rateTypes[0],
              classification: fetchedAwbData?.rates?.classification || classifications[0],
              iataZone: fetchedAwbData?.rates?.iataZone || iataZones[3],
              otherCharges: fetchedAwbData?.rates?.otherCharges || 0,
          }));
          setEditableTotalAmount(fetchedAwbData?.totalAmount?.toString() ?? "0");
      } else {
          setError("No AWB data found.");
          setAwbData(null);
      }

    } catch (err) {
      console.error("Error fetching AWB details:", err);
      const errorMsg = err.response?.data?.message || err.message || "Error fetching AWB details";
      setError(errorMsg);
      setAwbData(null);
    } finally {
      setLoading(false);
    }
  }, [awbId, awbNo]);

  useEffect(() => {
    if (awbId && awbNo) {
        fetchData();
    } else {
        setLoading(false);
        setError(null);
        setAwbData(null);
    }
  }, [awbId, awbNo, fetchData]);

  const handleRateGeneratorInputChange = useCallback((field) => (event) => {
    const value = event.target.type === 'number' ? (event.target.value === '' ? '' : Number(event.target.value)) : event.target.value;
    setRateGeneratorInput(prev => ({ ...prev, [field]: value }));
    setRateGenError(null);
  }, []);

  const handleGenerateAwbRate = async () => {
    if (!awbData) {
        setRateGenError("Cannot generate rate: AWB data not loaded.");
        return;
    }

    setRateGenError(null);
    setError(null);
    setIsGeneratingRate(true);

    const baseRateKg = parseFloat(rateGeneratorInput.baseRatePerKg);
    if (isNaN(baseRateKg) || baseRateKg <= 0) {
      setRateGenError("Please enter a valid positive Base Rate per Kg.");
      setIsGeneratingRate(false);
      return;
    }
    const totalChgWeight = Number(awbData?.chargeableWeight) || 0;

    if (totalChgWeight <= 0) {
       setRateGenError("Cannot generate rate: AWB Chargeable Weight must be greater than 0. Please check AWB details.");
       setIsGeneratingRate(false);
       return;
    }

    try {
        const awbOtherCharges = Number(rateGeneratorInput.otherCharges) || 0;

        const calculatedBaseCharge = totalChgWeight * baseRateKg;
        const calculatedFuelSurcharge = totalChgWeight * FUEL_SURCHARGE_RATE_PER_KG;
        // Security surcharge might be fixed per AWB or calculated differently now
        const calculatedSecuritySurcharge = FIXED_SECURITY_SURCHARGE;
        const newTotalAmount = calculatedBaseCharge + calculatedFuelSurcharge + calculatedSecuritySurcharge + awbOtherCharges;

        const updatedAwbDataPayload = {
          totalAmount: newTotalAmount,
          rates: {
              ...(awbData.rates || {}), // Preserve existing non-calculated rate fields
              baseRatePerKg: baseRateKg,
              baseCharge: calculatedBaseCharge,
              fuelSurcharge: calculatedFuelSurcharge,
              securitySurcharge: calculatedSecuritySurcharge,
              otherCharges: awbOtherCharges,
              totalRate: newTotalAmount, // AWB total rate
              currency: rateGeneratorInput.currency,
              rateType: rateGeneratorInput.rateType,
              classification: rateGeneratorInput.classification,
              iataZone: rateGeneratorInput.iataZone,
              isManuallyAdjusted: false, // Mark AWB as auto-calculated
          }
        };

      // Use awbNo for updating
      await cargoService.updateAwb(awbNo, updatedAwbDataPayload);
      await fetchData(false);

    } catch (err) {
      console.error("Error generating/updating AWB rate:", err);
      const genErrorMessage = err.response?.data?.message || err.message || "Failed to generate or update AWB rate.";
      setRateGenError(genErrorMessage);
    } finally {
      setIsGeneratingRate(false);
    }
  };

  const handleEditToggle = () => {
    setEditableTotalAmount(awbData?.totalAmount?.toString() ?? "0");
    setIsEditingTotalAmount(true);
    setError(null);
  };

  const handleCancelEdit = () => {
    setIsEditingTotalAmount(false);
    setEditableTotalAmount(awbData?.totalAmount?.toString() ?? "0");
  };

  const handleTotalAmountChange = (event) => {
    const value = event.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setEditableTotalAmount(value);
    }
  };

  const handleSaveManualTotal = async () => {
    if (isSavingManualTotal) return;
    setIsSavingManualTotal(true);
    setError(null);
    setRateGenError(null);

    try {
      const newTotalAmount = parseFloat(editableTotalAmount);
      if (isNaN(newTotalAmount) || newTotalAmount < 0) {
        setError("Invalid total amount. Please enter a valid non-negative number.");
        setIsSavingManualTotal(false);
        return;
      }

      const updatePayload = {
          totalAmount: newTotalAmount,
          rates: {
              ...(awbData?.rates || {}),
              isManuallyAdjusted: true,
              totalRate: newTotalAmount,
          }
      };

      await cargoService.updateAwb(awbNo, updatePayload);
      setIsEditingTotalAmount(false);
      await fetchData(false);

    } catch (err) {
      console.error("Error saving manual total amount:", err);
      const saveErrorMessage = err.response?.data?.message || err.message || "Failed to save total amount.";
      setError(saveErrorMessage);
    } finally {
      setIsSavingManualTotal(false);
    }
  };

  if (!awbId || !awbNo) {
    return (
      <Box p={3}>
          <Alert severity="warning" variant="outlined">Please select an AWB.</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3} minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2, color: 'text.secondary' }}>Loading Rates...</Typography>
      </Box>
    );
  }

  if (error && !isSavingManualTotal && !isGeneratingRate) {
    return (
      <Box p={3}>
        <Alert severity="error" variant="filled" sx={{ mb: 2 }}>{error}</Alert>
        <Button onClick={() => fetchData(true)} variant="outlined" startIcon={<ErrorOutlineIcon />}>Retry</Button>
      </Box>
    );
  }

  if (!awbData) {
     return (
       <Box p={3}>
           <Alert severity="info" variant="outlined">No AWB data found for {awbNo}.</Alert>
       </Box>
     );
  }

  const currentCurrency = rateGeneratorInput.currency;
  const currentCurrencyIcon = getCurrencyIcon(currentCurrency);
  const isAwbManuallyAdjusted = awbData?.rates?.isManuallyAdjusted || false;
  const awbChargeableWeight = Number(awbData?.chargeableWeight) || 0;
  const isBusy = isGeneratingRate || isSavingManualTotal;

  return (
    <Stack spacing={3} p={2}>

        {rateGenError && (
            <Alert severity="error" variant="outlined" sx={{ mb: 0 }} onClose={() => setRateGenError(null)}>{rateGenError}</Alert>
        )}
        {error && isSavingManualTotal && (
            <Alert severity="error" variant="outlined" sx={{ mb: 0 }} onClose={() => setError(null)}>{error}</Alert>
        )}

      <Card variant="outlined" >
         <CardHeader
            avatar={<PriceChangeIcon color="secondary" />}
            title="AWB Rate Generator"
            sx={{ backgroundColor: alpha(theme.palette.secondary.main, 0.05), pb: 1 }}
         />
         <CardContent>
            <Grid container spacing={2} alignItems="flex-end">
               <Grid item xs={12} sm={6} md={2.5}>
                  <TextField
                     label="Base Rate per Kg"
                     value={rateGeneratorInput.baseRatePerKg}
                     onChange={handleRateGeneratorInputChange('baseRatePerKg')}
                     type="number"
                     fullWidth size="small" required
                     error={!!rateGenError && (!rateGeneratorInput.baseRatePerKg || parseFloat(rateGeneratorInput.baseRatePerKg) <= 0)}
                     helperText={rateGenError && (!rateGeneratorInput.baseRatePerKg || parseFloat(rateGeneratorInput.baseRatePerKg) <= 0) ? "Required positive value" : ""}
                     InputProps={{ startAdornment: <InputAdornment position="start">{getCurrencyIcon(rateGeneratorInput.currency)}</InputAdornment> }}
                     inputProps={{ step: "0.01", min: "0" }}
                     disabled={isBusy}
                  />
               </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                     label="AWB Other Charges"
                     value={rateGeneratorInput.otherCharges}
                     onChange={handleRateGeneratorInputChange('otherCharges')}
                     type="number"
                     fullWidth size="small"
                     InputProps={{ startAdornment: <InputAdornment position="start">{getCurrencyIcon(rateGeneratorInput.currency)}</InputAdornment> }}
                    
                     disabled={isBusy}
                     
                  />
               </Grid>
               <Grid item xs={12} sm={4} md={1.5}>
                 <FormControl fullWidth size="small" disabled={isBusy}>
                   <InputLabel id="g-currency-label">Currency</InputLabel>
                   <Select labelId="g-currency-label" value={rateGeneratorInput.currency} label="Currency" onChange={handleRateGeneratorInputChange('currency')}>
                     {currencies.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                   </Select>
                 </FormControl>
               </Grid>
               <Grid item xs={12} sm={4} md={2}>
                 <FormControl fullWidth size="small" disabled={isBusy}>
                   <InputLabel id="g-ratetype-label">Rate Type</InputLabel>
                   <Select labelId="g-ratetype-label" value={rateGeneratorInput.rateType} label="Rate Type" onChange={handleRateGeneratorInputChange('rateType')}>
                     {rateTypes.map((rt) => <MenuItem key={rt} value={rt}>{rt}</MenuItem>)}
                   </Select>
                 </FormControl>
               </Grid>
                <Grid item xs={12} sm={4} md={2}>
                 <FormControl fullWidth size="small" disabled={isBusy}>
                   <InputLabel id="g-class-label">Classification</InputLabel>
                   <Select labelId="g-class-label" value={rateGeneratorInput.classification} label="Classification" onChange={handleRateGeneratorInputChange('classification')}>
                     {classifications.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                   </Select>
                 </FormControl>
               </Grid>
                <Grid item xs={12} sm={4} md={2}>
                 <FormControl fullWidth size="small" disabled={isBusy}>
                   <InputLabel id="g-zone-label">IATA Zone</InputLabel>
                   <Select labelId="g-zone-label" value={rateGeneratorInput.iataZone} label="IATA Zone" onChange={handleRateGeneratorInputChange('iataZone')}>
                     {iataZones.map((z) => <MenuItem key={z} value={z}>{z}</MenuItem>)}
                   </Select>
                 </FormControl>
               </Grid>
               <Grid item xs={12}>
                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mt: 1 }}>
                     <Button
                       variant="contained" color="secondary"
                       onClick={handleGenerateAwbRate}
                       disabled={isBusy || awbChargeableWeight <= 0 || !rateGeneratorInput.baseRatePerKg || parseFloat(rateGeneratorInput.baseRatePerKg) <= 0}
                       startIcon={isGeneratingRate ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
                     >
                       {isGeneratingRate ? 'Generating...' : 'Generate & Update AWB'}
                     </Button>
                 </Box>
                 {awbChargeableWeight <= 0 && (
                     <Typography variant="caption" color="error" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                         AWB Chargeable Weight is zero. Cannot generate rate.
                     </Typography>
                  )}
               </Grid>
            </Grid>
         </CardContent>
      </Card>

      <Card variant="outlined" >
          <CardHeader
              avatar={<ReceiptLongIcon color="primary" />}
              title="AWB Final Total Amount"
              titleTypographyProps={{ variant: 'h6', fontWeight: 'medium' }}
              action={
                 !isEditingTotalAmount
                 ? ( <Tooltip title="Manually Edit AWB Total Amount">
                       <span>
                           <IconButton onClick={handleEditToggle} size="small" color="primary" disabled={isBusy}>
                               <EditIcon fontSize="small" />
                           </IconButton>
                       </span>
                     </Tooltip> )
                 : null
              }
              sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05), pb: 1 }}
          />
          <CardContent>
              <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={isEditingTotalAmount ? 7 : 12}>
                      {isEditingTotalAmount ? (
                          <TextField
                              label={`Enter Total Amount (${currentCurrency})`}
                              value={editableTotalAmount}
                              onChange={handleTotalAmountChange}
                              fullWidth variant="outlined" size="medium"
                              type="text" inputMode="decimal"
                              InputProps={{ startAdornment: <InputAdornment position="start">{currentCurrencyIcon}</InputAdornment> }}
                              sx={{ backgroundColor: alpha(theme.palette.warning.light, 0.15) }}
                              autoFocus
                             
                           />
                      ) : (
                          <ReadonlyField
                              label={`AWB Total (${currentCurrency})`}
                              value={awbData?.rates?.totalRate || 0}
                              textVariant="h5"
                              InputProps={{
                                  startAdornment: <InputAdornment position="start">{currentCurrencyIcon}</InputAdornment>,
                                  sx: { fontSize: '1.7rem' }
                              }}
                              sx={{
                                  fontWeight: 'bold',
                                  '& .MuiInputBase-input': { color: theme.palette.primary.dark },
                                  '& .MuiInputLabel-root': { fontWeight: 'medium' }
                              }}
                              tooltip={isAwbManuallyAdjusted ? "Manually set/adjusted." : "Calculated from AWB rates/charges."}
                          />
                      )}
                  </Grid>
                  {isEditingTotalAmount && (
                      <Grid item xs={12} sm={5}>
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
                              <Button
                                  variant="contained" color="primary" size="medium"
                                  onClick={handleSaveManualTotal}
                                  disabled={isBusy || editableTotalAmount === "" || editableTotalAmount === (awbData?.totalAmount?.toString() ?? "0")}
                                  startIcon={isSavingManualTotal ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} >
                                  Save Manual Total
                              </Button>
                              <Button
                                  variant="outlined" color="secondary" size="medium"
                                  onClick={handleCancelEdit} disabled={isBusy}
                                  startIcon={<CancelIcon />} >
                                  Cancel
                              </Button>
                          </Stack>
                      </Grid>
                  )}
              </Grid>
                 {isAwbManuallyAdjusted && !isEditingTotalAmount && (
                    <Alert severity="info" variant="outlined" icon={<EditIcon fontSize="inherit"/>} sx={{ alignItems: 'center', mt: 2 }}>
                       AWB Total Amount was manually set. Generating rate will override this value.
                    </Alert>
                 )}
          </CardContent>
      </Card>

      {/* AwbRatesTable (related to pieces) is removed */}

    </Stack>
  );
};

export default AwbRatesTab;