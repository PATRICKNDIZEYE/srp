import express from "express";
import { createDerived, getDerivedEntries, getDerivedById, updateDerived, deleteDerived, getDerivedByDiaryId, updateDerivedStatus, getDerivedByDeriveryId, getDerivedByTransportId } from "../models/derivedModel.js";

const router = express.Router();

// Create a new derived entry
router.post("/", async (req, res) => {
  try {
    const { diaryId, transportId, deriveryId, amount, status } = req.body;

    // Log the incoming request data for debugging
    console.log("Request data:", req.body);

    // Ensure the required fields are provided and valid
    if (!diaryId || !transportId || !deriveryId || !amount || !status) {
      return res.status(400).json({ error: "diaryId, transportId, deriveryId, amount, and status are required." });
    }

    if (isNaN(parseInt(deriveryId))) {
      return res.status(400).json({ error: "Invalid derivery ID." });
    }

    const derived = await createDerived({
      diaryId,
      transportId,
      deriveryId,
      amount,
      status,
    });

    res.status(201).json(derived);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all derived entries
router.get("/", async (req, res) => {
  try {
    const derivedEntries = await getDerivedEntries();
    res.status(200).json(derivedEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a derived entry by ID
router.get("/:id", async (req, res) => {
  try {
    const derived = await getDerivedById(req.params.id);
    if (derived) {
      res.status(200).json(derived);
    } else {
      res.status(404).json({ message: "Derived entry not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a derived entry by ID
router.put("/:id", async (req, res) => {
  try {
    const { diaryId, transportId, amount, status } = req.body;

    // Ensure the required fields are provided
    if (!diaryId || !transportId || !amount || !status) {
      return res.status(400).json({ error: "diaryId, transportId, amount, and status are required." });
    }

    const derived = await updateDerived(req.params.id, {
      diaryId,
      transportId,
      amount,
      status,
    });

    if (derived) {
      res.status(200).json(derived);
    } else {
      res.status(404).json({ message: "Derived entry not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a derived entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const derived = await deleteDerived(req.params.id);
    if (derived) {
      res.status(200).json({ message: "Derived entry deleted successfully" });
    } else {
      res.status(404).json({ message: "Derived entry not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get derived entries by diary ID
router.get("/diary/:diaryId", async (req, res) => {
  try {
    const derivedEntries = await getDerivedByDiaryId(req.params.diaryId);
    if (derivedEntries.length > 0) {
      res.status(200).json(derivedEntries);
    } else {
      res.status(404).json({ message: "No derived entries found for this diary ID" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update the status of a derived entry by ID
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    // Ensure the status is provided
    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }

    const derived = await updateDerivedStatus(req.params.id, status);

    if (derived) {
      res.status(200).json(derived);
    } else {
      res.status(404).json({ message: "Derived entry not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get derived entries by derivery ID
router.get("/derivery/:deriveryId", async (req, res) => {
  try {
    const derivedEntries = await getDerivedByDeriveryId(req.params.deriveryId);
    if (derivedEntries.length > 0) {
      res.status(200).json(derivedEntries);
    } else {
      res.status(404).json({ message: "No derived entries found for this derivery ID" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get derived entries by transport ID
router.get("/transport/:transportId", async (req, res) => {
  try {
    const derivedEntries = await getDerivedByTransportId(req.params.transportId);
    if (derivedEntries.length > 0) {
      res.status(200).json(derivedEntries);
    } else {
      res.status(404).json({ message: "No derived entries found for this transport ID" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
