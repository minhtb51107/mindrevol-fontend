import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { Bookmark, Lock, Users, BookOpen, Archive, Sparkles, Package } from 'lucide-react'; 
import { Checkin } from '@/modules/checkin/types';
import { UserActiveJourneyResponse } from '@/modules/journey/types';

import MainLayout from '@/components/layout/MainLayout';
import { JourneyGalleryCard } from '@/modules/journey/components/JourneyGalleryCard';
import { CheckinDetailModal } from '@/modules/checkin/components/CheckinDetailModal';
import { JourneyAlbumModal } from '@/modules/journey/components/JourneyAlbumModal';
import { FriendsModal } from '@/modules/user/components/FriendsModal';

import { useProfileData } from '../hooks/useProfileData';
import { useProfileContent } from '../hooks/useProfileContent';
import { ProfileHeaderBlock } from '../components/profile/ProfileHeaderBlock';
import { LivePhotoViewer } from '@/components/ui/LivePhotoViewer';
import { cn } from '@/lib/utils';

type TabType = 'PUBLIC' | 'PRIVATE' | 'ARCHIVED' | 'SAVED';

const ProfilePage = () => {
  const { user: authUser } = useAuth();
  const { userId: paramUserId } = useParams<{ userId: string }>(); 
  
  const isViewingOther = !!paramUserId && paramUserId !== authUser?.id;
  const currentProfileId = isViewingOther ? paramUserId : authUser?.id;

  const [activeTab, setActiveTab] = useState<TabType>('PUBLIC');
  const { userProfile, isLoading, handleFriendRequest } = useProfileData(currentProfileId, isViewingOther);
  
  const { 
      publicJourneys, 
      privateJourneys, 
      savedCheckins, 
      archivedCheckins, 
      toggleLocalVisibility,
      selectedBoxId,
      setSelectedBoxId,
      availableBoxes 
  } = useProfileContent(currentProfileId, userProfile?.isMe, activeTab);
  
  const [selectedJourneyAlbum, setSelectedJourneyAlbum] = useState<UserActiveJourneyResponse | null>(null);
  const [selectedCheckin, setSelectedCheckin] = useState<Checkin | null>(null);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  
  if (isLoading) return (
      <MainLayout>
          <div className="flex justify-center items-center min-h-screen bg-white dark:bg-[#121212]">
              <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-black dark:border-white border-t-transparent"></div>
          </div>
      </MainLayout>
  ); 

  if (!userProfile) return <div className="text-center py-20 text-gray-500 font-black text-[1.4rem]">Không tìm thấy người dùng</div>;
  
  const isMe = userProfile.isMe;
  const isBlocked = !isMe && (userProfile.isBlockedByThem || userProfile.isBlockedByMe);

  return (
    <>
      <MainLayout>
        <div className="w-full min-h-screen bg-white dark:bg-[#121212] transition-colors duration-500 relative overflow-hidden font-quicksand">
          
          <div className="px-4 md:px-8 pt-8 md:pt-14 pb-24 w-full max-w-[1024px] mx-auto relative z-10">
            
            <ProfileHeaderBlock 
              userProfile={userProfile}
              isMe={isMe || false}
              onFriendRequest={handleFriendRequest}
              onShowFriends={() => setShowFriendsModal(true)}
              publicCount={publicJourneys.length}
              privateCount={privateJourneys.length}
            />

            {/* THANH TABS NAVIGATION */}
            {isMe && (
              <div className="mb-6 md:mb-8 mt-4">
                <div className="flex justify-between sm:justify-center px-2 sm:px-0 gap-2 md:gap-12 relative">
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200 dark:bg-white/10 z-0"></div>

                  {(['PUBLIC', 'PRIVATE', 'ARCHIVED', 'SAVED'] as TabType[]).map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                          "pb-4 text-[0.8rem] md:text-[0.85rem] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 relative z-10 flex-1 sm:flex-none",
                          activeTab === tab 
                            ? "text-black dark:text-white" 
                            : "text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                      )}
                    >
                      {tab === 'PUBLIC' && <Users size={18} strokeWidth={activeTab === tab ? 2.5 : 2} />}
                      {tab === 'PRIVATE' && <Lock size={18} strokeWidth={activeTab === tab ? 2.5 : 2} />}
                      {tab === 'ARCHIVED' && <Archive size={18} strokeWidth={activeTab === tab ? 2.5 : 2} />}
                      {tab === 'SAVED' && <Bookmark size={18} strokeWidth={activeTab === tab ? 2.5 : 2} />}
                      <span className="hidden sm:inline">
                        {tab === 'PUBLIC' ? 'Công khai' : tab === 'PRIVATE' ? 'Riêng tư' : tab === 'ARCHIVED' ? 'Lưu trữ' : 'Đã lưu'}
                      </span>
                      
                      {activeTab === tab && (
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black dark:bg-white rounded-t-full shadow-sm animate-in zoom-in duration-300"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* BỘ LỌC THEO BOX */}
            {!isBlocked && ['PUBLIC', 'PRIVATE'].includes(activeTab) && availableBoxes.length > 0 && (
                <div className="mb-8 md:mb-10 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2 px-1">
                        <button
                            onClick={() => setSelectedBoxId('ALL')}
                            className={cn(
                                "px-5 py-2.5 rounded-full text-[15px] font-bold whitespace-nowrap transition-all active:scale-95 border",
                                selectedBoxId === 'ALL'
                                    ? "bg-black border-black text-white dark:bg-white dark:border-white dark:text-black shadow-md"
                                    : "bg-white dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                            )}
                        >
                            Tất cả hành trình
                        </button>
                        
                        {availableBoxes.map(box => (
                            <button
                                key={box.id}
                                onClick={() => setSelectedBoxId(box.id)}
                                className={cn(
                                    "px-5 py-2.5 rounded-full text-[15px] font-bold whitespace-nowrap transition-all active:scale-95 border flex items-center gap-2.5",
                                    selectedBoxId === box.id
                                        ? "bg-black border-black text-white dark:bg-white dark:border-white dark:text-black shadow-md"
                                        : "bg-white dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                                )}
                            >
                                {box.avatar ? (
                                    box.avatar.startsWith('http') || box.avatar.startsWith('/') 
                                      ? <img src={box.avatar} alt="box" className="w-5 h-5 rounded-md object-cover" />
                                      : <span className="text-[1rem] leading-none">{box.avatar}</span>
                                ) : (
                                    <Package size={16} strokeWidth={2.5} />
                                )}
                                {box.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* KHU VỰC NỘI DUNG (CONTENT TABS) */}
            <div className="min-h-[400px]">
              {isBlocked ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-[#1A1A1A]/40 rounded-[32px] border border-gray-200 dark:border-white/5 mx-4 md:mx-0 flex flex-col items-center">
                  <div className="w-16 h-16 bg-white dark:bg-[#2B2A29] rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-gray-100 dark:border-transparent">
                      <Lock className="w-8 h-8 text-gray-400" strokeWidth={2} />
                  </div>
                  <p className="text-black dark:text-white font-black text-[1.4rem] tracking-tight">Nội dung không khả dụng</p>
                  <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Bạn không thể xem hồ sơ này.</p>
                </div>
              ) : (
                <>
                  {activeTab === 'PUBLIC' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {publicJourneys.length > 0 ? (
                        publicJourneys.map(journey => (
                          <JourneyGalleryCard 
                              key={journey.id} 
                              journey={journey} 
                              isMe={isMe} 
                              onJourneyClick={setSelectedJourneyAlbum}
                              onVisibilityToggle={toggleLocalVisibility} 
                          />
                        ))
                      ) : (
                        <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-[#1A1A1A]/40 rounded-[32px] border border-gray-200 dark:border-white/5 flex flex-col items-center">
                          <div className="w-16 h-16 bg-white dark:bg-[#2B2A29] rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-gray-100 dark:border-transparent">
                              <BookOpen className="w-8 h-8 text-gray-400" strokeWidth={2} />
                          </div>
                          <p className="text-black dark:text-white font-bold text-[1.1rem] px-6 tracking-tight mb-2">
                              {isMe ? "Chưa có hành trình công khai" : 
                                (userProfile.friendshipStatus !== 'ACCEPTED' 
                                  ? "Hãy kết bạn để xem không gian của người này." 
                                  : "Chưa có hành trình công khai nào.")}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium px-6">
                              {selectedBoxId !== 'ALL' ? 'Không có hành trình nào trong không gian này.' : 'Hành trình công khai sẽ xuất hiện tại đây.'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'PRIVATE' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {privateJourneys.length > 0 ? (
                        privateJourneys.map(journey => (
                          <JourneyGalleryCard 
                              key={journey.id} 
                              journey={journey} 
                              isMe={isMe} 
                              onJourneyClick={setSelectedJourneyAlbum}
                              onVisibilityToggle={toggleLocalVisibility} 
                          />
                        ))
                      ) : (
                        <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-[#1A1A1A]/40 rounded-[32px] border border-gray-200 dark:border-white/5 flex flex-col items-center">
                           <div className="w-16 h-16 bg-white dark:bg-[#2B2A29] rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-gray-100 dark:border-transparent">
                               <Lock className="w-8 h-8 text-gray-400" strokeWidth={2} />
                           </div>
                           <p className="text-black dark:text-white font-bold text-[1.1rem] px-6 tracking-tight mb-2">Không gian cá nhân trống</p>
                           <p className="text-gray-500 dark:text-gray-400 text-sm font-medium px-6">
                               {selectedBoxId !== 'ALL' ? 'Không có hành trình nào trong không gian này.' : 'Chưa có hành trình riêng tư nào.'}
                           </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'ARCHIVED' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {archivedCheckins.length > 0 ? (
                        archivedCheckins.map(checkin => (
                          <div 
                            key={checkin.id} 
                            className="aspect-square bg-gray-100 dark:bg-[#1A1A1A] rounded-[24px] md:rounded-[28px] overflow-hidden group relative shadow-sm border border-gray-200 dark:border-white/5"
                          >
                              <div 
                                className="absolute inset-0 z-10 cursor-pointer" 
                                onClick={() => setSelectedCheckin(checkin)} 
                              />
                              
                              {checkin.thumbnailUrl || checkin.imageUrl ? (
                                  <LivePhotoViewer 
                                      imageUrl={checkin.thumbnailUrl || checkin.imageUrl} 
                                      videoUrl={checkin.videoUrl} 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                  />
                              ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                      <Sparkles className="w-8 h-8 text-gray-400 mb-3" strokeWidth={1.5} />
                                      <span className="text-[1.05rem] font-bold text-gray-800 dark:text-gray-200 line-clamp-3 leading-snug">
                                          {checkin.caption ? checkin.caption : 'Ghi chú văn bản'}
                                      </span>
                                  </div>
                              )}
                              
                              <div className="absolute top-3 right-3 p-2 bg-black/40 rounded-[12px] backdrop-blur-md pointer-events-none z-20 border border-white/20">
                                  <Archive className="w-4 h-4 text-white" strokeWidth={2.5} />
                              </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-[#1A1A1A]/40 rounded-[32px] border border-gray-200 dark:border-white/5 flex flex-col items-center">
                            <div className="w-16 h-16 bg-white dark:bg-[#2B2A29] rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-gray-100 dark:border-transparent">
                                <Archive className="w-8 h-8 text-gray-400" strokeWidth={2} />
                            </div>
                            <span className="text-black dark:text-white font-bold text-[1.1rem] px-6 tracking-tight mb-2">Kho lưu trữ trống</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium px-6">Những khoảnh khắc không thuộc hành trình nào sẽ nằm ở đây.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'SAVED' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {savedCheckins.length > 0 ? (
                        savedCheckins.map(checkin => (
                          <div 
                            key={checkin.id} 
                            className="aspect-square bg-gray-100 dark:bg-[#1A1A1A] rounded-[24px] md:rounded-[28px] overflow-hidden group relative shadow-sm border border-gray-200 dark:border-white/5"
                          >
                              <div 
                                className="absolute inset-0 z-10 cursor-pointer" 
                                onClick={() => setSelectedCheckin(checkin)} 
                              />

                              {checkin.thumbnailUrl || checkin.imageUrl ? (
                                  <LivePhotoViewer 
                                      imageUrl={checkin.thumbnailUrl || checkin.imageUrl} 
                                      videoUrl={checkin.videoUrl} 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                  />
                              ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                      <Sparkles className="w-8 h-8 text-gray-400 mb-3" strokeWidth={1.5} />
                                      <span className="text-[1.05rem] font-bold text-gray-800 dark:text-gray-200 line-clamp-3 leading-snug">
                                          {checkin.caption ? checkin.caption : 'Ghi chú văn bản'}
                                      </span>
                                  </div>
                              )}
                              
                              <div className="absolute top-3 right-3 p-2 bg-black rounded-[12px] shadow-md pointer-events-none z-20 border border-white/10">
                                  <Bookmark className="w-4 h-4 fill-white text-white" />
                              </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-[#1A1A1A]/40 rounded-[32px] border border-gray-200 dark:border-white/5 flex flex-col items-center">
                            <div className="w-16 h-16 bg-white dark:bg-[#2B2A29] rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-gray-100 dark:border-transparent">
                                <Bookmark className="w-8 h-8 text-gray-400" strokeWidth={2} />
                            </div>
                            <span className="text-black dark:text-white font-bold text-[1.1rem] px-6 tracking-tight mb-2">Chưa có bài đăng nào</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium px-6">Hãy lưu lại các kỷ niệm đẹp để xem lại sau nhé.</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </MainLayout>

      <JourneyAlbumModal 
          journey={selectedJourneyAlbum} 
          onClose={() => setSelectedJourneyAlbum(null)} 
          onCheckinClick={(checkin) => setSelectedCheckin(checkin)} 
      />
      
      {selectedCheckin && (
        <CheckinDetailModal 
          checkin={selectedCheckin} 
          onClose={() => setSelectedCheckin(null)} 
        />
      )}
      
      {showFriendsModal && (
        <FriendsModal 
          isOpen={true} 
          userId={currentProfileId} 
          onClose={() => setShowFriendsModal(false)} 
        />
      )}
    </>
  );
};

export default ProfilePage;