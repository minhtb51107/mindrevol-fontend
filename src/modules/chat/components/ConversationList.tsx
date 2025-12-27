import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronLeft } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { useChatStore } from '../store/useChatStore';

export const ConversationList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // [FIX] Dùng đúng tên hàm 'openChat' từ store
  const { 
    conversations, 
    activeConversationId, 
    openChat // <--- Đổi từ setActiveConversationId thành openChat
  } = useChatStore();

  return (
    <div className="flex flex-col h-full bg-[#121212] border-r border-white/5 transition-all duration-300 w-[90px] md:w-[350px]">
      
      {/* HEADER */}
      <div className="h-16 shrink-0 flex items-center px-0 md:px-4 border-b border-white/5 justify-center md:justify-start gap-2">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
          title="Quay lại Trang chủ"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="hidden md:block text-lg font-bold text-white">Tin nhắn</h2>
      </div>

      {/* DANH SÁCH CHAT */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
        {conversations.length === 0 ? (
           <div className="text-center text-zinc-500 mt-10 text-xs hidden md:block">Chưa có tin nhắn</div>
        ) : (
          conversations.map((conv) => {
            const isActive = activeConversationId === conv.id;
            const isUnread = (conv.unreadCount || 0) > 0;

            return (
              <button
                key={conv.id}
                onClick={() => openChat(Number(conv.id))} // [FIX] Gọi openChat
                className={cn(
                  "w-full flex items-center p-2 rounded-2xl transition-all duration-200 group relative",
                  // Mobile: Căn giữa (Avatar). Desktop: Căn trái.
                  "justify-center md:justify-start",
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                )}
              >
                {/* AVATAR AREA */}
                <div className="relative shrink-0">
                  <img 
                    src={conv.partner.avatarUrl || `https://ui-avatars.com/api/?name=${conv.partner.fullname}&background=random`} 
                    alt={conv.partner.fullname}
                    className={cn(
                      "rounded-full object-cover border-2 transition-all",
                      // Kích thước Avatar
                      "w-12 h-12", 
                      isActive ? "border-white/20" : "border-transparent"
                    )}
                  />
                  {/* Online Dot */}
                  {conv.partner.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#121212] rounded-full"></span>
                  )}
                  
                  {/* Mobile Unread Dot: Chấm đỏ đè lên avatar khi màn hình nhỏ */}
                  {isUnread && (
                     <span className="md:hidden absolute top-0 right-0 w-3.5 h-3.5 bg-blue-500 border-2 border-[#121212] rounded-full animate-pulse"></span>
                  )}
                </div>

                {/* INFO AREA: Ẩn trên Mobile (hidden), Hiện trên Desktop (md:block) */}
                <div className="hidden md:block ml-3 flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={cn("font-semibold truncate text-sm", isUnread ? "text-white" : "text-zinc-300")}>
                      {conv.partner.fullname}
                    </span>
                    {conv.lastMessageAt && (
                      <span className="text-[10px] text-zinc-500 ml-2 shrink-0">
                        {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: false, locale: vi }).replace('khoảng ', '')}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                      <p className={cn("truncate text-xs max-w-[180px]", isUnread ? "text-white font-medium" : "text-zinc-500")}>
                      {conv.lastMessageContent 
                          ? (String(conv.lastSenderId) === String(user?.id) ? `Bạn: ${conv.lastMessageContent}` : conv.lastMessageContent)
                          : "Bắt đầu cuộc trò chuyện"}
                      </p>
                      {/* Desktop Unread Badge */}
                      {isUnread && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/50 ml-2">
                           <span className="text-[10px] font-bold text-white">
                             {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                           </span>
                        </div>
                      )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};