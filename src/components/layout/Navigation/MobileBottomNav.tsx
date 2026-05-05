// File: src/components/layout/Navigation/MobileBottomNav.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Camera, Box, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  onJourneyClick?: () => void; 
  triggerUpload: () => void;
  totalUnread?: number; 
  hasJourneyAlerts: boolean;
}

export const MobileBottomNav: React.FC<MobileNavProps> = ({ 
  triggerUpload, 
  hasJourneyAlerts 
}) => {
  return (
    <div className={cn(
      "fixed z-[100] bottom-0 left-0 w-full block md:hidden pointer-events-none",
      "flex items-end justify-center pb-4 pt-12" // Tăng pt-12 để phần mờ vuốt lên dài hơn
    )}>
      
      {/* Lớp nền blur gradient mượt mà (không viền) */}
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#121212] dark:via-[#121212]/80 backdrop-blur-md pointer-events-none"
        style={{ 
          WebkitMaskImage: 'linear-gradient(to top, black 50%, transparent 100%)', 
          maskImage: 'linear-gradient(to top, black 50%, transparent 100%)' 
        }}
      />

      <div className="flex items-center justify-between w-full max-w-[360px] px-6 pointer-events-auto relative z-10">
        
        <NavButton to="/" icon={Home} />
        <NavButton to="/box" icon={Box} />

        <button
          onClick={triggerUpload}
          className={cn(
            "relative flex items-center justify-center w-14 h-14 rounded-full",
            "bg-white dark:bg-[#121212]",
            "border border-zinc-200 dark:border-zinc-800 shadow-sm",
            "hover:scale-105 active:scale-95 transition-all"
          )}
        >
          <div className={cn(
            "w-[42px] h-[42px] flex items-center justify-center rounded-full",
            "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
          )}>
            <Camera strokeWidth={2} className="w-5 h-5" />
          </div>
        </button>

        <NavLink 
          to="/journeys/grid"
          className="relative p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors group"
        >
          {({ isActive }) => (
            <>
              <LayoutGrid 
                strokeWidth={isActive ? 2.5 : 2} 
                className={cn("w-6 h-6 transition-transform", isActive ? "text-zinc-900 dark:text-white scale-110" : "group-hover:scale-110")} 
              />
              {hasJourneyAlerts && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-[#121212]" />
              )}
              {isActive && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-zinc-900 dark:bg-white rounded-full" />
              )}
            </>
          )}
        </NavLink>

        <NavButton to="/profile" icon={User} />
      </div>
    </div>
  );
};

const NavButton = ({ to, icon: Icon }: any) => (
  <NavLink to={to} className="relative p-2 text-zinc-500 dark:text-zinc-400 transition-colors">
    {({ isActive }) => (
      <>
        <Icon 
          strokeWidth={isActive ? 2.5 : 2} 
          className={cn("w-6 h-6 transition-transform", isActive ? "text-zinc-900 dark:text-white scale-110" : "hover:text-zinc-900 dark:hover:text-white")} 
        />
        {isActive && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-zinc-900 dark:bg-white rounded-full" />
        )}
      </>
    )}
  </NavLink>
);