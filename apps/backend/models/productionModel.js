import { prisma } from "../postgres/postgres.js";
import bcrypt from 'bcrypt';

// Create a new production entry
export const createProduction = async ({ status, approveStatus, phoneNumber, password, longitude, latitude }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.production.create({
    data: {
      status,
      approveStatus,
      phoneNumber,
      password: hashedPassword,
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
    },
  });
};

// Get all production entries
export const getProductions = async () => {
  return await prisma.production.findMany();
};

// Get a production entry by ID
export const getProductionById = async (id) => {
  return await prisma.production.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a production entry by ID
export const updateProduction = async (id, { status, approveStatus, phoneNumber, password, longitude, latitude }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.production.update({
    where: { id: parseInt(id) },
    data: {
      status,
      approveStatus,
      phoneNumber,
      password: hashedPassword,
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
    },
  });
};

// Delete a production entry by ID
export const deleteProduction = async (id) => {
  return await prisma.production.delete({
    where: { id: parseInt(id) },
  });
}; 