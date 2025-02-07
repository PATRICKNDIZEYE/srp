import express from "express";
import { createMilkSubmission, getMilkSubmissions, getMilkSubmissionById, updateMilkSubmission, deleteMilkSubmission, getMilkSubmissionsByFarmerId } from "../models/milkSubmissionModel.js";

const router = express.Router();

// Create a new milk submission
router.post("/", async (req, res) => {
  try {
    const { milkType, amount, notes, status, farmerId } = req.body;

    // Create milk submission
    const milkSubmission = await createMilkSubmission({
      milkType,
      amount,
      notes,
      status,
      farmerId,
    });

    res.status(201).json(milkSubmission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all milk submissions
router.get("/", async (req, res) => {
  try {
    const milkSubmissions = await getMilkSubmissions();
    res.status(200).json(milkSubmissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a milk submission by ID
router.get("/:id", async (req, res) => {
  try {
    const milkSubmission = await getMilkSubmissionById(req.params.id);
    if (milkSubmission) {
      res.status(200).json(milkSubmission);
    } else {
      res.status(404).json({ message: "Milk submission not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a milk submission by ID
router.put("/:id", async (req, res) => {
  try {
    const { milkType, amount, notes, status, farmerId } = req.body;

    // Update milk submission
    const milkSubmission = await updateMilkSubmission(req.params.id, {
      milkType,
      amount,
      notes,
      status,
      farmerId,
    });

    if (milkSubmission) {
      res.status(200).json(milkSubmission);
    } else {
      res.status(404).json({ message: "Milk submission not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a milk submission by ID
router.delete("/:id", async (req, res) => {
  try {
    const milkSubmission = await deleteMilkSubmission(req.params.id);
    if (milkSubmission) {
      res.status(200).json({ message: "Milk submission deleted successfully" });
    } else {
      res.status(404).json({ message: "Milk submission not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get milk submissions by farmer ID
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const milkSubmissions = await getMilkSubmissionsByFarmerId(req.params.farmerId);
    if (milkSubmissions.length > 0) {
      res.status(200).json(milkSubmissions);
    } else {
      res.status(404).json({ message: "No milk submissions found for this farmer" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 