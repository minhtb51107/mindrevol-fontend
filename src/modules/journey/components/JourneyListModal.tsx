// src/modules/journey/components/JourneyListModal.tsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Settings, UserPlus, ArrowRight, Loader2, Search } from 'lucide-react';
import { useJourneyList } from '../hooks/useJourneyList';
import { useJoinJourney } from '../hooks/useJoinJourney'; 
import { JourneySettingsModal } from './JourneySettingsModal';
import { InviteMembersModal } from './InviteMembersModal';
import { CreateJourneyModal } from './CreateJourneyModal';
import { InvitationList } from './InvitationList'; // [MỚI] Import component lời mời
import { JourneyResponse, JourneyRole } from '../types';
import { useAuth } from '@/modules/auth/store/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const JourneyListModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: journeys, isLoading: listLoading, refresh } = useJourneyList();
  
  // Logic nhập mã
  const { inviteCode, setInviteCode, handleJoin, isLoading: joinLoading } = useJoinJourney(() => refresh());

  // Logic Modal con
  const [selectedJourney, setSelectedJourney] = useState<JourneyResponse | null>(null);
  const [modalType, setModalType] = useState<'SETTINGS' | 'INVITE' | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!isOpen) return null;

  // Hàm chuyển trang chính xác
  const handleEnterJourney = (journeyId: string) => {
    onClose();
    // Chuyển hướng về trang chủ kèm tham số journeyId để HomePage tự load feed
    navigate(`/?journeyId=${journeyId}`);
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
          
          {/* Header & Join Code */}
          <div className="p-6 border-b border-white/5 space-y-4 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Hành trình</h2>
              <div className="flex gap-2">
                <button onClick={() => setIsCreateOpen(true)} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-colors"><Plus className="w-5 h-5" /></button>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-400"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Nhập mã tham gia..." 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:border-blue-500 outline-none uppercase"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                />
              </div>
              <button 
                onClick={handleJoin}
                disabled={!inviteCode || joinLoading}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {joinLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Vào'}
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            
            {/* [MỚI] Hiển thị danh sách lời mời (nếu có) */}
            <InvitationList onSuccess={refresh} />

            {listLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
            ) : journeys.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-sm">Bạn chưa có hành trình nào.</div>
            ) : (
              journeys.map((journey) => (
                <div key={journey.id} className="group bg-zinc-900 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="cursor-pointer" onClick={() => handleEnterJourney(journey.id)}>
                      <h3 className="font-bold text-white text-base truncate max-w-[200px] hover:text-blue-400 transition-colors">{journey.name}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">{journey.participantCount} thành viên</p>
                    </div>
                    {/* Role Badge */}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      Number(user?.id) === Number(journey.creatorId)
                      ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' 
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {Number(user?.id) === Number(journey.creatorId) ? 'OWNER' : 'MEMBER'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 border-t border-white/5 pt-3">
                    <button 
                      onClick={() => { setSelectedJourney(journey); setModalType('INVITE'); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-zinc-300 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Mời
                    </button>
                    
                    <button 
                      onClick={() => { setSelectedJourney(journey); setModalType('SETTINGS'); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-zinc-300 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" /> Cài đặt
                    </button>

                    <button 
                      onClick={() => handleEnterJourney(journey.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                    >
                      Truy cập <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedJourney && modalType === 'SETTINGS' && (
        <JourneySettingsModal 
          isOpen={true}
          journey={selectedJourney}
          onClose={() => { setModalType(null); setSelectedJourney(null); }}
          onUpdateSuccess={refresh}
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
        onSuccess={() => { setIsCreateOpen(false); refresh(); }}
      />
    </>,
    document.body
  );
};