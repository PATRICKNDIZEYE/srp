import { prisma } from "../postgres/postgres.js";
import bcrypt from 'bcrypt';

// Create a new user
export const createUser = async ({ username, email, password, role, name, phone, resetToken, resetTokenExpires, otp, otpExpiry }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role,
      name,
      phone,
      resetToken,
      resetTokenExpires,
      otp,
      otpExpiry,
    },
  });
};

// Get all users
export const getUsers = async () => {
  return await prisma.user.findMany();
};

// Get a user by ID
export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a user by ID
export const updateUser = async (id, { username, email, password, role, name, phone, resetToken, resetTokenExpires, otp, otpExpiry }) => {
  const dataToUpdate = {
    username, 
    email,
    role,
    name,
    phone,
    resetToken,
    resetTokenExpires,
    otp,
    otpExpiry,
  };

  if (password) {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  return await prisma.user.update({
    where: { id: parseInt(id) },
    data: dataToUpdate,
  });
};

// Delete a user by ID
export const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id: parseInt(id) },
  });
};




// {
//   "username": "lionson",
//   "email": "lionson@gmail.com",
//   "password": "securePassword123",
//   "role": "ADMIN",
//   "name": "Lionson Gjr"
// }