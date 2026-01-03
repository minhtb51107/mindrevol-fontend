import { create } from 'zustand';
import { Conversation, Message } from '../types';
import { chatService } from '../services/chat.service';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: any; // [FIX] Dùng any để nhận UUID string
  messages: Record<string, Message[]>; // [FIX] Key là string ID
  isSidebarOpen: boolean;

  // Actions
  setConversations: (list: Conversation[]) => void;
  openChat: (conversationId: any) => Promise<void>; // [FIX] Param any
  closeChat: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  
  setMessages: (convId: any, msgs: Message[]) => void;
  addMessage: (msg: Message) => void; 
  markAsRead: (convId: any) => void;
  
  updateMessageStatus: (clientSideId: string, status: string, realId?: any) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  isSidebarOpen: true,

  setConversations: (list) => set({ conversations: list }),

  openChat: async (id) => {
    // 1. Optimistic Update
    set((state) => ({
      activeConversationId: id,
      conversations: state.conversations.map((c) => 
        // [FIX] So sánh chuỗi
        String(c.id) === String(id) ? { ...c, unreadCount: 0 } : c
      ),
    }));

    // 2. Gọi API
    try {
      if(id) await chatService.markAsRead(id);
    } catch (error) {
      console.error("Lỗi khi đánh dấu đã đọc:", error);
    }
  },

  closeChat: () => set({ activeConversationId: null }),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  setMessages: (convId, msgs) => set((state) => ({
    messages: { ...state.messages, [convId]: msgs }
  })),

  addMessage: (msg) => set((state) => {
    // 1. Thêm tin nhắn
    const currentMsgs = state.messages[msg.conversationId] || [];
    // Check trùng
    if (currentMsgs.some(m => (m.id === msg.id && msg.id) || (m.clientSideId === msg.clientSideId && msg.clientSideId))) {
      return state;
    }
    const newMsgs = [...currentMsgs, msg];

    // 2. Đẩy hội thoại lên đầu
    const convIndex = state.conversations.findIndex(c => String(c.id) === String(msg.conversationId));
    let newConversations = [...state.conversations];

    if (convIndex > -1) {
      const updatedConv = { ...newConversations[convIndex] };
      updatedConv.lastMessageContent = msg.type === 'IMAGE' ? '[Hình ảnh]' : msg.content;
      updatedConv.lastMessageAt = new Date().toISOString(); 
      updatedConv.lastSenderId = msg.senderId;
      
      if (String(state.activeConversationId) !== String(msg.conversationId)) {
         updatedConv.unreadCount = (updatedConv.unreadCount || 0) + 1;
      }

      newConversations.splice(convIndex, 1);
      newConversations.unshift(updatedConv);
    } 

    return { 
      messages: { ...state.messages, [msg.conversationId]: newMsgs },
      conversations: newConversations
    };
  }),

  markAsRead: (convId) => set((state) => {
    const newConvs = state.conversations.map(c => 
      String(c.id) === String(convId) ? { ...c, unreadCount: 0 } : c
    );
    return { conversations: newConvs };
  }),

  updateMessageStatus: (clientSideId, status, realId) => set((state) => {
    const newMessages = { ...state.messages };
    for (const convId in newMessages) {
      newMessages[convId] = newMessages[convId].map(m => {
        if (m.clientSideId === clientSideId) {
          return { ...m, id: realId || m.id, status: status }; // status isn't in Message type usually but implied for UI
        }
        return m;
      });
    }
    return { messages: newMessages };
  }),
}));