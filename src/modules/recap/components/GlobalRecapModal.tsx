import React from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Play, Download, Zap, Snail, Users, User, CheckCircle2, Video, Search } from 'lucide-react';
import { Checkin } from '@/modules/checkin/types';
import { cn } from '@/lib/utils';
import { useGlobalRecap } from '../hooks/useGlobalRecap';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalRecapModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
      isPreviewing, previewUrl,
      speed, setSpeed, filter, setFilter,
      checkins, selectedIds, isLoadingImages,
      journeys, selectedJourneyIds, setSelectedJourneyIds,
      searchQuery, setSearchQuery, filteredJourneys,
      toggleJourneySelection, toggleImageSelection,
      handlePreview, handleDownload
  } = useGlobalRecap(isOpen);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-6 font-quicksand">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />

      <div className="relative w-full md:w-[480px] h-[95vh] md:h-[90vh] bg-white dark:bg-[#121212] rounded-t-[32px] md:rounded-[40px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full md:zoom-in-95">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4EBE1] dark:border-[#2B2A29] shrink-0">
          <h2 className="text-[#1A1A1A] dark:text-white text-[1.2rem] font-black tracking-tight">Thước Phim Tổng Hợp 🎬</h2>
          <button onClick={onClose} className="p-2 bg-[#F4EBE1] dark:bg-[#2B2A29] rounded-full text-[#8A8580] hover:scale-105 transition-transform"><X size={20} strokeWidth={2.5} /></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          <div className="flex justify-center mb-2">
             {previewUrl ? (
                <div className="w-[280px] h-[280px] bg-black rounded-[40px] shadow-2xl overflow-hidden relative border-4 border-white dark:border-[#2B2A29]">
                    <video src={previewUrl} autoPlay loop playsInline controls className="w-full h-full object-cover" />
                </div>
             ) : (
                <div className="w-[280px] h-[280px] bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] rounded-[40px] border-2 border-dashed border-[#8A8580]/30 flex flex-col items-center justify-center text-[#8A8580]">
                    <Video size={48} className="mb-3 opacity-50" strokeWidth={1.5} />
                    <span className="font-bold text-[0.9rem]">Chưa có xem trước</span>
                </div>
             )}
          </div>

          <div className="bg-[#F4EBE1]/30 dark:bg-[#1A1A1A]/30 p-4 rounded-[24px] border border-[#F4EBE1] dark:border-[#2B2A29]">
              <div className="flex items-center justify-between mb-3">
                  <label className="text-[#8A8580] text-[0.75rem] font-extrabold uppercase tracking-widest">Gom từ Hành Trình ({selectedJourneyIds.size}/{journeys.length})</label>
                  <button onClick={() => setSelectedJourneyIds(selectedJourneyIds.size === journeys.length ? new Set() : new Set(journeys.map(j => j.id)))} className="text-purple-500 font-bold text-[0.8rem]">
                      {selectedJourneyIds.size === journeys.length ? 'Bỏ chọn hết' : 'Chọn tất cả'}
                  </button>
              </div>
              <div className="relative mb-3">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8580]" />
                  <input type="text" placeholder="Tìm kiếm hành trình..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#2B2A29] border border-[#E8E2D9] dark:border-[#3A3734] rounded-xl text-[0.9rem] font-semibold focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
              <div className="max-h-[160px] overflow-y-auto custom-scrollbar flex flex-wrap gap-2 pt-1 pb-1">
                  {filteredJourneys.map(j => (
                      <button key={j.id} onClick={() => toggleJourneySelection(j.id)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] border-2 transition-all text-[0.85rem] font-bold", selectedJourneyIds.has(j.id) ? "bg-purple-500 border-purple-500 text-white shadow-md" : "bg-white dark:bg-[#2B2A29] border-[#E8E2D9] dark:border-[#3A3734] text-[#8A8580] dark:text-[#A09D9A] hover:border-purple-300")}>
                          <span className="text-[1rem] leading-none">{j.avatar && !j.avatar.startsWith('http') ? j.avatar : '🌍'}</span>
                          <span className="truncate max-w-[100px]">{j.name}</span>
                      </button>
                  ))}
              </div>
          </div>

          <div>
            <label className="text-[#8A8580] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2">Ảnh của ai?</label>
            <div className="flex bg-[#F4EBE1] dark:bg-[#1A1A1A] p-1.5 rounded-[20px]">
              <button onClick={() => setFilter('ALL')} className={cn("flex-1 py-2.5 rounded-[16px] text-[0.9rem] font-bold transition-all flex justify-center items-center gap-2", filter === 'ALL' ? "bg-white dark:bg-[#2B2A29] shadow-sm text-[#1A1A1A] dark:text-white" : "text-[#8A8580]")}>
                <Users size={16} /> Cả nhóm
              </button>
              <button onClick={() => setFilter('ME')} className={cn("flex-1 py-2.5 rounded-[16px] text-[0.9rem] font-bold transition-all flex justify-center items-center gap-2", filter === 'ME' ? "bg-white dark:bg-[#2B2A29] shadow-sm text-[#1A1A1A] dark:text-white" : "text-[#8A8580]")}>
                <User size={16} /> Mình tôi
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-[#8A8580] text-[0.75rem] font-extrabold uppercase tracking-widest">Tốc độ</label>
              <span className="text-purple-500 font-black text-[0.8rem]">{speed === 1 ? "Rùa bò" : speed === 5 ? "Flashback" : "Bình thường"}</span>
            </div>
            <input type="range" min="1" max="5" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full h-2 bg-[#F4EBE1] dark:bg-[#2B2A29] rounded-lg appearance-none cursor-pointer accent-purple-500" />
            <div className="flex justify-between text-[#8A8580] mt-2 px-1"><Snail size={14} /><Zap size={14} /></div>
          </div>

          <div>
            <label className="text-[#8A8580] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-3">Thành phẩm ({selectedIds.size}/{checkins.length})</label>
            {isLoadingImages ? (
              <div className="flex justify-center py-4"><Loader2 className="animate-spin text-purple-500" /></div>
            ) : (
              <div className="grid grid-cols-5 gap-2 max-h-[150px] overflow-y-auto custom-scrollbar p-1">
                {checkins.map((c: Checkin) => (
                  <div key={c.id} onClick={() => toggleImageSelection(c.id)} className={cn("aspect-square rounded-[12px] overflow-hidden cursor-pointer relative border-2 transition-all", selectedIds.has(c.id) ? "border-purple-500 scale-[0.95]" : "border-transparent opacity-50")}>
                    <img src={c.thumbnailUrl || c.imageUrl} className="w-full h-full object-cover" alt="img" />
                    {selectedIds.has(c.id) && <div className="absolute top-1 right-1 bg-purple-500 rounded-full text-white"><CheckCircle2 size={12} /></div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-[#F4EBE1] dark:border-[#2B2A29] flex gap-3 shrink-0 bg-white dark:bg-[#121212]">
          <button onClick={handlePreview} disabled={isPreviewing || selectedIds.size === 0} className="flex-1 h-[56px] bg-[#F4EBE1] dark:bg-[#2B2A29] text-[#1A1A1A] dark:text-white rounded-[20px] font-black text-[1rem] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50">
            {isPreviewing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />} Xem Thử
          </button>
          {previewUrl && (
             <button onClick={handleDownload} className="flex-1 h-[56px] bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-[20px] font-black text-[1rem] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-purple-500/30">
               <Download strokeWidth={3} className="w-5 h-5" /> Lưu Máy
             </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};