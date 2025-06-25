import express from "express";
import {
  addAirport,
  getAirports,
  getAirportByICAO,
  updateAirport,
  deleteAirport,
} from "../Controller/AirportController.js";

const airportRouter = express.Router();

airportRouter.post("/addairport", addAirport); // Add new airport
airportRouter.get("/getairport", getAirports); // Get all airports
airportRouter.get("/getairport/:icao", getAirportByICAO); // Get single airport by ICAO
airportRouter.put("/updateairport/:id", updateAirport); // Update airport
airportRouter.delete("/deleteairport/:icao", deleteAirport); // Delete airport

export default airportRouter;
