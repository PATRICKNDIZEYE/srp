import { prisma } from "../postgres/postgres.js";

// Create a new farmer
export const createFarmer = async ({ firstName, lastName, phoneNumber, email, farmSize, region, address, status }) => {
  return await prisma.farmer.create({
    data: {
      firstName,
      lastName,
      phoneNumber,
      email,
      farmSize,
      region,
      address,
      status,
    },
  });
};

// Get all farmers
export const getFarmers = async () => {
  return await prisma.farmer.findMany();
};

// Get a farmer by ID
export const getFarmerById = async (id) => {
  return await prisma.farmer.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a farmer by ID
export const updateFarmer = async (id, { firstName, lastName, phoneNumber, email, farmSize, region, address, status }) => {
  return await prisma.farmer.update({
    where: { id: parseInt(id) },
    data: {
      firstName,
      lastName,
      phoneNumber,
      email,
      farmSize,
      region,
      address,
      status,
    },
  });
};

// Delete a farmer by ID
export const deleteFarmer = async (id) => {
  return await prisma.farmer.delete({
    where: { id: parseInt(id) },
  });
};
