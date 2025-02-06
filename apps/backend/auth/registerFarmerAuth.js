import bcrypt from 'bcryptjs';
import { prisma } from '../postgres/postgres.js';

// Register a new Farmer
export const registerFarmerAuth = async ({ firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, farmDetails, status }) => {
  // Validate required fields
  if (!nationalId) {
    throw new Error('National ID is required.');
  }

  const existingFarmer = await prisma.farmer.findUnique({
    where: { nationalId },
  });

  if (existingFarmer) {
    throw new Error('Farmer with this National ID already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newFarmer = await prisma.farmer.create({
    data: {
      firstName,
      lastName,
      birthday,
      nationalId,
      phoneNumber,
      longitude,
      latitude,
      username,
      password: hashedPassword,
      farmDetails,
      status,
    },
  });

  return newFarmer;
}; 