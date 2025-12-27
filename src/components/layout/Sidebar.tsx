import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, MessageCircle, User, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onCheckinClick: (file: File) => void;
  onJourneyClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCheckinClick, onJourneyClick }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // [BACKGROUND]: Gradient đen mờ từ dưới lên. Không đóng khung.
      "h-[100px] bg-gradient-to-t from-black via-black/80 to-transparent",
      "flex items-end justify-center pb-5 md:pb-6",
      "pointer-events-none" // Cho phép click xuyên qua phần trong suốt
    )}>
      
      {/* NAV GROUP: Đặt độ rộng cố định để các icon không bị chạy */}
      <div className="flex items-center justify-between w-full max-w-[360px] px-4 pointer-events-auto">
        
        {/* 1. HOME */}
        <NavButton to="/" icon={Home} />
        
        {/* 2. JOURNEYS */}
        <button
          onClick={onJourneyClick}
          className="group w-12 h-12 flex flex-col items-center justify-center outline-none"
        >
           {/* Icon tĩnh, chỉ đổi màu */}
           <div className="text-zinc-500 transition-colors duration-300 group-hover:text-zinc-200">
             <Map strokeWidth={2} className="w-6 h-6" />
           </div>
        </button>

        {/* 3. CAMERA: DISTINCT & SOLID (Khác biệt nhưng tĩnh) */}
        {/* Nút tròn trắng, nổi lên trên nền đen. Không hiệu ứng thở, không cầu kỳ. */}
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
              "bg-white text-black", // Tương phản mạnh: Trắng trên nền tối
              "shadow-[0_4px_20px_rgba(255,255,255,0.15)]", // Bóng đổ vừa phải
              "hover:scale-105 active:scale-95 transition-transform duration-200", // Hiệu ứng nhấn vật lý gọn gàng
              "border-4 border-black/50 bg-clip-padding" // Viền giả để tách nền (nếu cần)
            )}
          >
            <Camera strokeWidth={2.5} className="w-6 h-6" />
          </button>
        </div>

        {/* 4. CHAT */}
        <NavButton to="/chat" icon={MessageCircle} isChat />

        {/* 5. PROFILE */}
        <NavButton to="/profile" icon={User} />

      </div>
    </div>
  );
};

// Helper Component: "Anchored State"
const NavButton = ({ to, icon: Icon, isChat }: any) => (
  <NavLink
    to={to}
    className="group w-12 h-12 flex flex-col items-center justify-center outline-none relative" 
  >
    {({ isActive }) => (
      <>
        {/* ICON: Luôn đứng yên (No translate) */}
        <div className={cn(
          "transition-colors duration-300",
          isActive 
            ? "text-white" // Active: Trắng sáng
            : "text-zinc-500 group-hover:text-zinc-300" // Inactive: Xám tối
        )}>
          {/* Stroke 2.0 để rõ ràng hơn trên nền Gradient */}
          <Icon strokeWidth={2} className="w-6 h-6" />
        </div>

        {/* INDICATOR: Chấm tròn nhỏ tĩnh tại dưới chân */}
        <div className={cn(
          "absolute bottom-1 w-1 h-1 rounded-full bg-white transition-all duration-300",
          isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
        )} />

        {/* NOTIFICATION: Chấm cam nhỏ gọn */}
        {isChat && (
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-orange-500 border-2 border-black" />
        )}
      </>
    )}
  </NavLink>
);