import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { ActiveJourneyList } from '@/modules/journey/components/ActiveJourneyList';
import { HomeFeed } from '@/modules/feed/components/HomeFeed'; 
import { CreateJourneyModal } from '@/modules/journey/components/CreateJourneyModal';

import { MobileHomeHeader } from '@/components/layout/Navigation/MobileHomeHeader';
import { MobileActiveJourneyList } from '@/modules/journey/components/MobileActiveJourneyList';
import { Plus } from 'lucide-react';

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

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

  const handleJourneySelect = (id: string) => {
    const newId = selectedJourneyId === id ? null : id;
    setSelectedJourneyId(newId);
    if (newId) setSearchParams({ journeyId: newId });
    else {
      searchParams.delete('journeyId');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleBackToHome = () => {
      setSelectedJourneyId(null);
      searchParams.delete('journeyId');
      setSearchParams(searchParams, { replace: true });
  };

  return (
    <MainLayout>
      <div className="flex flex-col flex-1 w-full h-full bg-zinc-50 dark:bg-[#121212] relative transition-colors duration-300">
        
        {/* =================================================================
            1. GIAO DIỆN MOBILE
            ================================================================= */}
        <div className="flex md:hidden flex-col w-full h-full pb-20">
            {!selectedJourneyId ? (
                <div className="flex flex-col w-full h-full">
                    <div className="shrink-0 z-10 w-full">
                        <MobileHomeHeader />
                        <MobileActiveJourneyList onJourneySelect={handleJourneySelect} selectedId={selectedJourneyId} />
                    </div>
                    
                    {/* FEED: MOMENTS & NÚT CREATE (THEO FIGMA) */}
                    <div className="flex-1 w-full relative px-5 pt-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-black dark:text-white text-2xl font-normal drop-shadow-sm" style={{ fontFamily: '"Jua", sans-serif' }}>
                                Moments
                            </h2>
                        </div>
                        
                        <HomeFeed selectedJourneyId={null} />
                    </div>
                </div>
            ) : (
                <div className="w-full h-full relative">
                     <button 
                        onClick={handleBackToHome}
                        className="absolute top-4 left-4 z-[60] bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-bold active:scale-95"
                     >
                        ← Trở về
                     </button>
                     <HomeFeed selectedJourneyId={selectedJourneyId} />
                </div>
            )}
        </div>

        {/* =================================================================
            2. GIAO DIỆN DESKTOP
            ================================================================= */}
        <div className="hidden md:flex flex-col w-full h-full overflow-hidden">
          <div className="flex-1 w-full h-full relative overflow-hidden">
            <HomeFeed selectedJourneyId={selectedJourneyId} />
          </div>
        </div>

      </div>

      <CreateJourneyModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={() => window.location.reload()}
      />
    </MainLayout>
  );
};

export default HomePage;