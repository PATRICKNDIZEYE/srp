import express from "express";
import { prisma } from '../postgres/postgres.js';

const router = express.Router();

// Calculate milk submissions by POC
router.get('/calculate-by-poc/:pocId', async (req, res) => {
  try {
    const pocId = parseInt(req.params.pocId);

    console.log('Calculating milk submissions for POC ID:', pocId);

    // Fetch all milk submissions for the given POC ID
    const submissions = await prisma.milkSubmission.findMany({
      where: {
        farmer: {
          pocId: pocId
        }
      },
      include: {
        farmer: true
      }
    });

    // Calculate total amount of milk submissions
    const totalAmount = submissions.reduce((sum, submission) => sum + submission.amount, 0);

    res.status(200).json({
      pocId,
      totalSubmissions: submissions.length,
      totalAmount
    });
  } catch (error) {
    console.error('Error calculating milk submissions by POC:', error);
    res.status(500).json({ error: 'Failed to calculate milk submissions by POC' });
  }
});

export default router; 