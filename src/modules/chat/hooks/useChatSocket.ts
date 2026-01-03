import { useEffect } from 'react';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { socket } from '@/lib/socket'; 
import { useChatStore } from '../store/useChatStore';
import { Message } from '../types';

export const useChatSocket = () => {
  const { user } = useAuth();
  const { addMessage } = useChatStore();

  useEffect(() => {
    if (!user) return;

    // Chỉ subscribe đúng 1 kênh: Tin nhắn mới
    // Backend vẫn bắn các event khác nhưng Client lờ đi
    const msgSub = socket.subscribe('/user/queue/messages', (msg: Message) => {
      addMessage(msg);
    });

    return () => {
      msgSub?.unsubscribe();
    };
  }, [user, addMessage]);
};