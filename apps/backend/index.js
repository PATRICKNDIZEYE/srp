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
// Import the reset password module
import resetPasswordAuth from './auth/resetFarmerPassword.js'; // Adjust the path as necessary
// Import the register farmer module
import { registerFarmerAuth } from './auth/registerFarmerAuth.js'; // Adjust the path as necessary
import loanRoutes from './routes/loanRoutes.js';
// Import database connection (if necessary)
import { connection } from './postgres/postgres.js';
import pocRoutes from './routes/pocRoutes.js';

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
app.use('/api/reset-password', resetPasswordAuth);
app.use('/api/pocs', pocRoutes);

app.use('/api/loans', loanRoutes);
// Use the registerFarmerAuth function as a route handler

app.post('/api/register-farmer', async (req, res) => {
  try {
    const newFarmer = await registerFarmerAuth(req.body);
    res.status(201).json(newFarmer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 2025;
connection();  // You can remove this if you are using Prisma's automatic connection management

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
