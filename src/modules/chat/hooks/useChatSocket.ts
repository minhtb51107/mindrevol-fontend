// src/modules/chat/hooks/useChatSocket.ts
import { useEffect } from 'react';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { socket } from '@/lib/socket'; // Giả định bạn đã có cấu hình socket ở đây
import { useChatStore } from '../store/useChatStore';
import { Message } from '../types';

export const useChatSocket = () => {
  const { user } = useAuth();
  const { addMessage, setTyping, markAsRead, updateOnlineStatus } = useChatStore();

  useEffect(() => {
    if (!user) return;

    // 1. Kênh Tin nhắn mới
    const msgSub = socket.subscribe('/user/queue/messages', (msg: Message) => {
      addMessage(msg);
      // Nếu đang mở chat này thì mark read luôn (gọi API sau)
    });

    // 2. Kênh Typing
    const typingSub = socket.subscribe('/user/queue/typing', (event: any) => {
      // event: { conversationId, senderId, isTyping }
      if (event.senderId !== user.id) {
        setTyping(event.conversationId, event.isTyping);
      }
    });

    // 3. Kênh Read Receipt (Người kia đã xem)
    const readSub = socket.subscribe('/user/queue/read-receipt', (event: any) => {
        // Cập nhật UI tin nhắn cuối cùng thành "Đã xem" (Logic này xử lý ở MessageList)
        console.log("Partner read until:", event.lastReadMessageId);
    });

    // 4. Kênh Presence (Online/Offline) - Nếu Backend có broadcast
    // const presenceSub = socket.subscribe('/topic/presence', ...);

    return () => {
      msgSub?.unsubscribe();
      typingSub?.unsubscribe();
      readSub?.unsubscribe();
    };
  }, [user]);
};