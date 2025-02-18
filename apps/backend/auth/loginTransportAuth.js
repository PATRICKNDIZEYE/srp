import bcrypt from 'bcrypt';  // Use bcrypt for consistency
import { prisma } from "../postgres/postgres.js";
import { Prisma } from '@prisma/client';  // Import Prisma for error handling
import jwt from 'jsonwebtoken';  // Add this import

export default async function loginTransportAuth(req, res) {
  try {
    const { phoneNumber, password } = req.body;

    // Check if both phoneNumber and password are provided
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "Phone number and password are required" });
    }

    // Find the Transport by phoneNumber
    const transport = await prisma.transport.findUnique({
      where: { phoneNumber },
    });

    // Check if Transport exists
    if (!transport) {
      return res.status(404).json({ message: "Transport not found" });
    }

    // Check if the password matches
    console.log('Stored hashed password:', transport.password); // Log the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, transport.password);
    console.log('Password comparison result:', isPasswordValid); // Log the comparison result
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: transport.id,
        phoneNumber: transport.phoneNumber,
        role: 'transport'  // Assuming role is transport
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return Transport details and token upon successful login
    res.status(200).json({
      message: "Login successful",
      token,
      transport: {
        id: transport.id,
        firstName: transport.firstName,
        lastName: transport.lastName,
        username: transport.username,
        status: transport.status,
      },
    });
  } catch (error) {
    console.error('Error during Transport login:', error);

    // Enhanced error response
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      res.status(500).json({ message: 'Database error', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
} 