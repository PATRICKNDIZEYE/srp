import express from "express";
import {
  createDiary,
  getDiaries,
  getDiaryById,
  updateDiary,
  deleteDiary,
  getDiaryByPhoneNumber,
  updateDiaryStatus,
} from "../models/diaryModel.js";

const router = express.Router();

// Ensure JSON parsing is enabled
router.use(express.json());

// Créer une nouvelle entrée de journal
router.post("/", async (req, res) => {
  try {
    // Log the incoming request body
    console.log("Request Body:", req.body);

    const { status, approveStatus, phoneNumber, password, longitude, latitude, firstName, lastName, nationalId } = req.body;

    // Check for missing fields
    const missingFields = [];
    if (!status) missingFields.push("status");
    if (!approveStatus) missingFields.push("approveStatus");
    if (!phoneNumber) missingFields.push("phoneNumber");
    if (!password) missingFields.push("password");
    if (!longitude) missingFields.push("longitude");
    if (!latitude) missingFields.push("latitude");
    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!nationalId) missingFields.push("nationalId");

    if (missingFields.length > 0) {
      console.log("Missing Fields:", missingFields); // Log missing fields
      return res.status(400).json({ error: `Tous les champs sont requis. Missing: ${missingFields.join(", ")}` });
    }

    const diary = await createDiary({
      status,
      approveStatus,
      phoneNumber,
      password,
      longitude: parseFloat(longitude), // Ensure these are numbers
      latitude: parseFloat(latitude),   // Ensure these are numbers
      firstName,
      lastName,
      nationalId,
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
    const { status, approveStatus, phoneNumber, password, longitude, latitude, firstName, lastName, nationalId } = req.body;

    if (!status || !approveStatus || !phoneNumber || !password || !longitude || !latitude || !firstName || !lastName || !nationalId) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const diary = await updateDiary(req.params.id, {
      status,
      approveStatus,
      phoneNumber,
      password,
      longitude,
      latitude,
      firstName,
      lastName,
      nationalId,
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

// Update Diary Status by ID
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const diary = await updateDiaryStatus(req.params.id, status);
    if (diary) {
      res.status(200).json(diary);
    } else {
      res.status(404).json({ message: "Diary entry not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
