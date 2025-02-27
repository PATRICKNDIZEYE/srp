import express from "express";
import { prisma } from "../postgres/postgres.js";

const router = express.Router();

// Get milk submissions and loans by farmer ID
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const farmerId = parseInt(req.params.farmerId);

    // Fetch milk submissions with farmer details
    const milkSubmissions = await prisma.milkSubmission.findMany({
      where: { farmerId },
      orderBy: { createdAt: 'desc' },
      include: {
        farmer: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    // Calculate total amount of milk submissions
    const totalAmount = milkSubmissions.reduce((sum, submission) => sum + submission.amount, 0);

    // Fetch loans
    const loans = await prisma.loan.findMany({
      where: { farmerId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ milkSubmissions, loans, totalAmount });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Get grouped milk submissions and loans by farmer ID
router.get("/grouped", async (req, res) => {
  try {
    // Fetch all milk submissions with farmer details
    const milkSubmissions = await prisma.milkSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        farmer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    // Fetch all loans with farmer details
    const loans = await prisma.loan.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        farmer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    // Group submissions and loans by farmerId
    const groupedData = {};

    milkSubmissions.forEach((submission) => {
      const farmerId = submission.farmer.id;
      if (!groupedData[farmerId]) {
        groupedData[farmerId] = {
          farmer: submission.farmer,
          submissions: [],
          loans: [],
          totalMilkAmount: 0,
          totalLoanAmount: 0,
        };
      }
      groupedData[farmerId].submissions.push(submission);
      groupedData[farmerId].totalMilkAmount += submission.amount;
    });

    loans.forEach((loan) => {
      const farmerId = loan.farmer.id;
      if (!groupedData[farmerId]) {
        groupedData[farmerId] = {
          farmer: loan.farmer,
          submissions: [],
          loans: [],
          totalMilkAmount: 0,
          totalLoanAmount: 0,
        };
      }
      groupedData[farmerId].loans.push(loan);
      groupedData[farmerId].totalLoanAmount += loan.loanAmount;
    });

    res.json(groupedData);
  } catch (error) {
    console.error('Error fetching grouped reports:', error);
    res.status(500).json({ error: 'Failed to fetch grouped reports' });
  }
});

export default router; 