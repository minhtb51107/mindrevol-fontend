import React from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { VoiceCallModal } from './VoiceCallModal';
import { ForwardMessageModal } from './ForwardMessageModal';
import { useChatWindow } from '../hooks/useChatWindow';

interface ChatWindowProps {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  onBackMobile?: () => void; 
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ isSidebarOpen, toggleSidebar, onBackMobile }) => {
  const {
      activeConv, forwardingMessage, setForwardingMessage,
      remoteAudioRef, chatData, callData, handleAcceptCall
  } = useChatWindow();

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #E1DDE8; border-radius: 20px; }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; }
  `;

  if (!activeConv) {
    return (
      <div className="flex flex-col items-center justify-center bg-[#F0EFF5] dark:bg-[#121212] h-full transition-colors duration-300">
        <style>{scrollbarStyles}</style>
        <div className="w-24 h-24 mb-4 rounded-full bg-white/50 dark:bg-zinc-800/50 flex items-center justify-center shadow-sm">
            <span className="text-4xl">☁️</span>
        </div>
        <p className="text-xl font-bold tracking-wide text-[#756A91] dark:text-zinc-300" style={{ fontFamily: '"Jua", sans-serif' }}>
            Kết nối với một người bạn
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-[#F0EFF5] dark:bg-[#121212]">
      <style>{scrollbarStyles}</style>

      <ForwardMessageModal 
        isOpen={!!forwardingMessage} 
        onClose={() => setForwardingMessage(null)} 
      />

      <ChatHeader 
        partner={activeConv.partner} 
        onBlock={chatData.blockUser}        
        onUnfriend={chatData.unfriendUser} 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onBackMobile={onBackMobile} 
      />

      <div className="flex-1 min-h-0 relative">
          <MessageList 
            messages={chatData.messages}
            currentUserId={chatData.currentUserId}
            partnerAvatar={activeConv.partner?.avatarUrl}
            onLoadMore={chatData.loadMoreMessages} 
            hasMore={chatData.hasMore}            
            isLoadingMore={chatData.isLoadingMore} 
          />
      </div>

      <ChatInput onSend={chatData.sendMessage} onEdit={chatData.editMessage} />

      <VoiceCallModal 
        incomingCall={callData.incomingCall} 
        outgoingCall={callData.outgoingCall} 
        isInCall={callData.isInCall} 
        partnerName={activeConv.partner?.fullname || 'Bạn bè'} 
        remoteAudioRef={remoteAudioRef} 
        onAccept={handleAcceptCall}
        onReject={() => { if (callData.incomingCall) callData.sendSignal({ type: 'call-reject', targetId: callData.incomingCall.senderId, senderId: chatData.currentUserId }); callData.endCall(); }}
        onEndCall={() => { const target = callData.incomingCall ? callData.incomingCall.senderId : callData.outgoingCall?.targetId; if (target) callData.sendSignal({ type: 'end-call', targetId: target, senderId: chatData.currentUserId }); callData.endCall(); }}
        onCancelCall={() => { if (callData.outgoingCall) callData.sendSignal({ type: 'end-call', targetId: callData.outgoingCall.targetId, senderId: chatData.currentUserId }); callData.endCall(); }}
      />
    </div>
  );
};