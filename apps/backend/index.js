import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import PrismaClient
import { PrismaClient } from '@prisma/client';

// Import routes and middleware
import errorHandling from './middlewares/errorHandler.js';
import stockRoutes from './routes/stockRoutes.js';
import milkSubmissionRoutes from './routes/milkSubmissionRoutes.js';
import loginFarmerAuth from './auth/loginFarmerAuth.js';
import loginPOCAuth from './auth/loginPOCAuth.js';
import resetPasswordAuth from './auth/resetFarmerPassword.js';
import { registerFarmerAuth } from './auth/registerFarmerAuth.js'; // Adjust the path as necessary
import loanRoutes from './routes/loanRoutes.js';
// Import database connection (if necessary)
import { connection } from './postgres/postgres.js';
import pocRoutes from './routes/pocRoutes.js';
import productionRoutes from './routes/productionRoutes.js';
import { loginAdminAuth } from './auth/loginAdminAuth.js';


// Import additional routes

import milkTransportationRoutes from './routes/milkTransportationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import transportRoutes from './routes/transportRoutes.js';
import derivedRoutes from './routes/derivedRoutes.js';
import diaryRoutes from './routes/diaryRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import loginTransportAuth from './auth/loginTransportAuth.js';
import loginDiaryAuth from './auth/loginDiaryAuth.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import loginProductionAuth from './auth/loginProductionAuth.js';
import transportationsRoutes from './routes/transportationsRoutes.js';
import transpDerivedRoutes from './routes/transpDerivedRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { authenticateToken } from './middlewares/auth.js';
import { managementLogin } from './controllers/auth.controller.js';
import reportRoutes from './routes/reportRoutes.js';
import dailySaleRoutes from './routes/dailySaleRoutes.js';
import requestMilkRoutes from './routes/requestMilkRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Log environment variables (without sensitive data)
console.log('\nEnvironment Configuration:');
console.log('SMS_USERNAME exists:', !!process.env.FDI_SMS_USERNAME);
console.log('SMS_PASSWORD exists:', !!process.env.FDI_SMS_PASSWORD);
console.log('SMS_SENDER_ID:', process.env.FDI_SMS_SENDER_ID);

const app = express();
const prisma = new PrismaClient();
const router = express.Router();


// CORS and Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandling);

// Home route
app.get('/', (req, res) => {
  res.send("SRP Server");
});

app.post('/api/login-management', managementLogin);

app.use('/api/stocks', stockRoutes);
app.use('/api/milk-submissions',milkSubmissionRoutes);
app.use('/api/login-farmer', loginFarmerAuth);
app.use('/api/login-transport', loginTransportAuth);
app.use('/api/login-poc', loginPOCAuth);
app.use('/api/reset-password', resetPasswordAuth);
app.use('/api/pocs', pocRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/login-diary', loginDiaryAuth);
app.use('/api/derived', derivedRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/login-production', loginProductionAuth);
app.use('/api/transportations', transportationsRoutes);
app.use('/api/transp-derived', transpDerivedRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/api/login-admin', loginAdminAuth);
app.use('/api/reports', reportRoutes);
app.use('/api/daily-sales', dailySaleRoutes);
app.use('/api/request-milk', requestMilkRoutes);
// Use the registerFarmerAuth function as a route handler

app.post('/api/register-farmer', async (req, res) => {
  try {
    const newFarmer = await registerFarmerAuth(req.body);
    res.status(201).json(newFarmer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ... other imports and middleware

app.use('/api/payments', paymentRoutes); 

// Use the routes

app.use('/api/milk-transportation', milkTransportationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transports', transportRoutes);
app.use('/api/diaries', diaryRoutes);
app.use('/api/farmer', farmerRoutes);

// Add new route path for milk-sub
app.use('/api/milk-sub', milkSubmissionRoutes);

// Start Server
const PORT = process.env.PORT || 2025;
connection();  // You can remove this if you are using Prisma's automatic connection management

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

