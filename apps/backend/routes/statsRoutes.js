import express from "express";
import { prisma } from "../postgres/postgres.js";

const router = express.Router();

router.get("/dashboard", async (req, res) => {
  try {
    // Get total farmers
    const totalFarmers = await prisma.farmer.count({
      where: { status: 'active' }
    });

    // Get total milk liters
    const milkSubmissions = await prisma.milkSubmission.aggregate({
      _sum: {
        amount: true
      },
      where: {
        status: 'accepted'
      }
    });

    // Get active POCs
    const activePOCs = await prisma.pOC.count({
      where: { status: 'active' }
    });

    // Get active diaries
    const activeDiaries = await prisma.diary.count({
      where: { status: 'active' }
    });

    // Calculate quality rate (you might want to adjust this based on your actual data)
    const qualityStats = await prisma.milkSubmission.aggregate({
      _count: {
        id: true
      },
      where: {
        status: 'accepted'
      }
    });

    const totalSubmissions = await prisma.milkSubmission.count();
    const qualityRate = totalSubmissions > 0 
      ? Math.round((qualityStats._count.id / totalSubmissions) * 100) : 0;

    res.json({
      totalFarmers,
      totalMilkLiters: Math.round(milkSubmissions._sum.amount || 0),
      activePOCs,
      activeDiaries,
      qualityRate
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router; 