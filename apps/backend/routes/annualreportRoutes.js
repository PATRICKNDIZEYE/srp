import express from "express";
import { prisma } from "../postgres/postgres.js";  // Prisma import

const router = express.Router();

// Helper function to calculate percentage
const calculateProgressPercentage = (targetNumbers, totalReached) => {
  return (totalReached / targetNumbers) * 100;
};

// Route to generate the Annual progress by comparing BiannualReports with AnnualTarget
router.get("/:annualTargetId", async (req, res) => {
  const { annualTargetId } = req.params;
  try {
    // Fetch the AnnualTarget to get the target numbers
    const annualTarget = await prisma.annualTarget.findUnique({
      where: { id: parseInt(annualTargetId) },
    });

    if (!annualTarget) {
      return res.status(404).json({ message: "Annual Target not found." });
    }

    // Fetch all BiannualReports related to this AnnualTarget
    const biannualReports = await prisma.biannualReport.findMany({
      where: {
        annualTargetId: parseInt(annualTargetId),
      },
    });

    if (biannualReports.length === 0) {
      return res.status(404).json({ message: "No Biannual Reports found for this Annual Target." });
    }

    // Calculate total reached from all BiannualReports
    const totalReached = biannualReports.reduce(
      (sum, report) => sum + report.targetNumbersReached,
      0
    );

    // Calculate the percentage progress based on the total reached and the planned target
    const progressPercentage = calculateProgressPercentage(annualTarget.targetNumbers, totalReached);

    // Send the response with aggregated data
    res.status(200).json({
      annualTargetId: annualTarget.id,
      activityName: annualTarget.activityName,
      totalTarget: annualTarget.targetNumbers,
      totalReached,
      progressPercentage,
    });
  } catch (error) {
    console.error("Error calculating annual progress:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch all BiannualReports for a specific AnnualTarget
router.get("/:annualTargetId", async (req, res) => {
  const { annualTargetId } = req.params;
  try {
    // Fetch all BiannualReports for the given AnnualTarget
    const biannualReports = await prisma.biannualReport.findMany({
      where: {
        annualTargetId: parseInt(annualTargetId),
      },
    });

    if (biannualReports.length === 0) {
      return res.status(404).json({ message: "No Biannual Reports found for this Annual Target." });
    }

    res.status(200).json(biannualReports);
  } catch (error) {
    console.error("Error fetching Biannual Reports:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
