import { Awb, AwbPiece } from "../Models/AwbModel.js";
import transporter from "../Config/Nodemailer.js"
import puppeteer from "puppeteer";
import path from "path";
import ejs from "ejs";
import { formatNumber, formatDimensions, formatDate, safeGet } from "../Utils/Formatters.js";
import { emailTemplate } from "../Config/EmailTemplate.js";



// Create a new AWB entry
export const createAwb = async (req, res) => {
  try {
    const newAwb = new Awb(req.body);
    await newAwb.save();
    res.status(201).json({ success: true, data: newAwb });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all AWBs
export const getAllAwbs = async (req, res) => {
  try {
    const awbs = await Awb.find();
    res.status(200).json({ success: true, data: awbs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single AWB by AWBNO
export const getAwbByAwbNo = async (req, res) => {
  try {
    const { awbNo } = req.params; // Extract awbNo from URL parameters
    const awb = await Awb.findOne({ awbNo }); // Find AWB by awbNo

    if (!awb) {
      return res.status(404).json({ success: false, message: "AWB not found" });
    }

    res.status(200).json({ success: true, data: awb });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an AWB entry
export const updateAwb = async (req, res) => {
  try {
    const { awbNo } = req.params; // Extract awbNo from URL
    console.log("Received awbNo:", awbNo);
    const updatedAwb = await Awb.findOneAndUpdate({ awbNo }, req.body, {
      new: true,
    });

    if (!updatedAwb) {
      return res.status(404).json({ success: false, message: "AWB not found" });
    }

    res.status(200).json({ success: true, data: updatedAwb });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete an AWB entry
export const deleteAwb = async (req, res) => {
  try {
    const deletedAwb = await Awb.findByIdAndDelete(req.params.id);
    if (!deletedAwb)
      return res.status(404).json({ success: false, message: "AWB not found" });

    res
      .status(200)
      .json({ success: true, message: "AWB deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate AWB numbers
export const generateAwbNumbers = async (req, res) => {
  try {
    const { airlineCode } = req.body;

    if (!airlineCode) {
      return res.status(400).json({
        success: false,
        message: "Airline code is required",
      });
    }

    // Extract the airline code from the format "Airline Name_CODE"
    const code = airlineCode.split("_")[1];

    // Fetch the last AWB & MAWB from DB for this airline
    const lastAwb = await Awb.findOne({ airline: airlineCode }).sort({
      createdAt: -1,
    });
    const lastMawb = await Awb.findOne({ airline: airlineCode }).sort({
      createdAt: -1,
    });

    // Get last numbers and increment
    const lastMawbNumber = lastMawb
      ? parseInt(lastMawb.mawbNo.split("-")[1])
      : 10000000;
    const lastAwbNumber = lastAwb
      ? parseInt(lastAwb.awbNo.split("-")[1])
      : 10000000;

    // Generate next sequential numbers using airline code
    const mawbNo = `${code}-${String(lastMawbNumber + 1).padStart(8, "0")}`;
    const awbNo = `${code}-${String(lastAwbNumber + 1).padStart(8, "0")}`;

    res.status(200).json({
      success: true,
      data: { mawbNo, awbNo },
    });
  } catch (error) {
    console.error("Error generating AWB numbers:", error);
    res.status(500).json({
      success: false,
      message: "Error generating numbers",
      error: error.message,
    });
  }
};
 


//email awb
export const emailAwb = async (req, res) => {
 
  const { to, subject, htmlBody } = req.body;

  if (!to || !subject || !htmlBody) {
      console.error('Email request missing required fields:', { to: !!to, subject: !!subject, htmlBody: !!htmlBody });
      return res.status(400).json({ success: false, message: 'Missing required fields: to, subject, htmlBody.' });
  }

  const mailOptions = {
      from: `"JetAvi" <alamarfam786@gmail.com>`,
      to: to,
      subject: subject,
      html: htmlBody,
  };

  console.log(`Attempting to send email via Brevo to: ${to}, Subject: ${subject}`);

  try {
      const info = await transporter.sendMail(mailOptions);

      console.log('Email sent successfully via Brevo:', info.messageId);
      res.status(200).json({ success: true, message: 'Email sent successfully!', messageId: info.messageId });

  } catch (error) {
      console.error('Error sending email via Brevo:', error);
      res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });
  }
};


//emailpdf

export const handleEmailAwbPdfRequest = async (req, res) => {
    const { to, subject, awbId } = req.body;
    if (!to || !subject || !awbId) {
        console.error("Validation Error: Missing required fields.", { to, subject, awbId });
        return res.status(400).json({ success: false, message: 'Missing required fields: to, subject, awbId.' });
    }
    if (!/\S+@\S+\.\S+/.test(to)) {
        console.error("Validation Error: Invalid email format.", { to });
        return res.status(400).json({ success: false, message: 'Invalid recipient email format.' });
    }

    let browser = null; // Initialize browser variable outside try block

    try {
        console.log(`[${awbId}] Fetching data for AWB ID: ${awbId}`);
        const awbDetails = await Awb.findById(awbId).lean();
        const piecesData = await AwbPiece.find({ awbId: awbId }).lean();

        if (!awbDetails) {
            console.error(`[${awbId}] AWB not found for ID: ${awbId}`);
            return res.status(404).json({ success: false, message: 'AWB not found.' });
        }
        console.log(`[${awbId}] AWB details fetched successfully.`);
        console.log(`[${awbId}] Found ${piecesData.length} pieces.`);

        const awbNumber = safeGet(awbDetails, "awbNo", 'UnknownAWB');
        const airlineName = safeGet(awbDetails, "airline", "").split("_")[0] || "---";
        const airlineCode = safeGet(awbDetails, "airline", "").split("_")[1] || "---";
        const readyDateFormatted = formatDate(safeGet(awbDetails, "readyDate"));
        const rates = awbDetails.rates || {};

        console.log(`[${awbId}] Rendering HTML template for PDF...`);
        const htmlContent =  ejs.render(emailTemplate, {
            awbDetails,
            piecesData,
            rates,
            airlineName,
            airlineCode,
            readyDateFormatted,
            awbNumber,
            formatNumber,
            formatDimensions,
            formatDate,
            safeGet
        });
        console.log(`[${awbId}] HTML rendered successfully.`);

      
        console.log(`[${awbId}] Launching Puppeteer...`);
        browser = await puppeteer.launch({
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ],
            headless: true
        });
        const page = await browser.newPage();

        console.log(`[${awbId}] Setting HTML content in Puppeteer page...`);
        // Using goto with data URI is often more reliable for complex HTML/CSS
        await page.goto(`data:text/html;charset=UTF-8,${encodeURIComponent(htmlContent)}`, {
            waitUntil: 'networkidle0' // Wait for network activity to cease (images, fonts)
        });
        // Alternative: await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        console.log(`[${awbId}] Generating PDF buffer...`);
        const pdfBuffer = await page.pdf({
            format: 'A4', // Standard paper size
            printBackground: true, // Crucial for rendering CSS background colors/images
            margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' } // Standard margins
        });
        console.log(`[${awbId}] PDF buffer generated successfully (Size: ${pdfBuffer.length} bytes).`);
        await page.close(); // Close the page after PDF generation

        // --- 4. Prepare Email Options with Attachment ---
        console.log(`[${awbId}] Preparing email options for: ${to}`);
        const mailOptions = {
            from: `"JetAvi" <alamarfam786@gmail.com>`, // Use environment variable for sender
            to: to, // Recipient from request
            subject: subject, // Subject from request
            // Provide both text and HTML bodies for better email client compatibility
            text: `Please find attached the Air Waybill ${awbNumber}.\n\nThank you,\nJetAvi Team`,
            html: `<p>Dear Customer,</p><p>Please find attached the Air Waybill <b>${awbNumber}</b>.</p><p>Thank you,<br>JetAvi Team</p>`,
            attachments: [
                {
                    filename: `AirWaybill-${awbNumber}.pdf`, // Dynamic filename
                    content: pdfBuffer, // The generated PDF buffer
                    contentType: 'application/pdf' // Standard PDF MIME type
                }
            ]
        };

        // --- 5. Send Email ---
        console.log(`[${awbId}] Sending email with PDF attachment to: ${to}`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`[${awbId}] Email with PDF sent successfully! Message ID: ${info.messageId}`);

        // --- Respond to Frontend ---
        res.status(200).json({
            success: true,
            message: 'Email with PDF attachment sent successfully!',
            messageId: info.messageId
        });

    } catch (error) {
        // --- Comprehensive Error Handling ---
        console.error(`[${awbId || 'N/A'}] Error during PDF generation or email sending:`, error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate PDF or send email. Please check server logs for details.'
         });
    } finally {
        if (browser) {
            console.log(`[${awbId || 'N/A'}] Closing Puppeteer browser...`);
            try {
                 await browser.close();
                 console.log(`[${awbId || 'N/A'}] Puppeteer browser closed successfully.`);
            } catch (closeErr) {
                 console.error(`[${awbId || 'N/A'}] Error closing Puppeteer browser:`, closeErr);
            }
        }
    }
};







// Create a new piece for an AWB
export const createAwbPiece = async (req, res) => {
  try {
    const { awbId } = req.params;
    const pieceData = {
      ...req.body,
      awbId,
      pieceNumber: parseInt(req.body.pieceNo),
      weight: parseFloat(req.body.weight),
      length: parseFloat(req.body.length),
      width: parseFloat(req.body.width),
      height: parseFloat(req.body.height),
    };

    // Calculate volume in cubic meters
    pieceData.volume = pieceData.length * pieceData.width * pieceData.height;

    const newPiece = new AwbPiece(pieceData);
    await newPiece.save();

    // Update the main AWB's total pieces count
    await Awb.findByIdAndUpdate(awbId, {
      $inc: { pieces: 1 },
      $set: { lastUpdated: new Date() },
    });

    res.status(201).json({ success: true, data: newPiece });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all pieces for a specific AWB
export const getAwbPieces = async (req, res) => {
  try {
    const { awbId } = req.params;
    const pieces = await AwbPiece.find({ awbId }).sort({ pieceNumber: 1 });
    res.status(200).json({ success: true, data: pieces });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a piece
export const updateAwbPiece = async (req, res) => {
  try {
    const { pieceId } = req.params;
    const pieceData = {
      ...req.body,
      pieceNumber: parseInt(req.body.pieceNo),
      weight: parseFloat(req.body.weight),
      length: parseFloat(req.body.length),
      width: parseFloat(req.body.width),
      height: parseFloat(req.body.height),
    };

    // Calculate volume in cubic meters
    pieceData.volume =
      (pieceData.length * pieceData.width * pieceData.height) / 1000000;

    const updatedPiece = await AwbPiece.findByIdAndUpdate(pieceId, pieceData, {
      new: true,
    });

    if (!updatedPiece) {
      return res
        .status(404)
        .json({ success: false, message: "Piece not found" });
    }

    res.status(200).json({ success: true, data: updatedPiece });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a piece
export const deleteAwbPiece = async (req, res) => {
  try {
    const { pieceId, awbId } = req.params;

    const deletedPiece = await AwbPiece.findByIdAndDelete(pieceId);

    if (!deletedPiece) {
      return res
        .status(404)
        .json({ success: false, message: "Piece not found" });
    }

    // Update the main AWB's total pieces count
    await Awb.findByIdAndUpdate(awbId, {
      $inc: { pieces: -1 },
      $set: { lastUpdated: new Date() },
    });

    res
      .status(200)
      .json({ success: true, message: "Piece deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single piece
export const getAwbPiece = async (req, res) => {
  try {
    const { pieceId } = req.params;
    const piece = await AwbPiece.findById(pieceId);

    if (!piece) {
      return res
        .status(404) 
        .json({ success: false, message: "Piece not found" });
    }

    res.status(200).json({ success: true, data: piece });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get awb stats
export const getAWBStats = async (req, res) => {
  console.log("GET /api/awbs/stats hit!");
  try {
    const totalAWBs = await Awb.countDocuments();
    const activeAWBs = await Awb.countDocuments({ status: { $in: ["Planned","Transit", "Forward",  "Departure", "Arrival"] } });
    const pendingAWBs = await Awb.countDocuments({ status: { $in: ["Request", "Waiting","Not-Complete","Unplanned","Off-Loaded","Standby","Missing","Canceled"] } });

    res.status(200).json({
      success: true,
      totalAWBs,
      activeAWBs,
      pendingAWBs,
    });
  } catch (error) {
    console.error("Error fetching AWB stats:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const getRates = async (req, res) => {
  try {
    const { awbId } = req.params;
    const rates = await AwbPiece.find({ awbId }).sort({ pieceNumber: 1 });
    res.status(200).json({ success: true, data: rates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addRate = async (req, res) => {
  try {
    const { awbId } = req.params;
    const rateData = req.body;
    const newRate = new Rate(rateData);
    await newRate.save();
    res.status(201).json({ success: true, data: newRate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRate = async (req, res) => {
  try {
    const { awbId, rateId } = req.params;
    const rateData = req.body;
    const updatedRate = await Rate.findByIdAndUpdate(rateId, rateData, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedRate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRate = async (req, res) => {
  try {
    const { awbId, rateId } = req.params;
    const deletedRate = await Rate.findByIdAndDelete(rateId);
    if (!deletedRate) {
      return res.status(404).json({ success: false, message: "Rate not found" });
    }
    res.status(200).json({ success: true, message: "Rate deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateRates = async (req, res) => {
  try {
    const { awbId } = req.params;
    const rateSettings = req.body;
    // Your rate generation logic here
    res.status(200).json({ success: true, message: "Rates generated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


  