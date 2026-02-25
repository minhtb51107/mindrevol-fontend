import React, { useState } from 'react';
import { X, Loader2, MapPin, Smile, Maximize, ChevronDown } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import Cropper from 'react-easy-crop';
import { useCheckinModal, ACTIVITY_PRESETS } from '../hooks/useCheckinModal'; 

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  journeyId: string;
  onSuccess: () => void;
}

export const CheckinModal: React.FC<CheckinModalProps> = (props) => {
  const { isOpen, onClose, file } = props;

  const {
    caption, setCaption, location, setLocation, selectedActivity, setSelectedActivity,
    customContext, setCustomContext, moodEmoji, setMoodEmoji, previewUrl, isSubmitting,
    showEmojiPicker, setShowEmojiPicker, pickerRef, handleSubmit,
    crop, setCrop, zoom, setZoom, aspect, setAspect, onCropComplete,
    // Lấy thêm các biến quản lý Dropdown
    activeJourneys, selectedJourneyId, setSelectedJourneyId, 
    isJourneyDropdownOpen, setIsJourneyDropdownOpen, journeyDropdownRef
  } = useCheckinModal(props);

  const [showCropMenu, setShowCropMenu] = useState(false);

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300 px-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[900px] h-[85vh] max-h-[700px] bg-[#1c1c1e] rounded-2xl overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/10 z-10">
        
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/10 shrink-0 bg-[#121212]">
          <button onClick={onClose} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
             <X size={24} strokeWidth={1.5}/>
          </button>
          <h2 className="text-white font-bold text-base">Tạo bài viết mới</h2>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !selectedJourneyId}
            className="text-blue-500 font-bold hover:text-blue-400 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Chia sẻ"}
          </button>
        </div>

        {/* Body 2 Cột */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
            
            {/* CỘT TRÁI: ẢNH VÀ CROP (60%) */}
            <div className="w-full md:w-[55%] h-[50vh] md:h-full bg-black relative group flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
                {previewUrl ? (
                    <Cropper
                        image={previewUrl}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        classes={{ containerClassName: 'bg-black' }}
                    />
                ) : (
                    <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
                )}

                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="relative">
                        <button 
                            onClick={() => setShowCropMenu(!showCropMenu)}
                            className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-colors shadow-lg border border-white/10"
                        >
                            <Maximize size={18} />
                        </button>
                        
                        {/* Menu chọn tỷ lệ */}
                        {showCropMenu && (
                            <div className="absolute bottom-full left-0 mb-2 bg-black/80 backdrop-blur-lg border border-white/10 rounded-xl p-2 flex flex-col gap-1 shadow-2xl">
                                <button onClick={() => {setAspect(1); setShowCropMenu(false)}} className={`text-xs font-medium px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${aspect === 1 ? 'bg-white text-black' : 'text-zinc-300 hover:bg-white/10'}`}>1:1 (Vuông)</button>
                                <button onClick={() => {setAspect(4/5); setShowCropMenu(false)}} className={`text-xs font-medium px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${aspect === 4/5 ? 'bg-white text-black' : 'text-zinc-300 hover:bg-white/10'}`}>4:5 (Dọc)</button>
                                <button onClick={() => {setAspect(16/9); setShowCropMenu(false)}} className={`text-xs font-medium px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${aspect === 16/9 ? 'bg-white text-black' : 'text-zinc-300 hover:bg-white/10'}`}>16:9 (Ngang)</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-4 right-4 w-32 hidden md:block">
                    <input 
                        type="range" value={zoom} min={1} max={3} step={0.1}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full accent-white"
                    />
                </div>
            </div>

            {/* CỘT PHẢI: NỘI DUNG VÀ SETTINGS (45%) */}
            <div className="w-full md:w-[45%] h-full bg-[#121212] overflow-y-auto custom-scrollbar flex flex-col">
                
                {/* [MỚI] CHỌN HÀNH TRÌNH ĐÍCH */}
                <div className="p-4 border-b border-white/10 z-20" ref={journeyDropdownRef}>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Đăng vào Hành trình</span>
                    <div className="relative">
                        <button 
                            onClick={() => setIsJourneyDropdownOpen(!isJourneyDropdownOpen)}
                            className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between hover:bg-zinc-800 transition-colors focus:ring-1 focus:ring-blue-500"
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                {selectedJourneyId ? (() => {
                                    const j = activeJourneys.find(x => x.id === selectedJourneyId);
                                    return j ? (
                                        <>
                                            <span className="text-lg leading-none">{j.avatar || '🚀'}</span>
                                            <span className="text-sm text-white font-bold truncate">{j.name}</span>
                                        </>
                                    ) : <span className="text-sm text-zinc-500">Đang tải...</span>;
                                })() : (
                                    <span className="text-sm text-zinc-500">Vui lòng chọn hành trình...</span>
                                )}
                            </div>
                            <ChevronDown size={18} className={`text-zinc-500 transition-transform ${isJourneyDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown danh sách */}
                        {isJourneyDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c1c1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[200px] overflow-y-auto custom-scrollbar">
                                {activeJourneys.map(j => (
                                    <button
                                        key={j.id}
                                        onClick={() => { setSelectedJourneyId(j.id); setIsJourneyDropdownOpen(false); }}
                                        className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0 ${selectedJourneyId === j.id ? 'bg-blue-500/10' : ''}`}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5" style={{ borderBottom: `2px solid ${j.themeColor || '#3b82f6'}` }}>
                                            <span className="text-sm">{j.avatar || '🚀'}</span>
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className={`text-sm font-bold truncate ${selectedJourneyId === j.id ? 'text-blue-400' : 'text-white'}`}>{j.name}</span>
                                        </div>
                                    </button>
                                ))}
                                {activeJourneys.length === 0 && (
                                    <div className="px-4 py-4 text-sm text-zinc-500 text-center">Bạn chưa tham gia hành trình nào</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Khu vực Ghi chú */}
                <div className="p-4 border-b border-white/10">
                    <textarea 
                        value={caption} 
                        onChange={e => setCaption(e.target.value)} 
                        placeholder="Viết chú thích..." 
                        className="w-full bg-transparent text-[15px] text-white placeholder:text-zinc-500 focus:outline-none resize-none min-h-[120px]"
                    />
                    <div className="flex items-center justify-between mt-2">
                        <button className="p-1.5 -ml-1.5 text-zinc-400 hover:text-white transition-colors">
                            <Smile size={20} />
                        </button>
                        <span className="text-xs text-zinc-600">{caption.length}/2200</span>
                    </div>
                </div>

                {/* Vị trí */}
                <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-zinc-900/20 focus-within:bg-zinc-800/50 transition-colors">
                    <MapPin size={20} className="text-zinc-400 shrink-0" />
                    <input 
                        value={location} 
                        onChange={e => setLocation(e.target.value)} 
                        placeholder="Thêm vị trí" 
                        className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                    />
                </div>

                {/* Cảm xúc & Hoạt động */}
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-zinc-300">Hoạt động & Cảm xúc</span>
                        <div className="relative" ref={pickerRef}>
                            <button 
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors text-lg"
                            >
                                {moodEmoji}
                            </button>
                            {showEmojiPicker && (
                                <div className="absolute top-full right-0 mt-2 z-50 shadow-2xl rounded-2xl overflow-hidden border border-white/10">
                                    <EmojiPicker onEmojiClick={(d) => { setMoodEmoji(d.emoji); setShowEmojiPicker(false); }} theme={Theme.DARK} width={280} height={320} previewConfig={{ showPreview: false }} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {ACTIVITY_PRESETS.map((item) => (
                            <button 
                                key={item.type} 
                                onClick={() => { setSelectedActivity(item); setCustomContext(''); }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                                    (!customContext && selectedActivity.type === item.type)
                                    ? 'bg-white text-black border-white'
                                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                                }`}
                            >
                                <span>{item.emoji}</span> {item.label}
                            </button>
                        ))}
                    </div>

                    <input 
                        value={customContext} 
                        onChange={e => setCustomContext(e.target.value)} 
                        placeholder="Hoặc nhập hoạt động khác..." 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-all mt-2"
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};