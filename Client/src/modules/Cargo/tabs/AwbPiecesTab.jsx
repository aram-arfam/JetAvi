import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Paper,
  Grid,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Divider,
  Card,
  CardContent,
  IconButton,
  Chip,
  Tooltip,
  useTheme,
  alpha,
  InputAdornment,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CalculateIcon from "@mui/icons-material/Calculate";
import ScaleIcon from "@mui/icons-material/Scale";

import { cargoService } from "../services/cargoService";
import SelectField from "../../../components/SelectField";
import AwbPiecesTable from "../components/AwbPiecesTable";
import ReadonlyField from "../../../components/ReadOnlyField";

import { validateDimensions, validateWeight } from "../utils/validation";
import { calculateVolume, calculateChargeableWeight, calculateTotalWeight } from "../utils/AwbUtils";

const SPECIAL_HANDLING_OPTIONS = [
  { value: "Normal", label: "Normal" },
  { value: "Fragile", label: "Fragile" },
  { value: "Perishable", label: "Perishable" },
  { value: "Dangerous", label: "Dangerous Goods" },
  { value: "Valuable", label: "Valuable" },
  { value: "Live Animals", label: "Live Animals" },
];

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Loaded", label: "Loaded" },
  { value: "Active", label: "Active" },
  { value: "Delivered", label: "Delivered" },
  { value: "Damaged", label: "Damaged" },
  { value: "Missing", label: "Missing" },
];

