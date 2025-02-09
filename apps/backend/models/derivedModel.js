import { prisma } from "../postgres/postgres.js";

// Create a new derived entry
export const createDerived = async ({ diaryId, transportId, deriveryId, amount, status }) => {
  // Check if the transportId exists
  const transportExists = await prisma.transport.findUnique({
    where: { id: parseInt(transportId) },
  });

  if (!transportExists) {
    throw new Error("Transport ID does not exist.");
  }

  // Ensure deriveryId is a valid number
  const parsedDeriveryId = parseInt(deriveryId);
  if (isNaN(parsedDeriveryId)) {
    throw new Error("Invalid derivery ID.");
  }

  // Check if the deriveryId exists
  const deriveryExists = await prisma.derivery.findUnique({
    where: { id: parsedDeriveryId },
  });

  if (!deriveryExists) {
    throw new Error("Derivery ID does not exist.");
  }

  return await prisma.derived.create({
    data: {
      amount: parseFloat(amount),     // Ensuring the amount is a float
      status,
      date: new Date(),               // Use current date by default, Prisma automatically handles this if not provided
      diary: {
        connect: { id: parseInt(diaryId) } // Connect the existing diary
      },
      transport: {
        connect: { id: parseInt(transportId) } // Connect the existing transport
      },
      derivery: {
        connect: { id: parsedDeriveryId } // Connect the existing derivery
      }
    },
  });
};

// Get all derived entries
export const getDerivedEntries = async () => {
  return await prisma.derived.findMany({
    include: {
      diary: true,     // Include related diary data
      transport: true, // Include related transport data
      derivery: true,  // Include related derivery data
    },
  });
};

// Get a derived entry by ID
export const getDerivedById = async (id) => {
  return await prisma.derived.findUnique({
    where: { id: parseInt(id) },
    include: {
      diary: true,     // Include related diary data
      transport: true, // Include related transport data
      derivery: true,  // Include related derivery data
    },
  });
};

// Update a derived entry by ID
export const updateDerived = async (id, { diaryId, transportId, deriveryId, amount, status }) => {
  return await prisma.derived.update({
    where: { id: parseInt(id) },
    data: {
      diaryId: parseInt(diaryId),
      transportId: parseInt(transportId),
      deriveryId: parseInt(deriveryId),
      amount: parseFloat(amount),
      status,
    },
  });
};

// Delete a derived entry by ID
export const deleteDerived = async (id) => {
  return await prisma.derived.delete({
    where: { id: parseInt(id) },
  });
};

// Get derived entries by transport ID
export const getDerivedByTransportId = async (transportId) => {
  return await prisma.derived.findMany({
    where: { transportId: parseInt(transportId) },
    include: {
      diary: true,     // Include related diary data
      transport: true, // Include related transport data
      derivery: true,  // Include related derivery data
    },
  });
};

// Get derived entries by diary ID
export const getDerivedByDiaryId = async (diaryId) => {
  return await prisma.derived.findMany({
    where: { diaryId: parseInt(diaryId) },
    include: {
      diary: true,     // Include related diary data
      transport: true, // Include related transport data
    },
  });
};

// Update the status of a derived entry by ID
export const updateDerivedStatus = async (id, status) => {
  return await prisma.derived.update({
    where: { id: parseInt(id) },
    data: {
      status,
    },
  });
};

// Get derived entries by derivery ID
export const getDerivedByDeriveryId = async (deriveryId) => {
  return await prisma.derived.findMany({
    where: { deriveryId: parseInt(deriveryId) },
    include: {
      diary: true,     // Include related diary data
      transport: true, // Include related transport data
      derivery: true,  // Include related derivery data
    },
  });
};
