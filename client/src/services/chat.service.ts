import { api } from './api.js';
import { Conversation, Message } from '../types/index.js';

export class ChatService {
  static async getConversations(): Promise<{ success: boolean; data: Conversation[] }> {
    const res = await api.get<{ success: boolean; data: Conversation[] }>('/chat/conversations');
    return res.data;
  }

  static async getOrCreateConversation(listingId: string): Promise<{ success: boolean; data: Conversation }> {
    const res = await api.post<{ success: boolean; data: Conversation }>('/chat/conversations', { listingId });
    return res.data;
  }

  static async getMessages(conversationId: string): Promise<{
    success: boolean;
    data: {
      conversation: Conversation;
      messages: Message[];
    };
  }> {
    const res = await api.get<{
      success: boolean;
      data: {
        conversation: Conversation;
        messages: Message[];
      };
    }>(`/chat/conversations/${conversationId}/messages`);
    return res.data;
  }

  static async sendMessage(conversationId: string, text: string): Promise<{ success: boolean; data: Message }> {
    const res = await api.post<{ success: boolean; data: Message }>(`/chat/conversations/${conversationId}/messages`, {
      text,
    });
    return res.data;
  }
}
