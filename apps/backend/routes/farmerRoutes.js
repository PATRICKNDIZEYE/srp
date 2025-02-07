import express from "express";
import bcrypt from "bcrypt";
import { createFarmer, getFarmers, getFarmerById, updateFarmer, deleteFarmer } from "../models/farmerModel.js";

const router = express.Router();

// Create a new Farmer
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, farmDetails, status } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Farmer
    const farmer = await createFarmer({
      firstName,
      lastName,
      birthday,
      nationalId,
      phoneNumber,
      longitude,
      latitude,
      username,
      password: hashedPassword,
      farmDetails,
      status,
    });

    res.status(201).json(farmer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Farmers
router.get("/", async (req, res) => {
  try {
    const farmers = await getFarmers();
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a Farmer by ID
router.get("/:id", async (req, res) => {
  try {
    const farmer = await getFarmerById(req.params.id);
    if (farmer) {
      res.status(200).json(farmer);
    } else {
      res.status(404).json({ message: "Farmer not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a Farmer by ID
router.put("/:id", async (req, res) => {
  try {
    const { firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, farmDetails, status } = req.body;

    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const farmer = await updateFarmer(req.params.id, {
      firstName,
      lastName,
      birthday,
      nationalId,
      phoneNumber,
      longitude,
      latitude,
      username,
      password: hashedPassword,
      farmDetails,
      status,
    });

    if (farmer) {
      res.status(200).json(farmer);
    } else {
      res.status(404).json({ message: "Farmer not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a Farmer by ID
router.delete("/:id", async (req, res) => {
  try {
    const farmer = await deleteFarmer(req.params.id);
    if (farmer) {
      res.status(200).json({ message: "Farmer deleted successfully" });
    } else {
      res.status(404).json({ message: "Farmer not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
