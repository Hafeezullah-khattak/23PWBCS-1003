import { Router } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config(); // Load environment variables

const router = Router();

// POST /api/signup - User Registration
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

// POST /api/signin - User Login
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare entered password with the hashed password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// GET /api/protected - Protected Route
router.get("/protected", async (req, res) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Remove "Bearer " from the token string
    const token = authHeader.replace("Bearer ", "").trim();

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res
      .status(200)
      .json({ message: "Protected data access granted", userId: decoded.id });
  } catch (err) {
    res.status(401).json({ message: "Token is not valid", error: err.message });
  }
});

export default router;
