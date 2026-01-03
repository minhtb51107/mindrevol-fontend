// src/modules/chat/components/ChatWindow.tsx
import React from 'react';
import { useChatStore } from '../store/useChatStore';
import { useChat } from '../hooks/useChat';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export const ChatWindow = () => {
  const { activeConversationId, conversations } = useChatStore();
  const activeConv = conversations.find(c => c.id === activeConversationId);

  const { 
    messages, 
    sendMessage, 
    blockUser, 
    unfriendUser, 
    currentUserId 
  } = useChat(activeConversationId, activeConv?.partner.id);

  // Style scrollbar gốc của bạn
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #52525b; }
  `;

  if (!activeConv) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center bg-[#0a0a0a] h-full text-zinc-500">
        <p className="text-base font-medium tracking-wide">Chọn một người bạn để bắt đầu</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] relative font-sans">
      {/* Inject style scrollbar vào đây */}
      <style>{scrollbarStyles}</style>

      <ChatHeader 
        partner={activeConv.partner} 
        onBlock={blockUser}
        onUnfriend={unfriendUser}
      />

      <MessageList 
        messages={messages}
        currentUserId={currentUserId}
        partnerAvatar={activeConv.partner.avatarUrl}
      />

      <ChatInput onSend={sendMessage} />
    </div>
  );
};