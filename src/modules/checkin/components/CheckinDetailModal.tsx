import React from 'react';
import { X, Package, FolderInput, Loader2 } from 'lucide-react';
import { Checkin } from '../types';
import { DetailPostCard } from '@/modules/feed/components/DetailPostCard';
import { useCheckinDetail } from '../hooks/useCheckinDetail';

interface Props {
  checkin: Checkin;
  onClose: () => void;
}

export const CheckinDetailModal: React.FC<Props> = ({ checkin, onClose }) => {
  const {
      showMoveMenu, 
      activeJourneys, isMoving, isLoadingJourneys,
      headerTarget, setHeaderTarget,
      handleOpenMoveMenu, handleMoveToJourney, postData
  } = useCheckinDetail({ checkin, onClose });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-6 font-quicksand animate-in fade-in duration-200">
      
      <button onClick={onClose} className="absolute top-6 right-6 z-[10000] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all backdrop-blur-md">
        <X className="w-6 h-6" strokeWidth={2.5} />
      </button>

      <div className="absolute inset-0 z-0" onClick={onClose} />

      <div className="w-full max-w-[500px] flex flex-col items-center justify-center relative z-10 pointer-events-none">
          {!checkin.journeyId && (
              <div className="relative w-full mb-4 pointer-events-auto animate-in slide-in-from-bottom-4 fade-in duration-300 z-[100]">
                  <button onClick={handleOpenMoveMenu} className="w-full py-3.5 px-5 bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 font-bold rounded-[24px] transition-all flex items-center justify-center gap-2 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:scale-[0.98]">
                      <FolderInput size={20} /> <span>Chuyển vào hành trình</span>
                  </button>

                  {showMoveMenu && (
                      <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-2xl overflow-hidden max-h-[300px] flex flex-col z-[100] origin-top animate-in zoom-in-95 duration-200">
                          <div className="px-5 py-3.5 text-[0.75rem] font-extrabold text-white/50 border-b border-white/5 uppercase tracking-widest bg-black/20 shrink-0">Chọn nơi đến</div>
                          <div className="overflow-y-auto custom-scrollbar flex-1">
                              {isLoadingJourneys ? (
                                  <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-white/50" /></div>
                              ) : activeJourneys.length > 0 ? (
                                  activeJourneys.map(j => (
                                      <button key={j.id} disabled={isMoving} onClick={() => handleMoveToJourney(j.id)} className="w-full text-left px-5 py-4 hover:bg-white/10 transition-colors flex items-center gap-3.5 border-b border-white/5 last:border-0 disabled:opacity-50 group">
                                          <div className="w-10 h-10 rounded-[12px] bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-colors shrink-0">
                                              <span className="text-[1.2rem] leading-none">{j.avatar && !j.avatar.startsWith('http') ? j.avatar : '🚀'}</span>
                                          </div>
                                          <span className="text-[0.95rem] font-bold text-white truncate flex-1">{j.name}</span>
                                      </button>
                                  ))
                              ) : (
                                  <div className="px-5 py-8 text-[0.9rem] text-white/50 text-center font-medium flex flex-col items-center gap-2">
                                      <Package size={24} className="opacity-50" /> Bạn chưa tham gia hành trình nào
                                  </div>
                              )}
                          </div>
                      </div>
                  )}
              </div>
          )}

          <div className="w-full pointer-events-auto relative z-10 filter drop-shadow-2xl">
             <div ref={setHeaderTarget} className="w-full absolute -top-[70px] left-0 z-20 pointer-events-none"></div>
             <div className="w-full relative">
                 <DetailPostCard post={postData} isActive={true} headerTarget={headerTarget} />
             </div>
          </div>
      </div>
    </div>
  );
};