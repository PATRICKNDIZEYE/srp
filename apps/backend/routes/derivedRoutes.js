import express from "express";
import { createDerived, getDeriveds, getDerivedById, updateDerived, deleteDerived } from "../models/derivedModel.js";

const router = express.Router();

// Create a new derived entry
router.post("/", async (req, res) => {
  try {
    const { derivedValue, transportId, diaryId, farmerId } = req.body;

    // Create derived entry
    const derived = await createDerived({
      derivedValue,
      transportId,
      diaryId,
      farmerId,
    });

    res.status(201).json(derived);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all derived entries
router.get("/", async (req, res) => {
  try {
    const derivedEntries = await getDeriveds();
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
    const { derivedValue, transportId, diaryId, farmerId } = req.body;

    // Update derived entry
    const derived = await updateDerived(req.params.id, {
      derivedValue,
      transportId,
      diaryId,
      farmerId,
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

export default router;
