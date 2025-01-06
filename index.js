import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" Connected to MongoDB!"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// Routes
app.use("/api", authRoutes);

// Export the app for deployment (e.g., with Vercel)
export default app;
