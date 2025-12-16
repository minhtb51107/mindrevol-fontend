import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { ConversationList } from '../components/ConversationList';
import { ChatWindow } from '../components/ChatWindow';
import { useChatSocket } from '../hooks/useChatSocket';
import { useChatStore } from '../store/useChatStore';
import { chatService } from '../services/chat.service';

export const ChatPage = () => {
  // 1. Kích hoạt Socket
  useChatSocket();
  
  // 2. Load danh sách hội thoại ban đầu
  const { setConversations } = useChatStore();
  
  useEffect(() => {
    const init = async () => {
      try {
        const data = await chatService.getConversations();
        setConversations(data);
      } catch (e) { console.error(e); }
    };
    init();
  }, []);

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-black">
        <ConversationList />
        <ChatWindow />
      </div>
    </MainLayout>
  );
};