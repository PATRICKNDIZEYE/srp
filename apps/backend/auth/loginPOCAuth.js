import bcrypt from 'bcrypt';  // Use bcrypt for consistency
import { prisma } from "../postgres/postgres.js";
import { Prisma } from '@prisma/client';  // Import Prisma for error handling
import jwt from 'jsonwebtoken';  // Add this import

export default async function loginPOCAuth(req, res) {
  try {
    const { phoneNumber, password } = req.body;

    // Check if both phoneNumber and password are provided
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "Phone number and password are required" });
    }

    // Find the POC by phoneNumber
    const poc = await prisma.pOC.findUnique({
      where: { phoneNumber },
    });

    // Check if POC exists
    if (!poc) {
      return res.status(404).json({ message: "POC not found" });
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, poc.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: poc.id,
        phoneNumber: poc.phoneNumber,
        role: 'poc'  // Assuming role is poc
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return POC details and token upon successful login
    res.status(200).json({
      message: "Login successful",
      token,
      poc: {
        id: poc.id,
        firstName: poc.firstName,
        lastName: poc.lastName,
        username: poc.username,
        status: poc.status,
      },
    });
  } catch (error) {
    console.error('Error during POC login:', error);

    // Enhanced error response
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      res.status(500).json({ message: 'Database error', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}
