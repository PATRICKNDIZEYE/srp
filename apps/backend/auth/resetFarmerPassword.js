import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

// Create Nodemailer transporter using custom SMTP service
const transporter = nodemailer.createTransport({
    host: process.env.TRANSPORTER_SERVICE,
    port: process.env.SERVICE_PORT,  
    secure: true,                         
    auth: {
        user: process.env.SERVICE_USERNAME,
        pass: process.env.SERVICE_PASSWORD 
    }
});

// Add a base route handler
router.post('/', async (req, res) => {
    const { email } = req.body;

    try {
        // Find Farmer by email
        const farmer = await prisma.farmer.findUnique({
            where: { email }
        });

        if (!farmer) {
            return res.status(404).json({ message: 'No Farmer found with this email' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000);
      
        await prisma.farmer.update({
            where: { id: farmer.id },
            data: { resetToken, resetTokenExpires }
        });

        // Create a reset password link
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Create the email message
        const mailOptions = {
            from: process.env.SERVICE_USERNAME, 
            to: email, 
            subject: 'Password Reset Request',
            text: `You requested a password reset. Please click the following link to reset your password: ${resetUrl}`,
            html: `<p>You requested a password reset. Please click the following link to reset your password: <a href="${resetUrl}">Reset Password</a></p>`
        };

        // Send email with the reset link
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending password reset email' });
            }
            console.log('Email sent: ' + info.response);
            res.status(200).json({
                message: 'Password reset email sent successfully'
            });
        });
    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({ message: 'Error processing password reset request' });
    }
});

export default router; 