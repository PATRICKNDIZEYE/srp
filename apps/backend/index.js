import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

// Import routes and middleware
import errorHandling from './middlewares/errorHandler.js';
import userRoutes from './routes/userRouter.js';
import ngoRoutes from './routes/ngoRoutes.js';
import annualTargetRoutes from './routes/annualtargetRoutes.js';
import biannualReportRoutes from './routes/biannualReportRoutes.js';
import progressRoutes from './routes/annualreportRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import userMessageRoutes from './routes/userMessageRoutes.js';

// Import authentication handlers
import { loginNgoAuth } from './auth/loginNgoAuth.js';
import { loginAdminAuth } from './auth/loginAdminAuth.js';
import { registerNgoAuth } from './auth/registerNgoAuth.js';
import { registerAdminAuth } from './auth/registerAdminAuth.js';
import { verifyOtp, verifyOtpAdmin } from './auth/Otpval.js';

// Import password reset routes
import passwordResetRoutes from './auth/resetNgopasswordAuth.js';
import passwordRoutes from './auth/resetAdminpassword.js';

// Import database connection
import { connection } from './postgres/postgres.js';
import { createNGO } from './models/ngoModel.js';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// Get current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS and Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandling);

// File Upload Configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Home route
app.get('/', (req, res) => {
  res.send("MINUBUMWE NGO Server");
});

// Routes Registration
  app.use('/api/users', userRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/annual-targets', annualTargetRoutes);
app.use('/api/loginAdmin', loginAdminAuth);
app.use('/api/biannual-reports', biannualReportRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/resetNgopassword', passwordResetRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user-messages', userMessageRoutes);

// Authentication Routes
app.post('/api/verify-otp', verifyOtp);
app.post('/api/verify-otp-foradmin', verifyOtpAdmin);

// Duplicate NGO Registration Routes
app.post('/api/registerNgo', async (req, res, next) => {
  try {
    const ngoData = req.body;
    const newNgo = await registerNgoAuth(ngoData);
    res.status(201).json(newNgo);
  } catch (error) {
    next(error);
  }
});

// Duplicate NGO Registration Route with Different Implementation
app.post('/api/ngos', upload.array('supportingDocuments'), async (req, res) => {
  try {
    let ngoData = req.body;

    if (typeof ngoData.ngoData === 'string') {
      try {
        ngoData = JSON.parse(ngoData.ngoData);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid NGO data format' });
      }
    }

    const supportingDocuments = req.files ? req.files.map(file => file.path) : [];

    if (!ngoData.password) {
      return res.status(400).json({ error: 'Password is required for NGO registration' });
    }

    const newNgo = await createNGO({
      ...ngoData,
      supportingDocuments,
      status: ngoData.status || 'PENDING'
    });

    res.status(201).json({
      message: 'NGO registered successfully',
      ngo: {
        id: newNgo.id,
        nameOfTheNGO: newNgo.nameOfTheNGO,
        contactPersonsEmail: newNgo.contactPersonsEmail
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// NGO Login
app.post('/api/loginNgos', async (req, res) => {
  try {
    const { contactPersonsEmail, password } = req.body;
    const response = await loginNgoAuth({ contactPersonsEmail, password });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Duplicate Admin Registration Routes
app.post('/api/registerAdmin', async (req, res, next) => {
  try {
    const { username, email, password, name } = req.body;
    const newAdmin = await registerAdminAuth({ username, email, password, name });
    res.status(201).json(newAdmin);
  } catch (error) {
    next(error);
  }
});

// Debug Endpoint for NGOs
app.get('/api/debug/ngos', async (req, res) => {
  try {
    const ngos = await prisma.NGO.findMany({
      select: {
        id: true,
        nameOfTheNGO: true,
        contactPersonsEmail: true,
        status: true
      }
    });

    res.json({
      count: ngos.length,
      ngos: ngos
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 2025;
connection();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});