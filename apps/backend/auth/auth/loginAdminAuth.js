import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { prisma } from '../postgres/postgres.js'; 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const OTP_EXPIRY_TIME = process.env.OTP_EXPIRY_TIME || '5m';  // OTP expiry time

const transporter = nodemailer.createTransport({
  service: 'smtp',
  host: process.env.TRANSPORTER_SERVICE,
  port: process.env.SERVICE_PORT,
  auth: {
    user: process.env.SERVICE_USERNAME,
    pass: process.env.SERVICE_PASSWORD,
  },
});

const generateOtp = () => Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

const sendOtpEmail = (email, otp) => {
  const mailOptions = {
    from: process.env.SERVICE_USERNAME,
    to: email,
    subject: 'Your OTP for Login',
    text: `Your OTP for login is: ${otp}. It will expire in ${OTP_EXPIRY_TIME}.`,
  };

  return transporter.sendMail(mailOptions);
};

export const loginAdminAuth = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({
      message: 'Login successful',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
