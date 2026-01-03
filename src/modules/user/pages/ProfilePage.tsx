import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { Settings, Users, ChevronLeft, UserPlus, MessageCircle, UserCheck } from 'lucide-react';
import { UserActiveJourneyResponse } from '@/modules/journey/types';
import { journeyService } from '@/modules/journey/services/journey.service';
import { Checkin } from '@/modules/checkin/types';

import { friendService } from '@/modules/user/services/friend.service'; 
import { userService, UserProfile } from '../services/user.service';

import { CheckinDetailModal } from '@/modules/checkin/components/CheckinDetailModal';
import { JourneyGalleryCard } from '@/modules/journey/components/JourneyGalleryCard';
import { FriendsModal } from '@/modules/user/components/FriendsModal';
import { SettingsModal } from '@/modules/user/components/SettingsModal';
import { RecapAlbumCard } from '@/modules/user/components/RecapAlbumCard';
import { RecapDetailModal } from '@/modules/user/components/RecapDetailModal';
import { Button } from '@/components/ui/Button';

const ProfilePage = () => {
  const { user: authUser } = useAuth();
  const { userId: paramUserId } = useParams<{ userId: string }>(); 
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'FINISHED'>('ACTIVE');
  const [activeJourneys, setActiveJourneys] = useState<UserActiveJourneyResponse[]>([]);
  const [finishedJourneys, setFinishedJourneys] = useState<UserActiveJourneyResponse[]>([]);
  
  const [selectedRecapJourney, setSelectedRecapJourney] = useState<UserActiveJourneyResponse | null>(null);
  const [selectedCheckin, setSelectedCheckin] = useState<Checkin | null>(null);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const isViewingOther = !!paramUserId && paramUserId !== authUser?.id;
  const currentProfileId = isViewingOther ? paramUserId : authUser?.id;

  // 1. Fetch Profile Data
  useEffect(() => {
    if (!currentProfileId) return;
    
    const fetchProfile = async () => {
        try {
            let data;
            if (isViewingOther) {
                data = await userService.getUserProfile(currentProfileId);
            } else {
                data = await userService.getMyProfile();
                data.isMe = true; 
            }
            setUserProfile(data);
        } catch (error) {
            console.error("Lỗi tải thông tin cá nhân:", error);
        }
    };
    fetchProfile();
  }, [currentProfileId, isViewingOther]);

  // 2. Fetch Journeys Data (CẬP NHẬT: Tự phân loại Active/Finished dựa trên ngày thực tế)
  useEffect(() => {
    if (!currentProfileId) return;
    const idStr = String(currentProfileId);

    const fetchAndSortJourneys = async () => {
        try {
            // 1. Tải cả 2 danh sách từ API
            const [activeRes, finishedRes] = await Promise.all([
                journeyService.getUserActiveJourneys(idStr).catch(() => []),
                journeyService.getUserFinishedJourneys(idStr).catch(() => [])
            ]);

            // 2. Gộp lại
            const allJourneys = [...(activeRes || []), ...(finishedRes || [])];
            // Lọc trùng theo ID
            const uniqueJourneys = Array.from(new Map(allJourneys.map(j => [j.id, j])).values());

            // 3. Phân loại lại
            const now = new Date();
            const computedActive: UserActiveJourneyResponse[] = [];
            const computedFinished: UserActiveJourneyResponse[] = [];

            uniqueJourneys.forEach(j => {
                let isExpired = false;
                
                // [FIX] Kiểm tra endDate chuẩn xác đến cuối ngày
                if (j.endDate) {
                    const end = new Date(j.endDate);
                    end.setHours(23, 59, 59, 999);
                    isExpired = end < now;
                }

                // Logic: Kết thúc nếu (status = COMPLETED) HOẶC (đã quá hạn)
                const isCompleted = j.status === 'COMPLETED' || j.status === 'FINISHED' || isExpired;

                if (isCompleted) {
                    computedFinished.push(j);
                } else {
                    computedActive.push(j);
                }
            });

            // 4. Cập nhật State
            setActiveJourneys(computedActive);
            setFinishedJourneys(computedFinished);

        } catch (error) {
            console.error("Lỗi tải/phân loại hành trình:", error);
        }
    };

    fetchAndSortJourneys();

  }, [currentProfileId]);

  // 3. Handle Friend Actions
  const handleFriendRequest = async () => {
    if (!userProfile) return;
    try {
        await friendService.sendFriendRequest(userProfile.id);
        setUserProfile({ ...userProfile, friendshipStatus: 'PENDING' });
    } catch (error) {
        console.error("Failed to send request", error);
    }
  };

  if (!userProfile) return null; 

  const isMe = userProfile.isMe;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#121212] text-white overflow-y-auto no-scrollbar">
      
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <button 
             onClick={() => navigate(-1)} 
             className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-xl rounded-full text-white transition-all border border-white/10 pointer-events-auto"
          >
             <ChevronLeft className="w-6 h-6" />
          </button>

          {isMe && (
            <button 
               onClick={() => setShowSettingsModal(true)}
               className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-xl rounded-full text-white transition-all border border-white/10 pointer-events-auto"
            >
               <Settings className="w-6 h-6" />
            </button>
          )}
      </div>

      <div className="pt-24 px-4 md:px-8 pb-20 w-full max-w-6xl mx-auto">
        
        {/* PROFILE INFO */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
            
            <div className="flex-shrink-0">
                <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-zinc-900 ring-2 ring-white/10 shadow-2xl relative group">
                    <img 
                        src={userProfile.avatarUrl || `https://ui-avatars.com/api/?name=${userProfile.fullname}&background=random`} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                    />
                </div>
            </div>

            <div className="flex-1 text-center md:text-left pt-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{userProfile.fullname}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                         <span className="text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full text-sm font-medium border border-white/5">@{userProfile.handle}</span>
                         
                         {(isMe || userProfile.friendshipStatus === 'ACCEPTED') && (
                             <button 
                               onClick={() => setShowFriendsModal(true)}
                               className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-colors border border-transparent hover:border-zinc-700"
                               title="Danh sách bạn bè"
                             >
                                <Users className="w-5 h-5"/>
                             </button>
                         )}
                    </div>
                </div>

                <p className="text-zinc-400 text-sm md:text-base max-w-2xl mb-5 leading-relaxed">
                    {userProfile.bio || "Chưa có giới thiệu."}
                </p>

                {/* ACTION BUTTONS */}
                {!isMe && (
                    <div className="flex gap-3 justify-center md:justify-start mb-6">
                        {userProfile.friendshipStatus === 'NONE' && (
                            <Button onClick={handleFriendRequest} className="bg-blue-600 hover:bg-blue-700 text-white border-none">
                                <UserPlus className="w-4 h-4 mr-2" /> Kết bạn
                            </Button>
                        )}
                        {userProfile.friendshipStatus === 'PENDING' && (
                            <Button variant="outline" disabled className="text-zinc-400 border-zinc-700">
                                Đã gửi lời mời
                            </Button>
                        )}
                        {userProfile.friendshipStatus === 'ACCEPTED' && (
                            <Button variant="outline" className="text-green-500 border-green-900 bg-green-900/10">
                                <UserCheck className="w-4 h-4 mr-2" /> Bạn bè
                            </Button>
                        )}

                        <Button 
                            variant="secondary" 
                            className="bg-zinc-800 hover:bg-zinc-700 text-white"
                            onClick={() => navigate(`/chat/${userProfile.id}`)}
                        >
                            <MessageCircle className="w-4 h-4 mr-2" /> Nhắn tin
                        </Button>
                    </div>
                )}

                <div className="flex items-center justify-center md:justify-start gap-6 md:gap-10 border-t border-white/5 pt-4">
                    <div className="text-center md:text-left">
                        <div className="text-xl md:text-2xl font-bold text-white">{activeJourneys.length}</div>
                        <div className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Đang chạy</div>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="text-xl md:text-2xl font-bold text-white">{finishedJourneys.length}</div>
                        <div className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Hoàn thành</div>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="text-xl md:text-2xl font-bold text-white">
                            {userProfile.friendCount || 0}
                        </div>
                        <div className="text-xs text-zinc-500 font-medium uppercase tracking-wide">
                            Bạn bè
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* TABS */}
        <div className="border-b border-white/10 mb-8">
            <div className="flex gap-8 justify-center md:justify-start">
              <button 
                onClick={() => setActiveTab('ACTIVE')}
                className={`pb-3 text-sm md:text-base font-bold transition-all relative ${
                    activeTab === 'ACTIVE' 
                    ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                ĐANG HOẠT ĐỘNG
              </button>
              <button 
                onClick={() => setActiveTab('FINISHED')}
                className={`pb-3 text-sm md:text-base font-bold transition-all relative ${
                    activeTab === 'FINISHED' 
                    ? 'text-purple-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-500' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                ĐÃ KẾT THÚC
              </button>
            </div>
        </div>

        {/* CONTENT */}
        <div className="min-h-[400px]">
            {(!isMe && (userProfile.isBlockedByThem || userProfile.isBlockedByMe)) ? (
                <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-white/5">
                    <p className="text-zinc-400">Nội dung không khả dụng.</p>
                </div>
            ) : (
                <>
                    {activeTab === 'ACTIVE' ? (
                      <div className="space-y-8">
                          {activeJourneys.length > 0 ? (
                              activeJourneys.map(journey => (
                                <JourneyGalleryCard 
                                  key={journey.id} 
                                  journey={journey} 
                                  isMe={isMe} 
                                  onCheckinClick={(checkin: Checkin) => setSelectedCheckin(checkin)}
                                />
                              ))
                          ) : (
                              <div className="text-zinc-500 text-center py-10">
                                {isMe ? "Bạn chưa tham gia hành trình nào." : "Người dùng này chưa có hành trình nào."}
                              </div>
                          )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {finishedJourneys && finishedJourneys.length > 0 ? (
                            finishedJourneys.map(journey => (
                                <RecapAlbumCard 
                                    key={journey.id} 
                                    journey={journey}
                                    onClick={() => setSelectedRecapJourney(journey)}
                                />
                            ))
                        ) : (
                              <div className="text-zinc-500 text-center py-10 col-span-full">Chưa có hành trình nào kết thúc.</div>
                        )}
                      </div>
                    )}
                </>
            )}
        </div>

        {/* MODALS */}
        {selectedRecapJourney && (
            <RecapDetailModal 
                journeyId={selectedRecapJourney.id}
                journeyName={selectedRecapJourney.name}
                onClose={() => setSelectedRecapJourney(null)}
                onCheckinClick={(checkin: Checkin) => setSelectedCheckin(checkin)}
            />
        )}

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

        <SettingsModal 
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
        />

      </div>
    </div>
  );
};

export default ProfilePage;