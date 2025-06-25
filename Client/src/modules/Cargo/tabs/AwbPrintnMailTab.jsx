import React, { useRef, useState, useCallback, useEffect } from "react";
// No PropTypes import needed
import {
    Box, // Keep Box for simple containers/utility
    Button,
    // Grid, // Removed
    Paper, // Keep Paper for the main container
    // Typography, // Removed (using standard elements + Tailwind)
    Stack, // Keep Stack for overall component structure
    // useTheme, // Removed (using Tailwind colors/borders)
    // Divider, // Removed (using Tailwind borders)
    CircularProgress,
    Alert,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import { toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';
import { cargoService } from "../services/cargoService"; // Ensure path is correct

// --- Helper Functions (remain the same) ---

const safeGet = (obj, path, fallback = "---") => {
    // ... (implementation as before)
    return path.split(".").reduce((acc, part) => {
        if (acc && typeof acc === 'object' && acc !== null) {
            const value = acc[part];
            if (value !== null && value !== undefined) {
                return value;
            }
        }
        return fallback;
    }, obj) ?? fallback;
};

const formatDimensions = (piece) => {
    // ... (implementation as before)
    const l = safeGet(piece, 'length', '-');
    const w = safeGet(piece, 'width', '-');
    const h = safeGet(piece, 'height', '-');
    if (l === '-' || w === '-' || h === '-') return '---';
    return `${l}x${w}x${h} cm`;
};

const formatNumber = (value, decimals = 2, fallback = '---') => {
    // ... (implementation as before)
    const num = Number(value);
    return isNaN(num) ? fallback : num.toFixed(decimals);
};

const formatDate = (dateString, fallback = '---') => {
    // ... (implementation as before)
    if (!dateString) return fallback;
    const dateValue = typeof dateString === 'object' && dateString !== null && dateString.$date ? dateString.$date : dateString;
    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
             console.warn("Invalid date value received:", dateValue);
             return fallback;
        }
        return date.toLocaleDateString(); // Adjust format if needed e.g., 'en-GB'
    } catch (e) {
        console.error("Error formatting date:", dateValue, e);
        return fallback;
    }
};
// --- End Helper Functions ---


// --- Component using Tailwind CSS ---

