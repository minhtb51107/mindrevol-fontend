import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Compass, Box, MessageCircle, Map as MapIcon, 
  Bell, PlusSquare, User, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DesktopSidebarProps {
  onJourneyClick?: () => void;
  triggerUpload?: () => void;
  totalUnread?: number;
  hasJourneyAlerts?: boolean;
  isExpanded: boolean;
  toggleSidebar: () => void;
  onNotificationClick: () => void;
  isNotificationOpen: boolean;
  onSettingsClick?: () => void; // [THÊM MỚI]
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  onJourneyClick,
  triggerUpload,
  totalUnread = 0,
  hasJourneyAlerts = false,
  isExpanded,
  toggleSidebar,
  onNotificationClick,
  isNotificationOpen,
  onSettingsClick // [THÊM MỚI]
}) => {
  return (
    <div className={cn(
      "fixed z-50 top-0 left-0 h-full transition-all duration-300 ease-in-out",
      "bg-transparent border-r border-white/10", 
      "flex flex-col py-8",
      isExpanded ? "w-[260px] px-6" : "w-[80px] px-3", 
      "hidden md:flex" 
    )}>
      
      {/* Nút Kéo ra / Thu vào */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3.5 top-12 w-7 h-7 bg-[#121212] border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all z-50 shadow-lg"
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* 1. Tên nền tảng */}
      <div className={cn("mb-5 transition-all flex items-center", isExpanded ? "px-2 justify-start" : "justify-center")}>
        <span className="text-[22px] font-extrabold text-white tracking-wide drop-shadow-md select-none">
          {isExpanded ? "MindRevol" : "M."}
        </span>
      </div>

      <div className="w-full h-px bg-white/10 mb-6 shrink-0" />

      {/* 2. Menu Items */}
      <div className="flex-1 flex flex-col gap-1">
        <DesktopNavItem to="/" icon={Home} label="Trang chủ" isExpanded={isExpanded} />
        
        <button 
          onClick={onJourneyClick}
          title={!isExpanded ? "Hành trình" : undefined}
          className={cn(
            "flex items-center rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group relative bg-transparent",
            isExpanded ? "w-full gap-4 px-3 py-3.5 justify-start" : "w-full px-0 py-3.5 justify-center"
          )}
        >
          <Compass className="w-[26px] h-[26px] transition-transform group-hover:scale-110 drop-shadow-sm shrink-0" strokeWidth={2} />
          {isExpanded && <span className="font-medium text-[15px] drop-shadow-sm whitespace-nowrap">Hành trình</span>}
          {hasJourneyAlerts && (
            <span className={cn("absolute bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]", isExpanded ? "right-4 w-2 h-2" : "top-3 right-[14px] w-2 h-2")} />
          )}
        </button>

        <DesktopNavItem to="/box" icon={Box} label="Box" isExpanded={isExpanded} />
        <DesktopNavItem to="/chat" icon={MessageCircle} label="Tin nhắn" badge={totalUnread} isExpanded={isExpanded} />
        <DesktopNavItem to="/map" icon={MapIcon} label="Bản đồ" isExpanded={isExpanded} />
        
        <button 
          onClick={onNotificationClick}
          title={!isExpanded ? "Thông báo" : undefined}
          className={cn(
            "flex items-center rounded-2xl transition-all relative group bg-transparent",
            isExpanded ? "w-full gap-4 px-3 py-3.5 justify-start" : "w-full px-0 py-3.5 justify-center",
            isNotificationOpen ? "text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Bell className={cn("w-[26px] h-[26px] transition-transform drop-shadow-sm shrink-0", isNotificationOpen ? "scale-105" : "group-hover:scale-110")} strokeWidth={isNotificationOpen ? 2.5 : 2} />
          {isExpanded && <span className={cn("text-[15px] drop-shadow-sm whitespace-nowrap", isNotificationOpen ? "font-bold" : "font-medium")}>Thông báo</span>}
        </button>

        <button 
            onClick={triggerUpload}
            title={!isExpanded ? "Đăng bài" : undefined}
            className={cn(
                "flex items-center rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group bg-transparent",
                isExpanded ? "w-full gap-4 px-3 py-3.5 justify-start" : "w-full px-0 py-3.5 justify-center"
            )}
        >
            <PlusSquare className="w-[26px] h-[26px] transition-transform group-hover:scale-110 drop-shadow-sm shrink-0" strokeWidth={2} />
            {isExpanded && <span className="font-medium text-[15px] drop-shadow-sm whitespace-nowrap">Đăng</span>}
        </button>

        <DesktopNavItem to="/profile" icon={User} label="Cá nhân" isExpanded={isExpanded} />
      </div>

      {/* 3. Cài đặt */}
      <div className="mt-auto pt-4 shrink-0 border-t border-white/10">
        {/* [SỬA LẠI] Đổi từ NavLink sang thẻ button gọi Modal */}
        <button 
          onClick={onSettingsClick}
          title={!isExpanded ? "Cài đặt" : undefined}
          className={cn(
            "flex items-center rounded-2xl transition-all relative group bg-transparent w-full",
            isExpanded ? "px-3 py-3.5 gap-4 justify-start" : "px-0 py-3.5 justify-center",
            "text-zinc-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings className={cn("w-[26px] h-[26px] transition-transform drop-shadow-sm shrink-0 group-hover:scale-110")} strokeWidth={2} />
          {isExpanded && <span className="text-[15px] drop-shadow-sm whitespace-nowrap font-medium">Cài đặt</span>}
        </button>
      </div>
    </div>
  );
};

// Component cũ giữ nguyên
const DesktopNavItem = ({ to, icon: Icon, label, badge, isExpanded }: any) => (
    <NavLink 
      to={to} 
      title={!isExpanded ? label : undefined}
      className={({ isActive }) => cn(
        "flex items-center rounded-2xl transition-all relative group bg-transparent",
        isExpanded ? "px-3 py-3.5 gap-4 justify-start" : "px-0 py-3.5 justify-center",
        isActive ? "text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
      )}
    >
      {({ isActive }) => (
        <>
          <Icon className={cn("w-[26px] h-[26px] transition-transform drop-shadow-sm shrink-0", isActive ? "scale-105" : "group-hover:scale-110")} strokeWidth={isActive ? 2.5 : 2} />
          {isExpanded && <span className={cn("text-[15px] drop-shadow-sm whitespace-nowrap", isActive ? "font-bold" : "font-medium")}>{label}</span>}
          {badge > 0 && isExpanded && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">{badge > 99 ? '99+' : badge}</span>}
          {badge > 0 && !isExpanded && <span className="absolute top-3 right-[14px] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
        </>
      )}
    </NavLink>
);