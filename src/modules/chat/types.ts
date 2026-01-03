export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}

export interface UserSummary {
  id: string; // [FIX] Đổi number -> string (để khớp với UUID backend)
  fullname: string;
  handle: string;
  avatarUrl: string;
  isOnline?: boolean; // Nên thêm lại để hỗ trợ hiển thị chấm xanh
}

export interface Message {
  id: string; // [FIX] number -> string
  conversationId: string; // [FIX] number -> string
  senderId: string; // [FIX] number -> string
  content: string;
  type: MessageType;
  metadata?: any;
  clientSideId?: string;
  createdAt: string;
}

export interface Conversation {
  id: string; // [FIX] number -> string
  partner: UserSummary;
  lastMessageContent: string;
  lastMessageAt: string;
  lastSenderId: string; // [FIX] number -> string
  unreadCount: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'BLOCKED';
}