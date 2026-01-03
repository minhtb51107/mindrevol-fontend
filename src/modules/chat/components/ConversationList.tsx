import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { useChatStore } from '../store/useChatStore';
import { friendService, FriendshipResponse } from '@/modules/user/services/friend.service';
import { chatService } from '../services/chat.service';

export const ConversationList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { 
    conversations, 
    activeConversationId, 
    openChat 
  } = useChatStore();

  const [friendships, setFriendships] = useState<FriendshipResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Load danh sách bạn bè
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // friendService.getMyFriends đã được xác nhận tồn tại trong file bạn gửi
        const list = await friendService.getMyFriends({ page: 0, size: 100 });
        setFriendships(list);
      } catch (error) {
        console.error("Failed to fetch friends", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFriends();
  }, []);

  // 2. Merge logic
  const displayList = useMemo(() => {
    if (!friendships || friendships.length === 0) return [];

    let merged = friendships.map(friendshipItem => {
      const friendUser = friendshipItem.friend; 
      
      const existingConv = conversations.find(
        c => String(c.partner.id) === String(friendUser.id)
      );

      return {
        userId: friendUser.id,
        userInfo: friendUser,
        conversationId: existingConv ? existingConv.id : null,
        lastMessage: existingConv?.lastMessageContent || "Bắt đầu trò chuyện",
        lastMessageAt: existingConv?.lastMessageAt,
        unreadCount: existingConv?.unreadCount || 0,
        isSelfSender: existingConv ? String(existingConv.lastSenderId) === String(user?.id) : false
      };
    });

    merged.sort((a, b) => {
        const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
        return timeB - timeA; 
    });

    if (searchTerm.trim()) {
        merged = merged.filter(item => 
            item.userInfo.fullname.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return merged;
  }, [friendships, conversations, searchTerm, user?.id]);

  // 3. Handle Click
  const handleItemClick = async (item: any) => {
    if (item.conversationId) {
      openChat(item.conversationId); 
    } else {
      try {
        // chatService.getOrCreateConversation đã được xác nhận tồn tại
        const newConv = await chatService.getOrCreateConversation(item.userId);
        
        // Cập nhật store ngay lập tức thay vì reload trang
        // Giả sử API trả về Conversation object, ta có thể mở luôn
        if (newConv && newConv.id) {
           openChat(newConv.id);
           // Có thể cần fetch lại list conversations nếu muốn đồng bộ hoàn hảo
           // window.location.reload(); // Hoặc giữ reload nếu an toàn hơn
        } else {
           window.location.reload();
        }
      } catch (error) {
        console.error("Cannot create chat", error);
      }
    }
  };

  return (
    // [FIX]: w-full cho mobile, md:w-[350px] cho desktop
    <div className="flex flex-col h-full w-full md:w-[350px]">
      
      {/* HEADER */}
      <div className="h-16 shrink-0 flex items-center px-4 border-b border-white/5 justify-between gap-2">
        <div className="flex items-center gap-2">
            <button 
            onClick={() => navigate('/')} 
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
            title="Quay lại Trang chủ"
            >
            <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-white">Đoạn chat</h2>
        </div>
      </div>

      {/* SEARCH */}
      <div className="px-3 py-2">
          <div className="relative bg-white/5 rounded-xl">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
             <input 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Tìm kiếm bạn bè..."
               className="w-full bg-transparent border-none py-2 pl-9 pr-4 text-sm text-white focus:ring-0 placeholder:text-zinc-600"
             />
          </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
        {isLoading ? (
             <div className="text-center text-zinc-600 text-xs mt-10">Đang tải danh sách...</div>
        ) : displayList.length === 0 ? (
           <div className="text-center text-zinc-500 mt-10 text-xs">
             Chưa có bạn bè nào.<br/>Hãy kết bạn để bắt đầu trò chuyện.
           </div>
        ) : (
            displayList.map((item) => {
            const isActive = String(activeConversationId) === String(item.conversationId);
            const isUnread = item.unreadCount > 0;
            
            let messagePreview = item.lastMessage;
            if (item.conversationId && item.isSelfSender && item.lastMessageAt) {
                messagePreview = `Bạn: ${item.lastMessage}`;
            }

            return (
              <button
                key={item.userId}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "w-full flex items-center p-3 rounded-2xl transition-all duration-200 group relative",
                  "justify-start", // Luôn căn trái để hiện avatar + tên
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                )}
              >
                {/* AVATAR */}
                <div className="relative shrink-0">
                  <img 
                    src={item.userInfo.avatarUrl || `https://ui-avatars.com/api/?name=${item.userInfo.fullname}&background=random`} 
                    alt={item.userInfo.fullname}
                    className={cn(
                      "rounded-full object-cover border-2 transition-all w-12 h-12", 
                      isActive ? "border-white/20" : "border-transparent"
                    )}
                  />
                  {item.userInfo.isOnline && (
                     <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#121212] rounded-full"></span>
                  )}
                  {isUnread && (
                     <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-blue-500 border-2 border-[#121212] rounded-full animate-pulse"></span>
                  )}
                </div>

                {/* INFO */}
                <div className="block ml-3 flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={cn("font-semibold truncate text-sm", isUnread ? "text-white" : "text-zinc-300")}>
                      {item.userInfo.fullname}
                    </span>
                    {item.lastMessageAt && (
                      <span className="text-[10px] text-zinc-500 ml-2 shrink-0">
                        {formatDistanceToNow(new Date(item.lastMessageAt), { addSuffix: false, locale: vi }).replace('khoảng ', '')}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                      <p className={cn("truncate text-xs max-w-[180px]", isUnread ? "text-white font-medium" : "text-zinc-500")}>
                        {messagePreview}
                      </p>
                      {isUnread ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/50 ml-2">
                           <span className="text-[10px] font-bold text-white">
                             {item.unreadCount > 9 ? '9+' : item.unreadCount}
                           </span>
                        </div>
                      ) : null}
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