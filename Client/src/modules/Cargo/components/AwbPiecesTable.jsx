import * as React from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer, // Keep this import
  TableHead,
  TableRow,
  IconButton,
  useTheme,
  alpha,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatPieceDimensions } from "../utils/handlers.jsx"; // Assuming this path is correct

const columns = [
  // Keep align:'center' for headers if desired, but body will be centered below
  { id: "pieceNumber", label: "Piece No.", align: 'center', minWidth: 80 },
  { id: "actualWeight", label: "Actual Wt (kg)", align: 'center', minWidth: 120 },
  { id: "dimensions", label: "Dimensions (cm)", align: 'center', minWidth: 150 },
  { id: "volume", label: "Volume (cm³)", align: 'center', minWidth: 150},
  { id: "chargeableWeight", label: "Chg. Wt (kg)", align: 'center', minWidth: 120 },
  { id: "content", label: "Content", align: 'left', minWidth: 150 },
  { id: "specialHandling", label: "Special Handling", align: 'left', minWidth: 150 },
  { id: "status", label: "Status", align: 'center', minWidth: 120 },
  { id: "notes", label: "Notes", align: 'left', minWidth: 150 },
  { id: "actions", label: "Actions", align: 'center', minWidth: 80 },
];

const formatValue = (value) => value ?? '---';

export default function AwbPiecesTable({
  data = [],
  handlePieceDelete,
  filteredAndSortedPieces,
  getStatusColor,
  getSpecialHandlingColor
}) {
  const theme = useTheme();
  const displayData = filteredAndSortedPieces || data;

  const headerCellStyle = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: "bold",
    borderBottom: `1px solid ${alpha(theme.palette.primary.contrastText, 0.2)}`,
    padding: "12px 8px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const bodyCellStyle = {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: "8px 8px",
    fontSize: "0.875rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <Paper sx={{ width: "100%", border: `1px solid ${theme.palette.divider}` }} variant="outlined">
      {/* REMOVED sx prop with maxHeight from TableContainer */}
      <TableContainer>
        <Table stickyHeader aria-label="sticky pieces table" sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  sx={{ ...headerCellStyle, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData.length > 0 ? (
              displayData.map((row, rowIndex) => (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={row._id || `piece-${rowIndex}`}
                  sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }}
                >
                  {columns.map((column) => {
                    if (column.id === "actions") {
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || "center"}
                          sx={{ ...bodyCellStyle, verticalAlign: 'middle' }}
                        >
                          {handlePieceDelete && (
                            <Tooltip title="Delete Piece">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePieceDelete(row._id);
                                }}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon fontSize="small"/>
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      );
                    }

                    let value;
                    if (column.id === "dimensions") {
                      value = formatPieceDimensions(row);
                    } else if (column.id === 'actualWeight' || column.id === 'chargeableWeight') {
                      const numValue = Number(row[column.id]);
                      value = isNaN(numValue) ? '---' : numValue.toFixed(2);
                    } else if (column.id === 'volume') {
                       const numValue = Number(row[column.id]);
                       value = isNaN(numValue) ? '---' : numValue.toFixed(0);
                    }
                    else {
                      value = row[column.id];
                    }

                    let customColor = 'inherit';
                    if (column.id === "status" && getStatusColor) {
                      customColor = getStatusColor(row.status) || 'inherit';
                    } else if (column.id === "specialHandling" && getSpecialHandlingColor) {
                      customColor = getSpecialHandlingColor(row.specialHandling) || 'inherit';
                    }

                    return (
                      <TableCell
                        key={column.id}
                        align={column.align || "left"}
                        sx={{
                            ...bodyCellStyle,
                            color: customColor,
                            verticalAlign: 'middle',
                         }}
                      >
                        <Tooltip title={formatValue(value)} placement="top" arrow disableHoverListener={String(value)?.length < 15}>
                           <span>{formatValue(value)}</span>
                        </Tooltip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{ textAlign: "center", py: 4, color: "text.secondary", borderBottom: 'none' }}
                >
                  No piece data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination Removed */}
    </Paper>
  );
}

AwbPiecesTable.propTypes = {
  data: PropTypes.array,
  handlePieceDelete: PropTypes.func,
  filteredAndSortedPieces: PropTypes.array,
  getStatusColor: PropTypes.func,
  getSpecialHandlingColor: PropTypes.func,
};

AwbPiecesTable.defaultProps = {
  data: [],
};