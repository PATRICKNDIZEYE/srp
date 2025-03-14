import express from "express";
import {
  createProduction,
  getProductions,
  getProductionById,
  updateProduction,
  deleteProduction,
  getProductionsByPhoneNumber,
  updateProductionStatus,
} from "../models/productionModel.js";

const router = express.Router();

// Create a new production entry
router.post("/", async (req, res) => {
  try {
    const { status, approveStatus, phoneNumber, password, longitude, latitude, username } = req.body;

    if (!status || !approveStatus || !phoneNumber || !password || !longitude || !latitude || !username) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const production = await createProduction({
      status,
      approveStatus,
      phoneNumber,
      password,
      longitude,
      latitude,
      username,
    });

    res.status(201).json(production);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all production entries
router.get("/", async (req, res) => {
  try {
    const productions = await getProductions();
    res.status(200).json(productions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a production entry by ID
router.get("/:id", async (req, res) => {
  try {
    const production = await getProductionById(req.params.id);
    if (production) {
      res.status(200).json(production);
    } else {
      res.status(404).json({ message: "Entry not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a production entry by ID
router.put("/:id", async (req, res) => {
  try {
    const { status, approveStatus, phoneNumber, password, longitude, latitude, username } = req.body;

    if (!status || !approveStatus || !phoneNumber || !password || !longitude || !latitude || !username) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const production = await updateProduction(req.params.id, {
      status,
      approveStatus,
      phoneNumber,
      password,
      longitude,
      latitude,
      username,
    });

    if (production) {
      res.status(200).json(production);
    } else {
      res.status(404).json({ message: "Entry not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a production entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const production = await deleteProduction(req.params.id);
    if (production) {
      res.status(200).json({ message: "Entry successfully deleted" });
    } else {
      res.status(404).json({ message: "Entry not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get production entries by phone number
router.get("/phone/:phoneNumber", async (req, res) => {
  try {
    const productions = await getProductionsByPhoneNumber(req.params.phoneNumber);
    if (productions.length > 0) {
      res.status(200).json(productions);
    } else {
      res.status(404).json({ message: "No production entries found for this phone number" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Production Status by ID
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const production = await updateProductionStatus(req.params.id, status);
    if (production) {
      res.status(200).json(production);
    } else {
      res.status(404).json({ message: "Production entry not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 