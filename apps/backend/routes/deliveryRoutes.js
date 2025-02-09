import express from "express";
import { createDerivery, getDeriveryEntries, getDeriveryById, updateDerivery, deleteDerivery, changeDeriveryStatus, getDeriveryByTransportId } from "../models/deliveryModel.js";

const router = express.Router();

// Create a new derivery entry
router.post("/", async (req, res) => {
  try {
    const { transportId, pocId, amount, transportStatus } = req.body;

    if (!transportId || !pocId || !amount || !transportStatus) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const derivery = await createDerivery({
      transportId,
      pocId,
      amount,
      transportStatus,
    });

    res.status(201).json(derivery);  // Status 201 for successful creation
  } catch (error) {
    res.status(400).json({ error: error.message });  // Handle any other errors
  }
});

// Get all derivery entries
router.get("/", async (req, res) => {
  try {
    const deriveryEntries = await getDeriveryEntries();
    res.status(200).json(deriveryEntries);  // Status 200 for successful GET
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve derivery entries" });  // Handle server errors
  }
});

// Get a derivery entry by ID
router.get("/:id", async (req, res) => {
  try {
    const derivery = await getDeriveryById(req.params.id);
    if (derivery) {
      res.status(200).json(derivery);  // Return the derivery if found
    } else {
      res.status(404).json({ message: "Derivery entry not found" });  // Entry not found
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve derivery entry" });  // Handle server errors
  }
});

// Update a derivery entry by ID
router.put("/:id", async (req, res) => {
  try {
    const { transportId, pocId, amount, transportStatus } = req.body;

    if (!transportId || !pocId || !amount || !transportStatus) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const derivery = await updateDerivery(req.params.id, {
      transportId,
      pocId,
      amount,
      transportStatus,
    });

    if (derivery) {
      res.status(200).json(derivery);  // Return the updated derivery
    } else {
      res.status(404).json({ message: "Derivery entry not found" });  // Entry not found
    }
  } catch (error) {
    res.status(400).json({ error: error.message });  // Handle any other errors
  }
});

// Delete a derivery entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const derivery = await deleteDerivery(req.params.id);
    if (derivery) {
      res.status(200).json({ message: "Derivery entry deleted successfully" });  // Success message
    } else {
      res.status(404).json({ message: "Derivery entry not found" });  // Entry not found
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete derivery entry" });  // Handle server errors
  }
});

// Change the status of a derivery entry by ID
router.patch("/:id/status", async (req, res) => {
  try {
    const { newStatus } = req.body;

    if (!newStatus) {
      return res.status(400).json({ error: "Missing new status" });
    }

    const derivery = await changeDeriveryStatus(req.params.id, newStatus);

    if (derivery) {
      res.status(200).json(derivery);  // Return the updated derivery
    } else {
      res.status(404).json({ message: "Derivery entry not found" });  // Entry not found
    }
  } catch (error) {
    res.status(400).json({ error: error.message });  // Handle any other errors
  }
});

// Get delivery entries by transport ID
router.get("/transport/:transportId", async (req, res) => {
  try {
    const deriveryEntries = await getDeriveryByTransportId(req.params.transportId);
    if (deriveryEntries.length > 0) {
      res.status(200).json(deriveryEntries);
    } else {
      res.status(404).json({ message: "No derivery entries found for this transport ID" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve derivery entries" });
  }
});

export default router;
  