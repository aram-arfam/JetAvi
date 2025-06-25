import React, { useEffect, useState } from "react";
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
  Search
} from "@mui/icons-material";

import {
  formatDateTimeForDisplay,
  highlightText,
  handlePaginationChange,
  handleRowsPerPageChange,
  handleAwbSelection,
  handleAwbSelectAll,
  formatAirlineName,
} from "../utils/handlers.jsx";

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


import { useRef } from 'react';

const CompactAddress = ({ label, address }) => {
  const textRef = useRef(null);
  const [isOverflowed, setIsOverflowed] = useState(false);
  const addressStr = [
    address?.street,
    address?.city,
    address?.state,
    address?.postalCode,
    address?.country
  ].filter(Boolean).join(', ');

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowed(
        textRef.current.scrollWidth > textRef.current.clientWidth
      );
    }
  }, [addressStr]);

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}:
      </Typography>
      
      <Tooltip 
        title={addressStr || "No address specified"} 
        arrow
        disableHoverListener={!isOverflowed} // Only show tooltip if text is truncated
      >
        <Typography 
          ref={textRef}
          variant="body2" 
          sx={{ 
            fontWeight: 500, 
            textAlign: "right",
            maxWidth: '60%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: isOverflowed ? 'pointer' : 'default'
          }}
        >
          {addressStr || "-"}
        </Typography>
      </Tooltip>
    </Box>
  );
};


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
};

// Define which columns to show in main table vs. collapsed section
const mainColumns = [
  "AWB No",
  "Airline",
  "Origin",
  "Destination",
  "Customer",
  "Status",
  "Pieces",
  "Weight",
  "Ready Date",
  "Arrival Date",
];

