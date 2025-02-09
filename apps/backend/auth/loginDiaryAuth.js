import bcrypt from 'bcrypt';
import { prisma } from "../postgres/postgres.js";
import { Prisma } from '@prisma/client';

export default async function loginDiaryAuth(req, res) {
  try {
    const { phoneNumber, password } = req.body;

    // Check if both phoneNumber and password are provided
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "Phone number and password are required" });
    }

    // Find the Diary by phoneNumber
    const diary = await prisma.diary.findUnique({
      where: { phoneNumber },
    });

    // Check if Diary exists
    if (!diary) {
      return res.status(404).json({ message: "Diary not found" });
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, diary.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Return Diary details upon successful login
    res.status(200).json({
      message: "Login successful",
      diary: {
        id: diary.id,
        status: diary.status,
        approveStatus: diary.approveStatus,
        longitude: diary.longitude,
        latitude: diary.latitude,
      },
    });
  } catch (error) {
    console.error('Error during Diary login:', error);

    // Enhanced error response
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(500).json({ message: 'Database error', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
} 