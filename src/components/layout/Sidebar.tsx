import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, MessageCircle, Compass, User, LogOut, PlusCircle, Users } from 'lucide-react';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { CreateJourneyModal } from '@/modules/journey/components/CreateJourneyModal';
import { JourneyListModal } from '@/modules/journey/components/JourneyListModal';
import { FriendsModal } from '@/modules/user/components/FriendsModal';

// [UPDATE] Thêm prop isCollapsed
interface SidebarProps {
  onCreateJourney?: () => void;
  isCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCreateJourney, isCollapsed = false }) => {
  const { logout } = useAuth(); // Bỏ user nếu không dùng để tránh warning

  // State quản lý đóng mở các Modal
  // const [isCreateOpen, setCreateOpen] = useState(false); // Đã chuyển lên MainLayout hoặc dùng prop onCreateJourney
  // Ở đây chúng ta dùng prop onCreateJourney được truyền từ MainLayout để tránh duplicate modal
  // Tuy nhiên, logic cũ của bạn có render modal tại đây, tôi sẽ giữ logic mở modal local cho Friends và List
  
  const [isListOpen, setListOpen] = useState(false);
  const [isFriendsOpen, setFriendsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Trang chủ', to: '/' },
    { icon: Compass, label: 'Khám phá', to: '/discovery' },
    { 
      icon: Map, 
      label: 'Hành trình', 
      to: '/journeys',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setListOpen(true);
      }
    },
    { 
      icon: Users, 
      label: 'Bạn bè', 
      to: '/friends',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setFriendsOpen(true);
      }
    },
    { icon: MessageCircle, label: 'Tin nhắn', to: '/chat' }, 
    { icon: User, label: 'Cá nhân', to: '/profile' },
  ];

  return (
    <>
      <div className={`h-full w-full flex flex-col text-white/90 ${isCollapsed ? 'items-center px-2 py-6' : 'px-4 py-6'}`}>
        {/* Logo Section */}
        <div className={`flex items-center gap-3 mb-8 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            M
          </div>
          {/* Ẩn tên app khi collapsed */}
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in duration-200">
              <span className="font-bold text-lg tracking-tight leading-none">MindRevol</span>
              <span className="text-xs text-zinc-500 font-medium">Bản khởi nghiệp</span>
            </div>
          )}
        </div>

        {/* Nút Tạo Hành Trình */}
        <div className="mb-6 w-full">
          <button 
            onClick={onCreateJourney}
            className={`
              flex items-center justify-center gap-2 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]
              bg-white/10 hover:bg-white/20 border border-white/5 text-white
              ${isCollapsed ? 'w-10 h-10 p-0 mx-auto rounded-full' : 'w-full py-3'}
            `}
            title="Tạo hành trình mới"
          >
            <PlusCircle className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} text-blue-400`} />
            {!isCollapsed && <span>Tạo Hành Trình</span>}
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 flex flex-col gap-2 w-full">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={item.onClick}
              title={isCollapsed ? item.label : undefined} // Tooltip khi thu nhỏ
              className={({ isActive }) => `
                flex items-center rounded-xl transition-all duration-200 group relative
                ${isCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-4 px-4 py-3'}
                ${isActive && !item.onClick
                  ? 'bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-white font-bold border border-white/5' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <item.icon className={`
                transition-transform group-hover:scale-110
                ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}
                ${item.label === 'Khám phá' ? 'text-purple-400' : ''}
              `} />
              
              {!isCollapsed && <span className="text-sm">{item.label}</span>}

              {/* Dấu chấm thông báo (Giả lập cho Tin nhắn) - Tinh tế */}
              {item.label === 'Tin nhắn' && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className={`mt-auto pt-4 border-t border-white/10 w-full ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button 
            onClick={logout}
            className={`
              flex items-center rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all
              ${isCollapsed ? 'justify-center w-10 h-10' : 'gap-4 px-4 py-3 w-full'}
            `}
            title="Đăng xuất"
          >
            <LogOut className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'}`} />
            {!isCollapsed && <span className="text-sm font-medium">Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* --- RENDER CÁC MODAL PHỤ (Modal Tạo hành trình đã được MainLayout lo) --- */}
      
      {/* 2. Danh sách hành trình */}
      <JourneyListModal 
        isOpen={isListOpen}
        onClose={() => setListOpen(false)}
      />

      {/* 3. Bạn bè & Tìm kiếm */}
      <FriendsModal 
        isOpen={isFriendsOpen}
        onClose={() => setFriendsOpen(false)}
      />
    </>
  );
};