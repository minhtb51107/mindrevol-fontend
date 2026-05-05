import React from 'react';
import { X, User, ChevronRight, Pin, Bell, BellOff, Trash2, UserX, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ChatInfoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isGroup: boolean;
  members: any[];
  isLoadingMembers: boolean;
  partner: any;
  activeConv: any;
  onTogglePin: () => void;
  onToggleMute: () => void;
  onHideConversation: () => void;
  onUnfriend: () => void;
  onBlock: () => void;
}

export const ChatInfoSidebar: React.FC<ChatInfoSidebarProps> = ({
  isOpen, onClose, isGroup, members, isLoadingMembers, partner, activeConv,
  onTogglePin, onToggleMute, onHideConversation, onUnfriend, onBlock
}) => {
  const navigate = useNavigate();

  const handleNavigateProfile = (userId: string) => {
    if (userId) {
      navigate(`/profile/${userId}`);
      if (window.innerWidth < 768) onClose();
    }
  };

  return (
    <div className={cn(
      "absolute right-0 top-0 h-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-l border-[#E1DDE8] dark:border-zinc-800 transition-transform duration-300 ease-in-out z-40 w-full md:w-[300px] shadow-2xl md:shadow-none flex flex-col",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      {/* ĐÃ SỬA THÀNH h-[76px] ĐỂ ĐỒNG BỘ CUT-LINE VỚI CHAT HEADER & CONVERSATION LIST */}
      <div className="h-[76px] px-5 border-b border-[#E1DDE8] dark:border-zinc-800 flex justify-between items-center shrink-0">
        <h3 className="font-jua text-xl text-zinc-800 dark:text-white">
          Thông tin
        </h3>
        <button onClick={onClose} className="p-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-zinc-500 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 pb-8">
        {/* KHU VỰC THÔNG TIN */}
        {isGroup ? (
          <div className="mb-6 mt-2">
            <h4 className="font-jua text-lg text-zinc-800 dark:text-zinc-100 mb-2 px-2">Thành viên ({members.length})</h4>
            <div className="space-y-0.5">
              {isLoadingMembers ? (
                <div className="py-4 text-center text-zinc-400 text-sm font-semibold">Đang tải...</div>
              ) : (
                members.map((m: any) => {
                  const userInfo = m.user || m;
                  const userId = userInfo.id || userInfo.userId || m.userId;
                  const fullname = userInfo.fullname || "Người dùng";
                  const handle = userInfo.handle || userInfo.username || "user";
                  const avatar = userInfo.avatarUrl || userInfo.avatar;

                  return (
                    <div key={m.id || userId} onClick={() => handleNavigateProfile(userId)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer transition-all active:scale-[0.98] group">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-100 dark:border-zinc-700 shrink-0">
                        <img src={avatar || `https://ui-avatars.com/api/?name=${fullname}&background=random`} alt={fullname} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[14px] text-zinc-800 dark:text-zinc-100 truncate leading-tight">{fullname}</p>
                        <p className="text-[11px] font-semibold text-zinc-400 truncate uppercase tracking-tight">@{handle}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 px-2 mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-white dark:border-zinc-800 shadow-md">
              <img src={partner?.avatarUrl || `https://ui-avatars.com/api/?name=${partner?.fullname}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <h4 className="font-jua text-xl text-zinc-800 dark:text-white mb-0.5">{partner?.fullname}</h4>
            <p className="text-[12px] font-bold text-zinc-400 mb-6 uppercase">@{partner?.handle || 'user'}</p>

            <button onClick={() => handleNavigateProfile(partner?.id)} className="w-full flex items-center gap-3 p-2.5 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
              <div className="w-9 h-9 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-500 shadow-sm"><User className="w-4 h-4" /></div>
              <span className="font-bold text-sm text-zinc-700 dark:text-zinc-200">Trang cá nhân</span>
              <ChevronRight className="w-4 h-4 text-zinc-300 ml-auto" />
            </button>
          </div>
        )}

        <div className="h-px bg-[#E1DDE8]/60 dark:bg-zinc-800 my-4 mx-2" />

        {/* KHU VỰC TÙY CHỌN */}
        <div className="space-y-1 px-1">
          <h4 className="font-jua text-[15px] text-zinc-500 dark:text-zinc-400 mb-2 px-2 uppercase tracking-wide">Tùy chọn</h4>
          
          <button onClick={onTogglePin} className="w-full flex items-center gap-3 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-xl transition-all font-bold text-[14px] text-zinc-700 dark:text-zinc-200">
            <Pin className="w-4 h-4 text-zinc-400" />
            {activeConv?.isPinned ? 'Bỏ ghim hội thoại' : 'Ghim hội thoại'}
          </button>
          
          <button onClick={onToggleMute} className="w-full flex items-center gap-3 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-xl transition-all font-bold text-[14px] text-zinc-700 dark:text-zinc-200">
            {activeConv?.isMuted ? <Bell className="w-4 h-4 text-zinc-400" /> : <BellOff className="w-4 h-4 text-zinc-400" />}
            {activeConv?.isMuted ? 'Bật thông báo' : 'Tắt thông báo'}
          </button>

          {!isGroup && (
            <button onClick={() => { if(confirm(`Hủy kết bạn với ${partner?.fullname}?`)) onUnfriend(); }} className="w-full flex items-center gap-3 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-xl transition-all font-bold text-[14px] text-zinc-700 dark:text-zinc-200">
              <UserX className="w-4 h-4 text-zinc-400" /> Hủy kết bạn
            </button>
          )}

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2 mx-2" />

          <button onClick={() => { if(confirm('Bạn có chắc chắn muốn xóa đoạn chat này?')) onHideConversation(); }} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-bold text-[14px] text-red-500 dark:text-red-400">
            <Trash2 className="w-4 h-4" /> Xóa đoạn chat
          </button>

          {!isGroup && (
            <button onClick={() => { if(confirm(`Chặn ${partner?.fullname}? Lịch sử trò chuyện vẫn sẽ được giữ lại.`)) onBlock(); }} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-bold text-[14px] text-red-500 dark:text-red-400">
              <Ban className="w-4 h-4" /> Chặn người này
            </button>
          )}
        </div>
      </div>
    </div>
  );
};