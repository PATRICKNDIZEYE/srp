import { prisma } from "../postgres/postgres.js";

// Create a new Farmer
export const createFarmer = async ({ firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, farmDetails, status, pocId }) => {
  try {
    // Check if phone number already exists
    const existingFarmer = await prisma.farmer.findFirst({
      where: { 
        phoneNumber: phoneNumber.trim() 
      }
    });

    if (existingFarmer) {
      throw new Error('Iyi numero ya telefoni isanzwe iriho. Koresha indi numero.');
    }

    // Check if username already exists
    const existingUsername = await prisma.farmer.findFirst({
      where: { username }
    });

    if (existingUsername) {
      throw new Error('Izina ryawe risanzwe rikoreshwa. Hitamo irindi.');
    }

    // Create the farmer if no duplicates found
    return await prisma.farmer.create({
      data: {
        firstName,
        lastName,
        birthday,
        nationalId,
        phoneNumber: phoneNumber.trim(),
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
        username,
        password,
        farmDetails,
        status,
        pocId: parseInt(pocId),
      },
    });
  } catch (error) {
    // If it's not one of our custom errors, throw a generic error in Kinyarwanda
    if (!error.message.includes('numero ya telefoni') && 
        !error.message.includes('Izina ryawe')) {
      throw new Error('Gerageza urebe niba ibyo wanditse bidasanzwe muri sisitemu.');
    }
    throw error;
  }
};

// Get all Farmers
export const getFarmers = async () => {
  return await prisma.farmer.findMany();
};

// Get a Farmer by ID
export const getFarmerById = async (id) => {
  return await prisma.farmer.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a Farmer by ID
export const updateFarmer = async (id, { firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, farmDetails, status, pocId }) => {
  return await prisma.farmer.update({
    where: { id: parseInt(id) },
    data: {
      firstName,
      lastName,
      birthday,
      nationalId,
      phoneNumber,
      longitude,
      latitude,
      username,
      password,
      farmDetails,
      status,
      pocId,
    },
  });
};

// Delete a Farmer by ID
export const deleteFarmer = async (id) => {
  return await prisma.farmer.delete({
    where: { id: parseInt(id) },
  });
};
export const getFarmersByPhoneNumber = async (phoneNumber) => {
  return await prisma.farmer.findMany({
    where: { phoneNumber },
  });
};

// Update Farmer Status by ID
export const updateFarmerStatus = async (id, status) => {
  return await prisma.farmer.update({
    where: { id: parseInt(id) },
    data: { status },
  });
};

// Get Farmers by POC ID
export const getFarmersByPocId = async (pocId) => {
  return await prisma.farmer.findMany({
    where: { pocId },
  });
};

// Update Farmer Password by ID
export const updateFarmerPassword = async (id, newPassword) => {
  return await prisma.farmer.update({
    where: { id: parseInt(id) },
    data: { password: newPassword },
  });
};
