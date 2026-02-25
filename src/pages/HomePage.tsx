import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { ActiveJourneyList } from '@/modules/journey/components/ActiveJourneyList';
import { HomeFeed } from '@/modules/feed/components/HomeFeed'; 
import { CreateJourneyModal } from '@/modules/journey/components/CreateJourneyModal';

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);

  const handleJourneySelect = (id: string) => {
    setSelectedJourneyId(selectedJourneyId === id ? null : id); 
  };

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-[#121212] relative">
        <ActiveJourneyList 
            onCreateClick={() => setIsCreateModalOpen(true)}
            onJourneySelect={handleJourneySelect}     
            selectedId={selectedJourneyId}            
        />
        
        {/* Chỉ cần truyền selectedJourneyId, HomeFeed sẽ tự xử lý phần còn lại */}
        <HomeFeed selectedJourneyId={selectedJourneyId} />
      </div>

      <CreateJourneyModal 
        isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={() => window.location.reload()}
      />
    </MainLayout>
  );
};

export default HomePage;