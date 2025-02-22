import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new delivery entry
export const createDelivery = async ({ transportId, productionId, amount, transportStatus }) => {
  console.log("Creating delivery with:", { transportId, productionId, amount, transportStatus });
  return await prisma.derivery.create({
    data: {
      transportId,
      productionId,
      amount,
      transportStatus,
      // `date` is automatically set by Prisma using the @default(now()) in the schema, no need to pass it
    },
  });
};

// Get all delivery entries
export const getDeliveryEntries = async () => {
  try {
    return await prisma.derivery.findMany({
      include: {
        transport: true,
        // Remove production if not needed
      },
    });
  } catch (error) {
    console.error("Error retrieving delivery entries:", error);
    throw new Error("Failed to retrieve delivery entries");
  }
};

// Get a delivery entry by ID
export const getDeliveryById = async (id) => {
  try {
    const deliveryId = parseInt(id, 10); // Ensure the ID is parsed as an integer
    if (isNaN(deliveryId)) {
      throw new Error("Invalid ID format");
    }

    const delivery = await prisma.derivery.findUnique({
      where: { id: deliveryId },
      include: {
        transport: true, // Include related transport data
        // Remove production as it is not a valid field
      },
    });

    if (!delivery) {
      throw new Error("Delivery entry not found");
    }

    return delivery;
  } catch (error) {
    console.error("Error retrieving delivery entry by ID:", error);
    throw new Error("Failed to retrieve delivery entry");
  }
};

// Update a delivery entry by ID
export const updateDelivery = async (id, { transportId, productionId, amount, transportStatus }) => {
  return await prisma.derivery.update({
    where: { id: parseInt(id) },
    data: {
      transportId,
      productionId,
      amount,
      transportStatus,
      // `date` is handled automatically by Prisma with @default(now()), so we don't need to update it
    },
  });
};

// Delete a delivery entry by ID
export const deleteDelivery = async (id) => {
  return await prisma.derivery.delete({
    where: { id: parseInt(id) },
  });
};

// Change the status of a delivery entry by ID
export const changeDeliveryStatus = async (id, newStatus) => {
  return await prisma.derivery.update({
    where: { id: parseInt(id) },
    data: {
      transportStatus: newStatus,
    },
  });
};

// Get delivery entries by transport ID
export const getDeliveryByTransportId = async (transportId) => {
  return await prisma.derivery.findMany({
    where: { transportId: parseInt(transportId) },
    include: {
      transport: true, // Include related transport data
      // Remove production as it is not a valid field
    },
  });
};
