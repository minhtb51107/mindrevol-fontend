import React from 'react';
import { Message } from '../types';
import { cn } from '@/lib/utils';

interface Props {
  message: Message;
  isMe: boolean;
  showAvatar: boolean;
  avatarUrl?: string;
}

export const MessageBubble: React.FC<Props> = ({ message, isMe, showAvatar, avatarUrl }) => {
  const replyImage = message.metadata?.replyToImage;

  return (
    <div className={cn("flex gap-2 mb-1 group", isMe ? "flex-row-reverse" : "flex-row")}>
      
      {/* Avatar (chỉ hiện khi cần) */}
      <div className="w-8 shrink-0 flex flex-col justify-end">
         {!isMe && showAvatar && (
            <img src={avatarUrl || "/default-avatar.png"} className="w-8 h-8 rounded-full object-cover" />
         )}
      </div>

      <div className={cn("flex flex-col max-w-[70%]", isMe ? "items-end" : "items-start")}>
        
        {/* Locket Reply Context */}
        {replyImage && (
          <div className={cn(
            "mb-[-8px] z-0 p-1 rounded-2xl overflow-hidden opacity-90 border-2 transition-transform hover:scale-105 cursor-pointer",
            isMe ? "bg-blue-600 border-blue-600 rounded-br-none" : "bg-zinc-800 border-zinc-800 rounded-bl-none"
          )}>
            <img src={replyImage} alt="Reply" className="w-24 h-36 object-cover rounded-xl" />
            <p className="text-[9px] text-white/70 px-1 pt-1 italic font-medium">💬 Phản hồi ảnh</p>
          </div>
        )}

        {/* Bubble Text */}
        <div className={cn(
          "px-4 py-2 rounded-2xl text-[15px] relative z-10 shadow-sm break-words leading-snug",
          isMe 
            ? "bg-blue-600 text-white rounded-br-sm" 
            : "bg-zinc-800 text-white rounded-bl-sm border border-white/5"
        )}>
          {message.content}
        </div>
        
        {/* Timestamp (Hiện khi hover) */}
        <span className="text-[10px] text-zinc-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>
    </div>
  );
};