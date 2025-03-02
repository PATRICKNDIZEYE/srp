import { prisma } from "../postgres/postgres.js";
import bcrypt from 'bcrypt';

// Create a new diary entry
export const createDiary = async ({ status, approveStatus, phoneNumber, password, longitude, latitude, firstName, lastName, nationalId }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.diary.create({
    data: {
      status,
      approveStatus,
      phoneNumber,
      password: hashedPassword,
      longitude,
      latitude,
      firstName,
      lastName,
      nationalId
    },
  });
};
 
// Get all diary entries
export const getDiaries = async () => {
  return await prisma.diary.findMany();
};

// Get a diary entry by ID
export const getDiaryById = async (id) => {
  return await prisma.diary.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a diary entry by ID
export const updateDiary = async (id, { status, approveStatus, phoneNumber, password, longitude, latitude, firstName, lastName, nationalId }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.diary.update({
    where: { id: parseInt(id) },
    data: {
      status,
      approveStatus,
      phoneNumber,
      password: hashedPassword,
      longitude,
      latitude,
      firstName,
      lastName,
      nationalId
    },
  });
};

// Delete a diary entry by ID
export const deleteDiary = async (id) => {
  return await prisma.diary.delete({
    where: { id: parseInt(id) },
  });
};
// Get a diary entry by phone number
export const getDiaryByPhoneNumber = async (phoneNumber) => {
  try {
    return await prisma.diary.findUnique({
      where: { phoneNumber: phoneNumber },
    });
  } catch (error) {
    throw new Error('Error fetching diary by phone number: ' + error.message);
  }
};

// Update Diary Status by ID
export const updateDiaryStatus = async (id, status) => {
  return await prisma.diary.update({
    where: { id: parseInt(id) },
    data: { status },
  });
};