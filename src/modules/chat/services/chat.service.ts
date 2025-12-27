// src/modules/chat/services/chat.service.ts
import { http } from "@/lib/http";

// Định nghĩa Interface (nếu chưa có file types riêng)
export interface SendMessageRequest {
  receiverId: number;
  content: string;
  type?: 'TEXT' | 'IMAGE';
  metadata?: {
    replyToPostId?: string;
    replyToImage?: string;
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
  deliveryStatus?: 'SENT' | 'DELIVERED' | 'READ';
  metadata?: any;
  clientSideId?: string;
  isRead?: boolean;
}

export const chatService = {
  // 1. Gửi tin nhắn 1v1
  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    const response = await http.post<{ data: Message }>("/chat/send", data);
    return response.data.data;
  },

  // 2. Lấy danh sách Inbox (Cho màn hình Chat chính)
  getConversations: async () => {
    const response = await http.get("/chat/conversations");
    return response.data.data;
  },

  // 3. Lấy lịch sử tin nhắn với 1 người
  getMessages: async (partnerId: number) => {
    const response = await http.get(`/chat/messages/${partnerId}`);
    return response.data.data;
  },

  // 4. Đánh dấu đã đọc
  markAsRead: async (conversationId: number) => {
    await http.post(`/chat/conversations/${conversationId}/read`);
  },

  // 5. [THÊM MỚI VÀO ĐÂY] Khởi tạo/Lấy hội thoại với friendId
  initConversation: async (receiverId: number) => {
    // API này sẽ trả về thông tin Conversation (id, partner, lastMessage...)
    // Nếu chưa có thì Backend tự tạo mới rồi trả về.
    const response = await http.post(`/chat/conversations/init/${receiverId}`);
    return response.data.data;
  }
};