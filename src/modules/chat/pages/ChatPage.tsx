import { useEffect } from 'react';
import { ConversationList } from '../components/ConversationList';
import { ChatWindow } from '../components/ChatWindow';
import MainLayout from '@/components/layout/MainLayout';
import { useChatStore } from '../store/useChatStore';

export const ChatPage = () => {
  return (
    <MainLayout>
    <div className="flex h-[100dvh] w-full bg-[#121212] overflow-hidden">
      
      {/* Cột trái: List Conversation */}
      <div className="w-[300px] md:w-[350px] h-full shrink-0 border-r border-white/5">
        <ConversationList />
      </div>

      {/* Cột phải: Chat Window - flex-1 để chiếm hết không gian còn lại */}
      <div className="flex-1 h-full min-w-0 bg-[#121212] relative">
        <ChatWindow />
      </div>
    </div>
    </MainLayout>
  );
};