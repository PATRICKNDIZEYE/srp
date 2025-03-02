import { prisma } from "../postgres/postgres.js";

// Create a new milk submission
export const createMilkSubmission = async ({ milkType, amount, notes, status, farmerId }) => {
  try {
    return await prisma.milkSubmission.create({
      data: {
        milkType,
        amount: parseFloat(amount),
        notes,
        status,
        farmerId,
      }
    });
  } catch (error) {
    console.error('Error creating milk submission:', error);
    throw new Error('Failed to create milk submission');
  }
};

// Create a new milk submission (copy of createMilkSubmission)
export const createMilkSub = async ({ milkType, amount, notes, status, farmerId }) => {
  try {
    console.log('Creating milk submission with data:', { milkType, amount, notes, status, farmerId }); // Debugging log
    return await prisma.milkSubmission.create({
      data: {
        milkType,
        amount,
        notes,
        status,
        farmer: { connect: { id: farmerId } }, // Connect to the farmer via farmerId
      },
    });
  } catch (error) {
    console.error('Error creating milk submission:', error); // More detailed error logging
    throw new Error('Failed to create milk submission');
  }
};

// Get all milk submissions
export const getMilkSubmissions = async () => {
  return await prisma.milkSubmission.findMany({
    include: {
      farmer: true, // Include related farmer data
    }
  });
};

// Get a milk submission by ID
export const getMilkSubmissionById = async (id) => {
  return await prisma.milkSubmission.findUnique({
    where: { id: parseInt(id) },
    include: {
      farmer: true,
    }
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

// Update milk submission quality by ID
export const updateMilkSubmissionQuality = async (id, quality) => {
  try {
    return await prisma.milkSubmission.update({
      where: { id: parseInt(id) },
      data: { quality },
    });
  } catch (error) {
    console.error('Error updating milk submission quality:', error);
    throw new Error('Failed to update milk submission quality');
  }
};

// Delete a milk submission by ID
export const deleteMilkSubmission = async (id) => {
  return await prisma.milkSubmission.delete({
    where: { id: parseInt(id) },
  });
};

// Get milk submissions by farmer ID
export const getMilkSubmissionsByFarmerId = async (farmerId) => {
  try {
    return await prisma.milkSubmission.findMany({
      where: { farmerId },
      orderBy: { createdAt: 'desc' },
      include: {
        farmer: true // Include related farmer data
      }
    });
  } catch (error) {
    console.error('Error fetching milk submissions by farmer ID:', error);
    throw new Error('Failed to fetch milk submissions');
  }
};

// Get milk submissions by POC ID
export const getMilkSubmissionsByPocId = async (pocId) => {
  try {
    return await prisma.milkSubmission.findMany({
      where: { pocId },
      include: {
        farmer: true, // Include related farmer data if needed
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching milk submissions by POC ID:', error);
    throw new Error('Failed to fetch milk submissions');
  }
};

// Get milk submissions by farmer ID and POC ID
export const getMilkSubmissionsByFarmerAndPocId = async (farmerId, pocId) => {
  try {
    return await prisma.milkSubmission.findMany({
      where: {
        farmerId,
        pocId
      },
      include: {
        farmer: true, // Include related farmer data if needed
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching milk submissions by farmer ID and POC ID:', error);
    throw new Error('Failed to fetch milk submissions');
  }
}; 