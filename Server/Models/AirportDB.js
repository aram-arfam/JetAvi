import mongoose from "mongoose";

const airportSchema = new mongoose.Schema(
  {
    // Basic Information
    name: { type: String, required: true },
    icao: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      minlength: 4,
      maxlength: 4,
    },
    iata: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    city: { type: String, required: true },
    country: { type: String, required: true },

    // Time and Operations
    timezone: { type: String, required: true },
    openingHours: { type: String, required: true },
    open24: { type: Boolean, default: false },

    // Infrastructure
    operator: { type: String },
    tarmac: { type: String },
    runways: [
      {
        lengthMeters: Number,
        surfaceType: String, // Example: "Asphalt", "Concrete"
      },
    ],

    // Cargo Facilities
    cargoFacilities: {
      warehouse: { type: Boolean, default: false },
      customsClearance: { type: Boolean, default: false },
      coldStorage: { type: Boolean, default: false },
      hazmatHandling: { type: Boolean, default: false },
    },

    // Handling Information
    handlingAgent: {
      name: String,
      contactNumber: String,
      email: String,
    },

    // Freight and Cargo Handling
    freightHandling: {
      prepaid: { type: Boolean, default: true },
      collect: { type: Boolean, default: true },
    },

    // Special Handling Capabilities
    specialHandling: {
      liveAnimals: { type: Boolean, default: false },
      perishableGoods: { type: Boolean, default: false },
      oversizedCargo: { type: Boolean, default: false },
    },

    // Capacity and Operations
    maxCargoWeightKg: { type: Number, required: true },
    airlinesServiced: [String], // List of airline names
    majorRoutes: [String], // Example: ["DXB-JFK", "LHR-SIN"]

    // Customs and Regulations
    customs: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Airport =
  mongoose.models.Airport || mongoose.model("Airport", airportSchema);
export default Airport;
