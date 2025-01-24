import { prisma } from '../postgres/postgres.js';

export const chatController = {
  // Get messages for NGO
  async getNGOMessages(req, res) {
    try {
      const ngoId = req.user?.id;

      if (!ngoId) {
        return res.status(401).json({ error: 'NGO authentication required' });
      }

      const messages = await prisma.message.findMany({
        where: {
          ngoId: ngoId // Messages for this NGO
        },
        include: {
          ngo: {
            select: {
              id: true,
              nameOfTheNGO: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      res.json(messages);
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async sendMessage(req, res) {
    try {
      const { content } = req.body;
      const ngoId = req.user?.id;

      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      if (!ngoId) {
        return res.status(401).json({ error: 'NGO authentication required' });
      }




      // Verify NGO exists
      const ngo = await prisma.nGO.findUnique({
        where: { id: ngoId }
      });

      if (!ngo) {
        return res.status(404).json({ error: 'NGO not found' });
      }

      // Create message from NGO
      const message = await prisma.message.create({
        data: {
          content,
          ngoId: ngoId,
          senderType: 'NGO',
          isRead: false
        },
        include: {
          ngo: {
            select: {
              id: true,
              nameOfTheNGO: true
            }
          }
        }
      });

      res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Mark messages as read
  async markAsRead(req, res) {
    try {
      const { messageIds } = req.body;
      const ngoId = req.user?.id;

      if (!messageIds?.length) {
        return res.status(400).json({ error: 'Message IDs are required' });
      }

      if (!ngoId) {
        return res.status(401).json({ error: 'NGO authentication required' });
      }

      // Convert string IDs to numbers and validate
      const parsedIds = messageIds.map(id => {
        const numId = parseInt(id);
        if (isNaN(numId)) {
          throw new Error('Invalid message ID format');
        }
        return numId;
      });

      // Update messages
      const result = await prisma.message.updateMany({
        where: {
          id: { in: parsedIds },
          ngoId: ngoId // Only update messages for this NGO
        },
        data: {
          isRead: true
        }
      });

      // Fetch updated messages to confirm changes
      const updatedMessages = await prisma.message.findMany({
        where: {
          id: { in: parsedIds },
          ngoId: ngoId
        },
        include: {
          ngo: {
            select: {
              id: true,
              nameOfTheNGO: true
            }
          }
        }
      });

      res.json({ 
        success: true, 
        updatedCount: result.count,
        messages: updatedMessages
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get all messages (Admin)
  async getAllMessages(req, res) {
    try {
      const adminId = req.user?.id;

      if (!adminId) {
        return res.status(401).json({ error: 'Admin authentication required' });
      }

      const messages = await prisma.message.findMany({
        include: {
          ngo: {
            select: {
              id: true,
              nameOfTheNGO: true,
              contactPersonsEmail: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get unread count
  async getUnreadCount(req, res) {
    try {
      const ngoId = req.user?.id;

      if (!ngoId) {
        return res.status(401).json({ error: 'NGO authentication required' });
      }

      const count = await prisma.message.count({
        where: {
          ngoId: ngoId,
          isRead: false
        }
      });

      res.json({ 
        unreadCount: count,
        ngoId: ngoId 
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({ error: error.message });
    }
  }
};