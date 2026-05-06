import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { HomeFeed } from '@/modules/feed/components/HomeFeed'; 
import { MobileHomeHeader } from '@/components/layout/Navigation/MobileHomeHeader';
import { MobileActiveJourneyList } from '@/modules/journey/components/MobileActiveJourneyList';
import { Flame, Archive, ArrowLeft } from 'lucide-react';
import { journeyService } from '@/modules/journey/services/journey.service';
import { useProfileData } from '@/modules/user/hooks/useProfileData';
import { useProfileContent } from '@/modules/user/hooks/useProfileContent';
import { ArchivedCheckinsModal } from '@/modules/checkin/components/ArchivedCheckinsModal';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const { userProfile } = useProfileData("me", false);
  const { archivedCheckins } = useProfileContent("me", true, "ARCHIVED");

  useEffect(() => {
    const initDesktopView = async () => {
      if (window.innerWidth >= 768 && !searchParams.get('journeyId')) {
        try {
          const activeList = await journeyService.getUserActiveJourneys("me");
          if (activeList && activeList.length > 0) {
            setSearchParams({ journeyId: activeList[0].id }, { replace: true });
          }
        } catch (error) {
          console.error("Failed to auto-select journey", error);
        }
      }
    };
    initDesktopView();

    const handleResize = () => {
      if (window.innerWidth >= 768 && !searchParams.get('journeyId')) {
        initDesktopView();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const journeyIdFromUrl = searchParams.get('journeyId');
    if (journeyIdFromUrl) setSelectedJourneyId(journeyIdFromUrl);
    else setSelectedJourneyId(null);
         
    const handleJourneySelected = (e: any) => {
      const id = e.detail;
      setSelectedJourneyId(id);
      setSearchParams({ journeyId: id });
    };
    window.addEventListener('JOURNEY_SELECTED', handleJourneySelected);
    return () => window.removeEventListener('JOURNEY_SELECTED', handleJourneySelected);
  }, [searchParams, setSearchParams]);

  const handleBackToHome = () => {
      setSelectedJourneyId(null);
      searchParams.delete('journeyId');
      setSearchParams(searchParams, { replace: true });
  };

  return (
    <MainLayout>
      <div className="flex flex-col flex-1 w-full h-full bg-zinc-50 dark:bg-[#121212] relative transition-colors duration-300">
        
        {/* MOBILE */}
        <div className="flex md:hidden flex-col w-full h-full">
            {!selectedJourneyId ? (
                <div className="flex flex-col w-full h-full overflow-y-auto pb-[90px] scrollbar-hide">
                    <div className="shrink-0 w-full mb-4">
                        <MobileHomeHeader />
                    </div>
                    
                    <div className="w-full mb-6">
                        <MobileActiveJourneyList 
                            selectedId={selectedJourneyId}
                            onJourneySelect={(id) => {
                                // Cập nhật URL param để chuyển màn hình sang Feed
                                setSearchParams({ journeyId: id });
                            }}
                        />
                    </div>
                    
                    <div className="w-full px-6 mb-8">
                        <h2 className="text-zinc-900 dark:text-white text-[1.4rem] font-black tracking-tight mb-5">
                            Hoạt động
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* Chuỗi (Streak) */}
                            <button 
                                 data-tour="streak-flame"
                                 onClick={() => navigate('/streak')}
                                className="relative overflow-hidden flex flex-col items-start p-5 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-[32px] border border-white/50 dark:border-zinc-800 active:scale-95 transition-all text-left shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] group"
                            >
                                <img 
                                      src="/moscow/moscow (14).png" 
                                      alt="Streak Decoration" 
                                      className="absolute bottom-0 right-0 w-28 h-28 object-contain opacity-70 pointer-events-none rounded-br-[32px] translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-500" 
                                  />
                                 
                                <div className="z-10 relative flex flex-col items-start h-full w-full">
                                    <div className="w-10 h-10 rounded-[14px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white mb-3 shadow-sm border border-zinc-200/50 dark:border-transparent">
                                        <Flame size={22} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[0.8rem] text-zinc-500 dark:text-zinc-400 font-extrabold uppercase tracking-widest mb-1">Chuỗi ngày</span>
                                    <div className="flex items-baseline gap-1.5 mt-auto pt-2">
                                        <span className="text-[2rem] font-black text-zinc-900 dark:text-white leading-none">
                                            {userProfile?.currentStreak || 0}
                                        </span>
                                        <span className="text-[0.95rem] text-zinc-500 dark:text-zinc-400 font-bold">ngày</span>
                                    </div>
                                </div>
                            </button>

                            {/* Lưu trữ */}
                            <button 
                                 data-tour="archive"
                                 onClick={() => setIsArchiveModalOpen(true)}
                                className="relative overflow-hidden flex flex-col items-start p-5 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-[32px] border border-white/50 dark:border-zinc-800 active:scale-95 transition-all text-left shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] group"
                            >
                                <img 
                                      src="/moscow/moscow (12).png" 
                                      alt="Archive Decoration" 
                                      className="absolute bottom-0 right-0 w-28 h-28 object-contain opacity-70 pointer-events-none rounded-br-[32px] translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-500" 
                                  />
                                <div className="z-10 relative flex flex-col items-start h-full w-full">
                                    <div className="w-10 h-10 rounded-[14px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white mb-3 shadow-sm border border-zinc-200/50 dark:border-transparent">
                                        <Archive size={20} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[0.8rem] text-zinc-500 dark:text-zinc-400 font-extrabold uppercase tracking-widest mb-1">Kho lưu trữ</span>
                                    <div className="flex items-baseline gap-1.5 mt-auto pt-2">
                                        <span className="text-[2rem] font-black text-zinc-900 dark:text-white leading-none">
                                            {archivedCheckins?.length || 0}
                                        </span>
                                        <span className="text-[0.95rem] text-zinc-500 dark:text-zinc-400 font-bold">bài viết</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full h-full relative pb-[72px] md:pb-0">
                     <div className="absolute top-2 left-2 z-[70] p-1 md:hidden">
                         <button 
                             onClick={handleBackToHome}
                             className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-[14px] shadow-sm border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                         >
                             <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                         </button>
                     </div>
                     <HomeFeed selectedJourneyId={selectedJourneyId} />
                </div>
            )}
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex flex-col w-full h-full overflow-hidden">
          <div className="flex-1 w-full h-full relative overflow-hidden">
            <HomeFeed selectedJourneyId={selectedJourneyId} />
          </div>
        </div>
      </div>

      <ArchivedCheckinsModal 
         isOpen={isArchiveModalOpen} 
         onClose={() => setIsArchiveModalOpen(false)} 
         checkins={archivedCheckins}
      />
    </MainLayout>
  );
};

export default HomePage;