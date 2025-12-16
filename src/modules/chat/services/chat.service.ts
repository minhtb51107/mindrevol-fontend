// src/modules/chat/services/chat.service.ts
import { http } from "@/lib/http";

// Định nghĩa Request Body
export interface SendMessageRequest {
  receiverId: number;
  content: string;
  type?: 'TEXT' | 'IMAGE';
  metadata?: {
    replyToPostId?: string; // ID bài check-in
    replyToImage?: string;  // Ảnh thumbnail bài check-in
    [key: string]: any;
  }; 
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
  type: 'TEXT' | 'IMAGE';
  metadata?: any;
}

export const chatService = {
  // Gửi tin nhắn 1v1
  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    // Backend API: POST /api/v1/chat/send
    const response = await http.post<{ data: Message }>("/chat/send", data);
    return response.data.data;
  },

  // Lấy danh sách hội thoại (Cho màn hình Chat chính)
  getConversations: async () => {
    const response = await http.get("/chat/conversations");
    return response.data.data;
  },

  // Lấy tin nhắn chi tiết với 1 người
  getMessages: async (partnerId: number) => {
    const response = await http.get(`/chat/messages/${partnerId}`);
    return response.data.data;
  }
};