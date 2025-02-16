import React from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { formatNumber } from '../utils/formatters';

// Receipt Template Component
const ReceiptTemplate = ({ receipt, onDownload }) => {
  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    
    page.drawText(`INYEMEZABWISHYU #${receipt.receiptNumber}`, {
      x: 50,
      y: 800,
      size: 20
    });

    // Add logo and header
    page.drawText(`Umuhinzi: ${receipt.farmerName}`, { x: 50, y: 750 });
    page.drawText(`Telefone: ${receipt.phoneNumber}`, { x: 50, y: 730 });
    page.drawText(`Itariki: ${receipt.date}`, { x: 50, y: 710 });

    // Draw milk details table
    let y = 650;
    receipt.milkDetails.forEach(detail => {
      page.drawText(detail.date, { x: 50, y });
      page.drawText(detail.type, { x: 150, y });
      page.drawText(`${formatNumber(detail.amount)}L`, { x: 250, y });
      page.drawText(`${formatNumber(detail.rate)} Rwf`, { x: 350, y });
      page.drawText(`${formatNumber(detail.total)} Rwf`, { x: 450, y });
      y -= 20;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${receipt.receiptNumber}.pdf`;
    link.click();
  };

  return (
    <button
      onClick={generatePDF}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      Kuramo Inyemezabwishyu
    </button>
  );
};

// Updated PaymentConfirmation component
const PaymentConfirmation = ({ payment, onConfirm }) => {
  const [showReceipt, setShowReceipt] = useState(false);
  
  const handleConfirm = async () => {
    try {
      await axiosInstance.post(`/payments/${payment.id}/confirm`, {
        amount: payment.amount,
        phoneNumber: payment.farmer.phoneNumber,
        sendReceipt: true // New option to send receipt via SMS
      });
      
      setShowReceipt(true);
      onConfirm();
    } catch (error) {
      toast.error('Hari ikibazo. Ongera ugerageze.');
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={handleConfirm}>Emeza Iyishyurwa</button>
      {showReceipt && <ReceiptTemplate receipt={payment} />}
    </div>
  );
};

// SMS Template Management
const smsTemplates = {
  ...SMS_TEMPLATES,
  WELCOME_MESSAGE: (name) => 
    `Murakaza neza ${name}! Mwakirwe neza muri sisiteme yacu y'amata.`,
  
  PRICE_UPDATE: (newPrice) =>
    `Igiciro cy'amata cyahindutse: ${newPrice} Rwf/L`,
  
  QUALITY_ALERT: (type, issue) =>
    `Amata ${type} afite ikibazo: ${issue}. Nyamuneka mutubwire vuba.`
};

// Backend route for bulk operations
router.post('/payments/bulk-confirm', authenticateToken, async (req, res) => {
  const { payments } = req.body;
  
  try {
    // Update all payments
    await prisma.$transaction(
      payments.map(p => 
        prisma.payment.update({
          where: { id: p.id },
          data: { status: 'paid' }
        })
      )
    );

    // Send bulk SMS
    const messages = payments.map(p => ({
      phoneNumber: p.farmer.phoneNumber,
      template: 'PAYMENT_CONFIRMATION',
      params: [p.amount, format(p.date, 'MMMM yyyy')]
    }));

    await sendBulkSMS(messages);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 