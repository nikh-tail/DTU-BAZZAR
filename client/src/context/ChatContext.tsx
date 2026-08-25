import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Conversation, Message } from '../types/index.js';
import { ChatService } from '../services/chat.service.js';
import { useAuth } from './AuthContext.js';
import { useSocket } from './SocketContext.js';

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isChatDrawerOpen: boolean;
  totalUnreadCount: number;
  openChatDrawer: () => void;
  closeChatDrawer: () => void;
  startChatWithListing: (listingId: string) => Promise<void>;
  selectConversation: (conversationId: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState<boolean>(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);

  const totalUnreadCount = conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);

  const refreshConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoadingConversations(true);
      const res = await ChatService.getConversations();
      if (res.success) {
        setConversations(res.data);
      }
    } catch {
      // Ignore
    } finally {
      setIsLoadingConversations(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshConversations();
    } else {
      setConversations([]);
      setActiveConversation(null);
      setMessages([]);
    }
  }, [isAuthenticated, refreshConversations]);

  const selectConversation = async (conversationId: string) => {
    try {
      setIsLoadingMessages(true);
      setIsChatDrawerOpen(true);

      const res = await ChatService.getMessages(conversationId);
      if (res.success) {
        setActiveConversation(res.data.conversation);
        setMessages(res.data.messages);

        // Update unread count locally
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
        );

        if (socket) {
          socket.emit('join_conversation', conversationId);
        }
      }
    } catch {
      // Ignore
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const startChatWithListing = async (listingId: string) => {
    try {
      const res = await ChatService.getOrCreateConversation(listingId);
      if (res.success && res.data) {
        await selectConversation(res.data.id);
        await refreshConversations();
      }
    } catch (err: any) {
      console.error('Failed to start chat:', err);
      throw err;
    }
  };

  const sendMessage = async (text: string) => {
    if (!activeConversation || !text.trim()) return;
    try {
      const res = await ChatService.sendMessage(activeConversation.id, text.trim());
      if (res.success) {
        // Appended locally or via socket
        setMessages((prev) => {
          if (prev.some((m) => m.id === res.data.id)) return prev;
          return [...prev, res.data];
        });

        // Update last message in conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversation.id
              ? { ...c, lastMessageText: text.trim(), lastMessageAt: new Date().toISOString() }
              : c
          )
        );
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  };

  // Listen for real-time socket events
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (payload: { conversationId: string; message: Message }) => {
      if (activeConversation && activeConversation.id === payload.conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === payload.message.id)) return prev;
          return [...prev, payload.message];
        });
      }
      refreshConversations();
    };

    const handleNotification = () => {
      refreshConversations();
    };

    socket.on('new_message', handleNewMessage);
    socket.on('new_message_notification', handleNotification);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('new_message_notification', handleNotification);
    };
  }, [socket, activeConversation, refreshConversations]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        isLoadingConversations,
        isLoadingMessages,
        isChatDrawerOpen,
        totalUnreadCount,
        openChatDrawer: () => setIsChatDrawerOpen(true),
        closeChatDrawer: () => setIsChatDrawerOpen(false),
        startChatWithListing,
        selectConversation,
        sendMessage,
        refreshConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
