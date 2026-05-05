import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, HelpCircle, Home, Flame, Box, MessageCircle, User, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DesktopHeaderProps {
  isSidebarExpanded: boolean;
  onNotificationClick: () => void;
  totalUnread?: number;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  onNotificationClick,
  totalUnread = 0
}) => {
  const location = useLocation();

  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/') return { title: 'Feed', icon: Home };
    if (path.startsWith('/streak')) return { title: 'Streaks', icon: Flame };
    if (path.startsWith('/box')) return { title: 'Box cá nhân', icon: Box };
    if (path.startsWith('/chat')) return { title: 'Tin nhắn', icon: MessageCircle };
    if (path.startsWith('/profile')) return { title: 'Hồ sơ', icon: User };
    return { title: 'MindRevol', icon: Hash };
  };

  const { title, icon: Icon } = getPageInfo();

  return (
    <div className={cn(
      "fixed top-0 left-[72px] right-0 h-[36px] z-[60] hidden md:flex items-center justify-between px-5 transition-all duration-300 ease-in-out",
      "bg-zinc-50 dark:bg-[#09090b]" 
    )}>
      <div className="flex-1"></div>

      <div className="font-bold text-[0.9rem] tracking-wide text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-2">
         <Icon size={18} className="text-zinc-500 dark:text-zinc-400" strokeWidth={2.5} />
         {title}
      </div>

      <div className="flex-1 flex justify-end items-center gap-3">
        <button
           className="p-1 text-zinc-400 hover:text-black dark:text-zinc-500 dark:hover:text-white transition-all active:scale-95"
           title="Trợ giúp"
        >
           <HelpCircle size={20} strokeWidth={2.5} />
        </button>

        <button
           onClick={onNotificationClick}
           className="relative p-1 text-zinc-400 hover:text-black dark:text-zinc-500 dark:hover:text-white transition-all active:scale-95"
           title="Thông báo"
        >
           <Bell size={20} strokeWidth={2.5} />
           {totalUnread > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#09090b]"></span>
           )}
        </button>
      </div>
    </div>
  );
};