import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "../routes/auth.js"; // Adjust path to auth.js

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/api", authRoutes);

// Export for serverless if deploying to Vercel
export default (req, res) => {
  app(req, res); // Call Express app as a serverless function
};
