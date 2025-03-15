import { prisma } from "../postgres/postgres.js";

// Create a new stock out entry
export const createStockOut = async ({ productionId, product, amount, dailyId, status, stockInId }) => {
  return await prisma.stockOut.create({
    data: {
      productionId,
      product,
      amount,
      dailyId,
      status,
      stockInId,
    },
  });
};

// Get all stock out entries, optionally filtered by criteria such as dailyId
export const getStockOuts = async (filter = {}) => {
  try {
    return await prisma.stockOut.findMany({
      where: filter, // filter can include dailyId, productionId, etc.
      select: {
        id: true,
        productionId: true,
        product: true,
        amount: true,
        dailyId: true,
        status: true,
        stockInId: true,
        production: true,
        stockIn: true,
      },
    });
  } catch (error) {
    console.error('Error fetching stockOuts:', error);
    throw error;
  }
};

// Get a stock out entry by ID
export const getStockOutById = async (id) => {
  return await prisma.stockOut.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      productionId: true,
      product: true,
      amount: true,
      dailyId: true,
      status: true,
      stockInId: true,
      production: true,
      dailySale: true,
      stockIn: true,
    },
  });
};

// Update a stock out entry by ID
export const updateStockOut = async (id, { productionId, product, amount, dailyId, status, stockInId }) => {
  return await prisma.stockOut.update({
    where: { id: parseInt(id) },
    data: {
      productionId,
      product,
      amount,
      dailyId,
      status,
      stockInId,
    },
  });
};

// Delete a stock out entry by ID
export const deleteStockOut = async (id) => {
  return await prisma.stockOut.delete({
    where: { id: parseInt(id) },
  });
};

// Update stock out status
export const updateStockOutStatus = async (id, status) => {
  return await prisma.stockOut.update({
    where: { id: parseInt(id) },
    data: { status },
  });
}; 