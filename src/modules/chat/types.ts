// src/modules/chat/types.ts

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VOICE = 'VOICE',
  REACTION = 'REACTION'
}

export enum MessageDeliveryStatus {
  SENT = 'SENT',       // Đã gửi lên server
  DELIVERED = 'DELIVERED', // Đã nhận
  SEEN = 'SEEN'        // Đã xem
}

export interface UserSummary {
  id: number;
  fullname: string;
  handle: string;
  avatarUrl: string;
  isOnline: boolean;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  type: MessageType;
  metadata?: any; // Chứa reply info, ảnh locket...
  clientSideId?: string; // Để khớp Optimistic UI
  deliveryStatus: MessageDeliveryStatus;
  createdAt: string;
}

export interface Conversation {
  id: number;
  partner: UserSummary;
  lastMessageContent: string;
  lastMessageAt: string;
  lastSenderId: number;
  unreadCount: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'BLOCKED';
  
  // State nội bộ FE (không phải từ DB)
  isTyping?: boolean; 
}