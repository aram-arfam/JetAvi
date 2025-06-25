// Common option arrays used across the Cargo module

// Status options for AWB
export const statusOptions = [
  "Request",
  "Waiting",
  "Not-Complete",
  "Planned",
  "Unplanned",
  "Off-Loaded",
  "Departure",
  "Transit",
  "Arrival",
  "Forward",
  "POD",
  "Standby",
  "Missing",
  "Canceled",
];

// Delivery options
export const DELIVERY_OPTIONS = [
  { label: "Airport Pickup", value: "Airport Pickup" },
  { label: "Door-to-Door Delivery", value: "Door-to-Door Delivery" },
  { label: "Warehouse Pickup", value: "Warehouse Pickup" },
  { label: "Port-to-Port", value: "Port-to-Port" },
  { label: "Terminal Handling", value: "Terminal Handling" },
  { label: "Courier Service", value: "Courier Service" },
  { label: "Freight Forwarder Pickup", value: "Freight Forwarder Pickup" },
];

// Customs clearance options
export const CUSTOMS_CLEARANCE_OPTIONS = [
  { label: "Pending", value: "Pending" },
  { label: "Cleared", value: "Cleared" },
  { label: "Held", value: "Held" },
];

// Insurance options
export const INSURANCE_OPTIONS = [
  { label: "Paid", value: "Paid" },
  { label: "Approved", value: "Approved" },
  { label: "Declined", value: "Declined" },
  { label: "Expired", value: "Expired" },
];

// Special handling options
export const SPECIAL_HANDLING_OPTIONS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
  { label: "Fragile", value: "Fragile" },
  { label: "Normal", value: "Normal" },
  { label: "Perishable", value: "Perishable" },
  { label: "Dangerous", value: "Dangerous Goods" },
  { label: "Valuable", value: "Valuable" },
  { label: "Live Animals", value: "Live Animals" },
];

// Approval status options
export const APPROVAL_STATUS_OPTIONS = [
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

// Piece status options
export const PIECE_STATUS_OPTIONS = [
  { label: "Pending", value: "Pending" },
  { label: "Loaded", value: "Loaded" },
  { label: "Active", value: "Active" },
  { label: "Delivered", value: "Delivered" },
  { label: "Damaged", value: "Damaged" },
  { label: "Missing", value: "Missing" },
];

// Cargo classifications based on IATA standards
export const CARGO_CLASSIFICATIONS = [
  { value: "GEN", label: "General Cargo", baseRate: 2.5 },
  { value: "VAL", label: "Valuable Cargo", baseRate: 6.5 },
  { value: "PER", label: "Perishable Cargo", baseRate: 3.8 },
  { value: "DGR", label: "Dangerous Goods", baseRate: 5.2 },
  { value: "HEA", label: "Heavy Cargo", baseRate: 4.0 },
  { value: "LIV", label: "Live Animals", baseRate: 7.5 },
];

// Rate types based on IATA standards
export const RATE_TYPES = [
  { value: "N", label: "Normal Rate", multiplier: 1.0 },
  { value: "Q", label: "Quantity Discount", multiplier: 0.85 },
  { value: "U", label: "ULD Container", multiplier: 0.78 },
  { value: "E", label: "Express Cargo", multiplier: 1.25 },
  { value: "C", label: "Class Cargo", multiplier: 1.15 },
  { value: "S", label: "Specific Commodity", multiplier: 0.95 },
];

// Currencies commonly used in air cargo
export const CURRENCIES = [
  { value: "USD", label: "USD", symbol: "$" },
  { value: "EUR", label: "EUR", symbol: "€" },
  { value: "GBP", label: "GBP", symbol: "£" },
  { value: "JPY", label: "JPY", symbol: "¥" },
  { value: "CNY", label: "CNY", symbol: "¥" },
  { value: "AED", label: "AED", symbol: "د.إ" },
];

// IATA zones for distance calculations
export const IATA_ZONES = [
  { value: "WITHIN_1", label: "Within Zone 1", multiplier: 1.0 },
  { value: "WITHIN_2", label: "Within Zone 2", multiplier: 1.1 },
  { value: "WITHIN_3", label: "Within Zone 3", multiplier: 1.2 },
  { value: "BETWEEN_1_2", label: "Between Zones 1 & 2", multiplier: 1.3 },
  { value: "BETWEEN_1_3", label: "Between Zones 1 & 3", multiplier: 1.5 },
  { value: "BETWEEN_2_3", label: "Between Zones 2 & 3", multiplier: 1.4 },
];

// Default new piece template
export const DEFAULT_NEW_PIECE = {
  pieceNo: "",
  length: "",
  width: "",
  height: "", 
  weight: "",
  volume: "",
  content: "",
  specialHandling: "Normal",
  status: "Pending",
  notes: "",
};

// Status color mapping
export const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
    case "Arrival":
    case "Approved":
    case "Cleared":
      return "success";
    case "Pending":
    case "Waiting":
    case "Request":
      return "info";
    case "Damaged":
    case "Missing":
    case "Rejected":
    case "Held":
      return "error";
    case "Active":
    case "Departure":
    case "Transit":
      return "primary";
    default:
      return "default";
  }
};

// Special handling color mapping
export const getSpecialHandlingColor = (handling) => {
  switch (handling) {
    case "Normal":
    case "No":
      return "default";
    case "Fragile":
      return "warning";
    case "Dangerous Goods":
      return "error";
    case "Valuable":
      return "secondary";
    case "Perishable":
    case "Live Animals":
      return "info";
    default:
      return "default";
  }
};

// Format address as string
export const formatAddress = (address) => {
  if (!address) return "Not provided";
  const parts = [
    address.street,
    address.city,
    address.state,
    address.country,
    address.postalCode,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Not provided";
};

// Get currency symbol
export const getCurrencySymbol = (currencyCode) => {
  const currency = CURRENCIES.find(c => c.value === currencyCode);
  return currency ? currency.symbol : "$";
};
