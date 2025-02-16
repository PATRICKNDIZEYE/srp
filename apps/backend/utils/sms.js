import axios from 'axios';
import { format } from 'date-fns';

const PINDO_API_KEY = process.env.PINDO_API_KEY;
const PINDO_URL = 'https://api.pindo.io/v1/sms/';

// SMS Templates
const SMS_TEMPLATES = {
  MILK_SUBMISSION: (amount, type, date) => 
    `Murakoze! Watanze ${amount}L y'amata ${type}. (${format(date, 'HH:mm dd/MM/yyyy')})`,
  
  PAYMENT_CONFIRMATION: (amount, period) =>
    `Iyishyurwa rya ${amount} Rwf ryemejwe. Ni ay'amata yo mu ${period}. Murakoze!`,
  
  LOAN_APPROVAL: (amount) =>
    `Inguzanyo yawe ya ${amount} Rwf yemejwe. Uzayakira mu masaha 24.`,
  
  MILK_REJECTION: (amount, type, reason) =>
    `Amata ${amount}L ${type} ntiyemewe. Impamvu: ${reason}. Tubisaba imbabazi.`,
  
  PAYMENT_REMINDER: (amount, dueDate) =>
    `Uzishyurwa ${amount} Rwf ku wa ${format(dueDate, 'dd/MM/yyyy')}. Komeza ukore neza!`,
  
  NEW_FARMER_REGISTRATION: (farmerName, farmerPhone) =>
    `Umuhinzi mushya yiyandikishije: ${farmerName} (${farmerPhone}). Nyamuneka musuzume mukemeze/mwange.`
};

// Track SMS delivery status
const trackDeliveryStatus = async (messageId) => {
  try {
    const response = await axios.get(`${PINDO_URL}/${messageId}/status`, {
      headers: { 'Authorization': `Bearer ${PINDO_API_KEY}` }
    });
    return response.data.status;
  } catch (error) {
    console.error('Failed to track SMS:', error);
    return null;
  }
};

// Send bulk SMS
const sendBulkSMS = async (messages) => {
  try {
    const response = await axios.post(
      `${PINDO_URL}/bulk`,
      {
        messages: messages.map(m => ({
          to: m.phoneNumber,
          text: m.message,
          sender: 'MILK-APP'
        }))
      },
      {
        headers: {
          'Authorization': `Bearer ${PINDO_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Bulk SMS sending failed:', error);
    throw error;
  }
};

// Generate PDF receipt
const generateReceipt = (payment) => {
  const receiptData = {
    receiptNumber: `RCP${payment.id}`,
    date: format(new Date(payment.date), 'dd/MM/yyyy'),
    farmerName: `${payment.farmer.firstName} ${payment.farmer.lastName}`,
    phoneNumber: payment.farmer.phoneNumber,
    milkDetails: payment.milkSubmissions.map(sub => ({
      date: format(new Date(sub.createdAt), 'dd/MM/yyyy'),
      type: sub.milkType,
      amount: sub.amount,
      rate: sub.rate,
      total: sub.amount * sub.rate
    })),
    totalAmount: payment.amount,
    paymentMethod: payment.paymentMethod,
    status: payment.status
  };

  return receiptData;
};

// Main SMS sending function with delivery tracking
export const sendSMS = async (phoneNumber, template, params) => {
  try {
    const message = SMS_TEMPLATES[template](...params);
    const response = await axios.post(
      PINDO_URL,
      {
        to: phoneNumber,
        text: message,
        sender: 'MILK-APP',
        track: true
      },
      {
        headers: {
          'Authorization': `Bearer ${PINDO_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Track delivery after 1 minute
    setTimeout(async () => {
      const status = await trackDeliveryStatus(response.data.message_id);
      await prisma.smsLog.create({
        data: {
          messageId: response.data.message_id,
          phoneNumber,
          message,
          status,
          template,
          params: JSON.stringify(params)
        }
      });
    }, 60000);

    return response.data;
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw error;
  }
};

export { sendBulkSMS, generateReceipt, SMS_TEMPLATES }; 