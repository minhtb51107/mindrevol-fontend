import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Settings, UserPlus, Loader2, Search, Bell, Layout } from 'lucide-react';
import { useJourneyList } from '../hooks/useJourneyList';
import { useJoinJourney } from '../hooks/useJoinJourney'; 
import { journeyService } from '../services/journey.service';
import { JourneySettingsModal } from './JourneySettingsModal';
import { InviteMembersModal } from './InviteMembersModal';
import { CreateJourneyModal } from './CreateJourneyModal';
import { InvitationList } from './InvitationList';
import { JourneyResponse } from '../types';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { toast } from 'react-hot-toast'; // [MỚI] Thêm toast để thông báo

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const JourneyListModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Hooks Logic
  const { data: journeys, isLoading: listLoading, refresh: refreshList } = useJourneyList();
  const { inviteCode, setInviteCode, handleJoin, isLoading: joinLoading } = useJoinJourney(() => refreshAll());

  // UI State
  const [activeTab, setActiveTab] = useState<'MY_JOURNEYS' | 'INVITATIONS'>('MY_JOURNEYS');
  const [selectedJourney, setSelectedJourney] = useState<JourneyResponse | null>(null);
  const [modalType, setModalType] = useState<'SETTINGS' | 'INVITE' | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // [LOGIC MỚI] Giới hạn hành trình
  const MAX_JOURNEYS = 5;
  const currentCount = journeys.length;
  const isLimitReached = currentCount >= MAX_JOURNEYS;

  // Alert State (Notifications)
  const [alerts, setAlerts] = useState({
    invitations: 0,
    requests: 0,
    journeyIdsWithRequests: new Set<string>()
  });

  useEffect(() => {
    if (isOpen) {
      refreshAll();
    }
  }, [isOpen]);

  const refreshAll = async () => {
    refreshList();
    fetchAlerts();
  };

  const fetchAlerts = async () => {
    try {
      const data = await journeyService.getAlerts();
      setAlerts({
        invitations: data.journeyPendingInvitations,
        requests: data.waitingApprovalRequests,
        journeyIdsWithRequests: new Set(data.journeyIdsWithRequests)
      });
    } catch (e) {
      console.error("Failed to fetch alerts", e);
    }
  };

  if (!isOpen) return null;

  const handleEnterJourney = (journeyId: string) => {
    onClose();
    navigate(`/?journeyId=${journeyId}`);
  };

  // [MỚI] Hàm xử lý khi bấm nút tạo/join mà bị giới hạn
  const handleActionWhenLimitReached = () => {
    if (isLimitReached) {
        toast.error(`Bạn đã đạt giới hạn ${MAX_JOURNEYS} hành trình. Hãy rời hoặc xóa bớt để tiếp tục.`);
        return true;
    }
    return false;
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
          
          {/* Header */}
          <div className="p-6 pb-0 space-y-4 shrink-0">
            <div className="flex items-center justify-between">
              {/* [SỬA] Hiển thị bộ đếm số lượng */}
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl font-bold text-white">Hành trình</h2>
                <span className={`text-sm font-medium ${isLimitReached ? 'text-red-500' : 'text-zinc-500'}`}>
                    ({currentCount}/{MAX_JOURNEYS})
                </span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    if (!handleActionWhenLimitReached()) {
                        setIsCreateOpen(true);
                    }
                  }}
                  disabled={isLimitReached} // [SỬA] Disable nếu full
                  className={`p-2 rounded-full text-white transition-colors ${
                    isLimitReached 
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                  title={isLimitReached ? "Đã đạt giới hạn số lượng" : "Tạo hành trình mới"}
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Join */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder={isLimitReached ? "Đã đạt giới hạn tham gia" : "Nhập mã tham gia..."}
                  disabled={isLimitReached} // [SỬA] Disable input
                  className={`w-full bg-zinc-900 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white outline-none uppercase ${
                    isLimitReached ? 'opacity-50 cursor-not-allowed' : 'focus:border-blue-500'
                  }`}
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                />
              </div>
              <button 
                onClick={() => {
                    if (!handleActionWhenLimitReached()) {
                        handleJoin();
                    }
                }}
                disabled={!inviteCode || joinLoading || isLimitReached} // [SỬA] Disable button
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joinLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Vào'}
              </button>
            </div>

            {/* TABS Navigation */}
            <div className="flex border-b border-white/10 mt-2">
              <button 
                onClick={() => setActiveTab('MY_JOURNEYS')}
                className={`flex-1 pb-3 text-sm font-medium flex justify-center items-center gap-2 relative transition-colors ${
                  activeTab === 'MY_JOURNEYS' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layout className="w-4 h-4" /> Của tôi
                {alerts.requests > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Có yêu cầu tham gia cần duyệt" />
                )}
              </button>
              
              <button 
                onClick={() => setActiveTab('INVITATIONS')}
                className={`flex-1 pb-3 text-sm font-medium flex justify-center items-center gap-2 relative transition-colors ${
                  activeTab === 'INVITATIONS' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Bell className="w-4 h-4" /> Lời mời
                {alerts.invitations > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-bold">
                    {alerts.invitations}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#18181b]">
            
            {activeTab === 'INVITATIONS' ? (
              <div className="space-y-2">
                <InvitationList onSuccess={refreshAll} />
              </div>
            ) : (
              // --- TAB DANH SÁCH CỦA TÔI ---
              <div className="space-y-3">
                {listLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                ) : journeys.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 text-sm">
                    Bạn chưa có hành trình nào. <br/>Hãy tạo mới hoặc nhập mã để tham gia.
                  </div>
                ) : (
                  journeys.map((journey) => {
                    const isOwner = String(user?.id) === String(journey.creatorId);
                    const userRole = journey.currentUserStatus?.role;
                    const isPending = userRole === 'PENDING';
                    
                    const hasPendingRequests = isOwner && alerts.journeyIdsWithRequests.has(journey.id);
                    const canInvite = isOwner || (journey.visibility === 'PUBLIC');

                    return (
                      <div 
                        key={journey.id} 
                        onClick={() => !isPending && handleEnterJourney(journey.id)}
                        className={`group relative bg-zinc-900 border border-white/5 rounded-2xl p-4 transition-all overflow-hidden ${
                          isPending ? 'opacity-60 cursor-not-allowed' : 'hover:border-white/20 cursor-pointer'
                        }`}
                      >
                        {/* ICONS GÓC TRÊN PHẢI */}
                        {!isPending && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                            {canInvite && (
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setSelectedJourney(journey); 
                                  setModalType('INVITE'); 
                                }}
                                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                title="Mời thành viên"
                              >
                                <UserPlus className="w-4 h-4" />
                              </button>
                            )}

                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setSelectedJourney(journey); 
                                setModalType('SETTINGS'); 
                              }}
                              className={`p-2 rounded-full transition-colors relative ${
                                hasPendingRequests 
                                  ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' 
                                  : 'text-zinc-400 hover:text-white hover:bg-white/10'
                              }`}
                              title="Cài đặt hành trình"
                            >
                              <Settings className={`w-4 h-4 ${hasPendingRequests ? 'animate-pulse' : ''}`} />
                              {hasPendingRequests && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#18181b]" />
                              )}
                            </button>
                          </div>
                        )}

                        {/* NỘI DUNG CARD */}
                        <div className="pr-16">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-white text-base truncate">
                              {journey.name}
                            </h3>
                            {isPending && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border bg-orange-500/10 text-orange-400 border-orange-500/20 whitespace-nowrap">
                                CHỜ DUYỆT
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500">
                            {journey.participantCount} thành viên
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals con */}
      {selectedJourney && modalType === 'SETTINGS' && (
        <JourneySettingsModal 
          isOpen={true}
          journey={selectedJourney}
          onClose={() => { setModalType(null); setSelectedJourney(null); }}
          onUpdateSuccess={refreshAll} 
        />
      )}

      {selectedJourney && modalType === 'INVITE' && (
        <InviteMembersModal 
          isOpen={true}
          journeyId={selectedJourney.id}
          inviteCode={selectedJourney.inviteCode}
          onClose={() => { setModalType(null); setSelectedJourney(null); }}
        />
      )}

      <CreateJourneyModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => { setIsCreateOpen(false); refreshAll(); }}
      />
    </>,
    document.body
  );
};