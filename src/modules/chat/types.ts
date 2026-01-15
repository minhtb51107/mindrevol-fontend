export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export interface UserSummary {
  id: string; 
  fullname: string;
  avatarUrl: string;
  handle?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO';
  metadata?: any;
  createdAt: string;
  
  // Field quan trọng cho Optimistic UI
  clientSideId?: string; 
  status?: 'SENDING' | 'SENT' | 'ERROR'; // [FIX] Bắt buộc dùng Union Type này
}

export interface Conversation {
  id: string;
  partner: UserSummary;
  lastMessageContent: string;
  lastMessageAt: string;
  lastSenderId: string;
  unreadCount: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'BLOCKED';
}

export interface SendMessageRequest {
  receiverId: string;
  content: string;
  type?: 'TEXT' | 'IMAGE';
  metadata?: any;
  clientSideId?: string;
}