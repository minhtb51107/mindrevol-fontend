// File: src/modules/chat/hooks/useChat.ts
import { useEffect, useState, useCallback } from 'react';
import { useChatStore } from '../store/useChatStore';
import { chatService } from '../services/chat.service';
import { blockService } from '@/modules/user/services/block.service'; 
import { friendService } from '@/modules/user/services/friend.service'; 
import { useAuth } from '@/modules/auth/store/AuthContext';
import { useChatSocket } from './useChatSocket';
import { Message } from '../types';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { http } from '@/lib/http';

export const useChat = (conversationId: any, partnerId: any) => {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const navigate = useNavigate();

  const { 
    messages: messagesMap, 
    addMessage,
    updateMessage, 
    setCursorData, 
    updateMessageStatus,
    replyingTo,        
    setReplyingTo,
    hasMoreMessages,   
    cursors            
  } = useChatStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const messages = (messagesMap && Array.isArray(messagesMap[conversationId])) 
    ? messagesMap[conversationId] 
    : [];

  const hasMore = hasMoreMessages[conversationId] ?? true;
  const currentCursor = cursors[conversationId] ?? null;

  useChatSocket(conversationId); 

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;
      
      if (conversationId.startsWith('friend_') || conversationId.startsWith('new_')) {
          setCursorData(conversationId, { data: [], nextCursor: null, hasNext: false });
          return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const pageData = await chatService.getMessages(conversationId, null, 50); 
        setCursorData(conversationId, pageData);
      } catch (err) {
        setError("Không thể tải tin nhắn");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId, setCursorData]);

  const loadMoreMessages = useCallback(async () => {
      if (isLoadingMore || !hasMore || !conversationId || conversationId.startsWith('friend_') || conversationId.startsWith('new_')) return;
      
      setIsLoadingMore(true);
      try {
          const pageData = await chatService.getMessages(conversationId, currentCursor, 50);
          setCursorData(conversationId, pageData);
      } catch (err) {
          console.error("Lỗi khi tải thêm tin nhắn:", err);
      } finally {
          setIsLoadingMore(false);
      }
  }, [conversationId, currentCursor, hasMore, isLoadingMore, setCursorData]);

  const sendMessage = useCallback(async (content: string, type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE' | 'FILE' = 'TEXT', file?: File | Blob) => {
    if (!content.trim() && type === 'TEXT') return;
    if (!currentUserId || (!partnerId && !conversationId)) return;

    let finalContent = content;

    if (file && (type === 'VOICE' || type === 'IMAGE' || type === 'FILE')) {
        try {
            const formData = new FormData();
            
            const isUnnamedBlob = !(file instanceof File) || !file.name || file.name === 'blob';
            if (type === 'VOICE' && isUnnamedBlob) {
                formData.append('file', file, 'voice-message.webm');
            } else {
                formData.append('file', file);
            }

            // ĐÃ THÊM LẠI HEADER: Ép client gửi dưới dạng multipart để SpringBoot đọc được file
            const uploadRes = await http.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            finalContent = uploadRes.data.data; 
        } catch (error) {
            toast.error("Không thể tải lên file đính kèm");
            return; 
        }
    }

    const clientSideId = Date.now().toString(); 
    const currentReplyId = replyingTo?.id;
    const optimisticMessage: Message = {
      id: clientSideId, 
      clientSideId, 
      conversationId, 
      senderId: currentUserId,
      content: finalContent, 
      type: type as any, 
      createdAt: new Date().toISOString(),
      replyToMsgId: currentReplyId
    };

    addMessage(optimisticMessage);
    setReplyingTo(null);

    try {
      const realMessage = await chatService.sendMessage({ 
          conversationId: !conversationId.startsWith('friend_') && !conversationId.startsWith('new_') ? conversationId : undefined, 
          receiverId: partnerId, 
          content: finalContent, 
          type, 
          clientSideId, 
          replyToMsgId: currentReplyId 
      });
      updateMessageStatus(clientSideId, 'SENT', realMessage.id);
    } catch (err) {
      updateMessageStatus(clientSideId, 'ERROR');
      toast.error("Gửi tin nhắn thất bại");
    }
  }, [conversationId, partnerId, currentUserId, addMessage, updateMessageStatus, replyingTo, setReplyingTo]);

  const editMessage = useCallback(async (messageId: string, newContent: string) => {
      if (!newContent.trim()) return;

      const currentMsg = messages.find(m => m.id === messageId);
      if (!currentMsg) return;

      updateMessage({ ...currentMsg, content: newContent, metadata: { ...currentMsg.metadata, isEdited: true } });

      try {
          await chatService.editMessage(messageId, newContent);
      } catch (error) {
          toast.error("Chỉnh sửa thất bại");
          updateMessage(currentMsg); 
      }
  }, [messages, updateMessage]);

  const deleteMessage = useCallback(async (messageId: string) => {
      try {
          await chatService.deleteMessage(messageId);
      } catch (err) {
          toast.error("Không thể thu hồi tin nhắn");
      }
  }, []);

  const blockUser = async () => { 
    if (!partnerId) return;
    try {
        await blockService.blockUser(partnerId);
        toast.success("Đã chặn người dùng");
        navigate('/messages');
    } catch (error: any) {
        console.error("Block user error:", error);
        toast.error(error.response?.data?.message || "Lỗi khi chặn người dùng");
    }
  };

  const unfriendUser = async () => { 
    if (!partnerId) return;
    try {
        await friendService.unfriend(partnerId);
        toast.success("Đã hủy kết bạn");
        window.location.reload();
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
    editMessage, 
    deleteMessage,
    blockUser,   
    unfriendUser,
    loadMoreMessages, 
    hasMore, 
    isLoadingMore
  };
};