// src/modules/chat/store/useChatStore.ts
import { create } from 'zustand';
import { Conversation, Message, MessageDeliveryStatus } from '../types';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: number | null;
  messages: Record<number, Message[]>; // Cache tin nhắn theo conversationId
  isSidebarOpen: boolean; // Mobile toggle

  // Actions
  setConversations: (list: Conversation[]) => void;
  setActiveConversation: (id: number | null) => void;
  setMessages: (convId: number, msgs: Message[]) => void;
  addMessage: (msg: Message) => void; // Dùng khi nhận socket hoặc gửi tin
  updateMessageStatus: (clientSideId: string, status: MessageDeliveryStatus, realId?: number) => void;
  markAsRead: (convId: number) => void;
  setTyping: (convId: number, isTyping: boolean) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  updateOnlineStatus: (userId: number, isOnline: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  isSidebarOpen: true,

  setConversations: (list) => set({ conversations: list }),
  
  setActiveConversation: (id) => set({ activeConversationId: id, isSidebarOpen: false }),

  setMessages: (convId, msgs) => set((state) => ({
    messages: { ...state.messages, [convId]: msgs }
  })),

  addMessage: (msg) => set((state) => {
    // 1. Thêm tin nhắn vào list
    const currentMsgs = state.messages[msg.conversationId] || [];
    // Check trùng (đề phòng socket và API response đua nhau)
    if (currentMsgs.some(m => (m.id === msg.id && msg.id) || (m.clientSideId === msg.clientSideId))) {
      return state;
    }
    const newMsgs = [...currentMsgs, msg]; // Append xuống cuối

    // 2. Update Conversation List (Move to top + Update preview)
    const convIndex = state.conversations.findIndex(c => c.id === msg.conversationId);
    let newConversations = [...state.conversations];

    if (convIndex > -1) {
      const updatedConv = { ...newConversations[convIndex] };
      updatedConv.lastMessageContent = msg.type === 'IMAGE' ? '[Hình ảnh]' : msg.content;
      updatedConv.lastMessageAt = new Date().toISOString(); // Hoặc msg.createdAt
      updatedConv.lastSenderId = msg.senderId;
      
      // Nếu không phải đang chat -> Tăng unread
      if (state.activeConversationId !== msg.conversationId) {
         updatedConv.unreadCount += 1;
      }

      // Xóa vị trí cũ, đưa lên đầu
      newConversations.splice(convIndex, 1);
      newConversations.unshift(updatedConv);
    } else {
      // Trường hợp message mới từ conversation chưa có trong list (cần fetch lại list hoặc xử lý sau)
    }

    return { 
      messages: { ...state.messages, [msg.conversationId]: newMsgs },
      conversations: newConversations
    };
  }),

  updateMessageStatus: (clientSideId, status, realId) => set((state) => {
    // Tìm và update status tin nhắn (Optimistic -> Real)
    const newMessages = { ...state.messages };
    for (const convId in newMessages) {
      newMessages[convId] = newMessages[convId].map(m => {
        if (m.clientSideId === clientSideId) {
          return { ...m, deliveryStatus: status, id: realId || m.id };
        }
        return m;
      });
    }
    return { messages: newMessages };
  }),

  markAsRead: (convId) => set((state) => {
    const newConvs = state.conversations.map(c => 
      c.id === convId ? { ...c, unreadCount: 0 } : c
    );
    return { conversations: newConvs };
  }),

  setTyping: (convId, isTyping) => set((state) => ({
    conversations: state.conversations.map(c => 
      c.id === convId ? { ...c, isTyping } : c
    )
  })),

  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  updateOnlineStatus: (userId, isOnline) => set((state) => ({
    conversations: state.conversations.map(c => 
      c.partner.id === userId 
        ? { ...c, partner: { ...c.partner, isOnline } } 
        : c
    )
  }))
}));