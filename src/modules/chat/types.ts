export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export interface UserSummary {
  id: string; // Đã đổi sang string (UUID)
  fullname: string;
  avatarUrl: string;
  handle?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string; // Đã đổi sang string
  conversationId: string; // Đã đổi sang string
  senderId: string; // Đã đổi sang string
  receiverId?: string; // Optional vì group chat có thể ko có receiver cụ thể
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO';
  metadata?: any;
  createdAt: string;
  
  // Các field cho Optimistic UI
  clientSideId?: string; 
  status?: 'SENDING' | 'SENT' | 'ERROR'; 
}

export interface Conversation {
  id: string; // Đã đổi sang string
  partner: UserSummary;
  lastMessageContent: string;
  lastMessageAt: string;
  lastSenderId: string; // Đã đổi sang string
  unreadCount: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'BLOCKED';
}

// Request gửi tin nhắn (đã thêm clientSideId)
export interface SendMessageRequest {
  receiverId: string; // Đổi any -> string cho chặt chẽ
  content: string;
  type?: 'TEXT' | 'IMAGE';
  metadata?: any;
  clientSideId?: string; // Field quan trọng để map lại response
}