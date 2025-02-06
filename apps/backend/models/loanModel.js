import { prisma } from "../postgres/postgres.js";

// Create a new loan
export const createLoan = async ({ loanAmount, purpose, status, farmerId }) => {
  return await prisma.loan.create({
    data: {
      loanAmount,
      purpose,
      status,
      farmer: { connect: { id: farmerId } }, // Connect to the farmer via farmerId
    },
  });
};

// Get all loans
export const getLoans = async () => {
  return await prisma.loan.findMany({
    include: {
      farmer: true, // Include related farmer data
    },
  });
};

// Get a loan by ID
export const getLoanById = async (id) => {
  return await prisma.loan.findUnique({
    where: { id: parseInt(id) },
    include: {
      farmer: true,
    },
  });
};

// Update a loan by ID
export const updateLoan = async (id, { loanAmount, purpose, status, farmerId }) => {
  return await prisma.loan.update({
    where: { id: parseInt(id) },
    data: {
      loanAmount,
      purpose,
      status,
      farmer: { connect: { id: farmerId } },
    },
  });
};

// Delete a loan by ID
export const deleteLoan = async (id) => {
  return await prisma.loan.delete({
    where: { id: parseInt(id) },
  });
};

// Get loans by farmer ID
export const getLoansByFarmerId = async (farmerId) => {
  return await prisma.loan.findMany({
    where: { farmerId: parseInt(farmerId) },
    include: {
      farmer: true,
    },
  });
}; 