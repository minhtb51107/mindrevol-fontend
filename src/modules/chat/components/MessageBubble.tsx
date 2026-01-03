import React from 'react';
import { Message } from '../types';
import { cn } from '@/lib/utils';

interface Props {
  message: Message;
  isMe: boolean;
  showAvatar: boolean;
  avatarUrl?: string;
}

// 1. Tách Component hiển thị Avatar
const ChatAvatar = ({ show, url, isMe }: { show: boolean, url?: string, isMe: boolean }) => {
  if (isMe) return <div className="w-8 h-8 flex-shrink-0 mb-[2px] hidden" />; // Placeholder hidden cho isMe

  return (
    <div className="w-8 h-8 flex-shrink-0 mb-[2px]">
       {show ? (
          <div className="w-8 h-8 transition-transform duration-200 active:scale-95 cursor-pointer">
              <img 
                src={url || "/default-avatar.png"} 
                alt="Avatar"
                className="w-full h-full rounded-full object-cover shadow-sm ring-1 ring-white/10" 
              />
          </div>
       ) : (
          <div className="w-8" />
       )}
    </div>
  );
};

// 2. Tách Component hiển thị Ảnh Reply (Phần phức tạp nhất)
const MessageImage = ({ src, isMe }: { src: string, isMe: boolean }) => (
  <div className={cn(
    "mb-2 relative z-0 cursor-pointer transition-all hover:scale-[1.01]",
    isMe ? "mr-0" : "ml-0"
  )}>
    {/* Hiệu ứng Blur background */}
    <div 
        className="absolute inset-0 rounded-[32px] opacity-50 blur-2xl scale-95 translate-y-4 z-[-1]"
        style={{ 
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}
    />

    {/* Ảnh chính */}
    <div className={cn(
        "relative overflow-hidden aspect-square border border-white/10 shadow-xl bg-[#18181b]",
        "w-72 md:w-80", 
        "rounded-[24px]" 
    )}>
        <img src={src} alt="Reply" className="w-full h-full object-cover" />
        
        {/* Overlay text */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <p className="text-[11px] text-white/95 font-medium pl-1 drop-shadow-md">💬 Đã trả lời</p>
        </div>
    </div>
  </div>
);

// 3. Component chính - Giờ rất gọn và dễ đọc luồng
export const MessageBubble: React.FC<Props> = ({ message, isMe, showAvatar, avatarUrl }) => {
  const replyImage = message.metadata?.replyToImage;

  return (
    <div className={cn(
        "flex gap-2.5 w-full group relative", 
        "items-end", 
        isMe ? "justify-end" : "justify-start"
    )}>
      
      {/* Cột Avatar */}
      <ChatAvatar show={showAvatar} url={avatarUrl} isMe={isMe} />

      {/* Nội dung tin nhắn */}
      <div className={cn(
          "flex flex-col max-w-[85%] md:max-w-[70%]",
          isMe ? "items-end" : "items-start"
      )}>
        
        {/* Phần Ảnh (Nếu có) */}
        {replyImage && <MessageImage src={replyImage} isMe={isMe} />}

        {/* Phần Text Bubble */}
        {message.content && (
             <div className={cn(
                "px-4 py-2.5 text-[15px] relative z-10 shadow-sm break-words leading-relaxed border transition-all duration-200",
                isMe 
                  ? "bg-white text-black rounded-[20px] rounded-br-[4px] border-transparent" 
                  : "bg-[#27272a] text-zinc-100 rounded-[20px] rounded-bl-[4px] border-white/5 hover:bg-[#2e2e32]"
              )}>
                {message.content}
              </div>
        )}
        
        {/* Timestamp */}
        <div className={cn(
            "h-4 overflow-hidden transition-all duration-300 ease-out",
            "opacity-0 group-hover:opacity-100 group-hover:h-5 mt-1 px-1"
        )}>
            <span className="text-[10px] font-medium text-zinc-500 select-none flex items-center gap-1">
                {isMe && <span className="text-[9px]">Đã gửi</span>}
                {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
        </div>
      </div>
    </div>
  );
};