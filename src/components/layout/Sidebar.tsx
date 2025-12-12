import React from 'react';
import { Home, Compass, MessageCircle, Heart, User, Plus, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Item menu đơn lẻ
const NavItem = ({ icon: Icon, label, active }: any) => (
  <button className={`flex items-center gap-4 p-3 rounded-2xl w-full transition-all group ${active ? 'bg-primary/10 text-primary font-bold' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
    <Icon className={`w-7 h-7 transition-transform group-hover:scale-110 ${active ? 'fill-current' : ''}`} strokeWidth={active ? 2.5 : 2} />
    <span className="text-base tracking-wide hidden xl:block">{label}</span>
  </button>
);

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-[80px] xl:w-[280px] bg-surface border-r border-border p-4 flex flex-col justify-between z-50 transition-all duration-300">
      
      {/* 1. Logo */}
      <div className="pl-2 xl:pl-4 mb-8 pt-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform rotate-3 shadow-lg shadow-primary/30 shrink-0">
          <span className="text-white font-black text-xl">M</span>
        </div>
        <span className="text-2xl font-extrabold tracking-tighter text-foreground hidden xl:block">MindRevol</span>
      </div>

      {/* 2. Menu Chính */}
      <nav className="flex-1 space-y-2">
        <NavItem icon={Home} label="Trang chủ" active />
        <NavItem icon={Compass} label="Khám phá" />
        <NavItem icon={MessageCircle} label="Tin nhắn" />
        <NavItem icon={Heart} label="Thông báo" />
        <NavItem icon={User} label="Hồ sơ" />
      </nav>

      {/* 3. Nút Tạo Mới (Nổi bật) */}
      <div className="mb-6">
        <Button className="w-full h-12 xl:h-14 rounded-2xl xl:rounded-full bg-primary hover:bg-blue-600 shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
          <Plus className="w-6 h-6 text-white" strokeWidth={3} />
          <span className="hidden xl:inline ml-2 text-white text-base">Check-in Mới</span>
        </Button>
      </div>

      {/* 4. Footer Menu */}
      <div className="space-y-2 pt-4 border-t border-border">
        <NavItem icon={Settings} label="Cài đặt" />
        <button 
          onClick={() => { 
            localStorage.removeItem('accessToken'); 
            localStorage.removeItem('refreshToken');
            window.location.reload(); 
          }}
          className="flex items-center gap-4 p-3 rounded-2xl w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group"
        >
          <LogOut className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
          <span className="text-base font-bold hidden xl:block">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};