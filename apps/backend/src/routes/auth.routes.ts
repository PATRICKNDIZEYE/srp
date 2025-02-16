import express from 'express';
import { managementLogin } from '../controllers/auth.controller';

const router = express.Router();

// Management login route
router.post('/login-management', managementLogin);

export default router; 