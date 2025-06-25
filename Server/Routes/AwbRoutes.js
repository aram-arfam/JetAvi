import express from "express";
import {
  createAwb,
  getAllAwbs,
  getAwbByAwbNo,
  updateAwb,
  deleteAwb,
  generateAwbNumbers,
  createAwbPiece,
  getAwbPieces,
  updateAwbPiece,
  deleteAwbPiece,
  getAwbPiece,
  getAWBStats,
  getRates,
  addRate,
  updateRate,
  deleteRate,
  generateRates,
  emailAwb,
  handleEmailAwbPdfRequest
} from "../Controller/AwbController.js";

const awbrouter = express.Router();

// AWB Routes
awbrouter.post("/", createAwb); // Create a new AWB entry
awbrouter.get("/", getAllAwbs); // Get all AWBs
awbrouter.get("/:awbNo", getAwbByAwbNo); // Get a single AWB by awbno
awbrouter.put("/:awbNo", updateAwb); // Update AWB details
awbrouter.delete("/:awbNo", deleteAwb); // Delete an AWB entry
awbrouter.post("/email", emailAwb); // Email AWB
awbrouter.post("/email-pdf", handleEmailAwbPdfRequest); // Email AWB PDF

// Special Operations
awbrouter.post("/generate", generateAwbNumbers);

// Awb Piece Routes
awbrouter.post("/:awbId/pieces", createAwbPiece); // Create a new piece for an AWB
awbrouter.get("/:awbId/pieces", getAwbPieces); // Get all pieces for a specific AWB
awbrouter.put("/:awbId/pieces/:pieceId", updateAwbPiece); // Update a piece
awbrouter.delete("/:awbId/pieces/:pieceId", deleteAwbPiece); // Delete a piece
awbrouter.get("/:awbId/pieces/:pieceId", getAwbPiece); // Get a single piece

// AWB Statistics
awbrouter.get("/awbs/stats", getAWBStats); // Get AWB statistics

//AWB Rates
awbrouter.get("/:awbId/pieces/:pieceId/rates", getRates);
awbrouter.post("/:awbId/pieces/:pieceId/rates", addRate);
awbrouter.put("/:awbId/pieces/:pieceId/rates/:rateId", updateRate);
awbrouter.delete("/:awbId/pieces/:pieceId/rates/:rateId", deleteRate);
awbrouter.post("/:awbId/pieces/:pieceId/generate-rates", generateRates);

export default awbrouter;
