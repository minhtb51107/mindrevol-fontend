import React, { useRef, useMemo, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, MessageCircle, User, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/modules/chat/store/useChatStore';

import { journeyService } from "@/modules/journey/services/journey.service";

interface SidebarProps {
  onCheckinClick: (file: File) => void;
  onJourneyClick: () => void;
  // [OPTIONAL] Nếu bác muốn trigger reload alert từ bên ngoài thì thêm prop này
  refreshTrigger?: number; 
}

export const Sidebar: React.FC<SidebarProps> = ({ onCheckinClick, onJourneyClick, refreshTrigger }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. LOGIC CHAT (Cũ) ---
  const conversations = useChatStore((state) => state.conversations);
  const totalUnread = useMemo(() => {
    return conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
  }, [conversations]);

  // --- 2. LOGIC JOURNEY ALERTS (Mới) ---
  const [hasJourneyAlerts, setHasJourneyAlerts] = useState(false);

  // Hàm check alert
  const checkJourneyAlerts = async () => {
    try {
      // Gọi service lấy thông tin alert
      const data = await journeyService.getAlerts();
      // Có alert nếu: Có lời mời chờ (pending) HOẶC Có yêu cầu duyệt (requests)
      const hasAlert = (data.journeyPendingInvitations > 0) || (data.waitingApprovalRequests > 0);
      setHasJourneyAlerts(hasAlert);
    } catch (error) {
      console.error("Failed to check journey alerts", error);
    }
  };

  // Check mỗi khi component mount hoặc khi có trigger refresh
  useEffect(() => {
    checkJourneyAlerts();
    
    // [Tuỳ chọn] Bác có thể set interval để auto check mỗi 30s
    const interval = setInterval(checkJourneyAlerts, 30000);
    return () => clearInterval(interval);
  }, [refreshTrigger]);


  // --- HANDLER UPLOAD ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCheckinClick(file);
    }
    e.target.value = ''; 
  };

  return (
    <div className={cn(
      "fixed z-50 bottom-0 left-0 w-full",
      "h-[100px] bg-gradient-to-t from-black via-black/80 to-transparent",
      "flex items-end justify-center pb-5 md:pb-6",
      "pointer-events-none"
    )}>
      
      <div className="flex items-center justify-between w-full max-w-[360px] px-4 pointer-events-auto">
        
        {/* 1. HOME */}
        <NavButton to="/" icon={Home} />
        
        {/* 2. JOURNEYS (Đã sửa) */}
        <button
          onClick={onJourneyClick}
          className="group w-12 h-12 flex flex-col items-center justify-center outline-none relative" // Thêm relative
        >
           <div className="text-zinc-500 transition-colors duration-300 group-hover:text-zinc-200">
             <Map strokeWidth={2} className="w-6 h-6" />
           </div>

           {/* [NEW] Dấu chấm đỏ thông báo cho Hành trình */}
           {hasJourneyAlerts && (
             <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-black animate-pulse" />
           )}
        </button>

        {/* 3. CAMERA */}
        <div className="mx-2 mb-1">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center",
              "bg-white text-black",
              "shadow-[0_4px_20px_rgba(255,255,255,0.15)]",
              "hover:scale-105 active:scale-95 transition-transform duration-200",
              "border-4 border-black/50 bg-clip-padding"
            )}
          >
            <Camera strokeWidth={2.5} className="w-6 h-6" />
          </button>
        </div>

        {/* 4. CHAT */}
        <NavButton 
          to="/chat" 
          icon={MessageCircle} 
          isChat 
          hasUnread={totalUnread > 0} 
        />

        {/* 5. PROFILE */}
        <NavButton to="/profile" icon={User} />

      </div>
    </div>
  );
};

// Helper Component (Giữ nguyên)
const NavButton = ({ to, icon: Icon, isChat, hasUnread }: any) => (
  <NavLink
    to={to}
    className="group w-12 h-12 flex flex-col items-center justify-center outline-none relative" 
  >
    {({ isActive }) => (
      <>
        <div className={cn(
          "transition-colors duration-300",
          isActive 
            ? "text-white" 
            : "text-zinc-500 group-hover:text-zinc-300"
        )}>
          <Icon strokeWidth={2} className="w-6 h-6" />
        </div>

        <div className={cn(
          "absolute bottom-1 w-1 h-1 rounded-full bg-white transition-all duration-300",
          isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
        )} />

        {isChat && hasUnread && (
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-orange-500 border-2 border-black" />
        )}
      </>
    )}
  </NavLink>
);