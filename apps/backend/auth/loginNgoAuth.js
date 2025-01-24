import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { prisma } from "../postgres/postgres.js";

const OTP_EXPIRY_TIME = process.env.OTP_EXPIRY_TIME || '5m';

const transporter = nodemailer.createTransport({

  host: process.env.TRANSPORTER_SERVICE,
  port: process.env.SERVICE_PORT,

  auth: {
    user: process.env.SERVICE_USERNAME,
    pass: process.env.SERVICE_PASSWORD,
  },
  debug: true,
  logger: true,
});

// Generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// Function to send OTP to the user's email
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.SERVICE_USERNAME,
    to: email,
    subject: 'Your OTP for Login',
    text: `Your OTP for login is: ${otp}. It will expire in ${OTP_EXPIRY_TIME}.`,
  };

  return transporter.sendMail(mailOptions);
};

// Login and OTP generation
export const loginNgoAuth = async ({ contactPersonsEmail, password }) => {
  try {
    console.log('Login attempt for:', contactPersonsEmail);

    // Direct database query to see what's in there
    const allNgos = await prisma.NGO.findMany({
      select: {
        id: true,
        contactPersonsEmail: true,
        status: true
      }
    });
    // console.log('i:', allNgos.map(ngo => ngo.contactPersonsEmail));

    if (!contactPersonsEmail || !password) {
      throw new Error("Email and password are required.");
    }

    // Find the NGO by email with exact match and case-insensitive search
    const ngo = await prisma.NGO.findFirst({
      where: {
        contactPersonsEmail: {
          mode: 'insensitive',
          equals: contactPersonsEmail.trim().toLowerCase()
        }
      }
    });

    if (!ngo) {
      // List available emails in error message during development
      // const availableEmails = allNgos.map(ngo => ngo.contactPersonsEmail).join(', ');
      throw new Error(`NGO not found with email: ${contactPersonsEmail}`);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, ngo.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password.");
    }

    // Check if NGO is approved
    if (ngo.status !== 'APPROVED') {
      throw new Error(`Your NGO registration is pending approval. Current status: ${ngo.status}`);
    }

    // Generate OTP
    const generatedOtp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    console.log('Saving OTP:', {
      ngoId: ngo.id,
      otp: generatedOtp,
      expiry: otpExpiry
    });

    // Update NGO with OTP
    await prisma.NGO.update({
      where: { id: ngo.id },
      data: {
        otp: generatedOtp,
        otpExpiry
      }
    });

    // Verify the OTP was saved
    const updatedNgo = await prisma.NGO.findUnique({
      where: { id: ngo.id },
      select: {
        id: true,
        otp: true,
        otpExpiry: true
      }
    });

    console.log('OTP saved:', {
      saved: !!updatedNgo?.otp,
      expiry: updatedNgo?.otpExpiry
    });

    // Send OTP to email
    await sendOtpEmail(contactPersonsEmail, generatedOtp);

    return {
      message: "OTP sent to email. Please verify to complete login.",
      otpExpiry,
    };
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
};
