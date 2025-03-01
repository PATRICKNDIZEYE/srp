import { prisma } from "../postgres/postgres.js";

// Create a new Farmer
export const createFarmer = async ({ firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, farmDetails, status, pocId }) => {
  return await prisma.farmer.create({
    data: {
      firstName,
      lastName,
      birthday,
      nationalId,
      phoneNumber,
      longitude,
      latitude,
      username,
      password,
      farmDetails,
      status,
      pocId,
    },
  });
};

// Get all Farmers
export const getFarmers = async () => {
  return await prisma.farmer.findMany();
};

// Get a Farmer by ID
export const getFarmerById = async (id) => {
  return await prisma.farmer.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a Farmer by ID
export const updateFarmer = async (id, { firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, farmDetails, status, pocId }) => {
  return await prisma.farmer.update({
    where: { id: parseInt(id) },
    data: {
      firstName,
      lastName,
      birthday,
      nationalId,
      phoneNumber,
      longitude,
      latitude,
      username,
      password,
      farmDetails,
      status,
      pocId,
    },
  });
};

// Delete a Farmer by ID
export const deleteFarmer = async (id) => {
  return await prisma.farmer.delete({
    where: { id: parseInt(id) },
  });
};
export const getFarmersByPhoneNumber = async (phoneNumber) => {
  return await prisma.farmer.findMany({
    where: { phoneNumber },
  });
};

// Update Farmer Status by ID
export const updateFarmerStatus = async (id, status) => {
  return await prisma.farmer.update({
    where: { id: parseInt(id) },
    data: { status },
  });
};

// Get Farmers by POC ID
export const getFarmersByPocId = async (pocId) => {
  return await prisma.farmer.findMany({
    where: { pocId },
  });
};
