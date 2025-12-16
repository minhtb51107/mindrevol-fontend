import React from 'react';
import { useChatStore } from '../store/useChatStore';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useAuth } from '@/modules/auth/store/AuthContext';

export const ConversationList = () => {
  const { conversations, activeConversationId, setActiveConversation, isSidebarOpen } = useChatStore();
  const { user } = useAuth();

  return (
    <div className={cn(
      "w-full md:w-80 border-r border-white/10 flex flex-col bg-[#121212] h-full",
      isSidebarOpen ? "block" : "hidden md:flex" // Responsive toggle
    )}>
      {/* Search Header */}
      <div className="p-4 border-b border-white/5 space-y-4">
        <h2 className="text-xl font-bold text-white">Đoạn chat</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input 
            placeholder="Tìm kiếm..." 
            className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {conversations.map(conv => (
          <div 
            key={conv.id}
            onClick={() => setActiveConversation(conv.id)}
            className={cn(
              "flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors relative",
              activeConversationId === conv.id ? "bg-white/10 border-l-4 border-blue-500" : "border-l-4 border-transparent"
            )}
          >
            {/* Avatar & Online Status */}
            <div className="relative shrink-0">
                <img src={conv.partner.avatarUrl || "/default-avatar.png"} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                {conv.partner.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#121212]"></div>
                )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h4 className={cn("text-sm truncate", conv.unreadCount > 0 ? "font-bold text-white" : "font-medium text-zinc-300")}>
                  {conv.partner.fullname}
                </h4>
                {/* Time */}
                <span className="text-[10px] text-zinc-500 shrink-0 ml-2">
                  {new Date(conv.lastMessageAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>

              <div className="flex justify-between items-center">
                {conv.isTyping ? (
                   <p className="text-xs text-blue-400 font-medium italic animate-pulse">Đang soạn tin...</p>
                ) : (
                   <p className={cn("text-xs truncate max-w-[180px]", conv.unreadCount > 0 ? "text-white font-bold" : "text-zinc-500")}>
                     {conv.lastSenderId === user?.id && "Bạn: "}{conv.lastMessageContent}
                   </p>
                )}
                
                {/* Badge */}
                {conv.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ml-2 shadow-lg shadow-blue-500/20">
                      {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                    </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};