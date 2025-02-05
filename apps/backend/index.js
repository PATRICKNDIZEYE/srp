import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// Import PrismaClient
import { PrismaClient } from '@prisma/client';

// Import routes and middleware
import errorHandling from './middlewares/errorHandler.js';
import stockRoutes from './routes/stockRoutes.js';

// Import database connection (if necessary)
import { connection } from './postgres/postgres.js';

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
  res.send("MINUBUMWE NGO Server");
});

app.use('/api/stocks', stockRoutes);

// Start Server
const PORT = process.env.PORT || 2025;
connection();  // You can remove this if you are using Prisma's automatic connection management

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
