import express from "express";
import { createLoan, getLoans, getLoanById, updateLoan, deleteLoan, getLoansByFarmerId } from "../models/loanModel.js";

const router = express.Router();

// Create a new loan
router.post("/", async (req, res) => {
  try {
    const { loanAmount, purpose, status, farmerId } = req.body;

    // Create loan
    const loan = await createLoan({
      loanAmount,
      purpose,
      status,
      farmerId,
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all loans
router.get("/", async (req, res) => {
  try {
    const loans = await getLoans();
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a loan by ID
router.get("/:id", async (req, res) => {
  try {
    const loan = await getLoanById(req.params.id);
    if (loan) {
      res.status(200).json(loan);
    } else {
      res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a loan by ID
router.put("/:id", async (req, res) => {
  try {
    const { loanAmount, purpose, status, farmerId } = req.body;

    // Update loan
    const loan = await updateLoan(req.params.id, {
      loanAmount,
      purpose,
      status,
      farmerId,
    });

    if (loan) {
      res.status(200).json(loan);
    } else {
      res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a loan by ID
router.delete("/:id", async (req, res) => {
  try {
    const loan = await deleteLoan(req.params.id);
    if (loan) {
      res.status(200).json({ message: "Loan deleted successfully" });
    } else {
      res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get loans by farmer ID
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const loans = await getLoansByFarmerId(req.params.farmerId);
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 