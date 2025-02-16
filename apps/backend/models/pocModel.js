import { prisma } from "../postgres/postgres.js";

// Create a new POC
export const createPOC = async ({ firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, address, status }) => {
  return await prisma.pOC.create({
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
      address,
      status
    },
  });
};

// Get all POCs
export const getPOCs = async () => {
  return await prisma.pOC.findMany();
};

// Get a POC by ID
export const getPOCById = async (id) => {
  return await prisma.pOC.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a POC by ID
export const updatePOC = async (id, { firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, address, status }) => {
  return await prisma.pOC.update({
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
      address,
      status,
    },
  });
};

// Delete a POC by ID
export const deletePOC = async (id) => {
  return await prisma.pOC.delete({
    where: { id: parseInt(id) },
  });
};
export const getPOCsByPhoneNumber = async (phoneNumber) => {
  return await prisma.poc.findMany({
    where: { phoneNumber },
  });
};