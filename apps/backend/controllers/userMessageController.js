import { prisma } from '../postgres/postgres.js';
import nodemailer from "nodemailer";


// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.TRANSPORTER_SERVICE,
  port: process.env.SERVICE_PORT,
  auth: {
    user: process.env.SERVICE_USERNAME,
    pass: process.env.SERVICE_PASSWORD
  }
});

async function sendMessageNotificationEmail(ngo, content) {
  try {
    // Prepare email options
    const mailOptions = {
      from: `"${process.env.SERVICE_USERNAME}`,
      to: ngo.contactPersonsEmail, // Assuming NGO model has a contact email
      subject: 'New Message Received',

      html: `
        <p>Dear,  ${ngo.nameOfTheNGO},</p>
        <p>You have a new message in your account system.</p>
<!--        <p> ${content}</p>-->
        <p><strong>Important:</strong> To view the full details of this message, please log in to your account and check your messages. Do not reply directly to this email.</p>
        <p>Best regards,<br>Support Team</p>
        <hr>
        <small>Note: This is an automated notification. Please do not respond to this email.</small>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw error;
  }
}


export const userMessageController = {

  // Get all NGOs with their latest message
  async getAllNGOs(req, res) {
    try {
      const adminId = req.admin?.id;

      if (!adminId) {
        return res.status(401).json({ error: 'Admin authentication required' });
      }

      const ngos = await prisma.nGO.findMany({
        select: {
          id: true,
          nameOfTheNGO: true,
          contactPersonsEmail: true,
          messages: {
            orderBy: {
              createdAt: 'asc'
            },
            take: 1,
            select: {
              id: true,
              content: true,
              createdAt: true,
              isRead: true,
              senderType: true
            }
          }
        },
        orderBy: {
          nameOfTheNGO: 'asc'
        }
      });

      // Format the response to handle empty messages array
      const formattedNGOs = ngos.map(ngo => ({
        ...ngo,
        latestMessage: ngo.messages[0] || null
      }));

      res.json(formattedNGOs);
    } catch (error) {
      console.error('Error getting NGOs:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get messages with a specific NGO
  async getNGOMessages(req, res) {
    try {
      const adminId = req.admin?.id;
      const { ngoId } = req.params;

      if (!adminId) {
        return res.status(401).json({ error: 'Admin authentication required' });
      }

      if (!ngoId) {
        return res.status(400).json({ error: 'NGO ID is required' });
      }

      const messages = await prisma.message.findMany({
        where: {
          ngoId: parseInt(ngoId)
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

  // Send message to NGO
  async sendMessage(req, res) {
    try {
      const { content, ngoId } = req.body;
      const adminId = req.admin?.id;

      if (!adminId) {
        return res.status(401).json({ error: 'Admin authentication required' });
      }

      if (!content || !ngoId) {
        return res.status(400).json({ error: 'Content and NGO ID are required' });
      }

      // Verify NGO exists
      const ngo = await prisma.nGO.findUnique({
        where: { id: parseInt(ngoId) }
      });

      if (!ngo) {
        return res.status(404).json({ error: 'NGO not found' });
      }

      // Create message
      const message = await prisma.message.create({
        data: {
          content,
          ngoId: parseInt(ngoId),
          senderType: 'ADMIN',
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

      await sendMessageNotificationEmail(ngo, message);


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
      const adminId = req.admin?.id;

      if (!adminId) {
        return res.status(401).json({ error: 'Admin authentication required' });
      }

      if (!messageIds?.length) {
        return res.status(400).json({ error: 'Message IDs are required' });
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
          senderType: 'NGO' // Only mark messages from NGO as read
        },
        data: {
          isRead: true
        }
      });

      res.json({
        success: true,
        updatedCount: result.count
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get unread count for specific NGO
  async getUnreadCount(req, res) {
    try {
      const adminId = req.admin?.id;
      const {ngoId} = req.params;

      if (!adminId) {
        return res.status(401).json({error: 'Admin authentication required'});
      }

      if (!ngoId) {
        return res.status(400).json({error: 'NGO ID is required'});
      }

      const count = await prisma.message.count({
        where: {
          ngoId: parseInt(ngoId),
          senderType: 'NGO',
          isRead: false
        }
      });

      res.json({
        unreadCount: count,
        ngoId: parseInt(ngoId)
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({error: error.message});
    }


  },


  async getAllUnreadCount(req,res) {
    try {
      const adminId = req.admin?.id;

      if (!adminId) {
        return res.status(401).json({error: 'Admin authentication required'});
      }

      const counts = await prisma.message.count({
        where:{
          isRead: false,
          senderType: 'NGO'
        }
      })

      res.json({
        unreadCount: counts
      });

    }
    catch (error){
      console.error('Error getting unread count:', error);
      res.status(500).json({ error: error.message });
    }
  }
};