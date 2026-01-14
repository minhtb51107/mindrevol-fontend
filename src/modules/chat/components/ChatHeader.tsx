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

  // Click outside để đóng menu
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
    // [UX] Dùng window.confirm đơn giản, sau này có thể thay bằng Custom Modal
    if (confirm(confirmMsg)) {
      action();
      // Không cần reload trang thủ công, logic trong useChat sẽ lo việc điều hướng hoặc update state
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

        {/* [THAY ĐỔI] Avatar click được -> Chuyển đến trang Profile */}
        <div className="relative group shrink-0">
           <UserAvatarLink 
              userId={partner.id} 
              avatarUrl={partner.avatarUrl} 
              fullname={partner.fullname}
              className="w-10 h-10 border-2 border-[#0a0a0a] rounded-full bg-zinc-800 hover:ring-2 hover:ring-offset-1 hover:ring-zinc-500 transition-all cursor-pointer"
           />
           {partner.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
           )}
        </div>
        
        {/* [THAY ĐỔI] Tên click được */}
        <div className="flex flex-col justify-center overflow-hidden">
          <Link 
            to={`/profile/${partner.id}`} 
            className="font-bold text-zinc-100 text-[16px] leading-tight tracking-wide cursor-pointer hover:underline transition-all truncate"
          >
              {partner.fullname}
          </Link>
          {partner.isOnline && <span className="text-xs text-green-500 font-medium">Đang hoạt động</span>}
        </div>
      </div>

      {/* Menu 3 chấm (Actions) */}
      <div className="relative" ref={menuRef}>
          <button 
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-full transition-all ${showMenu ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
          >
              <MoreHorizontal className="w-6 h-6" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 origin-top-right">
                  <div className="py-1">
                    <button 
                        onClick={() => handleAction(onUnfriend, `Bạn có chắc chắn muốn hủy kết bạn với ${partner.fullname}?`)}
                        className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-colors"
                    >
                        <UserX className="w-4 h-4 text-zinc-400" /> 
                        <span>Hủy kết bạn</span>
                    </button>
                    
                    <div className="h-[1px] bg-white/5 mx-2 my-1"></div>
                    
                    <button 
                        onClick={() => handleAction(onBlock, `Bạn có chắc chắn muốn chặn ${partner.fullname}? Họ sẽ không thể nhắn tin cho bạn nữa.`)}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors"
                    >
                        <Ban className="w-4 h-4" /> 
                        <span>Chặn người này</span>
                    </button>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};