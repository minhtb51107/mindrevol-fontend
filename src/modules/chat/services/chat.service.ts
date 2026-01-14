import { http } from "@/lib/http";
import { Message, Conversation, SendMessageRequest } from "../types";

export const chatService = {
  // 1. Gửi tin nhắn
  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    // API endpoint nên có prefix /api/v1 nếu backend config như vậy (kiểm tra lại file backend controller)
    // Giả sử config axios base URL đã có /api/v1, nếu chưa thì thêm vào
    const response = await http.post<any>("/chat/send", data);
    return response.data.data || response.data;
  },

  // 2. Lấy danh sách Inbox (Conversations)
  getConversations: async (): Promise<Conversation[]> => {
    const response = await http.get<any>("/chat/conversations");
    return response.data.data || response.data || [];
  },

  // 3. Lấy tin nhắn chi tiết với 1 user (hoặc theo conversationId tùy backend)
  getMessages: async (partnerId: string): Promise<Message[]> => {
    // API này lấy tin nhắn với partnerId
    const response = await http.get<any>(`/chat/messages/${partnerId}`, {
        params: { size: 50 } // Lấy 50 tin mới nhất
    });
    
    const data = response.data.data || response.data;

    // Xử lý cả 2 trường hợp: Trả về mảng trực tiếp hoặc Page object (.content)
    if (Array.isArray(data)) {
        return data;
    } else if (data && Array.isArray(data.content)) {
        return data.content;
    }
    return [];
  },

  // 4. Đánh dấu đã đọc
  markAsRead: async (conversationId: string) => {
    await http.post(`/chat/conversations/${conversationId}/read`);
  },

  // 5. Khởi tạo hội thoại (Tìm hoặc tạo mới)
  getOrCreateConversation: async (receiverId: string): Promise<Conversation> => {
    const response = await http.post<any>(`/chat/conversations/init/${receiverId}`);
    return response.data.data || response.data;
  },
  
  // Alias cho hàm trên (giữ lại để tương thích code cũ nếu có)
  initConversation: async (receiverId: string): Promise<Conversation> => {
    const response = await http.post<any>(`/chat/conversations/init/${receiverId}`);
    return response.data.data || response.data;
  }
};