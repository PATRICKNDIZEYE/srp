import express from "express";
import {
  createDiary,
  getDiaries,
  getDiaryById,
  updateDiary,
  deleteDiary,
  getDiaryByPhoneNumber,
} from "../models/diaryModel.js";

const router = express.Router();

// Créer une nouvelle entrée de journal
router.post("/", async (req, res) => {
  try {
    const { status, approveStatus, phoneNumber, password, longitude, latitude } = req.body;

    if (!status || !approveStatus || !phoneNumber || !password || !longitude || !latitude) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const diary = await createDiary({
      status,
      approveStatus,
      phoneNumber,
      password,
      longitude,
      latitude,
    });

    res.status(201).json(diary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Récupérer toutes les entrées de journal
router.get("/", async (req, res) => {
  try {
    const diaries = await getDiaries();
    res.status(200).json(diaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer une entrée par ID
router.get("/:id", async (req, res) => {
  try {
    const diary = await getDiaryById(req.params.id);
    if (diary) {
      res.status(200).json(diary);
    } else {
      res.status(404).json({ message: "Entrée non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour une entrée par ID
router.put("/:id", async (req, res) => {
  try {
    const { status, approveStatus, phoneNumber, password, longitude, latitude } = req.body;

    if (!status || !approveStatus || !phoneNumber || !password || !longitude || !latitude) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const diary = await updateDiary(req.params.id, {
      status,
      approveStatus,
      phoneNumber,
      password,
      longitude,
      latitude,
    });

    if (diary) {
      res.status(200).json(diary);
    } else {
      res.status(404).json({ message: "Entrée non trouvée" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Supprimer une entrée par ID
router.delete("/:id", async (req, res) => {
  try {
    const diary = await deleteDiary(req.params.id);
    if (diary) {
      res.status(200).json({ message: "Entrée supprimée avec succès" });
    } else {
      res.status(404).json({ message: "Entrée non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Récupérer une entrée par numéro de téléphone
router.get("/phone/:phoneNumber", async (req, res) => {
  try {
    const diary = await getDiaryByPhoneNumber(req.params.phoneNumber);
    if (diary) {
      res.status(200).json(diary);
    } else {
      res.status(404).json({ message: "Entrée non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
