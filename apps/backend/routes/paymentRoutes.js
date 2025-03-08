import express from "express";
import { prisma } from "../postgres/postgres.js";
import { sendSMS } from "../utils/sms.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get farmer's payments
router.get('/farmer/:farmerId', async (req, res) => {
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
router.get('/farmer/:farmerId/summary', async (req, res) => {
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
router.post('/:id/confirm', async (req, res) => {
  try {
    const { amount, phoneNumber } = req.body;
    const paymentId = parseInt(req.params.id);

    // Ensure paymentId is valid
    if (isNaN(paymentId)) {
      return res.status(400).json({ error: 'Invalid payment ID' });
    }

    // Ensure amount is a valid number and phoneNumber is provided
    if (!amount || isNaN(amount) || !phoneNumber) {
      return res.status(400).json({ error: 'Valid amount and phone number are required' });
    }

    // Update payment status and send SMS in a transaction
    const payment = await prisma.$transaction(async (prisma) => {
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'paid' }
      });

      // Send SMS notification
      await sendSMS(phoneNumber, 'PAYMENT_CONFIRMATION', [
        formatNumber(amount),
        new Date(updatedPayment.createdAt).toLocaleDateString()
      ]);

      return updatedPayment;
    });

    res.status(200).json({ message: 'Payment confirmed and SMS sent' });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk payment confirmation
router.post('/bulk-confirm', async (req, res) => {
  const { payments } = req.body;

  try {
    // Validate payments array
    if (!Array.isArray(payments) || payments.length === 0) {
      return res.status(400).json({ error: 'Payments array is required' });
    }

    // Update all payments and send SMS in a transaction
    await prisma.$transaction(async (prisma) => {
      await Promise.all(
        payments.map(async (p) => {
          if (!p.id || isNaN(p.amount) || !p.farmer.phoneNumber) {
            throw new Error('Invalid payment data');
          }

          await prisma.payment.update({
            where: { id: p.id },
            data: { status: 'paid' }
          });

          // Send SMS notification
          await sendSMS(p.farmer.phoneNumber, 'PAYMENT_CONFIRMATION', [
            formatNumber(p.amount),
            new Date(p.createdAt).toLocaleDateString()
          ]);
        })
      );
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Bulk payment confirmation failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to create a new payment
router.post('/create', async (req, res) => {
  try {
    const { farmerId, amount, startDate, endDate } = req.body;

    const newPayment = await prisma.payment.create({
      data: {
        farmerId,
        amount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'pending',
      },
    });

    res.status(201).json(newPayment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change payment status
router.patch('/:id/status', async (req, res) => {
  try {
    const paymentId = parseInt(req.params.id);
    const { status } = req.body;

    // Validate paymentId and status
    if (isNaN(paymentId) || !['paid', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid payment ID or status' });
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status }
    });

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error('Error changing payment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 