import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, MessageCircle, User, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

// Định nghĩa Props mà view này cần
interface MobileNavProps {
  onJourneyClick: () => void;
  triggerUpload: () => void;
  totalUnread: number;
  hasJourneyAlerts: boolean;
}

export const MobileBottomNav: React.FC<MobileNavProps> = ({ 
  onJourneyClick, 
  triggerUpload, 
  totalUnread, 
  hasJourneyAlerts 
}) => {
  return (
    <div className={cn(
      "fixed z-50 bottom-0 left-0 w-full block md:hidden", // Chỉ hiện mobile
      "h-[90px] bg-gradient-to-t from-black via-[#121212] to-transparent",
      "flex items-end justify-center pb-4",
      "pointer-events-none"
    )}>
      <div className="flex items-center justify-between w-full max-w-[360px] px-6 pointer-events-auto bg-[#1a1a1a]/90 backdrop-blur-md border border-white/5 rounded-full py-2 shadow-2xl">
        
        {/* Home */}
        <NavButton to="/" icon={Home} />
        
        {/* Journey */}
        <button onClick={onJourneyClick} className="group relative w-10 h-10 flex items-center justify-center">
           <Map className="w-6 h-6 text-zinc-500 group-hover:text-blue-400 transition-colors" />
           {hasJourneyAlerts && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-[#1a1a1a]" />}
        </button>

        {/* Upload Button (Nổi bật) */}
        <button
          onClick={triggerUpload}
          className="w-12 h-12 -mt-8 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-[#121212]"
        >
          <Camera strokeWidth={2.5} className="w-6 h-6" />
        </button>

        {/* Chat */}
        <NavButton to="/chat" icon={MessageCircle} isChat hasUnread={totalUnread > 0} />
        
        {/* Profile */}
        <NavButton to="/profile" icon={User} />
      </div>
    </div>
  );
};

// Helper Component nhỏ cho nút (để file gọn hơn)
const NavButton = ({ to, icon: Icon, isChat, hasUnread }: any) => (
  <NavLink to={to} className="relative p-2 text-zinc-500 hover:text-zinc-200 transition-colors">
    {({ isActive }) => (
      <>
        <Icon strokeWidth={isActive ? 2.5 : 2} className={cn("w-6 h-6", isActive && "text-blue-400")} />
        {isActive && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />}
        {isChat && hasUnread && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#1a1a1a]" />}
      </>
    )}
  </NavLink>
);