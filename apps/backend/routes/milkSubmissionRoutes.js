import express from "express";
import { createMilkSubmission, getMilkSubmissions, getMilkSubmissionById, updateMilkSubmission, deleteMilkSubmission, getMilkSubmissionsByFarmerId } from "../models/milkSubmissionModel.js";
import { prisma } from '../postgres/postgres.js';
import { authenticateToken, checkFarmerRole } from '../middlewares/auth.js';
import { sendSMS } from '../utils/sms.js';

const router = express.Router();

// Create a new milk submission
router.post("/", authenticateToken, checkFarmerRole, async (req, res) => {
  try {
    const { milkType, amount, notes } = req.body;
    const farmerId = req.user.id;

    const submission = await prisma.milkSubmission.create({
      data: {
        milkType,
        amount: parseFloat(amount),
        notes,
        status: 'pending',
        farmerId,
      }
    });

    // Send SMS notification
    const farmer = await prisma.farmer.findUnique({
      where: { id: farmerId }
    });

    if (farmer?.phoneNumber) {
      try {
        await sendSMS(farmer.phoneNumber, 'MILK_SUBMISSION', [
          amount,
          milkType,
          new Date()
        ]);
      } catch (smsError) {
        console.error('SMS sending failed:', smsError);
        // Don't fail the request if SMS fails
      }
    }

    res.status(201).json(submission);
  } catch (error) {
    console.error('Error creating milk submission:', error);
    res.status(500).json({ 
      error: 'Failed to create milk submission',
      details: error.message 
    });
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

// Get farmer's milk submissions
router.get('/farmer/:farmerId', authenticateToken, async (req, res) => {
  try {
    const farmerId = parseInt(req.params.farmerId);
    
    // Verify the farmer is accessing their own data
    if (req.user.id !== farmerId) {
      return res.status(403).json({ error: 'You can only access your own submissions' });
    }

    console.log('Fetching submissions for farmer:', farmerId);

    const submissions = await prisma.milkSubmission.findMany({
      where: {
        farmerId,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      select: {
        id: true,
        milkType: true,
        amount: true,
        status: true,
        createdAt: true,
        notes: true
      }
    });

    const totalAmount = await prisma.milkSubmission.aggregate({
      where: {
        farmerId,
        status: 'accepted'
      },
      _sum: {
        amount: true
      }
    });

    res.json({
      submissions,
      totalAmount: totalAmount._sum.amount || 0
    });

  } catch (error) {
    console.error('Error fetching milk submissions:', error);
    res.status(500).json({ error: 'Failed to fetch milk submissions' });
  }
});

export default router; 