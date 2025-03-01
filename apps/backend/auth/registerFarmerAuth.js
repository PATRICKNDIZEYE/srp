import bcrypt from 'bcryptjs';
import { prisma } from '../postgres/postgres.js';

// Register a new Farmer
export const registerFarmerAuth = async ({ firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, farmDetails, status, pocId }) => {
  // Validate required fields
  if (!nationalId) {
    throw new Error('National ID is required.');
  }

  // Check if the POC exists
  const poc = await prisma.pOC.findUnique({
    where: { id: pocId },
  });

  if (!poc) {
    throw new Error('Invalid POC ID.');
  }

  const existingFarmer = await prisma.farmer.findUnique({
    where: { nationalId },
  });

  if (existingFarmer) {
    throw new Error('Farmer with this National ID already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('Creating new farmer with pocId:', pocId);

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
      pocId,
    },
  });

  return newFarmer;
};

async function registerFarmer(req, res) {
    try {
        const { firstName, lastName, birthday, nationalId, phoneNumber, username, password, pocId } = req.body;

        // Ensure pocId is valid and does not violate unique constraints
        const poc = await prisma.pOC.findUnique({
            where: { id: pocId }
        });

        if (!poc) {
            return res.status(400).json({ error: "Invalid POC ID" });
        }

        const newFarmer = await prisma.farmer.create({
            data: {
                firstName,
                lastName,
                birthday: new Date(birthday),
                nationalId,
                phoneNumber,
                username,
                password,
                pocId, // Ensure this is set correctly
                // other fields...
            }
        });

        res.status(201).json(newFarmer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
} 