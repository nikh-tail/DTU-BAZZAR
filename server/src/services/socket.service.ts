import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export class SocketService {
  private static io: SocketIOServer | null = null;
  private static userSockets = new Map<string, string[]>(); // userId -> socketId[]

  public static init(io: SocketIOServer) {
    this.io = io;

    // Authentication middleware for Socket.io
    io.use((socket: Socket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        // Allow unauthenticated connection for public broadcasts, but without userId
        return next();
      }

      try {
        const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
        (socket as any).userId = decoded.userId;
        next();
      } catch (err) {
        // Allow connection to continue unauthenticated
        next();
      }
    });

    io.on('connection', (socket: Socket) => {
      const userId = (socket as any).userId;

      if (userId) {
        // Track user socket
        const currentSockets = this.userSockets.get(userId) || [];
        this.userSockets.set(userId, [...currentSockets, socket.id]);

        // Join personal user notification room
        socket.join(`user:${userId}`);
        // console.log(`🔌 User connected: ${userId} (Socket: ${socket.id})`);
      }

      // Join a conversation chat room
      socket.on('join_conversation', (conversationId: string) => {
        if (conversationId) {
          socket.join(`conv:${conversationId}`);
        }
      });

      // Leave a conversation room
      socket.on('leave_conversation', (conversationId: string) => {
        if (conversationId) {
          socket.leave(`conv:${conversationId}`);
        }
      });

      // Typing indicators
      socket.on('typing_start', ({ conversationId }: { conversationId: string }) => {
        if (conversationId && userId) {
          socket.to(`conv:${conversationId}`).emit('user_typing', { conversationId, userId });
        }
      });

      socket.on('typing_stop', ({ conversationId }: { conversationId: string }) => {
        if (conversationId && userId) {
          socket.to(`conv:${conversationId}`).emit('user_stopped_typing', { conversationId, userId });
        }
      });

      // Disconnect cleanup
      socket.on('disconnect', () => {
        if (userId) {
          const updated = (this.userSockets.get(userId) || []).filter((id) => id !== socket.id);
          if (updated.length > 0) {
            this.userSockets.set(userId, updated);
          } else {
            this.userSockets.delete(userId);
          }
        }
      });
    });
  }

  /**
   * Emit new message to active room & receiver's inbox
   */
  public static emitNewMessage(conversationId: string, receiverId: string, message: any) {
    if (!this.io) return;

    // Send to anyone currently viewing the conversation
    this.io.to(`conv:${conversationId}`).emit('new_message', { conversationId, message });

    // Send notification update to the receiver's personal user room
    this.io.to(`user:${receiverId}`).emit('new_message_notification', {
      conversationId,
      message,
    });
  }
}
