import express from "express";
import {
  createAnnualTarget,
  getAnnualTargets,
  getAnnualTargetByIdAndNgo,
  getAnnualTargetById,
  updateAnnualTarget,
  deleteAnnualTarget,
} from "../models/annualtargetModel.js";

const router = express.Router();


// Get all AnnualTargets for a specific NGO
router.get("/:ngoId/ngo", async (req, res) => {
  const { ngoId } = req.params;
  try {
    const targets = await getAnnualTargets(ngoId);
    res.json(targets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an AnnualTarget by ID for a specific NGO
router.get("/:ngoId/ngo/:id", async (req, res) => {
  const { ngoId, id } = req.params;
  try {
    const target = await getAnnualTargetByIdAndNgo(ngoId, id);
    if (target) {
      res.json(target);
    } else {
      res.status(404).json({ message: "Annual Target not found for this NGO" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new AnnualTarget
router.post("/", async (req, res) => {
  try {
    const targetData = req.body;
    const annualTarget = await createAnnualTarget(targetData);
    res.status(201).json(annualTarget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get an AnnualTarget by ID
router.get("/:id", async (req, res) => { 
  const { id } = req.params;
  try {
    const target = await getAnnualTargetById(id);
    if (target) {
      res.json(target);
    } else {
      res.status(404).json({ message: "Annual Target not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an AnnualTarget by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const target = await updateAnnualTarget(id, updatedData);
    if (target) {
      res.json(target);
    } else {
      res.status(404).json({ message: "Annual Target not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an AnnualTarget by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const target = await deleteAnnualTarget(id);
    if (target) {
      res.status(200).json({ message: "Annual Target deleted successfully" });
    } else {
      res.status(404).json({ message: "Annual Target not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
