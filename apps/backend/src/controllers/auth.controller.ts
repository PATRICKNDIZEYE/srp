import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const managementLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { 
        email,
        role: 'super_admin' // Only allow super_admin login
      }
    });

    if (!user) {
      return res.status(401).json({ 
        message: 'Imeyili cyangwa ijambo ryibanga sibyo' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Imeyili cyangwa ijambo ryibanga sibyo' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Management login error:', error);
    res.status(500).json({ 
      message: 'Habaye ikibazo. Ongera ugerageze.' 
    });
  }
}; 