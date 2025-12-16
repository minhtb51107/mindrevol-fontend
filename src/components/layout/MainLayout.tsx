import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Grip, X } from 'lucide-react';
import { CreateJourneyModal } from '@/modules/journey/components/CreateJourneyModal';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans relative overflow-hidden selection:bg-purple-500/30">
      
      {/* 1. NÚT ĐA NHIỆM (Toggle) */}
      {/* Đã BỎ class 'md:hidden' để hiện nút này trên cả Desktop */}
      <div className="fixed top-6 left-6 z-[60] animate-in fade-in zoom-in duration-500">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center 
            hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] group
            ${isSidebarOpen 
              ? 'bg-transparent border border-white/20 text-white' // Khi mở: nút trong suốt hòa vào sidebar
              : 'bg-zinc-900/50 backdrop-blur-xl border border-white/10 text-zinc-400' // Khi đóng: nút nổi
            }
          `}
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6" /> 
          ) : (
            <Grip className="w-6 h-6 group-hover:text-white transition-colors" />
          )}
        </button>
      </div>

      {/* 2. SIDEBAR DRAWER */}
      {/* Đã BỎ class 'md:translate-x-0' để sidebar không tự hiện trên Desktop */}
      {/* Giữ nguyên hiệu ứng trượt mượt mà */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-[280px] 
          bg-black/80 backdrop-blur-2xl border-r border-white/10 
          p-6 pt-24 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        `}
      >
         <Sidebar onCreateJourney={() => setIsModalOpen(true)} />
      </div>

      {/* 3. MAIN CONTENT */}
      {/* Đã BỎ 'md:pl-[280px]' để nội dung luôn tràn màn hình (Fullscreen) */}
      <main className="w-full h-screen relative flex flex-col transition-all duration-500">
        {children || <Outlet />}
      </main>

      {/* 4. MODAL TẠO HÀNH TRÌNH */}
      {/* Đặt ở đây để đè lên tất cả */}
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