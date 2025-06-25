import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import AwbSearch from "../components/AwbSearch";
import AwbTable from "../components/AwbTable";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { cargoService } from "../services/cargoService";
import {
  exportToExcel,
  getUniqueValues,
  filterAwbs,
  calculateSelectedTotals,
  formatAwbCopyText,
  generateHighlightSearchQuery,
} from "../utils/handlers.jsx";

const AwbDatabase = () => {
  const [awbsData, setAwbsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedAWBs, setSelectedAWBs] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [airlineSearch, setAirlineSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState({});

  // Date filter states
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [appliedDateFrom, setAppliedDateFrom] = useState("");
  const [appliedDateTo, setAppliedDateTo] = useState("");
  const [hasActiveDateFilter, setHasActiveDateFilter] = useState(false);

  // Get unique statuses from awbsData
  const availableStatuses = getUniqueValues(awbsData, "status");

  // Generate the combined search query for highlighting
  const highlightSearchQuery = useMemo(() => {
    const searchCriteria = {
      airlineSearch,
      customerSearch,
      originSearch,
      destinationSearch,
      searchQuery,
    };
    return generateHighlightSearchQuery(searchCriteria);
  }, [
    airlineSearch,
    customerSearch,
    originSearch,
    destinationSearch,
    searchQuery,
  ]);

  useEffect(() => {
    fetchAwbs();
  }, []);

  const fetchAwbs = async () => {
    setIsLoading(true);
    try {
      const response = await cargoService.getAllAwbs();
      const data = response.data.data || [];

      if (data.length === 0) {
        toast.info("No AWBs found in the database");
      }

      setAwbsData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching AWBs:", error);
      toast.error(error.response?.data?.message || "Error fetching data");
      setAwbsData([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle date filter application
  const handleApplyDateFilter = () => {
    // Validate date input
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      toast.error("From date cannot be after To date");
      return;
    }

    setAppliedDateFrom(dateFrom);
    setAppliedDateTo(dateTo);
    setHasActiveDateFilter(Boolean(dateFrom || dateTo));

    toast.info(
      `Date filter applied: ${dateFrom ? dateFrom : "Any"} to ${
        dateTo ? dateTo : "Any"
      }`
    );
  };

  // Handle clearing date filters
  const handleClearDateFilter = () => {
    setDateFrom("");
    setDateTo("");
    setAppliedDateFrom("");
    setAppliedDateTo("");
    setHasActiveDateFilter(false);
    toast.info("Date filters cleared");
  };

  useEffect(() => {
    const searchCriteria = {
      airlineSearch,
      customerSearch,
      originSearch,
      destinationSearch,
      selectedStatuses,
      searchQuery,
      dateFrom: appliedDateFrom,
      dateTo: appliedDateTo,
    };

    const filtered = filterAwbs(awbsData, searchCriteria);
    setFilteredData(filtered);

    // If we're filtering and get 0 results, show a message
    if (filtered.length === 0 && awbsData.length > 0) {
      if (hasActiveDateFilter) {
        toast.info(`No AWBs match the selected date range`);
      }
    }
  }, [
    airlineSearch,
    customerSearch,
    originSearch,
    destinationSearch,
    searchQuery,
    selectedStatuses,
    awbsData,
    appliedDateFrom,
    appliedDateTo,
    hasActiveDateFilter,
  ]);

  // Calculate selected AWBs totals
  const selectedTotals = calculateSelectedTotals(filteredData, selectedAWBs);

  // Clear selections when data changes
  useEffect(() => {
    setSelectedAWBs({});
  }, [awbsData]);

  const handleCopy = () => {
    const selectedData = filteredData.filter((awb) => selectedAWBs[awb.awbNo]);
    if (selectedData.length === 0) {
      toast.warning("Please select AWBs to copy");
      return;
    }

    const copyText = formatAwbCopyText(selectedData);
    navigator.clipboard.writeText(copyText);
    toast.success(`Copied ${selectedData.length} AWBs to clipboard!`);
  };

  const handleExportToExcel = async () => {
    const selectedData = filteredData.filter((awb) => selectedAWBs[awb.awbNo]);
    if (selectedData.length === 0) {
      toast.warning("Please select AWBs to export");
      return;
    }

    try {
      await exportToExcel(selectedData);
      toast.success("Export completed successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <Box sx={{ p: 6, minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h1">AWB Database</Typography>
          {hasActiveDateFilter && (
            <Chip
              icon={<CalendarMonthIcon />}
              label={`Date Filter: ${appliedDateFrom || "Any"} to ${
                appliedDateTo || "Any"
              }`}
              color="primary"
              onDelete={handleClearDateFilter}
            />
          )}
        </Stack>

        {selectedTotals.count > 0 ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Paper sx={{ px: 4, py: 2, bgcolor: "secondary.main" }}>
              <Typography variant="subtitle1" color="primary">
                Selected: {selectedTotals.count} AWBs | Weight:{" "}
                {selectedTotals.weight.toFixed(2)} kg | Volume:{" "}
                {selectedTotals.volume.toFixed(2)} m³
              </Typography>
            </Paper>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
            >
              Copy
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportToExcel}
            >
              Export
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title="Refresh">
              <span>
                <IconButton onClick={fetchAwbs} disabled={isLoading}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        )}
      </Box>

      <Stack spacing={4}>
        <Paper sx={{ p: 2 }}>
          <AwbSearch
            airlineSearch={airlineSearch}
            setAirlineSearch={setAirlineSearch}
            customerSearch={customerSearch}
            setCustomerSearch={setCustomerSearch}
            originSearch={originSearch}
            setOriginSearch={setOriginSearch}
            destinationSearch={destinationSearch}
            setDestinationSearch={setDestinationSearch}
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
            availableStatuses={availableStatuses}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            onApplyDateFilter={handleApplyDateFilter}
            onClearDateFilter={handleClearDateFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </Paper>

        <Paper>
          <AwbTable
            data={filteredData}
            searchQuery={highlightSearchQuery}
            selectedAWBs={selectedAWBs}
            onSelectionChange={setSelectedAWBs}
          />
        </Paper>
      </Stack>
    </Box>
  );
};

export default AwbDatabase;
