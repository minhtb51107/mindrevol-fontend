import React from 'react';
import { useChatStore } from '../store/useChatStore';
import { useChat } from '../hooks/useChat';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export const ChatWindow = () => {
  const { activeConversationId, conversations } = useChatStore();
  const activeConv = conversations.find(c => c.id === activeConversationId);

  // [QUAN TRỌNG] Hook này trả về 2 hàm blockUser và unfriendUser
  // (Đảm bảo bạn đã cập nhật file useChat.ts như hướng dẫn trước)
  const { 
    messages, 
    sendMessage, 
    blockUser,      // <-- Hàm xử lý chặn (gọi API)
    unfriendUser,   // <-- Hàm xử lý hủy kết bạn (gọi API)
    currentUserId 
  } = useChat(activeConversationId, activeConv?.partner?.id);

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
      <style>{scrollbarStyles}</style>

      {/* [KẾT NỐI] Truyền hàm từ hook xuống component giao diện */}
      <ChatHeader 
        partner={activeConv.partner} 
        onBlock={blockUser}        // Khi Header bấm "Chặn", nó sẽ gọi hàm này
        onUnfriend={unfriendUser}  // Khi Header bấm "Hủy kết bạn", nó sẽ gọi hàm này
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