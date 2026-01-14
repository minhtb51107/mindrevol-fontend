import { useEffect } from 'react';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { socket } from '@/lib/socket'; 
import { useChatStore } from '../store/useChatStore';
import { Message } from '../types';

// [FIX] Nhận tham số conversationId
export const useChatSocket = (conversationId: string) => {
  const { user } = useAuth();
  const { addMessage } = useChatStore();

  useEffect(() => {
    if (!user || !conversationId) return;

    // [FIX] Subscribe vào topic chung: /topic/chat.{id}
    // Topic này khớp với backend ChatServiceImpl.java
    const topic = `/topic/chat.${conversationId}`;
    
    // console.log("Subscribing to chat topic:", topic); // Uncomment để debug nếu cần

    const msgSub = socket.subscribe(topic, (msg: Message) => {
      // Logic xử lý tin nhắn nhận được
      // useChatStore (Zustand) thường sẽ có logic để tránh trùng lặp tin nhắn
      // dựa trên id hoặc clientSideId (đã được thêm bởi Optimistic UI)
      addMessage(msg);
    });

    return () => {
      msgSub?.unsubscribe();
    };
  }, [user, conversationId, addMessage]);
};