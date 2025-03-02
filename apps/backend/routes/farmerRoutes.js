import express from "express";
import bcrypt from "bcrypt";
import { createFarmer, getFarmers,getFarmersByPhoneNumber, getFarmerById, updateFarmer, deleteFarmer, updateFarmerStatus, getFarmersByPocId, updateFarmerPassword } from "../models/farmerModel.js";
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create a new Farmer
router.post("/", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the request body for debugging

    const { firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, farmDetails, status, pocId } = req.body;

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
      pocId: parseInt(pocId, 10),
    });

    res.status(201).json(farmer);
  } catch (error) {
    console.error("Error creating farmer:", error); // Log the error for debugging
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
    const { firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, farmDetails, status, pocId } = req.body;

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
      pocId: parseInt(pocId, 10),
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

// Get farmer entries by phone number
router.get("/phone/:phoneNumber", async (req, res) => {
  try {
    const farmers = await getFarmersByPhoneNumber(req.params.phoneNumber);
    if (farmers.length > 0) {
      res.status(200).json(farmers);
    } else {
      res.status(404).json({ message: "No farmer entries found for this phone number" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Farmer Status by ID
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const farmer = await updateFarmerStatus(req.params.id, status);
    if (farmer) {
      res.status(200).json(farmer);
    } else {
      res.status(404).json({ message: "Farmer not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get farmer entries by POC ID
router.get("/poc/:pocId", async (req, res) => {
  try {
    const pocId = parseInt(req.params.pocId, 10);
    console.log("POC ID:", pocId); // Debugging line
    if (isNaN(pocId)) {
      return res.status(400).json({ message: "Invalid POC ID" });
    }

    const farmers = await getFarmersByPocId(pocId);
    console.log("Farmers found:", farmers); // Debugging line
    if (farmers.length > 0) {
      res.status(200).json(farmers);
    } else {
      res.status(404).json({ message: "No farmer entries found for this POC ID" });
    }
  } catch (error) {
    console.error("Error fetching farmers by POC ID:", error); // Debugging line
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalFarmers = await prisma.farmer.count();
    const activeFarmers = await prisma.farmer.count({ where: { status: 'active' } });
    const pendingFarmers = await prisma.farmer.count({ where: { status: 'pending' } });

    res.json({
      total: totalFarmers,
      active: activeFarmers,
      pending: pendingFarmers,
    });
  } catch (error) {
    console.error('Error fetching farmer stats:', error);
    res.status(500).json({ error: 'Failed to fetch farmer stats' });
  }
});

// Update Farmer Password by ID
router.patch("/:id/password", async (req, res) => {
  try {
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const farmer = await updateFarmerPassword(req.params.id, hashedPassword);
    if (farmer) {
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(404).json({ message: "Farmer not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
