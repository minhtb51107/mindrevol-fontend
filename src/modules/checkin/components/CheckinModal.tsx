import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Send, MapPin, Smile } from 'lucide-react';
import { checkinService } from '@/modules/checkin/services/checkin.service';
import imageCompression from 'browser-image-compression';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Emotion } from '@/modules/feed/types';
import { trackEvent } from '@/lib/analytics'; // [Analytics] Import

// Định nghĩa ActivityType nội bộ
enum UIActivityType {
  LEARNING = 'LEARNING',
  WORKING = 'WORKING',
  EXERCISING = 'EXERCISING',
  CHILLING = 'CHILLING',
  EATING = 'EATING',
  DATING = 'DATING',
  GAMING = 'GAMING',
  TRAVELING = 'TRAVELING',
  READING = 'READING',
  CREATING = 'CREATING',
  CUSTOM = 'CUSTOM'
}

// --- CONFIG PRESETS ---
const ACTIVITY_PRESETS = [
  { type: UIActivityType.LEARNING, label: 'Học bài', emoji: '📚', color: 'bg-blue-600' },
  { type: UIActivityType.WORKING, label: 'Làm việc', emoji: '💼', color: 'bg-slate-600' },
  { type: UIActivityType.EXERCISING, label: 'Tập gym', emoji: '💪', color: 'bg-orange-600' },
  { type: UIActivityType.CHILLING, label: 'Chill', emoji: '🌿', color: 'bg-emerald-600' },
  { type: UIActivityType.EATING, label: 'Ăn uống', emoji: '🍜', color: 'bg-yellow-600' },
  { type: UIActivityType.DATING, label: 'Hẹn hò', emoji: '💕', color: 'bg-pink-600' },
  { type: UIActivityType.GAMING, label: 'Game', emoji: '🎮', color: 'bg-purple-600' },
  { type: UIActivityType.TRAVELING, label: 'Du lịch', emoji: '✈️', color: 'bg-sky-500' },
  { type: UIActivityType.READING, label: 'Đọc sách', emoji: '📖', color: 'bg-amber-700' },
  { type: UIActivityType.CREATING, label: 'Sáng tạo', emoji: '🎨', color: 'bg-rose-500' },
];

// Helper: Map Emoji sang Emotion Enum
const mapEmojiToEmotion = (emoji: string): Emotion => {
  // Mapping đơn giản dựa trên emoji input, bạn có thể mở rộng logic
  return Emotion.NORMAL; 
};

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  journeyId: string;
  onSuccess: () => void;
}

export const CheckinModal: React.FC<CheckinModalProps> = ({ 
  isOpen, onClose, file, journeyId, onSuccess 
}) => {
  // --- STATES ---
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITY_PRESETS[0]);
  const [customContext, setCustomContext] = useState('');
  const [moodEmoji, setMoodEmoji] = useState('✨');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Drag Scroll Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const pickerRef = useRef<HTMLDivElement>(null);

  // --- EFFECTS ---
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen || !file) return null;

  // --- HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/jpeg' };
      let fileToUpload = file;
      if (file.size > 1024 * 1024) {
        try { fileToUpload = await imageCompression(file, options); } catch (e) { console.warn(e); }
      }

      const isCustom = !!customContext;
      const finalEmotion = mapEmojiToEmotion(moodEmoji);
      const finalActivityType = isCustom ? UIActivityType.CUSTOM : selectedActivity.type;

      await checkinService.createCheckin({
        file: fileToUpload,
        journeyId: journeyId,
        caption: caption,
        emotion: finalEmotion,
        activityType: finalActivityType,
        activityName: isCustom ? customContext : selectedActivity.label,
        locationName: location,
        statusRequest: 'NORMAL'
      });
      
      // [Analytics] Đo lường: Retention & Feature Usage
      trackEvent('checkin_completed', {
        journey_id: journeyId,
        has_photo: true,
        word_count: caption.trim().split(/\s+/).length, // Độ dài caption
        emotion_emoji: moodEmoji,
        activity_type: finalActivityType,
        has_location: !!location
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      alert("Lỗi khi đăng bài");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-[440px] max-h-[100dvh] overflow-y-auto no-scrollbar sm:max-h-[92vh] flex flex-col sm:rounded-[40px] bg-[#121212] shadow-2xl ring-1 ring-white/10 z-10 transition-all duration-300">
        
        {/* Close Button */}
        <div className="absolute top-0 left-0 w-full p-5 z-20 flex justify-end pointer-events-none">
          <button onClick={onClose} className="pointer-events-auto p-2 bg-black/30 backdrop-blur-md rounded-full text-white/80 border border-white/10 hover:bg-white/10 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- CONTENT --- */}
        <div className="flex flex-col p-3 sm:p-4 gap-4">
            
            {/* 1. IMAGE PREVIEW */}
            <div className="relative w-full aspect-square rounded-[40px] overflow-hidden bg-[#1c1c1e] border border-white/10 shadow-2xl shrink-0 group">
                {previewUrl && <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />}
                
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                {/* A. BADGES */}
                <div className="absolute top-5 left-5 flex flex-col items-start gap-2 z-10 pointer-events-none">
                    
                    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-lg transition-all backdrop-blur-md border bg-zinc-900/90 border-white/10 shadow-black/20">
                        <span className="text-[18px] leading-none filter drop-shadow-sm">{moodEmoji}</span>
                        <span className="text-[14px] font-bold tracking-wide text-white drop-shadow-sm max-w-[200px] truncate">
                            {customContext || selectedActivity.label}
                        </span>
                    </div>

                    {location && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 shadow-md backdrop-blur-sm ml-1">
                           <MapPin className="w-3.5 h-3.5 text-red-500" />
                           <span className="text-zinc-200 text-[11px] font-medium truncate max-w-[180px]">{location}</span>
                        </div>
                    )}
                </div>

                {/* B. CAPTION PREVIEW */}
                <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-start pointer-events-none">
                    <div className="bg-zinc-950/90 border border-white/10 shadow-2xl backdrop-blur-sm rounded-2xl px-4 py-3 w-fit max-w-[95%]">
                        <p className="text-zinc-100 text-[14px] font-medium leading-relaxed break-words text-left">
                           {caption || <span className="italic text-zinc-500 text-[13px]">Ghi chú...</span>}
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
                      onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
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