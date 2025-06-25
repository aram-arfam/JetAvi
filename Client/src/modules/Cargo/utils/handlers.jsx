import { toast } from "react-toastify";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Table Handlers
export const handleTablePageChange = (setPage) => (event, newPage) => {
  setPage(newPage);
};

export const handleTableRowsPerPageChange =
  (setRowsPerPage, setPage) => (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

// AWB Table Specific Handlers
export const handleAwbCopy = (data, selectedAWBs, formatDateTime) => {
  try {
    const selectedData = data.filter((awb) => selectedAWBs[awb.awbNo]);

    if (selectedData.length === 0) {
      toast.warning("Please select AWBs to copy");
      return;
    }

    const formattedData = formatAwbCopyText(selectedData, formatDateTime);

    navigator.clipboard.writeText(formattedData);
    toast.success(`Copied ${selectedData.length} AWBs to clipboard!`);
  } catch (error) {
    console.error("Copy error:", error);
    toast.error("Failed to copy data");
  }
};

export const exportToExcel = async (selectedData) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("AWBs");

    const columns = [
      "MAWB No",
      "AWB No",
      "Airline",
      "Customer",
      "Company",
      "Agent/Broker",
      "Origin",
      "Destination",
      "Delivery",
      "Status",
      "Pieces",
      "Weight",
      "Chargeable Weight",
      "Volume",
      "Ready Date",
      "Arrival Date",
      "Weight Discrepancy",
      "Priority Shipment",
      "Quality Check",
      "Freight Charges",
      "Customs Clearance",
      "Insurance",
      "Special Handling",
      "Approval Status",
      "Flight Number",
      "Shipper Name",
      "Shipper Contact",
      "Shipper Address",
      "Consignee Name",
      "Consignee Contact",
      "Consignee Address",
      "Freight Charges",
      "Customs Declaration",
      "HS Code",
      "Insurance Details",
      "Created At",
    ];

    worksheet.addRow(columns);

    selectedData.forEach((awb) => {
      const airlineName = awb.airline ? awb.airline.split("_")[0] : "N/A";
      worksheet.addRow([
        awb.mawbNo,
        awb.awbNo,
        airlineName,
        awb.customer,
        awb.company,
        awb.agentBroker,
        awb.origin,
        awb.destination,
        awb.delivery,
        awb.status,
        awb.pieces,
        awb.weight,
        awb.chargeableWeight,
        awb.volume,
        formatDateTimeForDisplay(awb.readyDate),
        formatDateTimeForDisplay(awb.arrivalDate),
        awb.weightDiscrepancy ? "Yes" : "No",
        awb.priorityShipment ? "Yes" : "No",
        awb.qualityCheck ? "Yes" : "No",
        awb.freightCharges ? "Yes" : "No",
        awb.customsClearance ? "Yes" : "No",
        awb.insurance ? "Yes" : "No",
        awb.specialHandling ? "Yes" : "No",
        awb.approvalStatus,
        formatDateTimeForDisplay(awb.createdAt),
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `AWBs_Export_${new Date().toISOString().split("T")[0]}.xlsx`);
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Failed to export data");
  }
};

export const handleAwbSelection =
  (selectedAWBs, onSelectionChange) => (awbNo) => {
    const newSelection = { ...selectedAWBs };
    if (newSelection[awbNo]) {
      delete newSelection[awbNo];
    } else {
      newSelection[awbNo] = true;
    }
    onSelectionChange(newSelection);
  };

export const handleAwbSelectAll =
  (data, selectedAWBs, onSelectionChange) => () => {
    const allSelected = data.every((awb) => selectedAWBs[awb.awbNo]);
    if (allSelected) {
      onSelectionChange({});
    } else {
      const newSelection = data.reduce((acc, awb) => {
        acc[awb.awbNo] = true;
        return acc;
      }, {});
      onSelectionChange(newSelection);
    }
  };

// AWB Search Handlers
export const handleStatusChange = (setSelectedStatuses) => (status) => {
  setSelectedStatuses((prev) => {
    const newStatuses = { ...prev };
    if (newStatuses[status]) {
      delete newStatuses[status];
    } else {
      newStatuses[status] = true;
    }
    return newStatuses;
  });
};

// AWB Pieces Table Handlers
export const formatPieceDimensions = (row) => {
  if (!row.length || !row.width || !row.height) return "-";
  return `${row.length} × ${row.width} × ${row.height}`;
};

export const formatDateTimeForInput = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    // Format: YYYY-MM-DDThh:mm
    return date.toISOString().slice(0, 16);
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return "";
  }
};

// Format datetime for display
export const formatDateTimeForDisplay = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return "";
  }
};

