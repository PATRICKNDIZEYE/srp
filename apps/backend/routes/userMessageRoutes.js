import express from 'express';
import { userMessageController } from '../controllers/userMessageController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();


// User/Admin chat routes
router.get('/ngos', authenticateAdmin, userMessageController.getAllNGOs);
router.get('/ngo/:ngoId/messages', authenticateAdmin, userMessageController.getNGOMessages);
router.post('/ngo/:ngoId/send', authenticateAdmin, userMessageController.sendMessage);
router.post('/ngo/:ngoId/messages/read', authenticateAdmin, userMessageController.markAsRead);
router.get('/ngo/:ngoId/messages/unread', authenticateAdmin, userMessageController.getUnreadCount);
router.get('/ngo/allUnreadMessages', authenticateAdmin, userMessageController.getAllUnreadCount);


export default router; 