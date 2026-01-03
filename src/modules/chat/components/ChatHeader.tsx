import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, UserX, Ban, ChevronLeft } from 'lucide-react'; 
import { UserSummary } from '../types';
import { useChatStore } from '../store/useChatStore';
import { Link } from 'react-router-dom'; // [MỚI] Import Link
import { UserAvatarLink } from '@/components/ui/UserAvatarLink'; // [MỚI] Import UserAvatarLink

interface ChatHeaderProps {
  partner: UserSummary;
  onBlock: () => void;
  onUnfriend: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ partner, onBlock, onUnfriend }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { openChat } = useChatStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (action: () => void, confirmMsg: string) => {
    if (confirm(confirmMsg)) {
      action();
      window.location.reload(); 
    }
    setShowMenu(false);
  };

  return (
    <div className="h-[72px] absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-6 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-3">
        
        {/* Nút Back cho Mobile */}
        <button 
           onClick={() => openChat(null)} 
           className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white"
        >
           <ChevronLeft className="w-6 h-6" />
        </button>

        {/* [THAY ĐỔI] Avatar click được */}
        <div className="relative group">
           <UserAvatarLink 
              userId={partner.id} 
              avatarUrl={partner.avatarUrl} 
              fullname={partner.fullname}
              className="w-10 h-10 border-2 border-[#0a0a0a] rounded-full bg-zinc-800 hover:ring-2 hover:ring-offset-1 hover:ring-zinc-500 transition-all"
           />
           {partner.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
           )}
        </div>
        
        {/* [THAY ĐỔI] Tên click được */}
        <div className="flex flex-col justify-center">
          <Link 
            to={`/profile/${partner.id}`} 
            className="font-bold text-zinc-100 text-[16px] leading-tight tracking-wide cursor-pointer hover:underline transition-all"
          >
              {partner.fullname}
          </Link>
          {partner.isOnline && <span className="text-xs text-green-500 font-medium">Đang hoạt động</span>}
        </div>
      </div>

      {/* Menu 3 chấm */}
      <div className="relative" ref={menuRef}>
          <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-full transition-all"
          >
              <MoreHorizontal className="w-6 h-6" />
          </button>

          {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 origin-top-right">
                  <button 
                      onClick={() => handleAction(onUnfriend, `Hủy kết bạn với ${partner.fullname}?`)}
                      className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 flex items-center gap-2 transition-colors"
                  >
                      <UserX className="w-4 h-4" /> Hủy kết bạn
                  </button>
                  <div className="h-[1px] bg-white/5 mx-2"></div>
                  <button 
                      onClick={() => handleAction(onBlock, `Chặn ${partner.fullname}?`)}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                  >
                      <Ban className="w-4 h-4" /> Chặn người này
                  </button>
              </div>
          )}
      </div>
    </div>
  );
};