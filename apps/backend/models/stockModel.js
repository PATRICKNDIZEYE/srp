import { prisma } from "../postgres/postgres.js";

// Create a new stock entry
export const createStock = async ({ quantity, productId, farmerId, pocId, productType }) => {
  return await prisma.stock.create({
    data: {
      quantity,
      productType,  // Include productType in the data
      product: { connect: { id: productId } },  // Connect to the product via productId
      farmer: { connect: { id: farmerId } },   // Connect to the farmer via farmerId
      poc: { connect: { id: pocId } }, // Connect to the poc via pocId
    },
  });
};

// Get all stock entries
export const getStocks = async () => {
  return await prisma.stock.findMany({
    include: {
      product: true,  // Include related product data
      farmer: true,   // Include related farmer data
      poc: true,      // Include related poc data
    },
  });
};

// Get a stock entry by ID
export const getStockById = async (id) => {
  return await prisma.stock.findUnique({
    where: { id: parseInt(id) },
    include: {
      product: true,
      farmer: true,
      poc: true,
    },
  });
};

// Update a stock entry by ID
export const updateStock = async (id, { quantity, productId, farmerId, pocId, productType }) => {
  return await prisma.stock.update({
    where: { id: parseInt(id) },
    data: {
      quantity,
      productType,  // Include productType in the data
      product: { connect: { id: productId } },
      farmer: { connect: { id: farmerId } },
      poc: { connect: { id: pocId } },
    },
  });
};

// Delete a stock entry by ID
export const deleteStock = async (id) => {
  return await prisma.stock.delete({
    where: { id: parseInt(id) },
  });
};
