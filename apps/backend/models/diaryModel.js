import { prisma } from "../postgres/postgres.js";

// Create a new diary entry
export const createDiary = async ({ date, content, transportId, farmerId }) => {
  return await prisma.diary.create({
    data: {
      date,
      content,
      transport: { connect: { id: transportId } },  // Connect to the transport via transportId
      farmer: { connect: { id: farmerId } },  // Connect to the farmer via farmerId
    },
  });
};

// Get all diary entries
export const getDiaries = async () => {
  return await prisma.diary.findMany({
    include: {
      transport: true,  // Include related transport data
      farmer: true,  // Include related farmer data
    },
  });
};

// Get a diary entry by ID
export const getDiaryById = async (id) => {
  return await prisma.diary.findUnique({
    where: { id: parseInt(id) },
    include: {
      transport: true,
      farmer: true,
    },
  });
};

// Update a diary entry by ID
export const updateDiary = async (id, { date, content, transportId, farmerId }) => {
  return await prisma.diary.update({
    where: { id: parseInt(id) },
    data: {
      date,
      content,
      transport: { connect: { id: transportId } },
      farmer: { connect: { id: farmerId } },
    },
  });
};

// Delete a diary entry by ID
export const deleteDiary = async (id) => {
  return await prisma.diary.delete({
    where: { id: parseInt(id) },
  });
};
