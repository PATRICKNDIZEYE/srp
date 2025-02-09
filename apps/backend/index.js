import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

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

// Import additional routes
import userRoutes from './routes/userRoutes.js';
import transportRoutes from './routes/transportRoutes.js';
import derivedRoutes from './routes/derivedRoutes.js';
import diaryRoutes from './routes/diaryRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import loginTransportAuth from './auth/loginTransportAuth.js';
import loginDiaryAuth from './auth/loginDiaryAuth.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
dotenv.config();
const app = express();
const prisma = new PrismaClient();


// CORS and Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandling);

// Home route
app.get('/', (req, res) => {
  res.send("SRP Server");
});

app.use('/api/stocks', stockRoutes);
app.use('/api/milk-submissions', milkSubmissionRoutes);
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

// Use the registerFarmerAuth function as a route handler

app.post('/api/register-farmer', async (req, res) => {
  try {
    const newFarmer = await registerFarmerAuth(req.body);
    res.status(201).json(newFarmer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/transports', transportRoutes);
app.use('/api/diaries', diaryRoutes);
app.use('/api/farmer', farmerRoutes);
// Start Server
const PORT = process.env.PORT || 2025;
connection();  // You can remove this if you are using Prisma's automatic connection management

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
