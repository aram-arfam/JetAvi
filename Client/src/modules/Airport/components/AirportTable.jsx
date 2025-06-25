import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  CheckCircle,
  Cancel,
  GroupsOutlined,
  FlightTakeoffOutlined,
  LocalShippingOutlined,
  FlagOutlined,
  DescriptionOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
  Edit
} from "@mui/icons-material";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Checkbox,
  Box,
  Chip,
  IconButton,
  Collapse,
  Typography,
  Tooltip
} from "@mui/material";

const DetailSection = ({ title, icon, children }) => (
  <Box sx={{
    flex: 1,
    minWidth: 180,
    maxWidth: 2400,
    p: 1.5,
    backgroundColor: "primary",
    borderRadius: 1,
    border: "5px solid rgba(0, 0, 0, 0.05)"
  }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      {icon}
      <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
        {title}
      </Typography>
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {children}
    </Box>
  </Box>
);

const DetailRow = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
    <Typography variant="caption" sx={{ color: "text.secondary" }}>
      {label}:
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 500, textAlign: "right" }}>
      {value || "-"}
    </Typography>
  </Box>
);

const StatusBadge = ({ status, label, isString, successValue }) => {
  const isActive = isString ? status === successValue : Boolean(status);
  
  return (
    <Box sx={{ 
      display: "flex", 
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}:
      </Typography>
      <Box sx={{
        px: 0.5,
        borderRadius: 0.5,
        backgroundColor: isActive ? "success.light" : "action.selected",
        color: isActive ? "success.dark" : "text.secondary",
        fontSize: 12,
        fontWeight: 500
      }}>
        {isString ? status : (isActive ? "Yes" : "No")}
      </Box>
    </Box>
  );
};

// Common style for sticky header cells
const headerCellStyle = {
  backgroundColor: "primary.main",
  color: "primary.contrastText",
  fontWeight: "bold",
  textAlign: "center",
  borderBottom: "none",
  padding: "16px 8px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  position: "relative",       // Needed for the pseudo-element fix
  "&::after": {              // Creates a clean edge
    content: '""',
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "1px",
    backgroundColor: "primary.main", // Matches header color
    transform: "translateX(0.5px)", // Ensures crisp edge
  },
};

// Define main columns to show in the table header
const mainColumns = [
  "ICAO",
  "IATA",
  "Name",
  "City",
  "Country",
  "Timezone",
  "Open 24H",
  "Customs",
  "Actions"
];

const AirportTable = ({
  airports,
  searchQuery,
  onEdit,
  selectedAirports,
  onSelectionChange,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [expandedRows, setExpandedRows] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const textStr = String(text);
    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (searchTerms.length === 0) return textStr;

    const pattern = searchTerms
      .map((term) => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"))
      .join("|");
    const regex = new RegExp(`(${pattern})`, "gi");
    const parts = textStr.split(regex);

    return parts.map((part, index) => {
      const isMatch = searchTerms.some((term) => part.toLowerCase() === term);
      return isMatch ? (
        <Box
          component="span"
          key={index}
          sx={{
            backgroundColor: "warning.light",
            color: "text.primary",
            fontWeight: "bold",
          }}
        >
          {part}
        </Box>
      ) : (
        part
      );
    });
  };

  const toggleSelection = (airportId) => {
    const newSelection = { ...selectedAirports };
    if (newSelection[airportId]) {
      delete newSelection[airportId];
    } else {
      newSelection[airportId] = true;
    }
    onSelectionChange(newSelection);
  };

  const toggleSelectAll = () => {
    const numSelected = Object.keys(selectedAirports).length;
    const rowCount = airports.length;

    if (numSelected === rowCount && rowCount > 0) {
      onSelectionChange({});
    } else {
      const newSelection = airports.reduce((acc, airport) => {
        acc[airport._id] = true;
        return acc;
      }, {});
      onSelectionChange(newSelection);
    }
  };

  const handleRowExpand = (airportId, event) => {
    if (event && event.target.closest('td[padding="checkbox"]')) {
      return;
    }

    setExpandedRows((prev) => ({
      ...prev,
      [airportId]: !prev[airportId],
    }));
  };

  const formatBoolean = (value) => (
    <Box component="span" sx={{ color: value ? "success.main" : "error.main" }}>
      {value ? "✓" : "✕"}
    </Box>
  );

  const paginatedAirports = airports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const hasSearchTerms = searchQuery && searchQuery.trim() !== "";

  const getSearchDisplay = () => {
    if (!hasSearchTerms) return "";
    const maxLength = 30;
    return searchQuery.length > maxLength
      ? `${searchQuery.substring(0, maxLength)}...`
      : searchQuery;
  };

  const numSelected = Object.keys(selectedAirports).length;
  const rowCount = airports.length;

  const getColumnWidth = (header) => {
    const widthMap = {
      "ICAO": "100px",
      "IATA": "80px",
      "Name": "200px",
      "City": "150px",
      "Country": "150px",
      "Timezone": "120px",
      "Open 24H": "100px",
      "Customs": "100px",
      "Actions": "80px"
    };
    return widthMap[header] || "auto";
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      {hasSearchTerms && (
        <Box
          sx={{
            p: 1,
            bgcolor: "action.selected",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search sx={{ mr: 1, color: "info.main" }} />
          <Chip
            label={`Searching for: "${getSearchDisplay()}"`}
            color="info"
            size="small"
          />
        </Box>
      )}

      <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
        <Table
          stickyHeader
          sx={{
            borderCollapse: "separate",
            borderSpacing: 0,
            tableLayout: "fixed",
            "& .MuiTableCell-root": {
              border: "none",
            },
          }}
        >
          <TableHead>
            <TableRow>
              {/* Expand/Collapse column */}
              <TableCell
                sx={{
                  ...headerCellStyle,
                  width: "50px",
                  padding: "8px",
                  borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              />

              {/* Checkbox column */}
              <TableCell
                padding="checkbox"
                sx={{
                  ...headerCellStyle,
                  borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                  width: "50px",
                  position: "sticky",
                  left: 0,
                  zIndex: 2,
                  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                  "& .MuiCheckbox-root": {
                    color: "primary.contrastText",
                    "&.Mui-checked": {
                      color: "primary.contrastText",
                    },
                  },
                }}
              >
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={toggleSelectAll}
                />
              </TableCell>

              {mainColumns.map((header, index) => (
                <TableCell
                  key={`header-${index}`}
                  sx={{
                    ...headerCellStyle,
                    width: getColumnWidth(header),
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAirports.length > 0 ? (
              paginatedAirports.map((airport) => {
                const isSelected = !!selectedAirports[airport._id];
                const isExpanded = !!expandedRows[airport._id];

                return (
                  <React.Fragment key={airport._id}>
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      selected={isSelected}
                      onClick={(event) => handleRowExpand(airport._id, event)}
                      sx={{ cursor: "pointer" }}
                    >
                      {/* Expand/Collapse button */}
                      <TableCell sx={{ padding: "0px 8px" }}>
                        <IconButton
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleRowExpand(airport._id);
                          }}
                          sx={{ color: "primary.main" }}
                        >
                          {isExpanded ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>

                      {/* Checkbox cell */}
                      <TableCell
                        padding="checkbox"
                        sx={{
                          color: "white",
                          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelection(airport._id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: "white",
                            "&.Mui-checked": {
                              color: "white",
                            },
                          }}
                        />
                      </TableCell>

                      {/* Main columns data */}
                      <TableCell sx={{ textAlign: "center" }}>
                        {highlightText(airport.icao, searchQuery)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {highlightText(airport.iata, searchQuery)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {highlightText(airport.name, searchQuery)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {highlightText(airport.city, searchQuery)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {highlightText(airport.country, searchQuery)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {highlightText(airport.timezone, searchQuery)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {formatBoolean(airport.open24)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {formatBoolean(airport.customs)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(airport);
                          }}
                          color="primary"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>

                    {/* Collapsible row for additional details */}
                    <TableRow>
                      <TableCell
                        colSpan={mainColumns.length + 2}
                        sx={{
                          padding: 0,
                          borderBottom: isExpanded
                            ? "1px solid rgba(81, 81, 81, 1)"
                            : "none",
                        }}
                      >
                        <Collapse
                          in={isExpanded}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: "rgba(30, 40, 50, 0.03)",
                              borderRadius: 2,
                              border: "1px solid rgba(0, 0, 0, 0.08)",
                            }}
                          >
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                              {/* Basic Info */}
                              <DetailSection title="Basic Info" icon={<DescriptionOutlined fontSize="small" />}>
                                <DetailRow label="ICAO" value={airport.icao} />
                                <DetailRow label="IATA" value={airport.iata} />
                                <DetailRow label="Name" value={airport.name} />
                                <DetailRow label="Operator" value={airport.operator} />
                                <DetailRow label="Tarmac" value={airport.tarmac} />
                              </DetailSection>

                              {/* Location */}
                              <DetailSection title="Location" icon={<FlightTakeoffOutlined fontSize="small" />}>
                                <DetailRow label="City" value={airport.city} />
                                <DetailRow label="Country" value={airport.country} />
                                <DetailRow label="Timezone" value={airport.timezone} />
                                <DetailRow label="Opening Hours" value={airport.openingHours} />
                                <StatusBadge status={airport.open24} label="Open 24H" />
                              </DetailSection>

                              {/* Runways */}
                              <DetailSection title="Runways" icon={<LocalShippingOutlined fontSize="small" />}>
                                {airport.runways?.length > 0 ? (
                                  airport.runways.map((runway, index) => (
                                    <DetailRow 
                                      key={index}
                                      label={`Runway ${index + 1}`}
                                      value={`${runway.lengthMeters || 'N/A'}m (${runway.surfaceType || 'N/A'})`}
                                    />
                                  ))
                                ) : (
                                  <DetailRow label="Runways" value="No data" />
                                )}
                                <DetailRow label="Max Cargo (kg)" value={airport.maxCargoWeightKg} />
                              </DetailSection>

                              {/* Facilities */}
                              <DetailSection title="Facilities" icon={<GroupsOutlined fontSize="small" />}>
                                <StatusBadge status={airport.cargoFacilities?.warehouse} label="Warehouse" />
                                <StatusBadge status={airport.cargoFacilities?.customsClearance} label="Customs Clearance" />
                                <StatusBadge status={airport.cargoFacilities?.coldStorage} label="Cold Storage" />
                                <StatusBadge status={airport.cargoFacilities?.hazmatHandling} label="Hazmat Handling" />
                              </DetailSection>

                              {/* Handling */}
                              <DetailSection title="Handling" icon={<FlagOutlined fontSize="small" />}>
                                <DetailRow label="Handling Agent" value={airport.handlingAgent?.name} />
                                <DetailRow label="Agent Contact" value={airport.handlingAgent?.contactNumber} />
                                <DetailRow label="Agent Email" value={airport.handlingAgent?.email} />
                                <StatusBadge status={airport.freightHandling?.prepaid} label="Prepaid" />
                                <StatusBadge status={airport.freightHandling?.collect} label="Collect" />
                              </DetailSection>

                              {/* Special Handling */}
                              <DetailSection title="Special Handling" icon={<FlagOutlined fontSize="small" />}>
                                <StatusBadge status={airport.specialHandling?.liveAnimals} label="Live Animals" />
                                <StatusBadge status={airport.specialHandling?.perishableGoods} label="Perishables" />
                                <StatusBadge status={airport.specialHandling?.oversizedCargo} label="Oversized" />
                              </DetailSection>

                              {/* Airlines & Routes */}
                              <DetailSection title="Airlines & Routes" icon={<FlightTakeoffOutlined fontSize="small" />}>
                                <DetailRow 
                                  label="Airlines Serviced" 
                                  value={airport.airlinesServiced?.join(", ")} 
                                />
                                <DetailRow 
                                  label="Major Routes" 
                                  value={airport.majorRoutes?.join(", ")} 
                                />
                              </DetailSection>
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={mainColumns.length + 2}
                  sx={{
                    textAlign: "center",
                    py: 4,
                    color: "text.secondary",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                      No airports found
                    </p>
                    <p style={{ fontSize: "0.9rem", color: "#666" }}>
                      Try adjusting your search criteria
                    </p>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={airports.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

AirportTable.propTypes = {
  airports: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      icao: PropTypes.string,
      iata: PropTypes.string,
      name: PropTypes.string.isRequired,
      city: PropTypes.string,
      country: PropTypes.string,
      operator: PropTypes.string,
      tarmac: PropTypes.string,
      timezone: PropTypes.string,
      openingHours: PropTypes.string,
      open24: PropTypes.bool,
      customs: PropTypes.bool,
      maxCargoWeightKg: PropTypes.number,
      runways: PropTypes.arrayOf(
        PropTypes.shape({
          lengthMeters: PropTypes.number,
          surfaceType: PropTypes.string,
        })
      ),
      cargoFacilities: PropTypes.shape({
        warehouse: PropTypes.bool,
        customsClearance: PropTypes.bool,
        coldStorage: PropTypes.bool,
        hazmatHandling: PropTypes.bool,
      }),
      handlingAgent: PropTypes.shape({
        name: PropTypes.string,
        contactNumber: PropTypes.string,
        email: PropTypes.string,
      }),
      freightHandling: PropTypes.shape({
        prepaid: PropTypes.bool,
        collect: PropTypes.bool,
      }),
      specialHandling: PropTypes.shape({
        liveAnimals: PropTypes.bool,
        perishableGoods: PropTypes.bool,
        oversizedCargo: PropTypes.bool,
      }),
      airlinesServiced: PropTypes.arrayOf(PropTypes.string),
      majorRoutes: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  searchQuery: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  selectedAirports: PropTypes.object.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};

AirportTable.defaultProps = {
  searchQuery: "",
};

export default AirportTable;