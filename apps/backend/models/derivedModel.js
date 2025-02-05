import { prisma } from "../postgres/postgres.js";

// Create a new derived entry
export const createDerived = async ({ derivedValue, transportId, diaryId, farmerId }) => {
  return await prisma.derived.create({
    data: {
      derivedValue,
      transport: { connect: { id: transportId } },  // Connect to the transport via transportId
      diary: { connect: { id: diaryId } },  // Connect to the diary via diaryId
      farmer: { connect: { id: farmerId } },  // Connect to the farmer via farmerId
    },
  });
};

// Get all derived entries
export const getDeriveds = async () => {
  return await prisma.derived.findMany({
    include: {
      transport: true,  // Include related transport data
      diary: true,  // Include related diary data
      farmer: true,  // Include related farmer data
    },
  });
};

// Get a derived entry by ID
export const getDerivedById = async (id) => {
  return await prisma.derived.findUnique({
    where: { id: parseInt(id) },
    include: {
      transport: true,
      diary: true,
      farmer: true,
    },
  });
};

// Update a derived entry by ID
export const updateDerived = async (id, { derivedValue, transportId, diaryId, farmerId }) => {
  return await prisma.derived.update({
    where: { id: parseInt(id) },
    data: {
      derivedValue,
      transport: { connect: { id: transportId } },
      diary: { connect: { id: diaryId } },
      farmer: { connect: { id: farmerId } },
    },
  });
};

// Delete a derived entry by ID
export const deleteDerived = async (id) => {
  return await prisma.derived.delete({
    where: { id: parseInt(id) },
  });
};
