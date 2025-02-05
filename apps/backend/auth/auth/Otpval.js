import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { prisma } from '../postgres/postgres.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const transporter = nodemailer.createTransport({
  service: 'smtp',
  host: process.env.TRANSPORTER_SERVICE,
  port: process.env.SERVICE_PORT,
  auth: {
    user: process.env.SERVICE_USERNAME,
    pass: process.env.SERVICE_PASSWORD,
  },
});


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log('Verifying OTP for:', { email, otp });

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find NGO with matching email and OTP
    const ngo = await prisma.NGO.findFirst({
      where: {
        contactPersonsEmail: email.toLowerCase(),
        otp: parseInt(otp),
        otpExpiry: {
          gt: new Date()
        }
      }
    });

    console.log('NGO found:', ngo ? { id: ngo.id, email: ngo.contactPersonsEmail } : 'No NGO found');

    if (!ngo) {
      return res.status(400).json({ message: 'OTP not found or expired.' });
    }

    // Clear the OTP after successful verification
    await prisma.NGO.update({
      where: { id: ngo.id },
      data: {
        otp: null,
        otpExpiry: null
      }
    });

    // Generate JWT token
    const tokenPayload = {
      id: parseInt(ngo.id),
      email: ngo.contactPersonsEmail,
      status: ngo.status,
      type: 'ngo'
    };

    console.log('Token payload:', tokenPayload);

    const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );

    // Send response with token and NGO data
    const response = {
      message: 'OTP verified successfully',
      token,
      ngo: {
        id: parseInt(ngo.id),
        nameOfTheNGO: ngo.nameOfTheNGO,
        email: ngo.contactPersonsEmail,
        status: ngo.status
      }
    };

    console.log('Sending response:', response);
    res.json(response);

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};

export const verifyOtpAdmin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log('Verifying Admin OTP for:', { email, otp });

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find Admin with matching email and OTP
    const admin = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        otp: parseInt(otp),
        otpExpiry: {
          gt: new Date()
        }
      }
    });

    console.log('Admin found:', admin ? { id: admin.id, email: admin.email } : 'No Admin found');

    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear the OTP after successful verification
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        otp: null,
        otpExpiry: null
      }
    });

    // Generate JWT token
    const tokenPayload = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      type: 'admin'
    };

    const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );

    res.json({
      message: 'OTP verified successfully',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        name: admin.name
      }
    });

  } catch (error) {
    console.error('Admin OTP verification error:', error);
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};



// {
//   "email": "user@example.com",
//   "otp": "123456"
// }