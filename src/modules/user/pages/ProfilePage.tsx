import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // [MỚI] Import useNavigate
import { useAuth } from '@/modules/auth/store/AuthContext';
import { 
  Settings, PlayCircle, Calendar, Heart, X, MapPin, 
  Shield, Users, ChevronLeft // [MỚI] Import ChevronLeft
} from 'lucide-react';
import { UserActiveJourneyResponse } from '@/modules/journey/types';
import { journeyService } from '@/modules/journey/services/journey.service';
import { Checkin } from '@/modules/checkin/types';

// Import services & types
import { userService, UserProfile } from '../services/user.service';

// Import Components
import { CheckinDetailModal } from '@/modules/checkin/components/CheckinDetailModal';
import { JourneyGalleryCard } from '@/modules/journey/components/JourneyGalleryCard';
import { FriendsModal } from '@/modules/user/components/FriendsModal';
import { SettingsModal } from '@/modules/user/components/SettingsModal';

// --- COMPONENT CON: RECAP CARD ---
const RecapAlbumCard: React.FC<{ 
    journey: UserActiveJourneyResponse; 
    onClick: () => void 
}> = ({ journey, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative aspect-square bg-zinc-900 rounded-[2rem] overflow-hidden cursor-pointer border border-white/5 hover:border-purple-500/50 transition-all shadow-lg hover:shadow-purple-500/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 group-hover:scale-110 transition-transform duration-500" />
      {journey.checkins && journey.checkins.length > 0 && (
         <img 
            src={journey.checkins[0].imageUrl} 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity blur-[1px] group-hover:blur-none duration-300" 
            alt="cover"
         />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
        <div className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center mb-3 group-hover:bg-purple-500 group-hover:text-white transition-all border border-white/10 group-hover:scale-110 shadow-xl">
            <PlayCircle className="w-7 h-7 text-white/90" />
        </div>
        <h3 className="font-bold text-white text-base md:text-lg line-clamp-2 drop-shadow-lg group-hover:translate-y-1 transition-transform">{journey.name}</h3>
        <div className="flex items-center gap-1 mt-2 text-[10px] md:text-xs text-zinc-300 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <Calendar className="w-3 h-3" />
            <span>Đã hoàn thành</span>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CON: MODAL GRID ---
const RecapAlbumGridModal: React.FC<{ 
    journey: UserActiveJourneyResponse; 
    onClose: () => void;
    onCheckinClick: (checkin: Checkin) => void; 
}> = ({ journey, onClose, onCheckinClick }) => {
    return (
        <div className="fixed inset-0 z-[90] bg-black/95 animate-in fade-in duration-200 flex flex-col h-full">
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-white/10 max-w-7xl mx-auto w-full">
                <div>
                   <h2 className="text-xl font-bold text-white">{journey.name}</h2>
                   <p className="text-sm text-zinc-400">{journey.totalCheckins} khoảnh khắc đáng nhớ</p>
                </div>
                <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-white hover:bg-zinc-700 transition-colors"><X /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-7xl mx-auto">
                    {journey.checkins && journey.checkins.length > 0 ? (
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-20">
                            {journey.checkins.map(checkin => (
                                <div 
                                    key={checkin.id} 
                                    onClick={() => onCheckinClick(checkin)}
                                    className="relative aspect-square bg-zinc-800 rounded-2xl overflow-hidden cursor-pointer group"
                                >
                                    <img 
                                        src={checkin.thumbnailUrl || checkin.imageUrl} 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300" 
                                        loading="lazy"
                                        alt="Checkin"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    {checkin.reactionCount && checkin.reactionCount > 0 ? (
                                        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-white font-bold drop-shadow-md">
                                            <Heart className="w-4 h-4 fill-white"/> {checkin.reactionCount}
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-zinc-500 text-center py-20 text-sm">Chưa có ảnh nào.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
const ProfilePage = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate(); // [MỚI] Hook điều hướng
  
  // State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'FINISHED'>('ACTIVE');
  const [activeJourneys, setActiveJourneys] = useState<UserActiveJourneyResponse[]>([]);
  const [finishedJourneys, setFinishedJourneys] = useState<UserActiveJourneyResponse[]>([]);
  
  // Modal State
  const [selectedRecapAlbum, setSelectedRecapAlbum] = useState<UserActiveJourneyResponse | null>(null);
  const [selectedCheckin, setSelectedCheckin] = useState<Checkin | null>(null);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const userId = authUser?.id; 

  // 1. Fetch User Profile
  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
        try {
            const data = await userService.getMyProfile();
            setUserProfile(data);
        } catch (error) {
            console.error("Lỗi tải thông tin cá nhân:", error);
        }
    };
    fetchProfile();
  }, [userId]);

  // 2. Fetch Journeys
  useEffect(() => {
    if (!userId) return;
    if (activeTab === 'ACTIVE') {
        journeyService.getUserActiveJourneys(userId)
            .then(data => setActiveJourneys(data || []))
            .catch(err => {
                console.error("Load Active Error:", err);
                setActiveJourneys([]);
            });
    } else {
        journeyService.getUserFinishedJourneys(userId)
            .then(data => setFinishedJourneys(data || []))
            .catch(err => {
                console.error("Load Finished Error:", err);
                setFinishedJourneys([]);
            });
    }
  }, [userId, activeTab]);

  if (!authUser) return null;

  const displayUser = userProfile || (authUser as unknown as UserProfile);

  return (
    // [THAY ĐỔI] Không dùng MainLayout nữa để bỏ Sidebar
    <div className="min-h-screen bg-[#121212] text-white">
      
      {/* --- [MỚI] HEADER NAVIGATION --- */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          {/* Nút Quay Lại */}
          <button 
             onClick={() => navigate('/')} 
             className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-xl rounded-full text-white transition-all border border-white/10"
          >
             <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Nút Cài Đặt (Đã chuyển từ vị trí cũ lên đây) */}
          <button 
             onClick={() => setShowSettingsModal(true)}
             className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-xl rounded-full text-white transition-all border border-white/10"
          >
             <Settings className="w-6 h-6" />
          </button>
      </div>

      <div className="pt-24 px-4 md:px-8 pb-20 w-full max-w-6xl mx-auto">
        
        {/* --- HEADER PROFILE --- */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
            
            {/* Avatar */}
            <div className="flex-shrink-0">
                <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-zinc-900 ring-2 ring-white/10 shadow-2xl relative group">
                    <img 
                        src={displayUser.avatarUrl || `https://ui-avatars.com/api/?name=${displayUser.fullname}&background=random`} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                    />
                    {/* Bạn có thể thêm logic click để đổi avatar tại đây */}
                </div>
            </div>

            {/* Info & Stats */}
            <div className="flex-1 text-center md:text-left pt-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{displayUser.fullname}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                         <span className="text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full text-sm font-medium border border-white/5">@{displayUser.handle}</span>
                         
                         {/* Nút Bạn Bè */}
                         <button 
                            onClick={() => setShowFriendsModal(true)}
                            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-colors border border-transparent hover:border-zinc-700"
                            title="Danh sách bạn bè"
                         >
                            <Users className="w-5 h-5"/>
                         </button>
                    </div>
                </div>

                <p className="text-zinc-400 text-sm md:text-base max-w-2xl mb-5 leading-relaxed">
                    {displayUser.bio || "Chưa có giới thiệu."}
                </p>

                {/* Stats Row */}
                <div className="flex items-center justify-center md:justify-start gap-6 md:gap-10 border-t border-white/5 pt-4">
                    <div className="text-center md:text-left">
                        <div className="text-xl md:text-2xl font-bold text-white">{activeJourneys.length}</div>
                        <div className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Đang chạy</div>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="text-xl md:text-2xl font-bold text-white">{finishedJourneys.length}</div>
                        <div className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Hoàn thành</div>
                    </div>
                    
                    <div 
                        className="text-center md:text-left cursor-pointer group"
                        onClick={() => setShowFriendsModal(true)}
                    >
                        <div className="text-xl md:text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                            {displayUser.friendCount || 0}
                        </div>
                        <div className="text-xs text-zinc-500 font-medium uppercase tracking-wide group-hover:text-purple-300 transition-colors">
                            Bạn bè
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- TABS --- */}
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

        {/* --- CONTENT AREA --- */}
        <div className="min-h-[400px]">
            {activeTab === 'ACTIVE' ? (
              <div className="space-y-8">
                  {activeJourneys.length > 0 ? (
                      activeJourneys.map(journey => (
                          <JourneyGalleryCard 
                            key={journey.id} 
                            journey={journey} 
                            onCheckinClick={(checkin) => setSelectedCheckin(checkin)}
                          />
                      ))
                  ) : (
                      <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-[2rem] bg-zinc-900/20">
                          <MapPin className="w-12 h-12 text-zinc-700 mb-3"/>
                          <p className="text-zinc-500 text-base font-medium">Bạn chưa tham gia hành trình nào.</p>
                          <button 
                             onClick={() => navigate('/')} // Quay về Home để tạo mới
                             className="mt-4 text-purple-400 hover:text-purple-300 text-sm font-bold hover:underline"
                          >
                              Khám phá ngay
                          </button>
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
                            onClick={() => setSelectedRecapAlbum(journey)}
                        />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-500 gap-3 border-2 border-dashed border-zinc-800 rounded-[2rem]">
                        <Shield className="w-12 h-12 text-zinc-800"/>
                        <p className="text-base font-medium">Chưa có hành trình nào kết thúc.</p>
                    </div>
                )}
              </div>
            )}
        </div>

        {/* --- MODALS --- */}
        {selectedRecapAlbum && (
            <RecapAlbumGridModal 
                journey={selectedRecapAlbum} 
                onClose={() => setSelectedRecapAlbum(null)}
                onCheckinClick={(checkin) => setSelectedCheckin(checkin)}
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
                onClose={() => setShowFriendsModal(false)} 
            />
        )}

        {/* Settings Modal */}
        <SettingsModal 
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
        />

      </div>
    </div>
  );
};

export default ProfilePage;