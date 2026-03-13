import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { ActiveJourneyList } from '@/modules/journey/components/ActiveJourneyList';
import { HomeFeed } from '@/modules/feed/components/HomeFeed'; 
import { CreateJourneyModal } from '@/modules/journey/components/CreateJourneyModal';

import { MobileHomeHeader } from '@/components/layout/Navigation/MobileHomeHeader';
import { MobileActiveJourneyList } from '@/modules/journey/components/MobileActiveJourneyList';
import { MobileStatsPanel } from '@/modules/journey/components/MobileStatsPanel';

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);

  const handleJourneySelect = (id: string) => {
    setSelectedJourneyId(selectedJourneyId === id ? null : id); 
  };

  return (
    <MainLayout>
      <div className="flex flex-col flex-1 w-full h-full bg-background relative transition-colors duration-300">
        
        {/* =================================================================
            1. GIAO DIỆN MOBILE
            ================================================================= */}
        <div className="flex md:hidden flex-col w-full h-full">
            {!selectedJourneyId ? (
                <div className="flex flex-col w-full h-full bg-background">
                    <div className="shrink-0 z-10 bg-background shadow-sm pb-2">
                        <MobileHomeHeader />
                        <MobileActiveJourneyList />
                    </div>
                    {/* Bỏ overflow-hidden ở đây để cứu nút Camera Mobile */}
                    <div className="flex-1 w-full relative bg-zinc-50 dark:bg-black">
                        <HomeFeed selectedJourneyId={null} />
                    </div>
                    <div className="shrink-0 hidden">
                        <MobileStatsPanel />
                    </div>
                </div>
            ) : (
                <div className="w-full h-full relative bg-zinc-50 dark:bg-black">
                     <button 
                        onClick={() => setSelectedJourneyId(null)}
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
        {/* Khóa cứng vùng làm việc của Desktop bằng h-full và overflow-hidden */}
        <div className="hidden md:flex flex-col w-full h-full bg-zinc-50 dark:bg-black overflow-hidden">
{/*           
          <div className="shrink-0 bg-background z-10 border-b border-zinc-200 dark:border-zinc-800">
            <ActiveJourneyList 
                onCreateClick={() => setIsCreateModalOpen(true)}
                onJourneySelect={handleJourneySelect}     
                selectedId={selectedJourneyId}            
            />
          </div> */}

          {/* [QUAN TRỌNG] Phải có h-full và overflow-hidden thì Locket Feed mới lấy được chiều cao */}
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