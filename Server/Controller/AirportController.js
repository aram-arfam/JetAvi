import Airport from "../Models/AirportDB.js";

// ✅ Add a new airport
export const addAirport = async (req, res) => {
  try {
    const newAirport = new Airport(req.body);
    await newAirport.save();
    res.status(201).json({ message: "Airport added successfully", newAirport });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all airports
export const getAirports = async (req, res) => {
  try {
    const airports = await Airport.find({});
    res.status(200).json(airports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a single airport by ICAO code
export const getAirportByICAO = async (req, res) => {
  try {
    const { icao } = req.params;
    const airport = await Airport.findOne({ icao });
    if (!airport) return res.status(404).json({ message: "Airport not found" });
    res.status(200).json(airport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update an airport
export const updateAirport = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("Updating airport with ID:", id);
    console.log("Update data:", updateData);

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid airport ID format",
      });
    }

    const updatedAirport = await Airport.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAirport) {
      return res.status(404).json({
        success: false,
        message: "Airport not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Airport updated successfully",
      updatedAirport,
    });
  } catch (error) {
    console.error("Error updating airport:", error);
    res.status(500).json({
      success: false,
      message: "Error updating airport",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// ✅ Delete an airport
export const deleteAirport = async (req, res) => {
  try {
    const { icao } = req.params;
    const deletedAirport = await Airport.findOneAndDelete({ icao });
    if (!deletedAirport)
      return res.status(404).json({ message: "Airport not found" });
    res.status(200).json({ message: "Airport deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