const AwbPrintnMailTab = ({ awbDetails }) => {
    // const theme = useTheme(); // No longer needed for layout styles
    const printRef = useRef();
    const [piecesData, setPiecesData] = useState([]);
    const [loadingPieces, setLoadingPieces] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
    const [emailRecipient, setEmailRecipient] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailDialogError, setEmailDialogError] = useState('');

    // --- Event Handlers (remain the same) ---
    const handleOpenEmailDialog = () => {
        setEmailRecipient('');
        setEmailSubject(awbDetails?.awbNo && awbDetails.awbNo !== "N/A" ? `Air Waybill: ${awbDetails.awbNo}` : 'Air Waybill Details');
        setEmailDialogError('');
        setIsEmailDialogOpen(true);
    };

    const handleCloseEmailDialog = () => {
        if (isSendingEmail) return;
        setIsEmailDialogOpen(false);
    };

    const handleSendEmailSubmit = async () => {
        // ... (validation logic remains the same) ...
        if (!emailRecipient) { /* ... */ return; }
        if (!/\S+@\S+\.\S+/.test(emailRecipient)) { /* ... */ return; }
        if (!emailSubject) { /* ... */ return; }
        if (!printRef.current) { /* ... */ return; }

        setEmailDialogError('');
        setIsSendingEmail(true);

        try {
            const payload = { to: emailRecipient, subject: emailSubject };
            await cargoService.emailAwbPdf({ awbId: awbDetails._id, ...payload });
            toast.success("Email sent successfully!");
            handleCloseEmailDialog();
        } catch (err) {
            console.error("Error sending email via service:", err);
            const errorMsg = err?.message || err?.response?.data?.message || "Failed to send email.";
            setEmailDialogError(errorMsg);
        } finally {
            setIsSendingEmail(false);
        }
    };

    const awbId = awbDetails?._id;

    const fetchPieces = useCallback(async () => {
        // ... (fetch logic remains the same) ...
        if (!awbId) { /* ... */ return; }
        setLoadingPieces(true);
        setFetchError(null);
        try {
            const response = await cargoService.getPieces(awbId);
            const data = response?.data?.data ?? response?.data ?? [];
            if (Array.isArray(data)) { setPiecesData(data); }
            else { throw new Error("Received unexpected data format for pieces."); }
        } catch (err) {
            console.error("Error fetching pieces:", err);
            const errorMsg = err.response?.data?.message || err.message || "Failed to load piece details.";
            setFetchError(errorMsg); setPiecesData([]);
        } finally { setLoadingPieces(false); }
    }, [awbId]);

    useEffect(() => {
        if (awbId) { // Fetch only if awbId exists
            fetchPieces();
        } else {
            // Clear data if awbDetails becomes null/undefined
            setPiecesData([]);
            setLoadingPieces(false);
            setFetchError(null);
        }
        // Cleanup function (optional, usually not needed for fetch)
        return () => {};
    }, [awbId, fetchPieces]); // Depend on awbId directly


    // --- Updated Print Handler with Tailwind-friendly Styles ---
    const handlePrint = () => {
        const printableElement = printRef.current; // This should be the <Paper> component
        if (!printableElement) {
            console.error("Printable element (#printableAwb) not found.");
            toast.error("Could not find content to print.");
            return;
        }

        const style = document.createElement("style");
        style.innerHTML = `
          @media print {
            @page {
              size: A4;
              margin: 1cm; /* Or adjust as needed, e.g., 0.8cm */
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              height: auto !important;
              background-color: #fff !important;
            }

            /* 1. Hide EVERYTHING by default */
            body * {
              visibility: hidden !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
            }

            /* 2. Make ONLY the target Paper and its children visible */
            #printableAwb, #printableAwb * {
              visibility: visible !important;
              color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
            }

            /* 3. Position the target Paper on the page */
            #printableAwb {
              /* --- Centering Logic --- */
              position: absolute !important;
              left: 50% !important;
              top: 2% !important; /* Adjust vertical start if needed */
              width: 96% !important; /* Use slightly less than 100% with centering */
              transform: translateX(-50%) !important;
              /* --- Common Styles --- */
              max-width: none !important;
              margin: 0 !important;
              padding: 0 !important;
              border: 1px solid #ccc !important;
              background-color: #fff !important;
              box-shadow: none !important;
              font-size: 8.5pt !important;
              line-height: 1.15 !important;
              box-sizing: border-box !important;
            }

            /* --- Style Tailwind structure within #printableAwb for print --- */
            #printableAwb .awb-row {
                display: flex !important; border-bottom: 1px solid #ccc !important; width: 100% !important;
            }
            #printableAwb .awb-row:last-of-type { border-bottom: none !important; }
            #printableAwb .awb-col {
                padding: 2px 4px !important; border-right: 1px solid #ccc !important; overflow: hidden !important;
                display: flex !important; flex-direction: column !important; justify-content: space-between !important;
                min-height: 2.5em !important; word-break: break-word !important; box-sizing: border-box !important;
            }
            #printableAwb .awb-col:last-of-type { border-right: none !important; }
            #printableAwb .awb-col .awb-col { border-right: 1px solid #ccc !important; }
            #printableAwb .awb-col .awb-col:last-of-type { border-right: none !important; }

            /* --- Style Text Elements within #printableAwb --- */
            #printableAwb p, #printableAwb span, #printableAwb h6, #printableAwb div:not(.awb-row):not(.awb-col):not(.signature-box):not(.piece-details) {
                font-family: 'Arial', sans-serif !important; color: #000 !important; margin-bottom: 0 !important;
                padding: 0 !important; line-height: inherit !important; background-color: transparent !important;
            }
            #printableAwb .awb-label { font-size: 7pt !important; color: #555 !important; margin-bottom: 1px !important; }
            #printableAwb .awb-value { font-family: 'Courier New', monospace !important; font-weight: normal !important; font-size: 8.5pt !important; }
            #printableAwb .awb-value-small { font-size: 7.5pt !important; line-height: 1.1 !important; }
            #printableAwb .awb-main-header { font-size: 13pt !important; font-weight: bold !important; margin: 3px 0 !important; }
            #printableAwb .awb-total-value { font-weight: bold !important; }
            #printableAwb .nature-goods-box { min-height: 4em !important; }
            #printableAwb .piece-details { margin-top: 4px !important; padding-top: 4px !important; border-top: 1px dashed #ccc !important; visibility: visible !important; }
            #printableAwb .piece-details * { visibility: visible !important; }
            #printableAwb .signature-box { margin-top: 8px !important; padding-top: 4px !important; border-top: 1px solid #000 !important; visibility: visible !important; }
            #printableAwb .signature-box * { visibility: visible !important; }
            #printableAwb .signature-box span { font-size: 7pt !important; }

            /* Hide elements specifically marked NOT for print */
            .print-action-buttons { display: none !important; }
          }
        `;
        document.head.appendChild(style);
        window.print();
        setTimeout(() => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 2000); // Increased timeout slightly
    };

    // --- Loading / Initial State ---
    if (!awbDetails) {
        return (
            <Box p={3} display="flex" justifyContent="center" alignItems="center">
                {/* Alert uses MUI, which is fine */}
                <Alert severity="info">Loading AWB details...</Alert>
            </Box>
        );
    }

    // --- Derived Data (remain the same) ---
    const airlineCode = safeGet(awbDetails, "airline", "").split("_")[1] || "---";
    const airlineName = safeGet(awbDetails, "airline", "").split("_")[0] || "---";
    const readyDateFormatted = formatDate(safeGet(awbDetails, "readyDate"));
    const rates = awbDetails.rates || {};

    // --- Tailwind CSS Class Strings (for readability) ---
    // Adjust padding (e.g., p-1 = 0.25rem, py-0.5 = 0.125rem) and borders to match visual needs
    const rowClasses = "flex border-b border-gray-300 awb-row"; // Added awb-row for print styles
    const colClasses = "p-1 border-r border-gray-300 flex flex-col justify-between min-h-[2.8em] overflow-hidden box-border awb-col"; // Added awb-col
    const lastColClasses = "last:border-r-0"; // Applied to the container or element itself
    const labelClasses = "block text-xs text-gray-500 leading-tight mb-px awb-label"; // Added awb-label
    const valueClasses = "block text-sm font-mono break-words leading-snug awb-value"; // Added awb-value
    const valueSmallClasses = `${valueClasses} awb-value-small text-[7.5pt] leading-tight`; // For smaller prints
    const totalValueClasses = `${valueClasses} font-bold awb-total-value`; // Added awb-total-value

    // Helper for width (adjust percentages if needed for better fit)
    // Using arbitrary values for precision matching Grid's 12 columns
    const widthMap = {
        1: "w-[8.33%]",
        1.5: "w-[12.5%]",
        2: "w-[16.66%]", // 2/12
        2.5: "w-[20.83%]",
        3: "w-[25%]", // 3/12
        4: "w-[33.33%]", // 4/12
        5: "w-[41.66%]",
        6: "w-[50%]", // 6/12
        8: "w-[66.66%]", // 8/12
        9: "w-[75%]", // 9/12
        12: "w-full",
    };
    const getWidthClass = (xs) => widthMap[xs] || "w-auto"; // Fallback

    return (
        // Wrap printable area in a div for easier print targeting if needed
        <Stack spacing={2} p={2} id="printableAwbContainer">
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }} className="print-action-buttons">
                 <Tooltip title="Send AWB via Email">
                    <span> {/* Tooltip needs a span for disabled buttons */}
                        <Button variant="outlined" startIcon={<EmailIcon />} onClick={handleOpenEmailDialog} disabled={!awbId}>
                            Email AWB
                        </Button>
                    </span>
                 </Tooltip>
                 <Tooltip title="Print AWB">
                     <span>
                        <Button variant="contained" color="primary" startIcon={<PrintIcon />} onClick={handlePrint} disabled={!awbId || loadingPieces || !!fetchError}>
                            {loadingPieces ? 'Loading Data...' : 'Print AWB'}
                        </Button>
                    </span>
                 </Tooltip>
            </Box>

            {/* Loading/Error Indicators */}
            {loadingPieces && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 1 }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <span className="text-sm text-gray-500">Loading piece details...</span>
                </Box>
            )}
            {fetchError && (
                 <Alert severity="error" onClose={() => setFetchError(null)} sx={{mb: 1}}>
                     Failed to load piece details: {fetchError}
                 </Alert>
            )}

            {/* Printable AWB Document using Paper + Tailwind */}
            <Paper
                variant="outlined"
                id="printableAwb"
                ref={printRef}
                // Apply Tailwind classes to Paper if needed, or style inner div
                className="max-w-[210mm] mx-auto border border-gray-300 overflow-hidden bg-white" // Screen styles
            >
                {/* Section 1: Shipper / Header / Airline */}
                <div className={rowClasses}>
                    <div className={`${colClasses} ${getWidthClass(4)}`}>
                        <span className={labelClasses}>Shipper's Name and Address</span>
                        <p className={`${valueClasses} whitespace-pre-line`}>
                            {safeGet(awbDetails, "shipperName")}{'\n'}
                            {safeGet(awbDetails, "shipperAddress.street")}{'\n'}
                            {safeGet(awbDetails, "shipperAddress.city")}, Postal Code: {safeGet(awbDetails, "shipperAddress.postalCode")}{'\n'}
                            {safeGet(awbDetails, "shipperAddress.country")}{'\n'}
                            PHONE: {safeGet(awbDetails, "shipperContactNumber")}
                        </p>
                    </div>
                    <div className={`${colClasses} ${getWidthClass(4)} justify-around items-center`}>
                         <div className="text-center"><span className={labelClasses}>AWB Number</span> <span className={valueClasses}>{safeGet(awbDetails, "awbNo")}</span></div>
                         <h6 className="text-lg font-bold text-center my-1 awb-main-header">Air Waybill</h6> {/* approx h6 */}
                         <span className="text-xs text-gray-500 text-center">Issued by JetStreams International</span>
                    </div>
                     <div className={`${colClasses} ${getWidthClass(4)} justify-around items-center ${lastColClasses}`}>
                         <div className="text-center"><span className={labelClasses}>Airline</span> <span className={valueClasses}>{airlineName}</span></div>
                         <span className="text-xs text-gray-500 text-center">Status {safeGet(awbDetails, "status")}</span>
                         <span className="text-xs text-gray-500 text-center">Company {safeGet(awbDetails, "company")}</span>
                    </div>
                </div>

                 {/* Section 2: AWB Number Bar */}
                <div className={`${rowClasses} items-center min-h-[2.5em] text-center p-1`}>
                     <div className={`grow ${lastColClasses}`}> {/* Full width column */}
                         <span className={`${valueClasses} text-lg font-bold`}> {safeGet(awbDetails, "awbNo")} </span>
                    </div>
                </div>

                 {/* Section 3: Consignee */}
                 <div className={rowClasses}>
                    <div className={`${colClasses} ${getWidthClass(6)}`}>
                        <span className={labelClasses}>Consignee's Name and Address</span>
                        <p className={`${valueClasses} whitespace-pre-line`}>
                            {safeGet(awbDetails, "consigneeName")}{'\n'}
                            {safeGet(awbDetails, "consigneeAddress.street")}{'\n'}
                            {safeGet(awbDetails, "consigneeAddress.city")}, Postal Code: {safeGet(awbDetails, "consigneeAddress.postalCode")}{'\n'}
                            {safeGet(awbDetails, "consigneeAddress.country")}{'\n'}
                            PHONE: {safeGet(awbDetails, "consigneeContactNumber")}
                        </p>
                    </div>
                    <div className={`${colClasses} ${getWidthClass(6)} ${lastColClasses}`}>
                        <span className={labelClasses}>Other Details</span>
                        <p className={`${valueClasses} whitespace-pre-line`}>
                            Customer Name: {safeGet(awbDetails, "customer")}{'\n'}
                            Contact: {safeGet(awbDetails, "customerContactNumber")}
                        </p>
                        <div className="mt-1">
                            <span className={labelClasses}>Delivery Type</span>
                            <span className={valueClasses}>{safeGet(awbDetails, "delivery")}</span>
                        </div>
                    </div>
                 </div>

                 {/* Section 4: Agent / Accounting Info */}
                 <div className={rowClasses}>
                    <div className={`${colClasses} ${getWidthClass(6)}`}>
                         <span className={labelClasses}>Issuing Carrier's Agent Name and City</span>
                         <p className={`${valueClasses} whitespace-pre-line`}>
                             {safeGet(awbDetails, "agentBroker")}{'\n'}
                             {safeGet(awbDetails, "origin")}{'\n'}
                             PHONE: {safeGet(awbDetails, "customerContactNumber")}
                         </p>
                    </div>
                     <div className={`${colClasses} ${getWidthClass(6)} ${lastColClasses}`}>
                         <span className={labelClasses}>Accounting Information</span>
                         <p className={`${valueClasses} whitespace-pre-line`}>
                            NOTIFY: {safeGet(awbDetails, "consigneeName")}{'\n'}
                            PH: {safeGet(awbDetails, "consigneeContactNumber")}
                         </p>
                    </div>
                 </div>

                 {/* Section 5: Agent Code / Ref No */}
                  <div className={rowClasses}>
                    <div className={`${colClasses} ${getWidthClass(3)}`}>
                        <span className={labelClasses}>Agent's IATA Code</span>
                        <span className={valueClasses}>{airlineCode}</span>
                    </div>
                    <div className={`${colClasses} ${getWidthClass(6)}`}>
                        <span className={labelClasses}>Reference Number</span>
                        <span className={valueClasses}>{safeGet(awbDetails, "hsCode")}</span>
                    </div>
                     <div className={`${colClasses} ${getWidthClass(3)} ${lastColClasses}`}>
                         {/* Spacer */}  
                     </div>
                 </div>

                {/* Section 6: Routing / Handling */}
                               {/* Section 6: Routing / Handling */}
                               <div className={rowClasses}> {/* Outer Row */}
                     {/* Airport of Departure Column (Correct) */}
                     <div className={`${colClasses} ${getWidthClass(3)}`}>
                         <span className={labelClasses}>Airport of Departure</span>
                         <span className={valueClasses}>{safeGet(awbDetails, "origin")}</span>
                     </div>

                     {/* --- CORRECTED Nested Flex Container --- */}
                     {/* This div acts as the container for the inner row. */}
                     {/* It takes up 9/12 width and arranges its children in a row ('flex'). */}
                     {/* It should NOT have 'awb-col' class. */}
                     {/* It needs the 'last:border-r-0' equivalent since it's the last item in the outer row. */}
                     <div className={`${getWidthClass(9)} flex p-0 border-r-0`}> {/* Added flex, removed awb-col, ensured no right border */}
                         {/* Inner Columns */}
                         <div className={`${colClasses} ${getWidthClass(2)}`}> {/* Width relative to 12-col grid */}
                             <span className={labelClasses}>To</span>
                             <span className={valueClasses}>{safeGet(awbDetails, "destination")}</span>
                         </div>
                         <div className={`${colClasses} ${getWidthClass(2)}`}>
                             <span className={labelClasses}>By First Carrier</span>
                             <span className={valueClasses}>{airlineName}</span>
                         </div>
                         <div className={`${colClasses} ${getWidthClass(3)}`}>
                             <span className={labelClasses}>Routing & Dest</span>
                             <span className={valueClasses}>{safeGet(awbDetails, "destination")}</span>
                         </div>
                         {/* Explicitly remove border from the last *inner* column */}
                         <div className={`${colClasses} ${getWidthClass(2)} border-r-0`}>
                             <span className={labelClasses}>Handling Info</span>
                             <span className={valueClasses}>{safeGet(awbDetails, "specialHandling")}</span>
                         </div>
                     </div>
                     {/* --- End Corrected Nested Flex Container --- */}
                 </div>

                 {/* Section 7: Flight / Currency / Charges / Value */}
                  <div className={rowClasses}>
                    <div className={`${colClasses} ${getWidthClass(3)}`}> <span className={labelClasses}>Airport of Destination</span><span className={valueClasses}>{safeGet(awbDetails, "destination")}</span> </div>
                    <div className={`${colClasses} ${getWidthClass(3)}`}> <span className={labelClasses}>Requested Flight and Date</span><span className={valueClasses}>{safeGet(awbDetails, "flightNumber")}, {readyDateFormatted}</span> </div>
                    <div className={`${colClasses} ${getWidthClass(1.5)}`}> <span className={labelClasses}>Currency</span><span className={valueClasses}>{safeGet(rates, "currency", "USD")}</span> </div>
                    <div className={`${colClasses} ${getWidthClass(2.5)}`}>
                        <span className={labelClasses}>CHGS Code</span>
                        <div className={`${valueClasses} flex gap-x-4`}> {/* Increased gap */}
                             <span>PP {safeGet(awbDetails, "freightCharges") === "Prepaid" ? "X" : "_"}</span>
                             <span>CC {safeGet(awbDetails, "freightCharges") === "Collect" ? "X" : "_"}</span>
                         </div>
                     </div>
                     <div className={`${colClasses} ${getWidthClass(2)} ${lastColClasses}`}>
                         <span className={labelClasses}>Declared Value Carriage</span>
                         <span className={valueClasses}>
                             {safeGet(awbDetails, "insuranceDetails.coverageAmount") !== '---'
                                ? formatNumber(safeGet(awbDetails, "insuranceDetails.coverageAmount"))
                                : "NVD"}
                         </span>
                     </div>
                 </div>

                {/* Section 8 & 9 : Pieces/Weight/Rate Details */}
                <div className="border-b border-gray-300 awb-row"> {/* Wrap header and data row */}
                    {/* Column Headers Row */}
                    <div className="flex border-b border-gray-300">
                        <div className={`${colClasses} ${getWidthClass(1)} items-center justify-center`}><span className={`${labelClasses} text-center`}>No. Pcs</span></div>
                        <div className={`${colClasses} ${getWidthClass(1.5)} items-center justify-center`}><span className={`${labelClasses} text-center`}>Gross Wt (kg)</span></div>
                        <div className={`${colClasses} ${getWidthClass(1)} items-center justify-center`}><span className={`${labelClasses} text-center`}>Rate Class</span></div>
                        <div className={`${colClasses} ${getWidthClass(1.5)} items-center justify-center`}><span className={`${labelClasses} text-center`}>Commodity No.</span></div>
                        <div className={`${colClasses} ${getWidthClass(2)} items-center justify-center`}><span className={`${labelClasses} text-center`}>Chargeable Wt (kg)</span></div>
                        <div className={`${colClasses} ${getWidthClass(1.5)} items-center justify-center`}><span className={`${labelClasses} text-center`}>Rate/Charge</span></div>
                        <div className={`${colClasses} ${getWidthClass(1.5)} items-center justify-center`}><span className={`${labelClasses} text-center`}>Total Charge</span></div>
                        <div className={`${colClasses} ${getWidthClass(2)} items-center justify-center ${lastColClasses}`}><span className={labelClasses}>Nature & Qty Goods (Dims/Vol)</span></div>
                    </div>
                     {/* Data Row */}
                    <div className="flex">
                        <div className={`${colClasses} ${getWidthClass(1)} items-center`}><span className={`${valueClasses} text-center`}>{safeGet(awbDetails, "pieces")}</span></div>
                        <div className={`${colClasses} ${getWidthClass(1.5)} items-center`}><span className={`${valueClasses} text-center`}>{formatNumber(safeGet(awbDetails, "weight"))}</span></div>
                        <div className={`${colClasses} ${getWidthClass(1)} items-center`}><span className={`${valueClasses} text-center`}>{safeGet(rates, "rateType")?.charAt(0) || 'N'}</span></div>
                        <div className={`${colClasses} ${getWidthClass(1.5)} items-center`}><span className={`${valueClasses} text-center`}>{safeGet(awbDetails, "hsCode")}</span></div>
                        <div className={`${colClasses} ${getWidthClass(2)} items-center`}><span className={`${valueClasses} text-center`}>{formatNumber(safeGet(rates, "chargeableWeight"))}</span></div>
                        <div className={`${colClasses} ${getWidthClass(1.5)} items-center`}><span className={`${valueClasses} text-center`}>{formatNumber(safeGet(rates, "baseRatePerKg"))}</span></div>
                        <div className={`${colClasses} ${getWidthClass(1.5)} items-end`}><span className={`${totalValueClasses} text-right w-full`}>{formatNumber(safeGet(rates, "baseCharge"))}</span></div>
                        {/* Nature of Goods & Piece Details */}
                        <div className={`${colClasses} ${getWidthClass(2)} ${lastColClasses} nature-goods-box`}>
                            <p className={`${valueClasses} whitespace-pre-line grow`}> {/* Allow text to wrap & take space */}
                                {safeGet(awbDetails, "customsDeclaration")}
                                {!loadingPieces && !fetchError && piecesData?.length > 0 && (
                                    <div className="piece-details mt-1 pt-1 border-t border-dashed border-gray-400">
                                        <span className={`${labelClasses} font-bold`}>PIECES:</span>
                                        {piecesData.map((p, index) => (
                                            <span key={p._id?.$oid || p._id || index} className={`${valueSmallClasses} block`}>
                                                {safeGet(p, 'pieceNumber', index + 1)}: {formatNumber(safeGet(p, 'actualWeight', 0), 2)}kg ({formatDimensions(p)}) {safeGet(p, 'content', '')}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {loadingPieces && <span className="block text-xs text-gray-500 mt-1">Loading pieces...</span>}
                                {fetchError && !loadingPieces && <span className="block text-xs text-red-600 mt-1">Error loading pieces.</span>}
                            </p>
                        </div>
                    </div>
                 </div>

                {/* Section 10: Totals Row */}
                <div className={rowClasses}>
                     <div className={`${colClasses} ${getWidthClass(1)} items-center`}><span className={`${totalValueClasses} text-center`}>{safeGet(awbDetails, "pieces")}</span></div>
                     <div className={`${colClasses} ${getWidthClass(1.5)} items-center`}><span className={`${totalValueClasses} text-center`}>{formatNumber(safeGet(awbDetails, "weight"))}</span></div>
                     <div className={`${colClasses} ${getWidthClass(6)}`}> </div>{/* Spacer */}
                     <div className={`${colClasses} ${getWidthClass(1.5)} items-end`}> <span className={`${totalValueClasses} text-right w-full`}>{formatNumber(safeGet(rates, "baseCharge"))}</span> </div>
                     <div className={`${colClasses} ${getWidthClass(2)} ${lastColClasses}`}> </div>{/* Spacer */}
                 </div>

                {/* Section 11: Charge Summary (Multiple Rows) */}
                <div className={rowClasses}>
                    <div className={`${colClasses} ${getWidthClass(6)} items-end`}> <span className={labelClasses}>Weight Charge</span><span className={`${valueClasses} text-right w-full`}>{formatNumber(safeGet(rates, "baseCharge"))}</span> </div>
                    <div className={`${colClasses} ${getWidthClass(6)} ${lastColClasses} items-end`}> <span className={labelClasses}>Chargeable Weight</span><span className={`${valueClasses} text-right w-full`}>{formatNumber(safeGet(awbDetails, "chargeableWeight"))}</span> </div>
                </div>
                 <div className={rowClasses}>
                    <div className={`${colClasses} ${getWidthClass(6)} items-end`}> <span className={labelClasses}>Tax</span><span className={`${valueClasses} text-right w-full`}>12.2%</span> </div>
                     <div className={`${colClasses} ${getWidthClass(6)} ${lastColClasses} items-end`}> <span className={labelClasses}>Discount</span><span className={`${valueClasses} text-right w-full`}>---</span> </div>
                 </div>
                 <div className={rowClasses}>
                    <div className={`${colClasses} ${getWidthClass(6)} items-end`}>
                         <span className={labelClasses}>Total Other Charges Due Carrier</span>
                         <span className={`${valueClasses} text-right w-full`}>{formatNumber(safeGet(rates, "otherCharges", 0))}</span>
                         <span className={`${labelClasses} text-right w-full text-[7pt]`}> {/* Smaller caption */}
                             (Fuel: {formatNumber(safeGet(rates, "fuelSurcharge", 0))}, Sec: {formatNumber(safeGet(rates, "securitySurcharge", 0))})
                         </span>
                    </div>
                     <div className={`${colClasses} ${getWidthClass(6)} ${lastColClasses} items-end`}>
                         <span className={labelClasses}>Total Prepaid</span>
                         <span className={`${totalValueClasses} text-right w-full`}> {formatNumber(safeGet(rates, "totalRate"))} </span>
                     </div>
                 </div>
                 <div className={rowClasses}>
                     <div className={`${colClasses} ${getWidthClass(6)} items-end`}>
                         <span className={labelClasses}>Total Collect</span>
                          {/* Simplified */}
                         <span className={`${totalValueClasses} text-right w-full`}> --- </span>
                     </div>
                     <div className={`${colClasses} ${getWidthClass(6)} ${lastColClasses} items-end`}>
                         <span className={labelClasses}>Currency Conversion / CC Charges</span>
                         <span className={valueClasses}>---</span>
                     </div>
                 </div>

                {/* Section 12: Signature Block */}
                <div className={rowClasses}>
                    <div className={`${colClasses} ${getWidthClass(8)} p-1`}>
                        <p className="text-[7pt] leading-tight text-justify"> {/* Small justified text */}
                            Shipper certifies that the particulars on the face hereof are correct and that insofar as any part of the consignment contains dangerous goods, such part is properly described by name and is in proper condition for carriage by air according to the applicable Dangerous Goods Regulations.
                        </p>
                        <div className="signature-box mt-auto w-4/5 pt-1 border-t border-black"> {/* Pushed to bottom */}
                            <span className={`${labelClasses} text-[7pt]`}>Signature of Shipper or its Agent</span>
                        </div>
                    </div>
                     <div className={`${colClasses} ${getWidthClass(4)} p-1 justify-end ${lastColClasses}`}>
                        <span className={`${labelClasses} block text-[7pt]`}>Executed On: {readyDateFormatted} at (Place): {safeGet(awbDetails, "origin")}</span>
                        <div className="signature-box mt-1 pt-1 border-t border-black">
                            <span className={`${labelClasses} text-[7pt]`}>Signature of Issuing Carrier or its Agent</span>
                        </div>
                    </div>
                </div>

                 {/* Section 13: Footer */}
                 <div className="flex awb-row"> {/* Final row, remove default border-b */}
                    <div className={`${colClasses} ${getWidthClass(6)}`}> </div>{/* Spacer */}
                    <div className={`${colClasses} ${getWidthClass(6)} p-1 text-right justify-center ${lastColClasses}`}>
                         <span className={`${labelClasses} block mt-1`}>ORIGINAL 1 (FOR ISSUING CARRIER)</span>
                         <span className={`${valueClasses} text-base font-bold`}>{safeGet(awbDetails, "awbNo")}</span> {/* Slightly larger AWB# */}
                    </div>
                 </div>

            </Paper> {/* End Printable Paper */}

            {/* --- Email Dialog Component (MUI - remains the same) --- */}
            <Dialog
                open={isEmailDialogOpen}
                onClose={handleCloseEmailDialog}
                maxWidth="sm"
                fullWidth
                disableEscapeKeyDown={isSendingEmail}
            >
                <DialogTitle>Email Air Waybill</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Enter recipient details. The AWB PDF will be generated and sent.
                    </DialogContentText>
                    {emailDialogError && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setEmailDialogError('')}>
                            {emailDialogError}
                        </Alert>
                    )}
                    <TextField /* MUI TextField is fine here */
                        autoFocus required margin="dense" id="recipient-email"
                        label="Recipient Email Address" type="email" fullWidth
                        variant="outlined" value={emailRecipient}
                        onChange={(e) => setEmailRecipient(e.target.value)}
                        disabled={isSendingEmail}
                    />
                    <TextField /* MUI TextField is fine here */
                        required margin="dense" id="subject" label="Subject" type="text"
                        fullWidth variant="outlined" value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        disabled={isSendingEmail}
                    />
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleCloseEmailDialog} disabled={isSendingEmail} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSendEmailSubmit} variant="contained" color="primary"
                        disabled={isSendingEmail || !emailRecipient || !emailSubject}
                        startIcon={isSendingEmail ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    >
                        {isSendingEmail ? 'Sending...' : 'Send Email'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

// --- PropTypes Removed ---

export default AwbPrintnMailTab;