const AwbTable = ({ data, searchQuery, selectedAWBs, onSelectionChange }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [expandedRows, setExpandedRows] = useState({});

  // Function to format address object into a readable string
  const formatAddress = (address) => {
    if (!address) return "N/A";

    // Check if address is an object with expected properties
    if (typeof address !== "object") return address;

    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.postalCode) parts.push(address.postalCode);
    if (address.country) parts.push(address.country);

    return parts.join(", ");
  };

  // Reset to first page when search query changes
  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  // Calculate paginated data
  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Check if there are search terms to display
  const hasSearchTerms = searchQuery && searchQuery.trim() !== "";

  // Format search terms for display in chip
  const getSearchDisplay = () => {
    if (!hasSearchTerms) return "";

    // If search query is too long, truncate it
    const maxLength = 30;
    if (searchQuery.length > maxLength) {
      return `${searchQuery.substring(0, maxLength)}...`;
    }
    return searchQuery;
  };

  // Toggle row expansion
  const handleRowExpand = (awbNo, event) => {
    // Prevent expansion when clicking on the checkbox
    if (event && event.target.closest('td[padding="checkbox"]')) {
      return;
    }

    setExpandedRows((prev) => ({
      ...prev,
      [awbNo]: !prev[awbNo],
    }));
  };

  // Get column width based on header name
  const getColumnWidth = (header) => {
    const widthMap = {
      Airline: "200px",
      Origin: "150px",
      Destination: "150px",
      Status: "120px",
      Pieces: "80px",
      Weight: "100px",
      ReadyDate: "150px",
      ArrivalDate: "150px",
      AWBNo: "120px",
    };

    return widthMap[header] || "auto";
  };

  const formatStatusWithIcon = (status, label) => {
    return (
      <Tooltip title={status ? "Yes" : "No"}>
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <strong>{label}:</strong>
          {status ? (
            <CheckCircle color="success" fontSize="small" />
          ) : (
            <Cancel color="error" fontSize="small" />
          )}
        </span>
      </Tooltip>
    );
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
                  indeterminate={
                    Object.keys(selectedAWBs).length > 0 &&
                    Object.keys(selectedAWBs).length < data.length
                  }
                  checked={
                    data.length > 0 &&
                    data.every((awb) => selectedAWBs[awb.awbNo])
                  }
                  onChange={handleAwbSelectAll(
                    data,
                    selectedAWBs,
                    onSelectionChange
                  )}
                />
              </TableCell>

              {/* Only show main columns in the header */}
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
            {paginatedData.length > 0 ? (
              paginatedData.map((awb) => (
                <React.Fragment key={awb.awbNo}>
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    selected={!!selectedAWBs[awb.awbNo]}
                    onClick={(event) => handleRowExpand(awb.awbNo, event)}
                    sx={{ cursor: "pointer" }}
                  >
                    {/* Expand/Collapse button */}
                    <TableCell sx={{ padding: "0px 8px" }}>
                      <IconButton
                        size="small"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRowExpand(awb.awbNo);
                        }}
                        sx={{ color: "primary.main" }}
                      >
                        {expandedRows[awb.awbNo] ? (
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
                        checked={!!selectedAWBs[awb.awbNo]}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleAwbSelection(
                            selectedAWBs,
                            onSelectionChange
                          )(awb.awbNo);
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

                    {/* Display only main columns in the regular row */}
                    {[
                      awb.awbNo,
                      formatAirlineName(awb.airline),
                      awb.origin,
                      awb.destination,
                      awb.customer,
                      awb.status,
                      awb.pieces,
                      awb.weight,
                      formatDateTimeForDisplay(awb.readyDate),
                      formatDateTimeForDisplay(awb.arrivalDate),
                    ].map((value, index) => (
                      <TableCell
                        key={`${awb.awbNo}-main-${index}`}
                        sx={{
                          textAlign: "center",
                          borderRight: "none",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: getColumnWidth(mainColumns[index]),
                        }}
                      >
                        {highlightText(value, searchQuery)}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Collapsible row for additional details */}
                  <TableRow>
                    <TableCell
                      colSpan={mainColumns.length + 2}
                      sx={{
                        padding: 0,
                        borderBottom: expandedRows[awb.awbNo]
                          ? "1px solid rgba(81, 81, 81, 1)"
                          : "none",
                      }}
                    >
                      <Collapse
                        in={expandedRows[awb.awbNo]}
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
    {/* Column 1 */}
    <DetailSection title="Basic Info" icon={<DescriptionOutlined fontSize="small" />}>
      <DetailRow label="MAWB" value={awb.mawbNo} />
      <DetailRow label="AWB" value={awb.awbNo} />
      <DetailRow label="Flight" value={awb.flightNumber} />
      <DetailRow label="Airline" value={awb.airline} />
      <DetailRow label="Status" value={awb.status} />
      <DetailRow label="Total Rate" value={awb.rates.totalRate} />
      <DetailRow label="Rate Type" value={awb.rates.rateType} />
      <DetailRow label="Classification" value={awb.rates.classification} />
      <DetailRow label="IATA Zone" value={awb.rates.iataZone} />
      <DetailRow label="Currency" value={awb.rates.currency} />
    </DetailSection>

    {/* Column 2 */}
    <DetailSection title="Route" icon={<FlightTakeoffOutlined fontSize="small" />}>
      <DetailRow label="Origin" value={awb.origin} />
      <DetailRow label="Destination" value={awb.destination} />
      <DetailRow label="Delivery" value={awb.delivery} />
      <DetailRow label="Ready Date" value={formatDateTimeForDisplay(awb.readyDate)} />
      <DetailRow label="Arrival Date" value={formatDateTimeForDisplay(awb.arrivalDate)} />
    </DetailSection>

    {/* Column 3 */}
    <DetailSection title="Cargo" icon={<LocalShippingOutlined fontSize="small" />}>
      <DetailRow label="Pieces" value={awb.pieces} />
      <DetailRow label="Weight" value={`${awb.weight} kg`} />
      <DetailRow label="Vol." value={`${awb.volume} m³`} />
      <DetailRow label="Ch. Weight" value={`${awb.chargeableWeight} kg`} />
      <DetailRow label="HS Code" value={awb.hsCode} />
      <DetailRow label="Insurance" value={awb.insurance} />
      <DetailRow 
    label="Policy Number" 
    value={awb.insuranceDetails?.policyNumber} 
  />
  <DetailRow 
    label="Coverage Amount" 
    value={awb.insuranceDetails?.coverageAmount ? `$${awb.insuranceDetails.coverageAmount.toLocaleString()}` : null} 
  />
  <DetailRow 
    label="Insurance Company" 
    value={awb.insuranceDetails?.insuranceCompany} 
  />
  <DetailRow 
    label="Policy Date" 
    value={awb.insuranceDetails?.policyDate ? formatDateTimeForDisplay(awb.insuranceDetails.policyDate) : null} 
  />
    </DetailSection>

    {/* Column 4 */}
    <DetailSection title="Parties" icon={<GroupsOutlined fontSize="small" />}>
      <DetailRow label="Customer" value={awb.customer} />
      <DetailRow label="Company" value={awb.company} />
      <DetailRow label="Agent/Broker" value={awb.agentBroker} />
      <DetailRow label="Shipper Name" value={awb.shipperName} />
      <DetailRow label="Shipper Contact Number" value={awb.shipperContactNumber} />
      <DetailRow label="Consignee Name" value={awb.consigneeName} />
      <DetailRow label="Consignee Contact Number" value={awb.consigneeContactNumber} />
      <CompactAddress label="Shipper Address" address={awb.shipperAddress} />
      <CompactAddress label="Consignee Address" address={awb.consigneeAddress} />
    </DetailSection>

    {/* Column 5 */}
    <DetailSection title="Flags" icon={<FlagOutlined fontSize="small" />}>
      <StatusBadge status={awb.weightDiscrepancy} label="Weight Disc." />
      <StatusBadge status={awb.priorityShipment} label="Priority" />
      <StatusBadge status={awb.qualityCheck} label="Quality Check" />
      <DetailRow label="Special Handling" value={awb.specialHandling} />
      <DetailRow label="Freight Charges" value={awb.freightCharges} />
      <DetailRow label="Customs Clearance" value={awb.customsClearance} />
      <DetailRow label="Approval Status" value={awb.approvalStatus} />
      <StatusBadge 
        status={awb.customsClearance} 
        label="Customs" 
        isString 
        successValue="Cleared"
      />
      <StatusBadge 
        status={awb.approvalStatus} 
        label="Approval" 
        isString 
        successValue="Approved"
      />
    </DetailSection>
  </Box>
</Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
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
                      No AWBs found
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePaginationChange(setPage)}
        onRowsPerPageChange={handleRowsPerPageChange(setRowsPerPage, setPage)}
      />
    </Paper>
  );
};

AwbTable.propTypes = {
  data: PropTypes.array.isRequired,
  searchQuery: PropTypes.string,
  selectedAWBs: PropTypes.object.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};

AwbTable.defaultProps = {
  searchQuery: "",
};

export default AwbTable;
