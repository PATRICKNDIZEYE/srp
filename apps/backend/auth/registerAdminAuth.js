import bcrypt from 'bcryptjs';
import { prisma } from '../postgres/postgres.js';

// Register a new Admin
export const registerAdminAuth = async ({ username, email, password, name }) => {
  
  // Validate email
  if (!email) {
    throw new Error('Email is required.');
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    throw new Error('Admin with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);  

  const newAdmin = await prisma.user.create({
    data: {
      username,  
      email,   
      password: hashedPassword, 
      role: 'ADMIN', 
      name,          
    },
  });

  return newAdmin;
};
