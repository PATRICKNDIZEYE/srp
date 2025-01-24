import express from 'express';
import { chatController } from '../controllers/chatController.js';
import { authenticateNgo } from '../middleware/authMiddleware.js';

const router = express.Router();

// NGO chat routes
router.get('/ngo/messages', authenticateNgo, chatController.getNGOMessages);
router.post('/ngo/send', authenticateNgo, chatController.sendMessage);
router.post('/ngo/messages/read', authenticateNgo, chatController.markAsRead);
router.get('/ngo/messages/unread', authenticateNgo, chatController.getUnreadCount);

// Admin routes
router.get('/admin/messages', authenticateNgo, chatController.getAllMessages);

export default router;
