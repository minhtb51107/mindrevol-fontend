// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, MessageCircle, Compass, User, LogOut, PlusCircle, Users } from 'lucide-react';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { CreateJourneyModal } from '@/modules/journey/components/CreateJourneyModal';
import { JourneyListModal } from '@/modules/journey/components/JourneyListModal';
import { FriendsModal } from '@/modules/user/components/FriendsModal';

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();

  // State quản lý đóng mở các Modal
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isListOpen, setListOpen] = useState(false);
  const [isFriendsOpen, setFriendsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Trang chủ', to: '/' },
    { icon: Compass, label: 'Khám phá', to: '/discovery' },
    { 
      icon: Map, 
      label: 'Hành trình', 
      to: '/journeys',
      // Logic: Bấm vào thì mở Modal, không chuyển trang
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setListOpen(true);
      }
    },
    { 
      icon: Users, 
      label: 'Bạn bè', 
      to: '/friends', // Đường dẫn ảo để active style hoạt động nếu cần
      // Logic: Bấm vào thì mở Modal Bạn bè
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setFriendsOpen(true);
      }
    },
    // [UPDATE] Trỏ đúng về trang ChatPage
    { icon: MessageCircle, label: 'Tin nhắn', to: '/chat' }, 
    { icon: User, label: 'Cá nhân', to: '/profile' },
  ];

  return (
    <>
      <aside className="h-full w-full flex flex-col text-white/90">
        {/* Logo */}
        <div className="flex flex-col gap-4 mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight leading-none">MindRevol</span>
              <span className="text-xs text-zinc-500 font-medium">Bản khởi nghiệp</span>
            </div>
          </div>
        </div>

        {/* Nút Tạo Hành Trình */}
        <div className="px-2 mb-6">
          <button 
            onClick={() => setCreateOpen(true)}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/5 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-5 h-5 text-blue-400" />
            <span>Tạo Hành Trình</span>
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 flex flex-col gap-1.5 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={item.onClick}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                ${isActive && !item.onClick
                  ? 'bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-white font-bold border border-white/5' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${item.label === 'Khám phá' ? 'text-purple-400' : ''}`} />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="flex flex-col gap-1 mt-auto border-t border-white/10 pt-4 px-2">
          <button 
            onClick={logout}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* --- RENDER CÁC MODAL --- */}
      {/* 1. Tạo hành trình */}
      <CreateJourneyModal 
        isOpen={isCreateOpen} 
        onClose={() => setCreateOpen(false)}
        onSuccess={() => setListOpen(true)}
      />

      {/* 2. Danh sách hành trình */}
      <JourneyListModal 
        isOpen={isListOpen}
        onClose={() => setListOpen(false)}
        // onCreateNew={() => { // Đã xử lý logic này bên trong component JourneyListModal rồi
        //   setListOpen(false);
        //   setCreateOpen(true);
        // }}
      />

      {/* 3. Bạn bè & Tìm kiếm (MỚI) */}
      <FriendsModal 
        isOpen={isFriendsOpen}
        onClose={() => setFriendsOpen(false)}
      />
    </>
  );
};