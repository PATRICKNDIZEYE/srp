import express from "express";
import { createFarmer, getFarmers, getFarmerById, updateFarmer, deleteFarmer } from "../models/farmerModel.js";

const router = express.Router();

// Create a new farmer
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, farmSize, region, address, status } = req.body;

    // Create farmer
    const farmer = await createFarmer({
      firstName,
      lastName,
      phoneNumber,
      email,
      farmSize,
      region,
      address,
      status,
    });

    res.status(201).json(farmer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all farmers
router.get("/", async (req, res) => {
  try {
    const farmers = await getFarmers();
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a farmer by ID
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

// Update a farmer by ID
router.put("/:id", async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, farmSize, region, address, status } = req.body;

    // Update farmer
    const farmer = await updateFarmer(req.params.id, {
      firstName,
      lastName,
      phoneNumber,
      email,
      farmSize,
      region,
      address,
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

// Delete a farmer by ID
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
