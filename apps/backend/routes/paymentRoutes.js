import express from "express";
import { prisma } from "../postgres/postgres.js";
import { sendSMS } from "../utils/sms.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get farmer's payments
router.get('/farmer/:farmerId', authenticateToken, async (req, res) => {
  try {
    const farmerId = parseInt(req.params.farmerId);
    
    const payments = await prisma.payment.findMany({
      where: {
        farmerId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get farmer's payment summary
router.get('/farmer/:farmerId/summary', authenticateToken, async (req, res) => {
  try {
    const farmerId = parseInt(req.params.farmerId);
    const today = new Date();
    
    // Calculate current cycle
    const currentCycleStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() <= 15 ? 1 : 16);
    const currentCycleEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() <= 15 ? 15 : 31);

    const currentCycleMilk = await prisma.milkSubmission.aggregate({
      _sum: {
        amount: true
      },
      where: {
        farmerId,
        status: 'accepted',
        createdAt: {
          gte: currentCycleStart,
          lte: currentCycleEnd
        }
      }
    });

    const pendingAmount = (currentCycleMilk._sum.amount || 0) * 300; // 300 Rwf per liter

    res.json({
      currentCycleMilk: currentCycleMilk._sum.amount || 0,
      pendingPayment: pendingAmount,
      nextPaymentDate: currentCycleEnd,
      daysUntilNextPayment: Math.ceil((currentCycleEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment and send SMS
router.post('/:id/confirm', authenticateToken, async (req, res) => {
  try {
    const { amount, phoneNumber } = req.body;
    const paymentId = parseInt(req.params.id);

    // Update payment status
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'paid' }
    });

    // Send SMS notification
    await sendSMS(phoneNumber, 'PAYMENT_CONFIRMATION', [
      formatNumber(amount),
      new Date(payment.createdAt).toLocaleDateString()
    ]);

    res.json(payment);
  } catch (error) {
    console.error('Payment confirmation failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Bulk payment confirmation
router.post('/bulk-confirm', authenticateToken, async (req, res) => {
  const { payments } = req.body;
  
  try {
    // Update all payments in a transaction
    await prisma.$transaction(
      payments.map(p => 
        prisma.payment.update({
          where: { id: p.id },
          data: { status: 'paid' }
        })
      )
    );

    // Send bulk SMS notifications
    const messages = payments.map(p => ({
      phoneNumber: p.farmer.phoneNumber,
      template: 'PAYMENT_CONFIRMATION',
      params: [formatNumber(p.amount), new Date(p.createdAt).toLocaleDateString()]
    }));

    await sendBulkSMS(messages);

    res.json({ success: true });
  } catch (error) {
    console.error('Bulk payment confirmation failed:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 