import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Grip, X } from 'lucide-react';
import { CreateJourneyModal } from '@/modules/journey/components/CreateJourneyModal';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Chỉ dùng cho Mobile
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  // Logic: Nếu đường dẫn bắt đầu bằng /chat -> Chế độ thu nhỏ (Collapsed)
  const isChatPage = location.pathname.startsWith('/chat');

  return (
    // Dùng flex h-screen để chia cột layout cứng trên Desktop
    <div className="flex h-screen bg-[#121212] text-white font-sans overflow-hidden selection:bg-purple-500/30">
      
      {/* --- 1. DESKTOP SIDEBAR (Ẩn trên Mobile, Hiện trên Desktop) --- */}
      <aside 
        className={`
          hidden md:flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl
          transition-all duration-300 ease-in-out z-40
          ${isChatPage ? 'w-20' : 'w-[280px]'} 
        `}
      >
        {/* Truyền prop isCollapsed xuống Sidebar */}
        <Sidebar 
          onCreateJourney={() => setIsModalOpen(true)} 
          isCollapsed={isChatPage} 
        />
      </aside>

      {/* --- 2. MOBILE TOGGLE BUTTON (Chỉ hiện trên Mobile) --- */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center 
            transition-all shadow-lg
            ${isSidebarOpen 
              ? 'bg-transparent text-white' 
              : 'bg-zinc-900/80 backdrop-blur border border-white/10 text-zinc-400'
            }
          `}
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Grip className="w-6 h-6" />}
        </button>
      </div>

      {/* --- 3. MOBILE SIDEBAR DRAWER (Chỉ hiện trên Mobile) --- */}
      <div 
        className={`
          md:hidden fixed inset-y-0 left-0 z-50 w-[280px] 
          bg-black/95 backdrop-blur-2xl border-r border-white/10 
          p-4 pt-20 shadow-2xl transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        `}
      >
        <Sidebar onCreateJourney={() => setIsModalOpen(true)} isCollapsed={false} />
      </div>

      {/* --- 4. MAIN CONTENT --- */}
      {/* flex-1 để chiếm toàn bộ không gian còn lại */}
      <main className="flex-1 flex flex-col h-full relative w-full overflow-hidden">
        {children || <Outlet />}
      </main>

      {/* 5. MODAL TẠO HÀNH TRÌNH */}
      <CreateJourneyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          setIsModalOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
};

export default MainLayout;