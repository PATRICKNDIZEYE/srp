import bcrypt from 'bcrypt';
import { prisma } from '../postgres/postgres.js';
import { Prisma } from '@prisma/client';

export const loginFarmerAuth = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const farmer = await prisma.farmer.findUnique({
      where: { phoneNumber },
    });

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, farmer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({
      message: 'Login successful',
      farmer: {
        id: farmer.id,
        firstName: farmer.firstName,
        lastName: farmer.lastName,
        username: farmer.username,
        status: farmer.status,
      },
    });
  } catch (error) {
    console.error('Error during farmer login:', error);

    // Enhanced error response
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      res.status(500).json({ message: 'Database error', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

export default loginFarmerAuth; 