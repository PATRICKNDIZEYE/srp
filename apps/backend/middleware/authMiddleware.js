import jwt from 'jsonwebtoken';
import { prisma } from '../postgres/postgres.js';

export const authenticateNgo = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const ngo = await prisma.nGO.findUnique({
            where: { id: decoded.id }
        });

        if (!ngo) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = ngo; // Set the NGO as the user
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

export const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');

        const admin = await prisma.user.findUnique({
            where: { 
                id: decoded.id,
                role: 'ADMIN'
            }
        });

        if (!admin) {
            return res.status(401).json({ message: 'Admin not found or unauthorized' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(500).json({ message: 'Server error' });
    }
}; 