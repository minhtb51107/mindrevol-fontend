import React, { useState } from 'react';
import { Users, PanelLeft, ArrowLeft, Search, Info, Video, Phone } from 'lucide-react'; 
import { useChatStore } from '../store/useChatStore';
import { useNavigate } from 'react-router-dom'; 
import { UserAvatarLink } from '@/components/ui/UserAvatarLink'; 
import { SearchMessageModal } from './SearchMessageModal';

import { http } from '@/lib/http';
import { useCallStore } from '@/modules/call/store/useCallStore';
import toast from 'react-hot-toast';

interface ChatHeaderProps {
  partner: any; 
  isSidebarOpen?: boolean; 
  toggleSidebar?: () => void; 
  onBackMobile?: () => void; 
  onToggleInfo?: () => void; 
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  partner, isSidebarOpen, toggleSidebar, onBackMobile, onToggleInfo 
}) => {
  const navigate = useNavigate();
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  const { conversations, activeConversationId, closeChat } = useChatStore(); 
  const { setOutgoingCall } = useCallStore();

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const isGroup = !!activeConversation?.boxId;

  const handleStartCall = async (type: 'video' | 'voice') => {
    if (isGroup) {
        toast.error("Gọi nhóm đang được phát triển.");
        return;
    }
    if (!partner?.id || !activeConversationId) return;

    try {
        // TRUYỀN THÊM conversationId XUỐNG BACKEND ĐỂ LƯU LỊCH SỬ
        const res = await http.post(`/calls/signaling/initiate?receiverId=${partner.id}&type=${type}&conversationId=${activeConversationId}`);
        const session = res.data?.data || res.data;

        setOutgoingCall({
            roomId: session.roomId,
            name: partner.fullname,
            avatar: partner.avatarUrl,
            callType: type
        });
    } catch (error: any) {
        console.error("Call error:", error);
        toast.error(error.response?.data?.message || "Người dùng đang bận hoặc không thể gọi lúc này.");
    }
  };

  return (
    <>
      <div className="h-[76px] w-full px-4 md:px-6 flex items-center justify-between bg-white/70 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-[#E1DDE8] dark:border-zinc-800 shrink-0 z-20 transition-colors">
        
        <div className="flex items-center gap-3 min-w-0">
            {onBackMobile && (
                <button onClick={() => { closeChat(); onBackMobile(); }} className="md:hidden w-10 h-10 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-600 dark:text-zinc-200 transition-transform active:scale-95 shadow-sm border border-transparent dark:border-zinc-700">
                    <ArrowLeft className="w-5 h-5" />
                </button>
            )}

            {!isSidebarOpen && toggleSidebar && (
                <button onClick={toggleSidebar} className="hidden md:flex w-10 h-10 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 items-center justify-center shrink-0 text-zinc-600 dark:text-zinc-200 transition-transform active:scale-95 shadow-sm border border-transparent dark:border-zinc-700" title="Mở danh sách">
                    <PanelLeft className="w-5 h-5" />
                </button>
            )}

            <div className="relative shrink-0 ml-1">
                {isGroup ? (
                    <div className="w-11 h-11 bg-[#F0EFF5] dark:bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden border border-[#E1DDE8] dark:border-zinc-700 shadow-sm">
                        {activeConversation?.boxAvatar ? (
                            activeConversation.boxAvatar.startsWith('http') ? <img src={activeConversation.boxAvatar} alt="Box Avatar" className="w-full h-full object-cover" /> : <span className="text-xl">{activeConversation.boxAvatar}</span>
                        ) : <Users className="w-5 h-5 text-[#756A91] dark:text-zinc-400" />}
                    </div>
                ) : (
                    <UserAvatarLink userId={partner?.id} avatarUrl={partner?.avatarUrl} fullname={partner?.fullname || "Người dùng"} className="w-11 h-11 rounded-full object-cover border border-[#E1DDE8] dark:border-zinc-700 shadow-sm block overflow-hidden" />
                )}
                {partner?.isOnline && !isGroup && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-[2.5px] border-white dark:border-[#121212]" />}
            </div>

            <div 
              className="flex flex-col flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity pl-1"
              onClick={() => { if(!isGroup && partner?.id) navigate(`/profile/${partner.id}`) }}
            >
                {isGroup ? (
                    <>
                        <span className="font-bold text-zinc-800 dark:text-zinc-100 text-[17px] leading-tight truncate" style={{ fontFamily: '"Jua", sans-serif' }}>{activeConversation?.boxName || "Không gian chung"}</span>
                        <span className="text-[12px] font-semibold text-[#9288AD] dark:text-zinc-500 mt-0.5 truncate">Nhóm trò chuyện</span>
                    </>
                ) : (
                    <>
                        <span className="font-bold text-zinc-800 dark:text-zinc-100 text-[17px] leading-tight truncate" style={{ fontFamily: '"Jua", sans-serif' }}>{partner?.fullname}</span>
                        <span className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400 truncate lowercase" style={{ fontFamily: '"Nunito", sans-serif' }}>
                            @{partner?.handle || partner?.fullname?.replace(/\s/g, '').toLowerCase() || 'user'}
                        </span>
                    </>
                )}
            </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pl-4">
            <button 
                onClick={() => handleStartCall('voice')} 
                className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-300 transition-colors active:scale-95 shadow-sm border border-[#E1DDE8]/50 dark:border-zinc-700" 
                title="Gọi thoại"
            >
                <Phone className="w-[18px] h-[18px]" />
            </button>

            <button 
                onClick={() => handleStartCall('video')} 
                className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-300 transition-colors active:scale-95 shadow-sm border border-[#E1DDE8]/50 dark:border-zinc-700" 
                title="Gọi video"
            >
                <Video className="w-[18px] h-[18px]" />
            </button>

            <button onClick={() => setShowSearchModal(true)} className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-300 transition-colors active:scale-95 shadow-sm border border-[#E1DDE8]/50 dark:border-zinc-700" title="Tìm kiếm tin nhắn">
                <Search className="w-[18px] h-[18px]" />
            </button>

            <button 
              onClick={onToggleInfo} 
              className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-300 transition-colors active:scale-95 shadow-sm border border-[#E1DDE8]/50 dark:border-zinc-700" 
              title="Thông tin hội thoại"
            >
                {isGroup ? <Users className="w-[18px] h-[18px]" /> : <Info className="w-[18px] h-[18px]" />}
            </button>
        </div>
      </div>

      {activeConversationId && (
        <SearchMessageModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} conversationId={activeConversationId} />
      )}
    </>
  );
};