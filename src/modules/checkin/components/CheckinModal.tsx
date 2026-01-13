import React from 'react';
import { X, Loader2, Send, MapPin, Smile } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useCheckinModal, ACTIVITY_PRESETS } from '../hooks/useCheckinModal'; // Import Hook

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  journeyId: string;
  onSuccess: () => void;
}

export const CheckinModal: React.FC<CheckinModalProps> = (props) => {
  const { isOpen, onClose, file } = props;

  // [HOOK] Tách biệt logic
  const {
    caption, setCaption,
    location, setLocation,
    selectedActivity, setSelectedActivity,
    customContext, setCustomContext,
    moodEmoji, setMoodEmoji,
    previewUrl,
    isSubmitting,
    showEmojiPicker, setShowEmojiPicker,
    scrollRef, pickerRef,
    dragHandlers,
    handleSubmit
  } = useCheckinModal(props);

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-[calc(100%-32px)] max-w-[440px] max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col rounded-[32px] bg-[#121212] shadow-2xl ring-1 ring-white/10 z-10 transition-all duration-300 my-4">
        
        {/* --- CONTENT --- */}
        <div className="flex flex-col p-3 sm:p-4 gap-4">
            
            {/* 1. IMAGE PREVIEW */}
            <div className="relative w-full aspect-square rounded-[28px] overflow-hidden bg-[#1c1c1e] border border-white/10 shadow-2xl shrink-0 group">
                {previewUrl && <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />}
                
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

                {/* Close Button Inside Image */}
                <div className="absolute top-4 right-4 z-50">
                    <button 
                        onClick={onClose} 
                        className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white border border-white/20 transition-all active:scale-90"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-10 pointer-events-none">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-black/40 border border-white/10 shadow-lg backdrop-blur-md">
                        <span className="text-[18px] leading-none filter drop-shadow-sm">{moodEmoji}</span>
                        <span className="text-[14px] font-bold text-white max-w-[160px] truncate">
                            {customContext || selectedActivity.label}
                        </span>
                    </div>

                    {location && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm ml-1">
                           <MapPin className="w-3 h-3 text-red-500" />
                           <span className="text-zinc-200 text-[11px] font-medium truncate max-w-[140px]">{location}</span>
                        </div>
                    )}
                </div>

                {/* Caption Preview (Pill Style) */}
                <div className="absolute bottom-0 inset-x-0 p-4 z-20 pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-md border border-white/15 shadow-xl w-fit max-w-[95%] rounded-full p-1.5 pr-5 flex items-center gap-3">
                        <div className="shrink-0 w-9 h-9 rounded-full bg-zinc-700 border border-white/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">Me</span>
                        </div>
                        <p className="text-white/95 text-[13px] font-medium leading-relaxed break-words min-w-0 pr-1 drop-shadow-sm">
                           {caption || <span className="italic text-zinc-400/80">Ghi chú...</span>}
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. CONTROLS */}
            <div className="flex flex-col gap-4">
                <div className="relative space-y-2">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cảm xúc & Hoạt động</span>
                      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-xs bg-white/5 hover:bg-white/10 text-zinc-300 px-2.5 py-1 rounded-lg transition-colors border border-white/5 flex items-center gap-1">
                         <Smile className="w-3.5 h-3.5" /><span>Đổi Mood</span>
                      </button>
                    </div>

                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 mb-2 z-50" ref={pickerRef}>
                          <div className="shadow-2xl rounded-2xl overflow-hidden border border-white/10">
                            <EmojiPicker onEmojiClick={(d) => { setMoodEmoji(d.emoji); setShowEmojiPicker(false); }} theme={Theme.DARK} width={280} height={320} previewConfig={{ showPreview: false }} />
                          </div>
                      </div>
                    )}

                    <div ref={scrollRef} className="flex gap-3 overflow-x-auto py-1 no-scrollbar cursor-grab active:cursor-grabbing select-none"
                      {...dragHandlers} // Spread handlers từ hook
                    >
                      {ACTIVITY_PRESETS.map((item) => {
                          const isActive = !customContext && selectedActivity.type === item.type;
                          return (
                            <div key={item.type} onClick={() => { setSelectedActivity(item); setCustomContext(''); }}
                               className={`group flex flex-col items-center gap-1.5 shrink-0 transition-all duration-200 cursor-pointer ${isActive ? 'opacity-100 scale-100' : 'opacity-60 hover:opacity-100'}`}>
                               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md border border-white/5 transition-all ${isActive ? item.color + ' ring-2 ring-white/20' : 'bg-zinc-800 group-hover:bg-zinc-700'}`}>
                                  {item.emoji}
                               </div>
                               <span className="text-[10px] font-medium text-zinc-400 group-hover:text-white transition-colors">{item.label}</span>
                            </div>
                          );
                      })}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-800/50 border border-white/5 focus-within:border-blue-500/50 focus-within:bg-zinc-800 rounded-xl px-3 py-2.5 transition-all">
                          <input value={customContext} onChange={e => setCustomContext(e.target.value)} placeholder="Hoạt động khác..." className="w-full bg-transparent text-xs font-medium text-white placeholder:text-zinc-600 focus:outline-none"/>
                        </div>
                        <div className="bg-zinc-800/50 border border-white/5 focus-within:border-blue-500/50 focus-within:bg-zinc-800 rounded-xl px-3 py-2.5 transition-all flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Địa điểm..." className="w-full bg-transparent text-xs font-medium text-white placeholder:text-zinc-600 focus:outline-none"/>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-zinc-800/50 border border-white/5 focus-within:border-white/20 focus-within:bg-zinc-800 rounded-2xl px-4 py-3 transition-all">
                          <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Ghi chú..." rows={1} className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none resize-none align-middle" style={{ minHeight: '24px', maxHeight: '60px' }}/>
                        </div>
                        <button onClick={handleSubmit} disabled={isSubmitting} className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-zinc-200 active:scale-90 transition-all disabled:opacity-50 disabled:shadow-none shrink-0">
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};