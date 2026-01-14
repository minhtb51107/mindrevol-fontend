import { useEffect, useState, useCallback } from 'react';
import { useChatStore } from '../store/useChatStore';
import { chatService } from '../services/chat.service';
import { blockService } from '@/modules/user/services/block.service'; // [FIX] Import đúng file
import { friendService } from '@/modules/user/services/friend.service'; // [FIX] Import đúng file
import { useAuth } from '@/modules/auth/store/AuthContext';
import { useChatSocket } from './useChatSocket';
import { Message } from '../types';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useChat = (conversationId: any, partnerId: any) => {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const navigate = useNavigate();

  const { 
    messages: messagesMap, 
    addMessage, 
    setMessages, 
    updateMessageStatus 
  } = useChatStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messages = (messagesMap && Array.isArray(messagesMap[conversationId])) 
    ? messagesMap[conversationId] 
    : [];

  useChatSocket(conversationId); 

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId || !partnerId) return;
      setIsLoading(true);
      try {
        const data = await chatService.getMessages(partnerId);
        const sortedMessages = [...data].reverse();
        setMessages(conversationId, sortedMessages);
      } catch (err) {
        console.error("Failed to load messages", err);
        setError("Không thể tải tin nhắn");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId, partnerId, setMessages]);

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
        type,
        clientSideId 
      });
      updateMessageStatus(clientSideId, 'SENT', realMessage.id);
    } catch (err) {
      console.error("Send message failed", err);
      updateMessageStatus(clientSideId, 'ERROR');
      toast.error("Gửi tin nhắn thất bại");
    }
  }, [conversationId, partnerId, currentUserId, addMessage, updateMessageStatus]);

  // --- [LOGIC CHẶN USER] Gọi blockService ---
  const blockUser = async () => { 
    if (!partnerId) return;
    // Có thể bỏ window.confirm nếu UI đã có modal confirm riêng, hoặc giữ lại để chắc chắn
    // if (!window.confirm("Bạn có chắc chắn muốn chặn người này?")) return;

    try {
        await blockService.blockUser(partnerId); // Gọi service riêng
        toast.success("Đã chặn người dùng");
        navigate('/messages'); // Quay về inbox để tránh lỗi hiển thị chat
    } catch (error: any) {
        console.error("Block user error:", error);
        toast.error(error.response?.data?.message || "Lỗi khi chặn người dùng");
    }
  };

  // --- [LOGIC HỦY KẾT BẠN] Gọi friendService ---
  const unfriendUser = async () => { 
    if (!partnerId) return;
    // if (!window.confirm("Bạn có chắc chắn muốn hủy kết bạn?")) return;

    try {
        await friendService.unfriend(partnerId); // Gọi service riêng
        toast.success("Đã hủy kết bạn");
        window.location.reload(); // Reload để cập nhật UI (nút kết bạn/chat)
    } catch (error: any) {
        console.error("Unfriend error:", error);
        toast.error(error.response?.data?.message || "Lỗi khi hủy kết bạn");
    }
  };

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