import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  currentUserId?: string; // [FIX] Đã đổi sang string
  partnerAvatar?: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, partnerAvatar }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // [FIX QUAN TRỌNG] Kiểm tra xem messages có phải là mảng không để tránh crash
  if (!messages || !Array.isArray(messages)) {
    return <div className="flex-1 flex items-center justify-center text-zinc-500">...</div>;
  }

  return (
    <div 
      ref={scrollRef} 
      className="flex-1 overflow-y-auto pt-[80px] pb-4 px-3 md:px-4 custom-scrollbar scroll-smooth"
    >
      <div className="space-y-[2px]">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUserId;
          const nextMsg = messages[index + 1];
          
          // Check nhóm tin nhắn liên tiếp để hiển thị avatar ở tin cuối cùng
          const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;
          
          return (
            <div key={msg.clientSideId || msg.id} className={cn("transition-all", isLastInGroup ? "mb-5" : "")}>
              <MessageBubble 
                message={msg} 
                isMe={isMe} 
                showAvatar={!isMe && isLastInGroup}
                avatarUrl={partnerAvatar}
              />
            </div>
          );
        })}
        {/* Dummy div để scroll bottom */}
        <div /> 
      </div>
    </div>
  );
};