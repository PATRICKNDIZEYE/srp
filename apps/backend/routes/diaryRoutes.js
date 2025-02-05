import express from "express";
import { createDiary, getDiaries, getDiaryById, updateDiary, deleteDiary } from "../models/diaryModel.js";

const router = express.Router();

// Create a new diary entry
router.post("/", async (req, res) => {
  try {
    const { date, content, transportId, farmerId } = req.body;

    // Create diary entry
    const diary = await createDiary({
      date,
      content,
      transportId,
      farmerId,
    });

    res.status(201).json(diary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all diary entries
router.get("/", async (req, res) => {
  try {
    const diaries = await getDiaries();
    res.status(200).json(diaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a diary entry by ID
router.get("/:id", async (req, res) => {
  try {
    const diary = await getDiaryById(req.params.id);
    if (diary) {
      res.status(200).json(diary);
    } else {
      res.status(404).json({ message: "Diary entry not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a diary entry by ID
router.put("/:id", async (req, res) => {
  try {
    const { date, content, transportId, farmerId } = req.body;

    // Update diary entry
    const diary = await updateDiary(req.params.id, {
      date,
      content,
      transportId,
      farmerId,
    });

    if (diary) {
      res.status(200).json(diary);
    } else {
      res.status(404).json({ message: "Diary entry not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a diary entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const diary = await deleteDiary(req.params.id);
    if (diary) {
      res.status(200).json({ message: "Diary entry deleted successfully" });
    } else {
      res.status(404).json({ message: "Diary entry not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