// Text Highlighting Handler
export const highlightText = (text, searchQuery) => {
  if (!searchQuery || !text) return text;

  try {
    const textStr = text.toString();
    const cleanedQuery = searchQuery.toLowerCase().trim().replace(/\s+/g, " ");

    if (cleanedQuery === "") return textStr;

    let searchTerms = cleanedQuery.includes(" ")
      ? [
          cleanedQuery,
          ...cleanedQuery.split(" ").filter((word) => word.length > 0),
        ]
      : [cleanedQuery];

    // Remove duplicates and sort by length (descending)
    searchTerms = [...new Set(searchTerms)]
      .filter((term) => term.length > 0)
      .sort((a, b) => b.length - a.length);

    if (searchTerms.length === 0) return textStr;

    const pattern = searchTerms
      .map((term) => `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`)
      .join("|");

    const regex = new RegExp(pattern, "gi");
    const parts = textStr.split(regex);

    if (parts.length === 1) return textStr;

    return parts.map((part, index) => {
      // Check if part is null or undefined and provide a default empty string
      const partText = part || "";

      const isMatch = searchTerms.some(
        (term) => term && partText.toLowerCase() === term.toLowerCase()
      );

      return isMatch ? (
        <span
          key={index}
          style={{
            backgroundColor: "#FFD700",
            color: "#000",
            fontWeight: "bold",
            padding: "2px",
            borderRadius: "2px",
          }}
        >
          {partText}
        </span>
      ) : (
        partText
      );
    });
  } catch (error) {
    console.error("Error highlighting text:", error);
    return text;
  }
};

// Consolidated Pagination Handlers
export const handlePaginationChange = (setPage) => (event, newPage) => {
  setPage(newPage);
};

export const handleRowsPerPageChange = (setRowsPerPage, setPage) => (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

// Utility for normalizing strings for search
export const normalizeString = (value) => value?.toString().toLowerCase() || "";

// Format airline name - extract name part before underscore
export const formatAirlineName = (airline) =>
  airline ? airline.split("_")[0] : "N/A";

// Get unique values from an array
export const getUniqueValues = (array, key) =>
  [...new Set(array.map((item) => item[key]))].filter(Boolean);

// Format boolean values for display
export const formatBoolean = (value, type = "text") => {
  if (type === "text") {
    return value ? "Yes" : "No";
  } else if (type === "icon") {
    return value ? "✓" : "✕";
  } else if (type === "short") {
    return value ? value.toString().charAt(0).toUpperCase() : "";
  }
  return value ? "Yes" : "No";
};

// Check if a date falls within a given range
export const isDateInRange = (dateStr, fromDate, toDate) => {
  if (!dateStr) return false; // No date to compare
  if (!fromDate && !toDate) return true; // No filter applied

  try {
    // Convert the input date string to a proper Date object
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.log(`Invalid date: ${dateStr}`);
      return false; // Invalid date
    }

    // Set to start of day for better comparison
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (fromDate && toDate) {
      // Both from and to dates are provided
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);

      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999); // End of day

      const isInRange = compareDate >= from && compareDate <= to;
      return isInRange;
    } else if (fromDate) {
      // Only from date is provided
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      return compareDate >= from;
    } else if (toDate) {
      // Only to date is provided
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999); // End of day
      return compareDate <= to;
    }

    return false;
  } catch (error) {
    console.error("Date comparison error:", error);
    return false;
  }
};

// Generate combined search string for highlighting
export const generateHighlightSearchQuery = (searchCriteria) => {
  const {
    airlineSearch,
    customerSearch,
    originSearch,
    destinationSearch,
    searchQuery,
  } = searchCriteria;

  // Clean up each search field
  const cleanFields = [
    searchQuery,
    airlineSearch,
    customerSearch,
    originSearch,
    destinationSearch,
  ]
    .map((field) => (field ? field.trim() : ""))
    .filter((field) => field !== "");

  // Combine all search fields with space separator
  return cleanFields.join(" ");
};