const AwbPiecesTab = ({ awbId }) => {
  const theme = useTheme();
  const [piecesData, setPiecesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newPiece, setNewPiece] = useState({
    pieceNo: "",
    length: "",
    width: "",
    height: "",
    actualWeight: "",
    chargeableWeight: "",
    content: "",
    specialHandling: "Normal",
    status: "Pending",
    notes: "",
    volume: "",
  });

  // Fetch pieces when awbId changes
  useEffect(() => {
    if (!awbId) {
      setError("AWB ID is required to manage pieces");
      return;
    }
    fetchPieces();

  }, [awbId]);


  const fetchPieces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!awbId) {
        throw new Error("AWB ID is required");
      }
      const response = await cargoService.getPieces(awbId);
      setPiecesData(response.data.data);
      console.log(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error fetching pieces"
      );
    } finally {
      setLoading(false);
    }
  }, [awbId]);

  const handleNewPieceChange = useCallback((field) => (event) => {
    const value = event.target.value;
    setNewPiece((prev) => {
      const updatedPiece = {
        ...prev,
        [field]: value,
      };
      return updatedPiece;
    });
  }, []);





  const handleNewPiece = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!awbId) {
        throw new Error("AWB ID is required");
      }

      // Validate required fields
      if (
        !newPiece.pieceNo ||
        !newPiece.actualWeight ||
        !newPiece.length ||
        !newPiece.width ||
        !newPiece.height
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Validate dimensions and weight
      const dimensionError = validateDimensions(
        newPiece.length,
        newPiece.width,
        newPiece.height
      );
      if (dimensionError) throw new Error(dimensionError);

      const weightError = validateWeight(newPiece.actualWeight);
      if (weightError) throw new Error(weightError);

      const pieceData = {
        pieceNo: newPiece.pieceNo,
        actualWeight: parseFloat(newPiece.actualWeight),
        chargeableWeight: parseFloat(newPiece.chargeableWeight || 0),
        length: parseFloat(newPiece.length),
        width: parseFloat(newPiece.width),
        height: parseFloat(newPiece.height),
        volume: parseFloat(newPiece.volume || 0),
        content: newPiece.content,
        specialHandling: newPiece.specialHandling,
        status: newPiece.status,
        notes: newPiece.notes,
      };

      const response = await cargoService.addPiece(awbId, pieceData);
      setPiecesData([...piecesData, response.data.data]);
      setNewPiece({
        pieceNo: "",
        length: "",
        width: "",
        height: "",
        actualWeight: "",
        chargeableWeight: "",
        content: "",
        specialHandling: "Normal",
        status: "Pending",
        notes: "",
        volume: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error adding piece"
      );
    } finally {
      setLoading(false);
    }
  }, [awbId, newPiece, piecesData, validateDimensions, validateWeight]);

  const handlePieceDelete = useCallback(async (pieceId) => {
    try {
      setLoading(true);
      setError(null);

      if (!awbId) {
        throw new Error("AWB ID is required");
      }

      await cargoService.deletePiece(awbId, pieceId);
      setPiecesData(piecesData.filter((piece) => piece._id !== pieceId));
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error deleting piece"
      );
    } finally {
      setLoading(false);
    }
  }, [awbId, piecesData]);












  if (!awbId) {
    return (
      <Box p={2}>
        <Alert severity="error" variant="filled">AWB ID is required to manage pieces</Alert>
      </Box>
    );
  }

  if (loading && piecesData.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card 
        sx={{ 
          mb: 3, 
          boxShadow: theme.shadows[3],
          borderRadius: '12px',
          overflow: 'visible'
        }} 
        elevation={3}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2, backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, borderRadius: '12px 12px 0 0' }}>
            <Typography variant="h6" fontWeight="medium">Add New Piece</Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={6} md={1.5}>
                <TextField
                  label="Piece No."
                  name="pieceNo"
                  value={newPiece.pieceNo}
                  onChange={handleNewPieceChange("pieceNo")}
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Tooltip title="Unique identifier for this piece">
                          <InfoOutlinedIcon fontSize="small" color="action" />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={1.5}>
                <TextField
                  label="Length (cm)"
                  name="length"
                  type="number"
                  value={newPiece.length}
                  onChange={handleNewPieceChange("length")}
                  required
                  fullWidth
                  inputProps={{ min: 0, max: 300 }}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={1.5}>
                <TextField
                  label="Width (cm)"
                  name="width"
                  type="number"
                  value={newPiece.width}
                  onChange={handleNewPieceChange("width")}
                  required
                  fullWidth
                  inputProps={{ min: 0, max: 300 }}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={1.5}>
                <TextField
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={newPiece.height}
                  onChange={handleNewPieceChange("height")}
                  required
                  fullWidth
                  inputProps={{ min: 0, max: 300 }}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={1.5}>
                <TextField
                  label="Actual Weight (kg)"
                  name="actualWeight"
                  type="number"
                  value={newPiece.actualWeight}
                  onChange={handleNewPieceChange("actualWeight")}
                  required
                  fullWidth
                  inputProps={{ min: 0, max: 1000 }}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ScaleIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={1.5}>
                <ReadonlyField
                  label="Volume (cm³)"
                  value={newPiece.volume || calculateVolume(
                    newPiece.length,
                    newPiece.width,
                    newPiece.height
                  )}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalculateIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={1.5}>
                <ReadonlyField
                  label="Chargeable Weight (kg)"
                  value={newPiece.chargeableWeight || calculateChargeableWeight(
                    newPiece.actualWeight,
                    newPiece.length,
                    newPiece.width,
                    newPiece.height
                  )}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ScaleIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Content"
                  name="content"
                  value={newPiece.content}
                  onChange={handleNewPieceChange("content")}
                  required
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2.5}>
                <SelectField
                  label="Special Handling"
                  name="specialHandling"
                  value={newPiece.specialHandling}
                  onChange={handleNewPieceChange("specialHandling")}
                  options={SPECIAL_HANDLING_OPTIONS}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.5}>
                <SelectField
                  label="Status"
                  name="status"
                  value={newPiece.status}
                  onChange={handleNewPieceChange("status")}
                  options={STATUS_OPTIONS}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Notes"
                  name="notes"
                  value={newPiece.notes}
                  onChange={handleNewPieceChange("notes")}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={1}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNewPiece}
                  fullWidth
                  disabled={loading}
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{ 
                    py: 1.5, 
                    boxShadow: theme.shadows[4],
                    '&:hover': {
                      boxShadow: theme.shadows[6]
                    }
                  }}
                >
                  Add Piece
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {piecesData.length > 0 && (
          <Chip
            label={`Total Weight: ${calculateTotalWeight(piecesData).toFixed(2)} kg`}
            color="primary"
            variant="filled"
            icon={<ScaleIcon />}
            sx={{ 
              fontWeight: 'bold', 
              fontSize: '1rem',
              height: 40, 
              
            }}
          />
        )}
      </Box>

      {loading && piecesData.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      <Card 
        sx={{  
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: theme.shadows[2]
        }}
      >
        <AwbPiecesTable
          data={piecesData}
          handlePieceDelete={handlePieceDelete}
   
        
        />
      </Card>
    </Box>
  );
};

export default AwbPiecesTab;