import { prisma } from "../postgres/postgres.js";

// Create a new delivery entry
export const createDerivery = async ({ transportId, pocId, amount, transportStatus }) => {
  return await prisma.derivery.create({
    data: {
      transportId,
      pocId,
      amount,
      transportStatus,
      // `date` is automatically set by Prisma using the @default(now()) in the schema, no need to pass it
    },
  });
};

// Get all delivery entries
export const getDeriveryEntries = async () => {
  return await prisma.derivery.findMany({
    include: {
      transport: true, // Include related transport data
      poc: true,       // Include related POC data
    },
  });
};

// Get a delivery entry by ID
export const getDeriveryById = async (id) => {
  return await prisma.derivery.findUnique({
    where: { id: parseInt(id) },
    include: {
      transport: true, // Include related transport data
      poc: true,       // Include related POC data
    },
  });
};

// Update a delivery entry by ID
export const updateDerivery = async (id, { transportId, pocId, amount, transportStatus }) => {
  return await prisma.derivery.update({
    where: { id: parseInt(id) },
    data: {
      transportId,
      pocId,
      amount,
      transportStatus,
      // `date` is handled automatically by Prisma with @default(now()), so we don't need to update it
    },
  });
};

// Delete a delivery entry by ID
export const deleteDerivery = async (id) => {
  return await prisma.derivery.delete({
    where: { id: parseInt(id) },
  });
};

// Change the status of a delivery entry by ID
export const changeDeriveryStatus = async (id, newStatus) => {
  return await prisma.derivery.update({
    where: { id: parseInt(id) },
    data: {
      transportStatus: newStatus,
    },
  });
};

// Get delivery entries by transport ID
export const getDeriveryByTransportId = async (transportId) => {
  return await prisma.derivery.findMany({
    where: { transportId: parseInt(transportId) },
    include: {
      transport: true, // Include related transport data
      poc: true,       // Include related POC data
    },
  });
};
