import { prisma } from "../postgres/postgres.js";

// Create a new milk submission
export const createMilkSubmission = async ({ milkType, amount, notes, status, farmerId }) => {
  return await prisma.milkSubmission.create({
    data: {
      milkType,
      amount,
      notes,
      status,
      farmer: { connect: { id: farmerId } }, // Connect to the farmer via farmerId
    },
  });
};

// Get all milk submissions
export const getMilkSubmissions = async () => {
  return await prisma.milkSubmission.findMany({
    include: {
      farmer: true, // Include related farmer data
    },
  });
};

// Get a milk submission by ID
export const getMilkSubmissionById = async (id) => {
  return await prisma.milkSubmission.findUnique({
    where: { id: parseInt(id) },
    include: {
      farmer: true,
    },
  });
};

// Update a milk submission by ID
export const updateMilkSubmission = async (id, { milkType, amount, notes, status, farmerId }) => {
  return await prisma.milkSubmission.update({
    where: { id: parseInt(id) },
    data: {
      milkType,
      amount,
      notes,
      status,
      farmer: { connect: { id: farmerId } },
    },
  });
};

// Delete a milk submission by ID
export const deleteMilkSubmission = async (id) => {
  return await prisma.milkSubmission.delete({
    where: { id: parseInt(id) },
  });
};

// Get milk submissions by farmer ID
export const getMilkSubmissionsByFarmerId = async (farmerId) => {
  return await prisma.milkSubmission.findMany({
    where: { farmerId: parseInt(farmerId) },
    include: {
      farmer: true, // Include related farmer data
    },
  });
}; 