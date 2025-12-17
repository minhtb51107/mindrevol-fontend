// src/modules/chat/components/ConversationList.tsx
import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { chatService } from '../services/chat.service';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { Search } from 'lucide-react';

// Hàm tự xử lý thời gian (không cần cài date-fns)
function formatTimeAgo(dateString: string | undefined) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Vừa xong';
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}p`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

export const ConversationList = () => {
  const { user } = useAuth();
  const { 
    conversations, 
    activeConversationId, 
    setConversations, 
    openChat // Đảm bảo bạn đã update file useChatStore.ts có hàm này
  } = useChatStore();

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const res: any = await chatService.getConversations();
        setConversations(res);
      } catch (error) {
        console.error("Failed to load conversations", error);
      }
    };
    if (user) loadConversations();
  }, [user]);

  return (
    <div className="flex flex-col h-full bg-[#121212] text-white">
      {/* Header & Search */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Tin nhắn
        </h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            placeholder="Tìm kiếm..." 
            className="w-full bg-zinc-900 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center text-zinc-500 mt-10 text-sm px-4">
            Chưa có tin nhắn nào.<br/>Hãy kết bạn để bắt đầu trò chuyện.
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = activeConversationId === conv.id;
            const isUnread = (conv.unreadCount || 0) > 0;

            return (
              <div
                key={conv.id}
                onClick={() => openChat(conv.id)} // Gọi hàm mở Drawer
                className={`
                  flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                  ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                `}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img 
                    src={conv.partner.avatarUrl || '/default-avatar.png'} 
                    alt={conv.partner.fullname}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/5" 
                  />
                  {conv.partner.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#121212]"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`text-[15px] truncate pr-2 ${isUnread ? 'font-bold text-white' : 'font-medium text-zinc-200'}`}>
                      {conv.partner.fullname}
                    </h3>
                    <span className={`text-[11px] shrink-0 ${isUnread ? 'text-blue-400 font-bold' : 'text-zinc-600'}`}>
                      {formatTimeAgo(conv.lastMessageAt)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className={`text-sm truncate pr-2 ${isUnread ? 'text-white font-medium' : 'text-zinc-500'}`}>
                       {conv.lastSenderId === user?.id ? 'Bạn: ' : ''}
                       {conv.lastMessageContent || 'Bắt đầu trò chuyện'}
                    </p>
                    
                    {/* Badge unread count */}
                    {isUnread && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/50">
                        <span className="text-[10px] font-bold text-white">
                          {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};