import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { CreateJourneyModal } from '@/modules/journey/components/CreateJourneyModal';
import { CheckinModal } from '@/modules/checkin/components/CheckinModal';
import { JourneyListModal } from '@/modules/journey/components/JourneyListModal'; 
import { journeyService } from '@/modules/journey/services/journey.service';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams(); // [FIX] Lấy params từ URL
  
  // State quản lý Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isJourneyListOpen, setIsJourneyListOpen] = useState(false);

  const [checkinFile, setCheckinFile] = useState<File | null>(null);
  const [defaultJourneyId, setDefaultJourneyId] = useState<string | null>(null);

  // Lấy journeyId từ URL, nếu không có thì dùng default
  const urlJourneyId = searchParams.get('journeyId');
  const activeJourneyId = urlJourneyId || defaultJourneyId;

  const isChatPage = location.pathname.startsWith('/chat');

  useEffect(() => {
    const fetchDefaultJourney = async () => {
        try {
            const myJourneys = await journeyService.getMyJourneys();
            if (myJourneys.length > 0) {
                setDefaultJourneyId(myJourneys[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch journeys", error);
        }
    };
    fetchDefaultJourney();
  }, []);

  const handleCheckinClick = (file: File) => {
    setCheckinFile(file);
    setIsCheckinModalOpen(true);
  };

  return (
    <div className="flex h-screen w-screen bg-[#121212] text-white font-sans selection:bg-purple-500/30 overflow-hidden relative">
      
      {/* Sidebar: Truyền thêm props onJourneyClick */}
      {!isChatPage && (
        <Sidebar 
            onCheckinClick={handleCheckinClick} 
            onJourneyClick={() => setIsJourneyListOpen(true)}
        />
      )}

      <main className={cn(
        "flex-1 w-full h-full relative overflow-y-auto no-scrollbar",
        isChatPage ? "pb-0" : "pb-32"
      )}>
        {children || <Outlet />}
      </main>

      {/* --- MODALS TOÀN CỤC --- */}
      
      {/* 1. Modal Tạo Hành Trình */}
      <CreateJourneyModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        // [FIX] Reload trang khi tạo xong để cập nhật Homepage
        onSuccess={() => window.location.reload()} 
      />

      {/* 2. Modal Danh Sách Hành Trình */}
      <JourneyListModal 
        isOpen={isJourneyListOpen}
        onClose={() => setIsJourneyListOpen(false)}
      />

      {/* 3. Modal Check-in */}
      {/* [FIX] Sử dụng activeJourneyId (Ưu tiên URL) */}
      {activeJourneyId && (
          <CheckinModal 
            isOpen={isCheckinModalOpen} 
            onClose={() => setIsCheckinModalOpen(false)} 
            file={checkinFile} 
            journeyId={activeJourneyId} 
            onSuccess={() => window.location.reload()} 
          />
      )}
    </div>
  );
};

export default MainLayout;