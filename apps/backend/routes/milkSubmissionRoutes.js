import express from "express";
import { createMilkSubmission, createMilkSub, getMilkSubmissions, getMilkSubmissionById, updateMilkSubmission, deleteMilkSubmission, getMilkSubmissionsByFarmerId, getMilkSubmissionsByPocId, getMilkSubmissionsByFarmerAndPocId } from "../models/milkSubmissionModel.js";
import { prisma } from '../postgres/postgres.js';
import { authenticateToken, checkFarmerRole } from '../middlewares/auth.js';
import { sendSMS } from '../utils/sms.js';
const MilkSubmissionSmsService = require('../services/smsService.js');

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

// Create a new milk submission using createMilkSub
router.post("/poc", async (req, res) => {
  try {
    const { milkType, amount, notes } = req.body;
    const farmerId = req.user?.id; // Ensure req.user is defined

    if (!farmerId) {
      return res.status(400).json({ error: 'Farmer ID is required' });
    }

    console.log('Creating milk submission for farmer:', farmerId); // Debugging log

    const submission = await createMilkSub({
      milkType,
      amount: parseFloat(amount),
      notes,
      status: 'pending',
      farmerId,
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
    console.error('Error creating milk submission:', error); // More detailed error logging
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

// Update milk submission status
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    console.log('\nProcessing milk submission status update:');
    console.log('ID:', id);
    console.log('New Status:', status);
    console.log('Reason:', reason);

    // Get the submission with farmer details
    const submission = await prisma.milkSubmission.findUnique({
      where: { id: parseInt(id) },
      include: {
        farmer: true
      }
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    console.log('\nFound submission:', submission);

    // Update the status
    const updatedSubmission = await prisma.milkSubmission.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    // Send SMS notification
    if (submission.farmer.phoneNumber) {
      console.log('\nAttempting to send SMS to:', submission.farmer.phoneNumber);
      try {
        if (status === 'accepted') {
          console.log('Sending acceptance SMS...');
          await MilkSubmissionSmsService.notifySubmissionAccepted(
            submission.farmer.phoneNumber,
            submission.amount,
            submission.milkType
          );
        } else if (status === 'rejected') {
          console.log('Sending rejection SMS...');
          await MilkSubmissionSmsService.notifySubmissionRejected(
            submission.farmer.phoneNumber,
            submission.amount,
            submission.milkType,
            reason || 'No reason provided'
          );
        }
        console.log('SMS notification sent successfully');
      } catch (smsError) {
        console.error('Failed to send SMS notification:', smsError);
        // Don't fail the request if SMS fails
      }
    } else {
      console.log('No phone number found for farmer');
    }

    res.json(updatedSubmission);
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({ error: 'Failed to update submission status' });
  }
});

export default router; 