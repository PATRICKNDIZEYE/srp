import { prisma } from "../postgres/postgres.js";
import bcrypt from 'bcrypt';

// Create a new transport
export const createTransport = async ({ firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, status, delivered }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.transport.create({
    data: {
      firstName,
      lastName,
      birthday,
      nationalId,
      phoneNumber,
      longitude,
      latitude,
      username,
      password: hashedPassword,
      status,
      delivered,
    },
  });
};

// Get all transports
export const getTransports = async () => {
  return await prisma.transport.findMany();
};

// Get a transport by ID
export const getTransportById = async (id) => {
  return await prisma.transport.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a transport by ID
export const updateTransport = async (id, { firstName, lastName, birthday, nationalId, phoneNumber, longitude, latitude, username, password, status, delivered }) => {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  return await prisma.transport.update({
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
      password: hashedPassword || undefined,
      status,
      delivered,
    },
  });
};

// Delete a transport by ID
export const deleteTransport = async (id) => {
  return await prisma.transport.delete({
    where: { id: parseInt(id) },
  });
};

// Function to get a transport by phone number
export const getTransportByPhoneNumber = async (phoneNumber) => {
  try {
    // Assuming you are using a database like MongoDB with Mongoose
    const transport = await prisma.transport.findUnique({
      where: { phoneNumber: phoneNumber },
    });
    return transport;
  } catch (error) {
    throw new Error("Error fetching transport by phone number: " + error.message);
  }
};

// Update transport status by ID
export const updateTransportStatus = async (id, status) => {
  return await prisma.transport.update({
    where: { id: parseInt(id) },
    data: { status },
  });
};