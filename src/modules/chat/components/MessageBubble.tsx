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
    <div className={cn(
        "flex gap-2.5 w-full group relative", 
        "items-end", 
        isMe ? "justify-end" : "justify-start"
    )}>
      
      {/* Avatar Column */}
      <div className={cn("w-8 h-8 flex-shrink-0 mb-[2px]", isMe && "hidden")}>
         {showAvatar ? (
            <div className="w-8 h-8 transition-transform duration-200 active:scale-95 cursor-pointer">
                <img src={avatarUrl || "/default-avatar.png"} className="w-full h-full rounded-full object-cover shadow-sm ring-1 ring-white/10" />
            </div>
         ) : (
            <div className="w-8" />
         )}
      </div>

      <div className={cn(
          "flex flex-col max-w-[85%] md:max-w-[70%]", // Tăng max-width để chứa ảnh to hơn
          isMe ? "items-end" : "items-start"
      )}>
        
        {/* IMAGE SECTION (Đã chỉnh sửa theo yêu cầu) */}
        {replyImage && (
          <div className={cn(
            "mb-2 relative z-0 cursor-pointer transition-all hover:scale-[1.01]",
            // Không set margin âm để tạo hiệu ứng tách biệt hiện đại hơn
            isMe ? "mr-0" : "ml-0"
          )}>
            {/* Hiệu ứng Blur phía sau (Tăng opacity và size lên chút để hợp với ảnh to) */}
            <div 
                className="absolute inset-0 rounded-[32px] opacity-50 blur-2xl scale-95 translate-y-4 z-[-1]"
                style={{ 
                    backgroundImage: `url(${replyImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            {/* Container Ảnh chính - TO HƠN & BO TRÒN HẾT */}
            <div className={cn(
                "relative overflow-hidden aspect-square border border-white/10 shadow-xl bg-[#18181b]",
                // Thay đổi: w-40 -> w-64 hoặc w-72 (To hơn)
                "w-72 md:w-80", 
                // Thay đổi: rounded-br-sm -> rounded-[24px] (Bo tròn hết, không góc vuông)
                "rounded-[24px]" 
            )}>
                <img src={replyImage} alt="Reply" className="w-full h-full object-cover" />
                
                {/* Overlay text nhỏ */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                     <p className="text-[11px] text-white/95 font-medium pl-1 drop-shadow-md">💬 Đã trả lời</p>
                </div>
            </div>
          </div>
        )}

        {/* Main Bubble (Text) - Giữ nguyên góc vuông để phân biệt hướng nói */}
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