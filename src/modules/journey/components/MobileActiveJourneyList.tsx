import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { journeyService } from '../services/journey.service';
import { JourneyResponse, JourneyStatus, UserActiveJourneyResponse } from '../types';
import { MobileJourneyCard } from './MobileJourneyCard';

// Đã import Component CreateJourneyModal
import { CreateJourneyModal } from './CreateJourneyModal'; 

interface MergedJourney extends JourneyResponse {
  memberAvatars?: (string | null)[];
  daysRemaining?: number;
  totalMembers?: number;
  thumbnailUrl?: string; 
  previewImages?: string[];
}

interface Props {
  onJourneySelect?: (id: string) => void;
  selectedId?: string | null;
}

type FilterTab = 'ACTIVE' | 'COMPLETED' | 'INVITED';

export const MobileActiveJourneyList: React.FC<Props> = ({ onJourneySelect, selectedId }) => {
  const [journeys, setJourneys] = useState<MergedJourney[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('ACTIVE');
  
  // State để quản lý việc đóng/mở Modal tạo hành trình
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchJourneys = async () => {
      setLoading(true);
      try {
          const [myList, activeList, inviteList] = await Promise.all([
              journeyService.getMyJourneys(),
              journeyService.getUserActiveJourneys("me"),
              journeyService.getMyPendingInvitations() 
          ]);

          const merged: MergedJourney[] = myList.map((journey: JourneyResponse) => {
              const extraData = activeList.find((a: UserActiveJourneyResponse) => a.id === journey.id);
              const checkinImages = extraData?.checkins
                  ?.filter((c: any) => c.imageUrl)
                  .map((c: any) => c.imageUrl as string) || [];

              return {
                  ...journey,
                  memberAvatars: extraData?.memberAvatars || [],
                  daysRemaining: extraData?.daysRemaining,
                  totalMembers: extraData?.totalMembers || journey.participantCount || 1,
                  themeColor: extraData?.themeColor || journey.themeColor,
                  avatar: extraData?.avatar || journey.avatar,
                  thumbnailUrl: extraData?.thumbnailUrl,
                  previewImages: checkinImages.length > 0 ? checkinImages : (extraData?.thumbnailUrl ? [extraData.thumbnailUrl] : []) 
              };
          });
          
          setJourneys(merged);
          setInvitations(inviteList || []);
      } catch (error) {
          console.error("Failed to load journeys data", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchJourneys();
    window.addEventListener('JOURNEY_UPDATED', fetchJourneys);
    return () => window.removeEventListener('JOURNEY_UPDATED', fetchJourneys);
  }, []);

  const displayData = useMemo(() => {
    if (activeTab === 'ACTIVE') {
      return journeys.filter(j => 
        [JourneyStatus.ACTIVE, JourneyStatus.ONGOING, JourneyStatus.UPCOMING].includes(j.status as JourneyStatus)
      );
    }
    if (activeTab === 'COMPLETED') {
      return journeys.filter(j => j.status === JourneyStatus.COMPLETED);
    }
    return invitations; 
  }, [journeys, invitations, activeTab]);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10 bg-transparent">
         <Loader2 className="w-8 h-8 text-[#8A8580] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col bg-transparent px-5 pb-6 font-quicksand animate-in fade-in duration-300">
        
        {/* HEADER: Tiêu đề bên trái + Nút Tạo bên phải */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#1A1A1A] dark:text-white text-[1.4rem] font-black tracking-tight">
            Hành trình
          </h2>
          <button 
            onClick={() => setIsCreateModalOpen(true)} // Mở modal khi click
            className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] rounded-full shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* FILTER TABS */}
        <div className="flex gap-2 mb-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <TabButton active={activeTab === 'ACTIVE'} onClick={() => setActiveTab('ACTIVE')} label="Hiện tại" />
          <TabButton active={activeTab === 'COMPLETED'} onClick={() => setActiveTab('COMPLETED')} label="Đã kết thúc" />
          <TabButton active={activeTab === 'INVITED'} onClick={() => setActiveTab('INVITED')} label="Lời mời" count={invitations.length} />
        </div>
        
        {/* LIST CONTENT */}
        <div className="flex flex-col w-full gap-5">
          {displayData.length === 0 ? (
            <div className="text-center py-8 text-[#8A8580] dark:text-[#A09D9A] font-bold">
              Trống
            </div>
          ) : (
            displayData.map((item: any) => {
              if (activeTab === 'INVITED') {
                return <div key={item.id} className="p-4 border rounded-xl">Lời mời từ {item.inviterName}</div>; 
              }

              return (
                <div 
                    key={item.id}
                    className={`w-full transition-all duration-300 ${selectedId === item.id ? 'scale-[1.02] ring-[3px] ring-[#1A1A1A] dark:ring-white rounded-[28px] shadow-[0_16px_40px_rgba(0,0,0,0.12)]' : 'scale-100 hover:-translate-y-1'}`}
                >
                    <MobileJourneyCard 
                        journey={item}
                        onClick={() => onJourneySelect?.(item.id)} 
                    />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RENDER MODAL TẠO HÀNH TRÌNH THẬT */}
      {isCreateModalOpen && (
        <CreateJourneyModal 
           isOpen={isCreateModalOpen} 
           onClose={() => setIsCreateModalOpen(false)} 
           onSuccess={() => {
              setIsCreateModalOpen(false); // Đóng modal
              fetchJourneys(); // Load lại danh sách hành trình
           }} 
        />
      )}
    </>
  );
};

// Component phụ cho Tab Button
const TabButton = ({ active, onClick, label, count }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-[0.85rem] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
      active 
        ? "bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A]" 
        : "bg-gray-100 dark:bg-[#1A1A1A] text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-800"
    }`}
  >
    {label}
    {count > 0 && (
      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </button>
);