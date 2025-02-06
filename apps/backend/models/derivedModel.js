import { prisma } from "../postgres/postgres.js";

// Create a new derived entry
export const createDerived = async ({ transportId, diaryId, data }) => {
  return await prisma.derived.create({
    data: {
      transportId,
      diaryId,
      data,
    },
  });
};

// Get all derived entries
export const getDerivedEntries = async () => {
  return await prisma.derived.findMany();
};

// Get a derived entry by ID
export const getDerivedById = async (id) => {
  return await prisma.derived.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a derived entry by ID
export const updateDerived = async (id, { transportId, diaryId, data }) => {
  return await prisma.derived.update({
    where: { id: parseInt(id) },
    data: {
      transportId,
      diaryId,
      data,
    },
  });
};

// Delete a derived entry by ID
export const deleteDerived = async (id) => {
  return await prisma.derived.delete({
    where: { id: parseInt(id) },
  });
};
