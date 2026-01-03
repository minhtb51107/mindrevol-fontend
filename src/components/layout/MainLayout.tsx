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
  const [searchParams] = useSearchParams();
  
  // State quản lý Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isJourneyListOpen, setIsJourneyListOpen] = useState(false);

  const [checkinFile, setCheckinFile] = useState<File | null>(null);
  const [defaultJourneyId, setDefaultJourneyId] = useState<string | null>(null);

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
    // [FIX 1]: h-[100dvh] để fix lỗi Safari, flex-col cho mobile
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#121212] text-white font-sans overflow-hidden relative">
      
      {/* Sidebar */}
      {!isChatPage && (
        <Sidebar 
            onCheckinClick={handleCheckinClick} 
            onJourneyClick={() => setIsJourneyListOpen(true)}
        />
      )}

      {/* [FIX 2]: Main Content
          - XÓA overflow-y-auto: Để HomePage tự quản lý scroll (ngăn việc kéo cả trang).
          - XÓA pb-32: Để HomePage tự padding bottom (tránh khoảng trắng thừa hoặc thiếu).
          - min-w-0: Fix lỗi flexbox child quá rộng.
      */}
      <main className={cn(
        "flex-1 relative flex flex-col min-w-0 overflow-hidden", 
        // Nếu là trang Chat thì giữ nguyên logic cũ nếu cần, các trang khác để full height
        isChatPage ? "" : "" 
      )}>
        {children || <Outlet />}
      </main>

      {/* --- MODALS TOÀN CỤC --- */}
      
      <CreateJourneyModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={() => window.location.reload()} 
      />

      <JourneyListModal 
        isOpen={isJourneyListOpen}
        onClose={() => setIsJourneyListOpen(false)}
      />

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