import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "../routes/auth.js"; // Adjust path for auth.js

// Load environment variables
dotenv.config();

// Create an Express application
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", authRoutes);

// Vercel serverless function
export default (req, res) => {
  app(req, res);
};
