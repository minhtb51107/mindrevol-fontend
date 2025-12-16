import React, { useState } from 'react';
import { Search, Edit } from 'lucide-react';
import { Conversation } from '../types';
import { cn } from '@/lib/utils';

interface ChatListProps {
  conversations: Conversation[];
  activeConvId: number | null;
  onSelect: (convId: number) => void;
  onlineUsers: number[]; // Danh sách ID user đang online
}

export const ChatList: React.FC<ChatListProps> = ({ conversations, activeConvId, onSelect, onlineUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc hội thoại theo tên
  const filteredConvs = conversations.filter(c => 
    c.partner.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-black border-r border-white/10 w-full md:w-[350px]">
      {/* 1. Header & Search */}
      <div className="p-4 pb-2">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-xl font-bold text-white">Đoạn chat</h2>
          <button className="text-white hover:bg-white/10 p-2 rounded-full"><Edit className="w-5 h-5"/></button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm..." 
            className="w-full bg-[#262626] rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20"
          />
        </div>
      </div>

      {/* 2. Active Friends (Instagram Style) */}
      <div className="px-4 py-2 overflow-x-auto no-scrollbar flex gap-4 border-b border-white/5">
        {conversations.filter(c => c.partner.isOnline).map(c => (
          <div key={c.partner.id} className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer" onClick={() => onSelect(c.id)}>
            <div className="relative">
              <img src={c.partner.avatarUrl} className="w-12 h-12 rounded-full object-cover border border-white/10" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <span className="text-[10px] text-zinc-400 truncate w-14 text-center">
              {c.partner.fullname.split(' ').pop()}
            </span>
          </div>
        ))}
      </div>

      {/* 3. Conversation List */}
      <div className="flex-1 overflow-y-auto mt-2">
        {filteredConvs.map(conv => (
          <div 
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/5",
              activeConvId === conv.id ? "bg-white/10" : ""
            )}
          >
            <div className="relative shrink-0">
                <img src={conv.partner.avatarUrl} className="w-12 h-12 rounded-full object-cover" />
                {conv.partner.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black"></div>
                )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={cn("text-sm truncate", conv.unreadCount > 0 ? "font-bold text-white" : "font-normal text-zinc-200")}>
                {conv.partner.fullname}
              </h4>
              <div className="flex items-center gap-1">
                <p className={cn("text-xs truncate max-w-[180px]", conv.unreadCount > 0 ? "text-white font-bold" : "text-zinc-500")}>
                  {conv.lastSenderId === 1 ? "Bạn: " : ""}{conv.lastMessageContent} {/* ID=1 là ví dụ, thay bằng user.id */}
                </p>
                <span className="text-zinc-600 text-[10px]">• 15p</span>
              </div>
            </div>

            {/* Badge Unread */}
            {conv.unreadCount > 0 && (
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};