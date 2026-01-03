import { useEffect, useState, useCallback } from 'react';
import { useChatStore } from '../store/useChatStore';
import { chatService } from '../services/chat.service';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { useChatSocket } from './useChatSocket';
import { Message } from '../types';

export const useChat = (conversationId: any, partnerId: any) => {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const { 
    messages: messagesMap, 
    addMessage, 
    setMessages, 
    updateMessageStatus 
  } = useChatStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // [FIX] Đảm bảo luôn trả về mảng, tránh undefined
  const messages = (messagesMap && Array.isArray(messagesMap[conversationId])) 
    ? messagesMap[conversationId] 
    : [];

  // 1. Kết nối Socket
  useChatSocket(); 

  // 2. Fetch tin nhắn
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId || !partnerId) return;

      setIsLoading(true);
      try {
        const data = await chatService.getMessages(partnerId);
        // Lưu vào store
        setMessages(conversationId, data);
      } catch (err) {
        console.error("Failed to load messages", err);
        setError("Không thể tải tin nhắn");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, partnerId, setMessages]);

  // 3. Gửi tin nhắn (Optimistic UI)
  const sendMessage = useCallback(async (content: string, type: 'TEXT' | 'IMAGE' = 'TEXT') => {
    if (!content.trim() && type === 'TEXT') return;
    if (!partnerId || !currentUserId) return;

    const clientSideId = Date.now().toString(); 
    const optimisticMessage: Message = {
      id: clientSideId, 
      clientSideId: clientSideId,
      conversationId: conversationId,
      senderId: currentUserId,
      content: content,
      type: type as any, 
      createdAt: new Date().toISOString(),
    } as any;

    addMessage(optimisticMessage);

    try {
      const realMessage = await chatService.sendMessage({
        receiverId: partnerId,
        content,
        type
      });
      updateMessageStatus(clientSideId, 'SENT', realMessage.id);
    } catch (err) {
      console.error("Send message failed", err);
      updateMessageStatus(clientSideId, 'ERROR');
    }
  }, [conversationId, partnerId, currentUserId, addMessage, updateMessageStatus]);

  const blockUser = async () => { console.log("Block", partnerId); };
  const unfriendUser = async () => { console.log("Unfriend", partnerId); };

  return {
    messages,
    isLoading,
    error,
    currentUserId,
    sendMessage,
    blockUser,
    unfriendUser
  };
};