import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../postgres/postgres.js';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    console.log('Received login attempt for:', phoneNumber);

    if (!phoneNumber || !password) {
      return res.status(400).json('Phone number and password are required');
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json('Server configuration error');
    }

    // Find the farmer with exact phone number match
    const farmer = await prisma.farmer.findFirst({
      where: {
        phoneNumber: {
          equals: phoneNumber
        }
      }
    });

    if (!farmer) {
      console.log('No farmer found with phone:', phoneNumber);
      return res.status(404).json('User not found');
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, farmer.password);
    if (!validPassword) {
      return res.status(401).json('Invalid password');
    }

    // Check if account is active
    if (farmer.status !== 'active') {
      return res.status(403).json('Account is inactive');
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: farmer.id, 
        phoneNumber: farmer.phoneNumber,
        role: 'farmer'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      token,
      user: {
        id: farmer.id,
        firstName: farmer.firstName,
        lastName: farmer.lastName,
        phoneNumber: farmer.phoneNumber,
        role: 'farmer'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json('Internal server error');
  }
});

export default router; 