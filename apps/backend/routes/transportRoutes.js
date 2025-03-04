import express from "express";
import { createTransport, getTransports, getTransportById, updateTransport, deleteTransport, getTransportByPhoneNumber, updateTransportStatus } from "../models/transportModel.js";

const router = express.Router();

// Create a new transport
router.post("/", async (req, res) => {
  try {
    const transport = await createTransport(req.body);
    res.status(201).json(transport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all transports
router.get("/", async (req, res) => {
  try {
    const transports = await getTransports();
    res.status(200).json(transports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a transport by ID
router.get("/:id", async (req, res) => {
  try {
    const transport = await getTransportById(req.params.id);
    if (transport) {
      res.status(200).json(transport);
    } else {
      res.status(404).json({ message: "Transport not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a transport by ID
router.put("/:id", async (req, res) => {
  try {
    const transport = await updateTransport(req.params.id, req.body);
    if (transport) {
      res.status(200).json(transport);
    } else {
      res.status(404).json({ message: "Transport not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a transport by ID
router.delete("/:id", async (req, res) => {
  try {
    const transport = await deleteTransport(req.params.id);
    if (transport) {
      res.status(200).json({ message: "Transport deleted successfully" });
    } else {
      res.status(404).json({ message: "Transport not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a transport by phone number
router.get("/phone/:phoneNumber", async (req, res) => {
  try {
    const transport = await getTransportByPhoneNumber(req.params.phoneNumber);
    if (transport) {
      res.status(200).json(transport);
    } else {
      res.status(404).json({ message: "Transport not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update transport status by ID
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const transport = await updateTransportStatus(req.params.id, status);
    if (transport) {
      res.status(200).json(transport);
    } else {
      res.status(404).json({ message: "Transport not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
