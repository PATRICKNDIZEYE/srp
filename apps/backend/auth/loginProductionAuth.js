import bcrypt from 'bcrypt';
import { prisma } from "../postgres/postgres.js";
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';

export default async function loginProductionAuth(req, res) {
  try {
    const { phoneNumber, password } = req.body;

    // Check if both phoneNumber and password are provided
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "Phone number and password are required" });
    }

    // Find the Production by phoneNumber
    const production = await prisma.production.findUnique({
      where: { phoneNumber },
    });

    // Check if Production exists
    if (!production) {
      return res.status(404).json({ message: "Production not found" });
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, production.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: production.id,
        phoneNumber: production.phoneNumber,
        role: 'production'  // Assuming role is production
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return Production details and token upon successful login
    res.status(200).json({
      message: "Login successful",
      token,
      production: {
        id: production.id,
        status: production.status,
        approveStatus: production.approveStatus,
        longitude: production.longitude,
        latitude: production.latitude,
      },
    });
  } catch (error) {
    console.error('Error during Production login:', error);

    // Enhanced error response
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(500).json({ message: 'Database error', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
} 