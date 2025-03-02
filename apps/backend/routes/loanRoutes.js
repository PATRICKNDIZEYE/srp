import express from "express";
import { createLoan, getLoans, getLoanById, updateLoan, deleteLoan, getLoansByFarmerId, updateLoanStatus } from "../models/loanModel.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Create a new loan
router.post("/",async (req, res) => {
  try {
    const { loanAmount, purpose, farmerId } = req.body;

    const loan = await prisma.loan.create({
      data: {
        loanAmount: parseFloat(loanAmount),
        purpose,
        status: 'PENDING', // Using the enum value
        farmerId: Number(farmerId)
      }
    });

    res.status(201).json(loan);
  } catch (error) {
    console.error('Error creating loan:', error);
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

// Get farmer's loans
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const loans = await prisma.loan.findMany({
      where: {
        farmerId: Number(req.params.farmerId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get farmer's loan summary
router.get('/farmer/:farmerId/summary', async (req, res) => {
  try {
    const farmerId = Number(req.params.farmerId);
    
    // Get current loans with proper Prisma enum
    const currentLoans = await prisma.loan.findMany({
      where: {
        farmerId,
        status: {
          equals: 'APPROVED'
        }
      }
    });

    // Calculate current debt
    const currentDebt = currentLoans.reduce((sum, loan) => sum + loan.loanAmount, 0);

    // Get monthly income from milk submissions
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthlyMilk = await prisma.milkSubmission.findMany({
      where: {
        farmerId,
        status: 'accepted',
        createdAt: {
          gte: monthStart
        }
      }
    });

    const monthlyIncome = monthlyMilk.reduce((sum, submission) => sum + (submission.amount * 300), 0);

    // Calculate max loan amount (50% of monthly income)
    const maxLoanAmount = Math.max(0, (monthlyIncome * 0.5) - currentDebt);

    res.json({
      maxLoanAmount,
      currentDebt,
      monthlyIncome,
      eligibleAmount: maxLoanAmount
    });
  } catch (error) {
    console.error('Error in loan summary:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update loan status by ID
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const loan = await updateLoanStatus(req.params.id, status);
    if (loan) {
      res.status(200).json(loan);
    } else {
      res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 