import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { Navigation } from './Navigation'; 
import { CreateJourneyModal } from '@/modules/journey/components/CreateJourneyModal';
import { CheckinModal } from '@/modules/checkin/components/CheckinModal';
import { JourneyListModal } from '@/modules/journey/components/JourneyListModal'; 
import { SettingsModal } from '@/modules/user/components/SettingsModal'; // [THÊM MỚI]
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
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // [THÊM MỚI]

  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => {
      const saved = localStorage.getItem('sidebar_expanded');
      return saved !== null ? saved === 'true' : true;
  });

  const [navRefreshKey, setNavRefreshKey] = useState(0);
  const [checkinFile, setCheckinFile] = useState<File | null>(null);
  const [defaultJourneyId, setDefaultJourneyId] = useState<string | null>(null);

  const urlJourneyId = searchParams.get('journeyId');
  const activeJourneyId = urlJourneyId || defaultJourneyId;

  useEffect(() => {
      const isChatPage = location.pathname.startsWith('/chat');
      const isProfilePage = location.pathname.startsWith('/profile');
      
      if (isChatPage || isProfilePage) {
          setIsSidebarExpanded(false);
      } else {
          const saved = localStorage.getItem('sidebar_expanded');
          setIsSidebarExpanded(saved !== null ? saved === 'true' : true);
      }
  }, [location.pathname]);

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

  const handleDataRefresh = () => {
     setNavRefreshKey(prev => prev + 1); 
  };

  const handleToggleSidebar = () => {
      const newVal = !isSidebarExpanded;
      setIsSidebarExpanded(newVal);
      localStorage.setItem('sidebar_expanded', String(newVal)); 
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#121212] text-white font-sans relative flex">
      
      <Navigation 
        onCheckinClick={handleCheckinClick} 
        onJourneyClick={() => setIsJourneyListOpen(true)}
        onSettingsClick={() => setIsSettingsModalOpen(true)} // [THÊM MỚI] Mở Modal Setting
        refreshTrigger={navRefreshKey}
        isSidebarExpanded={isSidebarExpanded}
        toggleSidebar={handleToggleSidebar} 
        setSidebarExpanded={setIsSidebarExpanded} 
      />

      <main className={cn(
        "relative w-full min-h-[100dvh]", 
        "transition-all duration-300 ease-in-out",
        "pb-[100px] md:pb-0",
        isSidebarExpanded ? "md:pl-[260px]" : "md:pl-[80px]"
      )}>
        {children || <Outlet />}
      </main>

      {/* --- MODALS TOÀN CỤC --- */}
      <CreateJourneyModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={() => {
            handleDataRefresh();
            window.location.reload(); 
        }} 
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
            onSuccess={() => {
                handleDataRefresh();
                window.location.reload(); 
            }} 
          />
      )}

      {/* [THÊM MỚI] Render Modal Cài đặt */}
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};

export default MainLayout;