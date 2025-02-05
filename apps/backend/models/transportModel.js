import { prisma } from "../postgres/postgres.js";

// Create a new transport
export const createTransport = async ({ vehicleId, type, capacity, region, status, driverName, contact }) => {
  return await prisma.transport.create({
    data: {
      vehicleId,
      type,
      capacity,
      region,
      status,
      driverName,
      contact,
    },
  });
};

// Get all transports
export const getTransports = async () => {
  return await prisma.transport.findMany();
};

// Get a transport by ID
export const getTransportById = async (id) => {
  return await prisma.transport.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a transport by ID
export const updateTransport = async (id, { vehicleId, type, capacity, region, status, driverName, contact }) => {
  return await prisma.transport.update({
    where: { id: parseInt(id) },
    data: {
      vehicleId,
      type,
      capacity,
      region,
      status,
      driverName,
      contact,
    },
  });
};

// Delete a transport by ID
export const deleteTransport = async (id) => {
  return await prisma.transport.delete({
    where: { id: parseInt(id) },
  });
};
