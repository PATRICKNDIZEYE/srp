import { prisma } from "../postgres/postgres.js";

// Create a new diary entry
export const createDiary = async ({ entryDate, status, remarks, transportId, approveStatus }) => {
  return await prisma.diary.create({
    data: {
      entryDate,
      status,
      remarks,
      transportId,
      approveStatus,
    },
  });
};

// Get all diary entries
export const getDiaries = async () => {
  return await prisma.diary.findMany();
};

// Get a diary entry by ID
export const getDiaryById = async (id) => {
  return await prisma.diary.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a diary entry by ID
export const updateDiary = async (id, { entryDate, status, remarks, transportId, approveStatus }) => {
  return await prisma.diary.update({
    where: { id: parseInt(id) },
    data: {
      entryDate,
      status,
      remarks,
      transportId,
      approveStatus,
    },
  });
};

// Delete a diary entry by ID
export const deleteDiary = async (id) => {
  return await prisma.diary.delete({
    where: { id: parseInt(id) },
  });
};
