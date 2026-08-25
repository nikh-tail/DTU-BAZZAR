import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';
import { SocketService } from '../services/socket.service.js';

const sendMessageSchema = z.object({
  text: z.string().min(1, 'Message text cannot be empty').max(1000),
});

export class ChatController {
  /**
   * Get all conversations for the authenticated user
   */
  static async getConversations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const userId = req.user.id;

      const conversations = await prisma.conversation.findMany({
        where: {
          OR: [{ buyerId: userId }, { sellerId: userId }],
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              price: true,
              status: true,
              campusLocation: true,
              images: { take: 1, orderBy: { order: 'asc' } },
            },
          },
          buyer: {
            select: {
              id: true,
              name: true,
              branch: true,
              year: true,
              hostel: true,
              avatar: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              branch: true,
              year: true,
              hostel: true,
              avatar: true,
            },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              messages: {
                where: {
                  senderId: { not: userId },
                  isRead: false,
                },
              },
            },
          },
        },
        orderBy: { lastMessageAt: 'desc' },
      });

      // Format response with partner info
      const formatted = conversations.map((conv) => {
        const isBuyer = conv.buyerId === userId;
        const partner = isBuyer ? conv.seller : conv.buyer;
        return {
          id: conv.id,
          listingId: conv.listingId,
          listing: conv.listing,
          partner,
          isBuyer,
          lastMessageText: conv.lastMessageText,
          lastMessageAt: conv.lastMessageAt,
          unreadCount: conv._count.messages,
        };
      });

      res.status(200).json({
        success: true,
        data: formatted,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch conversations' });
    }
  }

  /**
   * Get or initiate a conversation between buyer and seller for a listing
   */
  static async getOrCreateConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { listingId } = req.body;
      if (!listingId) {
        res.status(400).json({ success: false, message: 'Listing ID is required' });
        return;
      }

      const listing = await prisma.listing.findUnique({
        where: { id: listingId as string },
        include: {
          images: { take: 1, orderBy: { order: 'asc' } },
          seller: {
            select: { id: true, name: true, branch: true, year: true, hostel: true },
          },
        },
      });

      if (!listing) {
        res.status(404).json({ success: false, message: 'Listing not found' });
        return;
      }

      if (listing.sellerId === req.user.id) {
        res.status(400).json({ success: false, message: 'You cannot initiate a chat on your own listing' });
        return;
      }

      // Check if conversation already exists between this buyer and listing
      let conversation = await prisma.conversation.findUnique({
        where: {
          listingId_buyerId: {
            listingId: listing.id,
            buyerId: req.user.id,
          },
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              price: true,
              status: true,
              campusLocation: true,
              images: { take: 1, orderBy: { order: 'asc' } },
            },
          },
          seller: {
            select: { id: true, name: true, branch: true, year: true, hostel: true, avatar: true },
          },
          buyer: {
            select: { id: true, name: true, branch: true, year: true, hostel: true, avatar: true },
          },
        },
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            listingId: listing.id,
            buyerId: req.user.id,
            sellerId: listing.sellerId,
            lastMessageText: 'Started conversation',
          },
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                price: true,
                status: true,
                campusLocation: true,
                images: { take: 1, orderBy: { order: 'asc' } },
              },
            },
            seller: {
              select: { id: true, name: true, branch: true, year: true, hostel: true, avatar: true },
            },
            buyer: {
              select: { id: true, name: true, branch: true, year: true, hostel: true, avatar: true },
            },
          },
        });
      }

      res.status(200).json({
        success: true,
        data: conversation,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to initiate conversation' });
    }
  }

  /**
   * Get message history for a conversation
   */
  static async getMessages(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const conversationId = req.params.conversationId as string;

      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              price: true,
              status: true,
              campusLocation: true,
              images: { take: 1, orderBy: { order: 'asc' } },
            },
          },
          buyer: {
            select: { id: true, name: true, branch: true, year: true, hostel: true, avatar: true },
          },
          seller: {
            select: { id: true, name: true, branch: true, year: true, hostel: true, avatar: true },
          },
        },
      });

      if (!conversation) {
        res.status(404).json({ success: false, message: 'Conversation not found' });
        return;
      }

      // Check participant authorization
      if (conversation.buyerId !== req.user.id && conversation.sellerId !== req.user.id) {
        res.status(403).json({ success: false, message: 'Unauthorized to view this conversation' });
        return;
      }

      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
      });

      // Mark messages as read for current user
      await prisma.message.updateMany({
        where: {
          conversationId,
          senderId: { not: req.user.id },
          isRead: false,
        },
        data: { isRead: true },
      });

      const partner = conversation.buyerId === req.user.id ? conversation.seller : conversation.buyer;

      res.status(200).json({
        success: true,
        data: {
          conversation: {
            id: conversation.id,
            listingId: conversation.listingId,
            listing: conversation.listing,
            partner,
          },
          messages,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch messages' });
    }
  }

  /**
   * Send a message in a conversation
   */
  static async sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const conversationId = req.params.conversationId as string;
      const validation = sendMessageSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: validation.error.errors[0]?.message || 'Invalid message',
        });
        return;
      }

      const { text } = validation.data;

      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        res.status(404).json({ success: false, message: 'Conversation not found' });
        return;
      }

      if (conversation.buyerId !== req.user.id && conversation.sellerId !== req.user.id) {
        res.status(403).json({ success: false, message: 'Unauthorized' });
        return;
      }

      // Create message and update conversation
      const [message] = await prisma.$transaction([
        prisma.message.create({
          data: {
            conversationId,
            senderId: req.user.id,
            text,
          },
        }),
        prisma.conversation.update({
          where: { id: conversationId },
          data: {
            lastMessageText: text,
            lastMessageAt: new Date(),
          },
        }),
      ]);

      const receiverId = conversation.buyerId === req.user.id ? conversation.sellerId : conversation.buyerId;

      // Broadcast via socket to conversation room & receiver's personal channel
      SocketService.emitNewMessage(conversationId, receiverId, message);

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to send message' });
    }
  }
}
