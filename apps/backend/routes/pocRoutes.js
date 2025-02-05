import express from "express";
import bcrypt from "bcrypt";
import { createPOC, getPOCs, getPOCById, updatePOC, deletePOC } from "../models/pocModel.js";

const router = express.Router();

// Create a new POC
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, address, status } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create POC
    const poc = await createPOC({
      firstName,
      lastName,
      birthday,
      nationalId,
      phoneNumber,
      longitude,
      latitude,
      username,
      password: hashedPassword,
      address,
      status,
    });

    res.status(201).json(poc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all POCs
router.get("/", async (req, res) => {
  try {
    const pocs = await getPOCs();
    res.status(200).json(pocs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a POC by ID
router.get("/:id", async (req, res) => {
  try {
    const poc = await getPOCById(req.params.id);
    if (poc) {
      res.status(200).json(poc);
    } else {
      res.status(404).json({ message: "POC not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a POC by ID
router.put("/:id", async (req, res) => {
  try {
    const { firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, address, status } = req.body;


    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }


    const poc = await updatePOC(req.params.id, {
      firstName,
      lastName,
      birthday,
      nationalId,
      phoneNumber,
      longitude,
      latitude,
      username,
      password: hashedPassword,
      address,
      status,
    });

    if (poc) {
      res.status(200).json(poc);
    } else {
      res.status(404).json({ message: "POC not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a POC by ID
router.delete("/:id", async (req, res) => {
  try {
    const poc = await deletePOC(req.params.id);
    if (poc) {
      res.status(200).json({ message: "POC deleted successfully" });
    } else {
      res.status(404).json({ message: "POC not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
