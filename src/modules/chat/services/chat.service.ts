import { http } from "@/lib/http";
import { Message, Conversation } from "../types";

export interface SendMessageRequest {
  receiverId: any;
  content: string;
  type?: 'TEXT' | 'IMAGE';
  metadata?: any;
}

export const chatService = {
  // 1. Gửi tin nhắn
  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    const response = await http.post<any>("/chat/send", data);
    return response.data.data;
  },

  // 2. Lấy danh sách Inbox
  getConversations: async (): Promise<Conversation[]> => {
    const response = await http.get<any>("/chat/conversations");
    return response.data.data || [];
  },

  // 3. Lấy tin nhắn chi tiết
  // [FIX] Xử lý trường hợp trả về Page (có .content) hoặc List
  getMessages: async (partnerId: any) => {
    const response = await http.get<any>(`/chat/messages/${partnerId}`);
    const data = response.data.data;

    if (Array.isArray(data)) {
        return data;
    } else if (data && Array.isArray(data.content)) {
        return data.content; // Trích xuất mảng từ Page object
    }
    return [];
  },

  // 4. Đánh dấu đã đọc
  markAsRead: async (conversationId: any) => {
    await http.post(`/chat/conversations/${conversationId}/read`);
  },

  // 5. Init Conversation
  getOrCreateConversation: async (receiverId: any): Promise<Conversation> => {
    const response = await http.post<any>(`/chat/conversations/init/${receiverId}`);
    return response.data.data;
  },
  
  initConversation: async (receiverId: any): Promise<Conversation> => {
    const response = await http.post<any>(`/chat/conversations/init/${receiverId}`);
    return response.data.data;
  }
};