import express from "express";
import {
  createTransportation,
  getTransportationById,
  updateTransportation,
  deleteTransportation,
  listTransportations,
  getTransportationsByPocId,
  getTransportationsByProductionId,
  updateTransportationStatus,
  getTransportationsByTransportId,
  getTransportationsByPhoneNumber,
  getTransporterTotalVolume
} from "../models/transportationsModel.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Create a new transportation entry
router.post("/", async (req, res) => {
  try {
    const { transportId, pocId, amount, transportStatus } = req.body;

    if (!transportId || !pocId || !amount || !transportStatus) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const transportation = await createTransportation({
      transportId,
      pocId,
      amount,
      transportStatus,
    });

    res.status(201).json(transportation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all transportation entries
router.get("/", async (req, res) => {
  try {
    const transportationEntries = await listTransportations();
    res.status(200).json(transportationEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a transportation entry by ID
router.get("/:id", async (req, res) => {
  try {
    const transportation = await getTransportationById(req.params.id);
    if (transportation) {
      res.status(200).json(transportation);
    } else {
      res.status(404).json({ message: "Transportation entry not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a transportation entry by ID
router.put("/:id", async (req, res) => {
  try {
    const { transportId, pocId, amount, transportStatus } = req.body;

    if (!transportId || !pocId || !amount || !transportStatus) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const transportation = await updateTransportation(req.params.id, {
      transportId,
      pocId,
      amount,
      transportStatus,
    });

    if (transportation) {
      res.status(200).json(transportation);
    } else {
      res.status(404).json({ message: "Transportation entry not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a transportation entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const transportation = await deleteTransportation(req.params.id);
    if (transportation) {
      res.status(200).json({ message: "Transportation entry deleted successfully" });
    } else {
      res.status(404).json({ message: "Transportation entry not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transportation entries by POC ID
router.get("/poc/:pocId", async (req, res) => {
  try {
    const transportations = await getTransportationsByPocId(req.params.pocId);
    if (transportations.length > 0) {
      res.status(200).json(transportations);
    } else {
      res.status(404).json({ message: "No transportation entries found for this POC ID" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transportation entries by Production ID
router.get("/production/:productionId", async (req, res) => {
  try {
    const transportations = await getTransportationsByProductionId(req.params.productionId);
    if (transportations.length > 0) {
      res.status(200).json(transportations);
    } else {
      res.status(404).json({ message: "No transportation entries found for this Production ID" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Transportation Status by ID
router.patch("/:id/status", async (req, res) => {
  try {
    const { newStatus } = req.body;
    
    if (!newStatus) {
      return res.status(400).json({ error: "Status is required" });
    }

    const transportation = await updateTransportationStatus(parseInt(req.params.id), newStatus);
    
    if (transportation) {
      res.status(200).json(transportation);
    } else {
      res.status(404).json({ message: "Transportation entry not found" });
    }
  } catch (error) {
    console.error('Error updating transportation status:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get transportation entries by Transport ID
router.get("/transport/:transportId", async (req, res) => {
  try {
    const transportations = await getTransportationsByTransportId(req.params.transportId);
    if (transportations.length > 0) {
      res.status(200).json(transportations);
    } else {
      res.status(404).json({ message: "No transportation entries found for this Transport ID" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transportation entries by phone number
router.get("/phone/:phoneNumber", async (req, res) => {
  try {
    const transportations = await getTransportationsByPhoneNumber(req.params.phoneNumber);
    if (transportations.length > 0) {
      res.status(200).json(transportations);
    } else {
      res.status(404).json({ message: "No transportation entries found for this phone number" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update the available-amount endpoint
router.get("/available-amount/:transportId", async (req, res) => {
  try {
    const transportId = parseInt(req.params.transportId);
    const volumes = await getTransporterTotalVolume(transportId);
    
    res.status(200).json({
      totalVolume: volumes.totalVolume,
      availableAmount: volumes.availableVolume
    });
  } catch (error) {
    console.error('Error fetching available milk amount:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update the delivery completion endpoint
router.post("/complete-delivery", async (req, res) => {
  try {
    const { transportId, deliveryId, amount } = req.body;
    
    // Create the delivery record
    await prisma.transpDerived.create({
      data: {
        transportId: parseInt(transportId),
        deriveryId: parseInt(deliveryId),
        amount: parseFloat(amount),
        status: 'Completed'
      }
    });

    // Get updated volumes
    const volumes = await getTransporterTotalVolume(transportId);
    
    res.status(200).json({
      message: 'Delivery completed successfully',
      updatedVolumes: volumes
    });
  } catch (error) {
    console.error('Error completing delivery:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get transportation details with remaining amount
router.get("/:deliveryId", async (req, res) => {
  try {
    const deliveryId = parseInt(req.params.deliveryId);
    
    // Get the original transportation record
    const transportation = await prisma.transportations.findUnique({
      where: { id: deliveryId },
      include: {
        transport: true
      }
    });

    if (!transportation) {
      return res.status(404).json({ message: "Transportation not found" });
    }

    // Get sum of all derived deliveries for this transportation
    const derivedSum = await prisma.transpDerived.aggregate({
      where: {
        deriveryId: deliveryId
      },
      _sum: {
        amount: true
      }
    });

    const totalDelivered = derivedSum._sum.amount || 0;
    const remainingAmount = transportation.amount - totalDelivered;

    res.status(200).json({
      ...transportation,
      remainingAmount: Math.max(0, remainingAmount)
    });
  } catch (error) {
    console.error('Error fetching transportation details:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 