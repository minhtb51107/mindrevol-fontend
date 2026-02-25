import React from 'react';
import { Message } from '../types';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  message: Message;
  isMe: boolean;
  showAvatar: boolean;
  avatarUrl?: string;
}

// 1. Tách Component hiển thị Avatar
const ChatAvatar = ({ show, url, isMe }: { show: boolean, url?: string, isMe: boolean }) => {
  if (isMe) return <div className="w-8 h-8 flex-shrink-0 mb-[2px] hidden" />;

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

// 2. Tách Component hiển thị Ảnh Reply (Từ lúc bình luận bài viết)
const MessageImage = ({ src, isMe }: { src: string, isMe: boolean }) => (
  <div className={cn(
    "mb-2 relative z-0 cursor-pointer transition-all hover:scale-[1.01]",
    isMe ? "mr-0" : "ml-0"
  )}>
    <div 
        className="absolute inset-0 rounded-[32px] opacity-50 blur-2xl scale-95 translate-y-4 z-[-1]"
        style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    />
    <div className={cn(
        "relative overflow-hidden aspect-square border border-white/10 shadow-xl bg-[#18181b]",
        "w-72 md:w-80", "rounded-[24px]" 
    )}>
        <img src={src} alt="Reply" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <p className="text-[11px] text-white/95 font-medium pl-1 drop-shadow-md">💬 Đã trả lời</p>
        </div>
    </div>
  </div>
);

// 3. [THÊM MỚI] Component hiển thị Thẻ Chia sẻ bài viết
const PostSharePreview = ({ postId, isMe }: { postId: string, isMe: boolean }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/post/${postId}`)}
      className={cn(
        "mb-1.5 w-72 md:w-80 overflow-hidden rounded-[20px] border cursor-pointer transition-all hover:opacity-90 active:scale-[0.98]",
        isMe ? "border-zinc-200 bg-white" : "border-white/10 bg-[#18181b]"
      )}
    >
      <div className="aspect-video bg-zinc-800 relative group flex items-center justify-center">
        <span className="text-[12px] text-zinc-500 font-medium">Nhấp để xem bài đăng</span>
        <div className="absolute top-3 right-3 p-1.5 bg-black/40 rounded-full backdrop-blur-md">
          <ExternalLink className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <div className="p-3.5">
        <p className={cn("text-[13px] font-bold line-clamp-2", isMe ? "text-black" : "text-white")}>
          Bài viết được chia sẻ từ MindRevol
        </p>
        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-bold">Mindrevol</p>
      </div>
    </div>
  );
};

// 4. Component chính
export const MessageBubble: React.FC<Props> = ({ message, isMe, showAvatar, avatarUrl }) => {
  const replyImage = message.metadata?.replyToImage;
  
  // Đọc metadata để xem có phải tin nhắn chia sẻ bài viết không
  const isSharedPost = message.metadata?.contentType === 'SHARE_POST';
  const sharedPostId = message.metadata?.sharedPostId;

  return (
    <div className={cn(
        "flex gap-2.5 w-full group relative items-end", 
        isMe ? "justify-end" : "justify-start"
    )}>
      
      {/* Cột Avatar */}
      <ChatAvatar show={showAvatar} url={avatarUrl} isMe={isMe} />

      {/* Nội dung tin nhắn */}
      <div className={cn(
          "flex flex-col max-w-[85%] md:max-w-[70%]",
          isMe ? "items-end" : "items-start"
      )}>
        
        {/* Phần Ảnh Reply (Nếu có) */}
        {replyImage && <MessageImage src={replyImage} isMe={isMe} />}

        {/* Phần Thẻ Chia Sẻ Bài Viết (Nếu có) */}
        {isSharedPost && sharedPostId && (
          <PostSharePreview postId={sharedPostId} isMe={isMe} />
        )}

        {/* Phần Text Bubble (Chỉ render nếu content có nội dung) */}
        {message.content && message.content.trim() !== "" && (
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