import express from "express";
import {
  createTranspDerived,
  getTranspDerivedById,
  updateTranspDerived,
  deleteTranspDerived,
  listTranspDerived,
  getTranspDerivedByTransportId,
  updateTranspDerivedStatus,
  getTranspDerivedByProductionId,
  getTranspDerivedByTransportationId
} from "../models/transpDerivedModel.js";

const router = express.Router();

// Create a new transpDerived entry
router.post("/", async (req, res) => {
  try {
    const { transportId, amount, status, productionId, transportationId } = req.body;

    if (!transportId || !amount || !status || !productionId || !transportationId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const transpDerived = await createTranspDerived({
      transportId,
      amount,
      status,
      productionId,
      transportationId,
    });

    res.status(201).json(transpDerived);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all transpDerived entries
router.get("/", async (req, res) => {
  try {
    const transpDerivedEntries = await listTranspDerived();
    res.status(200).json(transpDerivedEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a transpDerived entry by ID
router.get("/:id", async (req, res) => {
  try {
    const transpDerived = await getTranspDerivedById(req.params.id);
    if (transpDerived) {
      res.status(200).json(transpDerived);
    } else {
      res.status(404).json({ message: "TranspDerived entry not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a transpDerived entry by ID
router.put("/:id", async (req, res) => {
  try {
    const { transportId, amount, status, productionId, transportationId } = req.body;

    if (!transportId || !amount || !status || !productionId || !transportationId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const transpDerived = await updateTranspDerived(req.params.id, {
      transportId,
      amount,
      status,
      productionId,
      transportationId,
    });

    if (transpDerived) {
      res.status(200).json(transpDerived);
    } else {
      res.status(404).json({ message: "TranspDerived entry not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a transpDerived entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const transpDerived = await deleteTranspDerived(req.params.id);
    if (transpDerived) {
      res.status(200).json({ message: "TranspDerived entry deleted successfully" });
    } else {
      res.status(404).json({ message: "TranspDerived entry not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transpDerived entries by transportId
router.get("/transport/:transportId", async (req, res) => {
  try {
    const transpDerivedEntries = await getTranspDerivedByTransportId(req.params.transportId);
    if (transpDerivedEntries.length > 0) {
      res.status(200).json(transpDerivedEntries);
    } else {
      res.status(404).json({ message: "No TranspDerived entries found for this transportId" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update the status of a transpDerived entry by ID
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }

    const transpDerived = await updateTranspDerivedStatus(req.params.id, status);

    if (transpDerived) {
      res.status(200).json(transpDerived);
    } else {
      res.status(404).json({ message: "TranspDerived entry not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get transpDerived entries by productionId
router.get("/production/:productionId", async (req, res) => {
  try {
    const transpDerivedEntries = await getTranspDerivedByProductionId(req.params.productionId);
    if (transpDerivedEntries.length > 0) {
      res.status(200).json(transpDerivedEntries);
    } else {
      res.status(404).json({ message: "No TranspDerived entries found for this productionId" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transpDerived entries by transportationId
router.get("/transportation/:transportationId", async (req, res) => {
  try {
    const transpDerivedEntries = await getTranspDerivedByTransportationId(req.params.transportationId);
    if (transpDerivedEntries.length > 0) {
      res.status(200).json(transpDerivedEntries);
    } else {
      res.status(404).json({ message: "No TranspDerived entries found for this transportationId" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 