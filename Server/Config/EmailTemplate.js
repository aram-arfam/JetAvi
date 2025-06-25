export const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Air Waybill - <%= awbDetails.awbNo %></title>
    <style>
        /* Basic CSS for PDF - Keep it simple and use inline styles for critical things */
        body {
            font-family: Arial, sans-serif;
            /* --- REDUCE BASE FONT SIZE --- */
            font-size: 8.5pt; /* Try slightly smaller */
            /* --- REDUCE BASE LINE HEIGHT --- */
            line-height: 1.15; /* Try slightly tighter */
            margin: 0;
            color: #000;
            background-color: #fff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .awb-container {
            width: 100%;
            max-width: 750px;
            margin: 0 auto;
            border: 1px solid #ccc;
            background-color: #fff;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
            padding: 0;
        }
        .section-row {
            border-bottom: 1px solid #ccc;
            display: table;
            width: 100%;
        }
        .grid-item {
            display: table-cell;
            border-right: 1px solid #ccc;
            /* --- REDUCE PADDING --- */
            padding: 2px 4px; /* Reduced vertical padding */
            vertical-align: top;
            /* --- REDUCE OR REMOVE MIN-HEIGHT --- */
            min-height: 2.5em; /* Try reducing this */
            box-sizing: border-box;
            position: relative;
        }
        /* ... (rest of grid-item width styles xs-1, xs-2 etc.) ... */
        .grid-item:last-child {
            border-right: none;
        }
        .label {
            display: block;
            font-size: 7pt; /* Keep label small */
            color: #555;
            /* --- REDUCE MARGIN BELOW LABEL --- */
            margin-bottom: 1px; /* Tighter spacing */
            line-height: 1.1;
        }
        .value {
            display: block;
            font-family: 'Courier New', Courier, monospace;
            /* --- ADJUST VALUE LINE HEIGHT if needed --- */
            line-height: 1.15; /* Match body or slightly tighter */
            word-break: break-word;
        }
        .value-normal {
            font-family: Arial, sans-serif;
        }
        .value-total {
            font-weight: bold;
        }
        .align-center { text-align: center; }
        .align-right { text-align: right; }
        .main-header {
            font-size: 13pt; /* Slightly smaller header */
            font-weight: bold;
            text-align: center;
            /* --- REDUCE HEADER MARGIN --- */
            margin: 3px 0;
        }
        .piece-details {
            /* --- REDUCE SPACING ABOVE PIECES --- */
            margin-top: 4px;
            padding-top: 4px;
            border-top: 1px dashed #ccc;
        }
        .piece-detail-item {
            font-family: 'Courier New', Courier, monospace;
            font-size: 7.5pt; /* Slightly smaller piece details */
            line-height: 1.1;
            display: block;
            /* --- REDUCE MARGIN BETWEEN PIECES if any (use margin-bottom: 1px;) --- */
        }
        .signature-box {
             /* --- REDUCE SPACING ABOVE SIGNATURE --- */
             margin-top: 8px;
             padding-top: 4px;
             border-top: 1px solid #000;
             font-size: 7pt;
             color: #555;
        }
        /* --- REDUCE NATURE OF GOODS BOX HEIGHT if possible --- */
        .nature-goods-box { min-height: 4em; } /* Try reducing */

        .bold { font-weight: bold; }
        .pre-line { white-space: pre-line; }
        .section-row, .grid-item, p, h1, h2 { page-break-inside: avoid; } /* Keep this */
    </style>
