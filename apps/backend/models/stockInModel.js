import { prisma } from "../postgres/postgres.js";

// Create a new stock in entry
export const createStockIn = async ({ productionId, product, amount }) => {
  return await prisma.stockIn.create({
    data: {
      productionId,
      product,
      amount,
    },
  });
};

// Get all stock in entries
export const getStockIns = async () => {
  return await prisma.stockIn.findMany({
    include: {
      production: true,
    },
  });
};

// Get a stock in entry by ID
export const getStockInById = async (id) => {
  return await prisma.stockIn.findUnique({
    where: { id: parseInt(id) },
    include: {
      production: true,
    },
  });
};

// Update a stock in entry by ID
export const updateStockIn = async (id, { productionId, product, amount }) => {
  return await prisma.stockIn.update({
    where: { id: parseInt(id) },
    data: {
      productionId,
      product,
      amount,
    },
  });
};

// Delete a stock in entry by ID
export const deleteStockIn = async (id) => {
  return await prisma.stockIn.delete({
    where: { id: parseInt(id) },
  });
}; 