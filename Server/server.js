import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./Config/MongoDB.js";
import authRouter from "./Routes/AuthRoutes.js";
import airportRouter from "./Routes/AirportRoutes.js";
import userRoutes from "./Routes/UserRoutes.js";
import adminRoutes from "./Routes/AdminRoutes.js";
import awbRoutes from "./Routes/AwbRoutes.js";

dotenv.config();
const app = express();

//port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//databse connection
connectDB();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

//endpoints

app.get("/", (req, res) => res.send("API Working"));
app.use("/api", authRouter);
app.use("/api/airports", airportRouter);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/awbs", awbRoutes);
