import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { Navigation } from './Navigation'; 
import { CreateJourneyModal } from '@/modules/journey/components/CreateJourneyModal';
import { CheckinModal } from '@/modules/checkin/components/CheckinModal';
import { CameraModal } from '@/modules/checkin/components/CameraModal'; 
import { JourneyListModal } from '@/modules/journey/components/JourneyListModal'; 
import { SettingsModal } from '@/modules/user/components/SettingsModal'; 
import { journeyService } from '@/modules/journey/services/journey.service';
import { cn } from '@/lib/utils';
import { usePaymentSuccessHandler } from '@/modules/payment/hooks/usePaymentSuccessHandler';
import { OnboardingTour } from '../common/OnboardingTour'; // [THÊM MỚI]

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  usePaymentSuccessHandler();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJourneyListOpen, setIsJourneyListOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); 
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [checkinFile, setCheckinFile] = useState<File | null>(null);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => {
      const saved = localStorage.getItem('sidebar_expanded');
      return saved !== null ? saved === 'true' : true;
  });

  const [navRefreshKey, setNavRefreshKey] = useState(0);
  const [defaultJourneyId, setDefaultJourneyId] = useState<string | null>(null);
  const [myJourneys, setMyJourneys] = useState<any[]>([]); 

  const urlJourneyId = searchParams.get('journeyId');
  const activeJourneyId = urlJourneyId || defaultJourneyId;

  const isHomePage = location.pathname === '/';
  const isChatPage = location.pathname.startsWith('/chat');
  const isBoxDetailPage = location.pathname.startsWith('/box/'); 

  useEffect(() => {
      if (isChatPage) {
          setIsSidebarExpanded(false);
      } else {
          const saved = localStorage.getItem('sidebar_expanded');
          setIsSidebarExpanded(saved !== null ? saved === 'true' : true);
      }
  }, [isChatPage]);

  useEffect(() => {
    const fetchDefaultJourney = async () => {
        try {
            const allJourneys = await journeyService.getMyJourneys();
            
            const activeJourneys = allJourneys.filter(j => {
                const validStatus = ['ACTIVE', 'ONGOING', 'UPCOMING'].includes(j.status);
                let isNotExpired = true;
                if (j.endDate) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); 
                    
                    const endDate = new Date(j.endDate);
                    endDate.setHours(0, 0, 0, 0); 
                    
                    isNotExpired = endDate >= today; 
                }
                return validStatus && isNotExpired;
            });
            
            setMyJourneys(activeJourneys); 
            if (activeJourneys.length > 0) setDefaultJourneyId(activeJourneys[0].id);
        } catch (error) { 
            console.error("Lỗi khi tải danh sách hành trình:", error); 
        }
    };
    fetchDefaultJourney();
  }, [navRefreshKey]);

  return (
    <div className={cn(
      "w-full text-zinc-900 dark:text-white font-sans relative block transition-colors duration-300 ease-in-out",
      "md:bg-zinc-50 md:dark:bg-[#09090b]",
      "max-md:min-h-[100dvh] max-md:bg-white max-md:dark:bg-[#121212]",
      isHomePage && "max-md:bg-zinc-50 max-md:dark:bg-black"
    )}>
      
      {/* [THÊM MỚI] Gắn tour vào layout */}
      <OnboardingTour />

      <Navigation 
        onCheckinClick={(f) => { setCheckinFile(f); setIsCameraModalOpen(true); }} 
        onJourneyClick={() => setIsJourneyListOpen(true)}
        onSettingsClick={() => setIsSettingsModalOpen(true)} 
        refreshTrigger={navRefreshKey}
        isSidebarExpanded={isSidebarExpanded}
        toggleSidebar={() => {
            const newState = !isSidebarExpanded;
            setIsSidebarExpanded(newState);
            localStorage.setItem('sidebar_expanded', String(newState));
        }} 
        setSidebarExpanded={(expanded) => {
            setIsSidebarExpanded(expanded);
            localStorage.setItem('sidebar_expanded', String(expanded));
        }} 
        hideBottomNav={isChatPage}
        myJourneys={myJourneys}
        activeJourneyId={activeJourneyId}
        onCreateJourneyClick={() => setIsCreateModalOpen(true)}
      />

      <main className={cn(
        "relative flex flex-col z-0 transition-all duration-300 ease-in-out",
        "w-full",
        isSidebarExpanded 
            ? "md:w-[calc(100%-352px)] md:ml-[352px]" 
            : "md:w-[calc(100%-160px)] md:ml-[160px]",
        
        "md:mt-[36px]",
        "md:bg-white md:dark:bg-[#121212]",
        "md:border-t md:border-zinc-200 md:dark:border-white/10",
        
        (isHomePage || isChatPage || isBoxDetailPage) 
            ? "h-[100dvh] md:h-[calc(100dvh-36px)] overflow-hidden" 
            : "min-h-[100dvh] md:min-h-[calc(100dvh-36px)]",
        (!isHomePage && !isChatPage && !isBoxDetailPage) && "pb-[72px] md:pb-0"
      )}>
        {children || <Outlet />}
      </main>

      <CreateJourneyModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={() => window.location.reload()} />
      <JourneyListModal isOpen={isJourneyListOpen} onClose={() => setIsJourneyListOpen(false)} />
      <CameraModal isOpen={isCameraModalOpen} onClose={() => setIsCameraModalOpen(false)} onCapture={(f) => { setCheckinFile(f); setIsCameraModalOpen(false); setTimeout(() => setIsCheckinModalOpen(true), 150); }} />
      {isCheckinModalOpen && <CheckinModal isOpen={isCheckinModalOpen} onClose={() => setIsCheckinModalOpen(false)} file={checkinFile} journeyId={activeJourneyId || ''} onSuccess={() => window.location.reload()} />}
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </div>
  );
};

export default MainLayout;