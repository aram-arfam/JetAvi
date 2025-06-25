import mongoose from "mongoose";

const AwbSchema = new mongoose.Schema(
  {
    airline: {
      type: String,
      required: true,
      enum: [
        "Emirates_176",
        "Qatar Airways Cargo_157",
        "Lufthansa Cargo_020",
        "Turkish Airlines Cargo_235",
        "Air France Cargo_057",
        "British Airways Cargo_125",
        "Singapore Airlines Cargo_618",
        "Cathay Pacific Cargo_160",
        "Korean Air Cargo_180",
        "Etihad Cargo_607",
      ],
    },
    mawbNo: { type: String, required: true, unique: true },
    awbNo: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    customerContactNumber: { type: String, required: true },
    company: { type: String, required: true },
    agentBroker: { type: String },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    delivery: {
      type: String,
      enum: [
        "Airport Pickup",
        "Door-to-Door Delivery",
        "Warehouse Pickup",
        "Port-to-Port",
        "Terminal Handling",
        "Courier Service",
        "Freight Forwarder Pickup",
      ],
      default: "Airport Pickup",
    },
    status: {
      type: String,
      enum: [
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
      ],
      default: "Request",
    },

    pieces: { type: Number, required: true },
    weight: { type: Number, required: true },
    chargeableWeight: { type: Number },
    volume: { type: Number, required: true },
    readyDate: { type: Date },
    arrivalDate: { type: Date },
    weightDiscrepancy: { type: Boolean, default: false },
    priorityShipment: { type: Boolean, default: false },
    qualityCheck: { type: Boolean, default: false },
    customsClearance: {
      type: String,
      enum: ["Pending", "Cleared", "Held"],
      default: "Pending",
    },
    insurance: {
      type: String,
      enum: ["Paid", "Approved", "Declined", "Expired"],
      default: "Paid",
    },
    specialHandling: {
      type: String,
      enum: ["Yes", "No", "Fragile"],
      default: "No",
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    flightNumber: {
      type: String,
      required: true,
    },
    shipperName: {
      type: String,
      required: true,
    },
    shipperContactNumber: { type: String, required: true },
    shipperAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String, required: true },
    },

    consigneeName: {
      type: String,
      required: true,
    },
    consigneeAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },
    consigneeContactNumber: {
      type: String,
      required: true,
    },
    freightCharges: {
      type: String,
      enum: ["Prepaid", "Collect"],
      required: true,
    },
    customsDeclaration: {
      type: String,
    },
    hsCode: {
      type: String,
    },
    insuranceDetails: {
      policyNumber: String,
      coverageAmount: Number,
      insuranceCompany: String,
      policyDate: Date,
    },
    rates: {
      baseRatePerKg: { type: Number, },
      baseCharge: { type: Number, },
      fuelSurcharge: { type: Number, },
      securitySurcharge: { type: Number, },
      otherCharges: { type: Number, default: 0 },
      totalRate: { type: Number, },
      chargeableWeight: { type: Number, },
      actualWeight: { type: Number, },
      currency: { type: String, default: "USD" ,enum:["USD", "EUR", "GBP", "JPY", "CNY", "AED"]},
      rateType: {
        type: String,
        enum: ["Normal Rate", "Quantity Discount", "ULD Container", "Express Cargo", "Class Cargo", "Specific Commodity"],
        default: "Normal Rate",
      },
      classification: {
        type: String,
        enum: ["General Cargo", "Valuable Cargo", "Perishable Cargo", "Dangerous Goods", "Heavy Cargo", "Live Animals"],
        default: "General Cargo",
      },
      iataZone: {
        type: String,
        enum: ["WITHIN_1", "BETWEEN_1_2", "WITHIN_2", "OTHER", "WITHIN_3", "BETWEEN_2_3", "WITHIN1_3"],
        default: "OTHER",
      },
      isManuallyAdjusted: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

// Generate sequential MAWB and AWB numbers using airline code
AwbSchema.pre("validate", async function (next) {
  try {
    if (!this.airline) {
      throw new Error("Airline selection is required");
    }

    // Extract the airline prefix (last part after "_")
    const airlinePrefix = this.airline.split("_")[1];

    if (!this.mawbNo) {
      // Find last MAWB for this airline
      const lastMawb = await mongoose
        .model("Awb")
        .findOne({ airline: this.airline })
        .sort({ createdAt: -1 });

      // Start from 10000000 or increment last number
      const lastMawbNumber = lastMawb
        ? parseInt(lastMawb.mawbNo.split("-")[1])
        : 10000000;

      // Format: PREFIX-XXXXXXXX
      this.mawbNo = `${airlinePrefix}-${String(lastMawbNumber + 1).padStart(
        8,
        "0"
      )}`;
    }

    if (!this.awbNo) {
      // Find last AWB for this airline
      const lastAwb = await mongoose
        .model("Awb")
        .findOne({ airline: this.airline })
        .sort({ createdAt: -1 });

      // Start from 10000000 or increment last number
      const lastAwbNumber = lastAwb
        ? parseInt(lastAwb.awbNo.split("-")[1])
        : 10000000;

      // Format: PREFIX-XXXXXXXX
      this.awbNo = `${airlinePrefix}-${String(lastAwbNumber + 1).padStart(
        8,
        "0"
      )}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Awb = mongoose.models.Awb || mongoose.model("Awb", AwbSchema);

const AwbPieceSchema = new mongoose.Schema(
  {
    awbId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Awb",
      required: true,
    },
    pieceNumber: {
      type: Number,
      required: true,
    },
    actualWeight: {
      type: Number,
      required: true,
    },
    chargeableWeight: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
    specialHandling: {
      type: String,
      enum: [
        "Normal",
        "Fragile",
        "Dangerous",
        "Perishable",
        "Valuable",
        "Live Animals",
      ],
      default: "Normal",
    },
    status: {
      type: String,
      enum: ["Active", "Damaged", "Missing", "Delivered", "Pending", "Loaded"],
      default: "Active",
    },
    notes: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },


    rates: {
      baseRatePerKg: { type: Number, },
      baseCharge: { type: Number, },
      fuelSurcharge: { type: Number, },
      securitySurcharge: { type: Number, },
      otherCharges: { type: Number, default: 0 },
      totalRate: { type: Number, },
      chargeableWeight: { type: Number, },
      actualWeight: { type: Number, },
      currency: { type: String, default: "USD" ,enum:["USD", "EUR", "GBP", "JPY", "CNY", "AED"]},
      rateType: {
        type: String,
        enum: ["Normal Rate", "Quantity Discount", "ULD Container", "Express Cargo", "Class Cargo", "Specific Commodity"],
        default: "Normal Rate",
      },
      classification: {
        type: String,
        enum: ["General Cargo", "Valuable Cargo", "Perishable Cargo", "Dangerous Goods", "Heavy Cargo", "Live Animals"],
        default: "General Cargo",
      },
      iataZone: {
        type: String,
        enum: ["WITHIN_1", "BETWEEN_1_2", "WITHIN_2", "OTHER", "WITHIN_3", "BETWEEN_2_3", "WITHIN1_3"],
        default: "OTHER",
      },
      isManuallyAdjusted: {
        type: Boolean,
        default: false,
      },
    },
  
  },
  { timestamps: true }
);

const AwbPiece =
  mongoose.models.AwbPiece || mongoose.model("AwbPiece", AwbPieceSchema);

export { Awb, AwbPiece };