</head>
<body>
    <div class="awb-container">
        <!-- Section 1: Shipper / Header / Airline -->
        <div class="section-row">
            <div class="grid-item xs-4">
                <span class="label">Shipper's Name and Address</span>
                <span class="value pre-line"><%= awbDetails.shipperName %><br><%= awbDetails.shipperAddress?.street %><br><%= awbDetails.shipperAddress?.city %>, Postal Code: <%= awbDetails.shipperAddress?.postalCode %><br><%= awbDetails.shipperAddress?.country %><br>PHONE: <%= awbDetails.shipperContactNumber %></span>
            </div>
            <div class="grid-item xs-4" style="vertical-align: middle;">
                <div class="align-center"><span class="label">AWB Number</span> <span class="value"><%= awbDetails.awbNo %></span></div>
                <div class="main-header">Air Waybill</div>
                <div class="align-center"><span class="label" style="font-size:8pt;">Issued by JetStreams International</span></div>
            </div>
            <div class="grid-item xs-4" style="vertical-align: middle;">
                 <div class="align-center"><span class="label">Airline</span> <span class="value"><%= airlineName %></span></div>
                 <div class="align-center"><span class="label">Status <%= awbDetails.status %></span></div>
                 <div class="align-center"><span class="label">Company <%= awbDetails.company %></span></div>
            </div>
        </div>

        <!-- Section 2: AWB Number Bar -->
        <div class="section-row" style="min-height: 2.5em; align-items: center;">
             <div class="grid-item xs-12" style="text-align: center; padding: 8px 0;"> <span class="value bold" style="font-size: 14pt;"><%= awbDetails.awbNo %></span> </div>
        </div>

        <!-- Section 3: Consignee / Other Details -->
        <div class="section-row">
             <div class="grid-item xs-6">
                 <span class="label">Consignee's Name and Address</span>
                 <span class="value pre-line"><%= awbDetails.consigneeName %><br><%= awbDetails.consigneeAddress?.street %><br><%= awbDetails.consigneeAddress?.city %>, Postal Code: <%= awbDetails.consigneeAddress?.postalCode %><br><%= awbDetails.consigneeAddress?.country %><br>PHONE: <%= awbDetails.consigneeContactNumber %></span>
             </div>
             <div class="grid-item xs-6">
                 <span class="label">Other Details</span>
                 <span class="value pre-line">Customer Name: <%= awbDetails.customer %><br>Contact: <%= awbDetails.customerContactNumber %></span>
                 <br>
                 <span class="label">Delivery Type</span>
                 <span class="value"><%= awbDetails.delivery %></span>
             </div>
         </div>

         <!-- Section 4: Agent / Accounting Info -->
         <div class="section-row">
             <div class="grid-item xs-6">
                 <span class="label">Issuing Carrier's Agent Name and City</span>
                 <span class="value pre-line"><%= awbDetails.agentBroker %><br><%= awbDetails.origin %><br>PHONE: <%= awbDetails.customerContactNumber %></span>
             </div>
             <div class="grid-item xs-6">
                 <span class="label">Accounting Information</span>
                 <span class="value pre-line">NOTIFY: <%= awbDetails.consigneeName %><br>PH: <%= awbDetails.consigneeContactNumber %></span>
             </div>
         </div>

        <!-- Section 5: Codes / Ref No -->
        <div class="section-row">
             <div class="grid-item xs-3"><span class="label">Agent's IATA Code</span><span class="value"><%= airlineCode %></span></div>
             <div class="grid-item xs-6"><span class="label">Reference Number</span><span class="value"><%= awbDetails.hsCode %></span></div>
             <div class="grid-item xs-3"></div> <!-- Spacer -->
         </div>

        <!-- Section 6: Routing / Handling -->
        <div class="section-row">
            <div class="grid-item xs-3"><span class="label">Airport of Departure</span><span class="value"><%= awbDetails.origin %></span></div>
             <!-- Nested structure mimicking inner grid -->
             <div class="grid-item xs-9" style="padding:0; border-right: none;">
                 <div style="display: table; width: 100%;">
                     <div style="display: table-cell; width: 22.22%; border-right: 1px solid #ccc; padding: 4px 6px; vertical-align: top;"><span class="label">To</span><span class="value"><%= awbDetails.destination %></span></div>
                     <div style="display: table-cell; width: 22.22%; border-right: 1px solid #ccc; padding: 4px 6px; vertical-align: top;"><span class="label">By First Carrier</span><span class="value"><%= airlineName %></span></div>
                     <div style="display: table-cell; width: 33.33%; border-right: 1px solid #ccc; padding: 4px 6px; vertical-align: top;"><span class="label">Routing & Dest</span><span class="value"><%= awbDetails.destination %></span></div>
                     <div style="display: table-cell; width: 22.23%; padding: 4px 6px; vertical-align: top;"><span class="label">Handling Info</span><span class="value"><%= awbDetails.specialHandling %></span></div>
                 </div>
             </div>
        </div>

        <!-- Section 7: Flight / Currency / Charges / Value -->
        <div class="section-row">
            <div class="grid-item xs-3"><span class="label">Airport of Destination</span><span class="value"><%= awbDetails.destination %></span></div>
            <div class="grid-item xs-3"><span class="label">Requested Flight and Date</span><span class="value"><%= awbDetails.flightNumber %>, <%= readyDateFormatted %></span></div>
            <div class="grid-item xs-1-5"><span class="label">Currency</span><span class="value"><%= rates.currency || 'USD' %></span></div>
            <div class="grid-item xs-2-5">
                <span class="label">CHGS Code</span>
                <span class="value" style="display: flex; gap: 1em;">
                    <span>PP <%= awbDetails.freightCharges === "Prepaid" ? "X" : "_" %></span>
                    <span>CC <%= awbDetails.freightCharges === "Collect" ? "X" : "_" %></span>
                </span>
            </div>
            <div class="grid-item xs-2">
                 <span class="label">Declared Value Carriage</span>
                 <span class="value"><%= typeof awbDetails.insuranceDetails?.coverageAmount === 'number' ? formatNumber(awbDetails.insuranceDetails.coverageAmount) : "NVD" %></span>
            </div>
        </div>

        <!-- Section 8 & 9: Pieces/Weight/Rate Details (Combined Header & Data) -->
        <div class="section-row">
             <table style="width: 100%; border-collapse: collapse;">
                 <thead>
                    <tr style="border-bottom: 1px solid #ccc;">
                        <th style="width: 8.33%; text-align: center;"><span class="label">No. Pcs</span></th>
                        <th style="width: 12.5%; text-align: center;"><span class="label">Gross Wt (kg)</span></th>
                        <th style="width: 8.33%; text-align: center;"><span class="label">Rate Class</span></th>
                        <th style="width: 12.5%; text-align: center;"><span class="label">Commodity No.</span></th>
                        <th style="width: 16.67%; text-align: center;"><span class="label">Chargeable Wt (kg)</span></th>
                        <th style="width: 12.5%; text-align: center;"><span class="label">Rate/Charge</span></th>
                        <th style="width: 12.5%; text-align: center;"><span class="label">Total Charge</span></th>
                        <th style="width: 16.67%; border-right: none;"><span class="label">Nature & Qty Goods (Dims/Vol)</span></th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr>
                        <td style="text-align: center;"><span class="value"><%= awbDetails.pieces %></span></td>
                        <td style="text-align: center;"><span class="value"><%= formatNumber(awbDetails.weight) %></span></td>
                        <td style="text-align: center;"><span class="value"><%= rates.rateType?.charAt(0) || 'N' %></span></td>
                        <td style="text-align: center;"><span class="value"><%= awbDetails.hsCode %></span></td>
                        <td style="text-align: center;"><span class="value"><%= formatNumber(rates.chargeableWeight) %></span></td>
                        <td style="text-align: center;"><span class="value"><%= formatNumber(rates.baseRatePerKg) %></span></td>
                        <td style="text-align: right;"><span class="value value-total"><%= formatNumber(rates.baseCharge) %></span></td>
                        <td class="nature-goods-box" style="border-right: none;">
                            <span class="value value-normal"><%= awbDetails.customsDeclaration %></span>
                            <% if (piecesData && piecesData.length > 0) { %>
                                <div class="piece-details">
                                    <span class="label bold">PIECES:</span>
                                    <% piecesData.forEach((p, index) => { %>
                                        <span class="piece-detail-item">
                                            <%= safeGet(p, 'pieceNumber', index + 1) %>: <%= formatNumber(safeGet(p, 'actualWeight', 0), 2) %>kg (<%= formatDimensions(p) %>) <%= safeGet(p, 'content', '') %>
                                        </span>
                                    <% }); %>
                                </div>
                            <% } %>
                        </td>
                    </tr>
                 </tbody>
             </table>
        </div>

        <!-- Section 10: Totals Row -->
         <div class="section-row">
             <div class="grid-item xs-1"><span class="value value-total align-center"><%= awbDetails.pieces %></span></div>
             <div class="grid-item xs-1-5"><span class="value value-total align-center"><%= formatNumber(awbDetails.weight) %></span></div>
             <div class="grid-item xs-6"></div><!-- Spacer -->
             <div class="grid-item xs-1-5"><span class="value value-total align-right"><%= formatNumber(rates.baseCharge) %></span></div>
             <div class="grid-item xs-2"></div><!-- Spacer -->
         </div>

        <!-- Section 11: Charge Summary -->
        <div class="section-row">
            <div class="grid-item xs-6"><span class="label">Weight Charge</span><span class="value align-right"><%= formatNumber(rates.baseCharge) %></span></div>
            <div class="grid-item xs-6"><span class="label">Chargeable Weight</span><span class="value align-right"><%= formatNumber(awbDetails.chargeableWeight) %></span></div>
        </div>
        <div class="section-row">
             <div class="grid-item xs-6"><span class="label">Tax</span><span class="value align-right">12.2%</span></div> <!-- Hardcoded example -->
             <div class="grid-item xs-6"><span class="label">Discount</span><span class="value align-right">---</span></div>
         </div>
        <div class="section-row">
             <div class="grid-item xs-6">
                 <span class="label">Total Other Charges Due Carrier</span>
                 <span class="value align-right"><%= formatNumber(rates.otherCharges, 2, 0) %></span>
                 <span class="label align-right" style="font-size: 7pt;">(Fuel: <%= formatNumber(rates.fuelSurcharge, 2, 0) %>, Sec: <%= formatNumber(rates.securitySurcharge, 2, 0) %>)</span>
             </div>
             <div class="grid-item xs-6">
                 <span class="label">Total Prepaid</span>
                 <span class="value value-total align-right"><%= formatNumber(rates.totalRate) %></span>
             </div>
         </div>
        <div class="section-row">
             <div class="grid-item xs-6">
                 <span class="label">Total Collect</span>
                 <span class="value value-total align-right">Prepaid</span> <!-- Assuming Prepaid logic -->
             </div>
             <div class="grid-item xs-6">
                 <span class="label">Currency Conversion / CC Charges</span>
                 <span class="value align-right">---</span>
             </div>
         </div>

        <!-- Section 12: Signature Block -->
        <div class="section-row">
             <div class="grid-item xs-8">
                 <p style="font-size: 7pt; text-align: justify; margin: 0;">Shipper certifies that the particulars on the face hereof are correct and that insofar as any part of the consignment contains dangerous goods, such part is properly described by name and is in proper condition for carriage by air according to the applicable Dangerous Goods Regulations.</p>
                 <div class="signature-box" style="width: 80%;">Signature of Shipper or its Agent</div>
             </div>
             <div class="grid-item xs-4" style="display: flex; flex-direction: column; justify-content: flex-end;">
                 <span class="label" style="margin-bottom: 5px;">Executed On: <%= readyDateFormatted %> at (Place): <%= awbDetails.origin %></span>
                 <div class="signature-box">Signature of Issuing Carrier or its Agent</div>
             </div>
         </div>

         <!-- Section 13: Footer -->
         <div class="section-row" style="border-bottom: none;">
            <div class="grid-item xs-6"></div><!-- Spacer -->
            <div class="grid-item xs-6 align-right">
                <span class="label" style="margin-top: 5px;">ORIGINAL 1 (FOR ISSUING CARRIER)</span>
                <span class="value bold" style="font-size: 11pt;"><%= awbDetails.awbNo %></span>
            </div>
         </div>
    </div>
</body>
</html>
`