// Filter AWBs based on search criteria
export const filterAwbs = (awbsData, searchCriteria) => {
  const {
    airlineSearch,
    customerSearch,
    originSearch,
    destinationSearch,
    selectedStatuses,
    searchQuery,
    dateFrom,
    dateTo,
  } = searchCriteria;

  // Check if date filter is applied
  const hasDateFilter = dateFrom || dateTo;

  // Check if universal search is active
  const hasUniversalSearch = searchQuery && searchQuery.trim() !== "";

  let filtered = awbsData.filter((awb) => {
    const originParts = normalizeString(awb.origin).split("-");
    const destinationParts = normalizeString(awb.destination).split("-");
    const airlineName = formatAirlineName(awb.airline).toLowerCase();

    // Status filtering
    const statusMatch =
      Object.keys(selectedStatuses).length === 0 ||
      (awb.status && selectedStatuses[awb.status] === true);

    // Date range filtering - only apply if date filter exists
    let dateMatch = true;
    if (hasDateFilter) {
      const readyDateMatch = isDateInRange(awb.readyDate, dateFrom, dateTo);
      const arrivalDateMatch = isDateInRange(awb.arrivalDate, dateFrom, dateTo);
      const createdAtMatch = isDateInRange(awb.createdAt, dateFrom, dateTo);

      dateMatch = readyDateMatch || arrivalDateMatch || createdAtMatch;
    }

    // Universal search across all fields
    let universalMatch = true;
    if (hasUniversalSearch) {
      // Clean up search query - trim and handle consecutive spaces
      const cleanedQuery = searchQuery
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

      // Check if query is empty after cleaning
      if (cleanedQuery === "") return true;

      // If query contains spaces, search for the whole string instead of individual terms
      if (cleanedQuery.includes(" ")) {
        // Search the whole string in all fields
        universalMatch = Object.entries(awb).some(([, value]) => {
          // Skip searching on functions and objects
          if (
            typeof value === "function" ||
            (typeof value === "object" && value !== null)
          ) {
            return false;
          }
          // Convert to string and search
          if (value) {
            return value.toString().toLowerCase().includes(cleanedQuery);
          }
          return false;
        });
      } else {
        // For single words, keep the existing behavior
        const searchTerms = cleanedQuery.split(/\s+/).filter(Boolean);
        universalMatch = searchTerms.every((term) =>
          Object.entries(awb).some(([, value]) => {
            // Skip searching on functions and objects
            if (
              typeof value === "function" ||
              (typeof value === "object" && value !== null)
            ) {
              return false;
            }
            // Convert to string and search
            if (value) {
              return value.toString().toLowerCase().includes(term);
            }
            return false;
          })
        );
      }
    }

    return (
      (!airlineSearch ||
        airlineName.includes(normalizeString(airlineSearch))) &&
      (!customerSearch ||
        normalizeString(awb.customer).includes(
          normalizeString(customerSearch)
        )) &&
      (!originSearch ||
        originParts.some((part) =>
          part.includes(normalizeString(originSearch))
        )) &&
      (!destinationSearch ||
        destinationParts.some((part) =>
          part.includes(normalizeString(destinationSearch))
        )) &&
      statusMatch &&
      dateMatch &&
      universalMatch
    );
  });

  if (hasUniversalSearch) {
    console.log(`Universal search found: ${filtered.length} AWBs`);
  }

  return filtered;
};

// Calculate totals for selected AWBs
export const calculateSelectedTotals = (data, selectedAWBs) => {
  const selectedItems = data.filter((awb) => selectedAWBs[awb.awbNo]);

  return {
    count: selectedItems.length,
    weight: selectedItems.reduce((sum, awb) => sum + (awb.weight || 0), 0),
    volume: selectedItems.reduce((sum, awb) => sum + (awb.volume || 0), 0),
  };
};

// Format copy text for AWBs
export const formatAwbCopyText = (selectedData, formatDateTime) => {
  const fields = [
    { key: "mawbNo", label: "MAWB" },
    { key: "awbNo", label: "AWB" },
    { key: "customer", label: "Customer" },
    { key: "company", label: "Company" },
    { key: "agentBroker", label: "Agent/Broker" },
    { key: "origin", label: "Origin" },
    { key: "destination", label: "Destination" },
    { key: "delivery", label: "Delivery" },
    { key: "status", label: "Status" },
    { key: "pieces", label: "Pieces" },
    { key: "weight", label: "Weight", unit: "kg" },
    { key: "chargeableWeight", label: "Chargeable Weight", unit: "kg" },
    { key: "volume", label: "Volume", unit: "m³" },
    { key: "readyDate", label: "Ready Date", format: formatDateTime },
    { key: "arrivalDate", label: "Arrival Date", format: formatDateTime },
    { key: "weightDiscrepancy", label: "Weight Discrepancy" },
    { key: "priorityShipment", label: "Priority" },
    { key: "qualityCheck", label: "Quality Check" },
    { key: "freightCharges", label: "Freight Charges" },
    { key: "customsClearance", label: "Customs Clearance" },
    { key: "insurance", label: "Insurance" },
    { key: "specialHandling", label: "Special Handling" },
    { key: "approvalStatus", label: "Approval Status" },
  ];

  return selectedData
    .map((awb) =>
      fields
        .map(({ key, label, unit, format }) => {
          let value = awb[key];

          if (typeof value === "boolean") value = value ? "Yes" : "No";
          if (format) value = format(value);
          if (unit && value) value = `${value} ${unit}`;

          return `${label}: ${value || "N/A"}`;
        })
        .join(" | ")
    )
    .join("\n\n");
};
