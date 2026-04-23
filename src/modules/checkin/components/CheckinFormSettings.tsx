import React from 'react';
import { MapPin, Smile, ChevronDown, Archive, Loader2 } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { ACTIVITY_PRESETS, useCheckinModal } from '../hooks/useCheckinModal';
import { cn } from '@/lib/utils';

interface CheckinFormSettingsProps {
    data: ReturnType<typeof useCheckinModal>;
    appTheme: 'light' | 'dark';
}

export const CheckinFormSettings: React.FC<CheckinFormSettingsProps> = ({ data, appTheme }) => {
    const {
        caption, setCaption, selectedActivity, setSelectedActivity,
        customContext, setCustomContext, showEmojiPicker, setShowEmojiPicker, 
        pickerRef, emojiTarget, setEmojiTarget, handleEmojiSelect,
        activeJourneys, selectedJourneyId, setSelectedJourneyId, 
        isJourneyDropdownOpen, setIsJourneyDropdownOpen, journeyDropdownRef,
        latitude, isLocating, handleAutoLocate, locationSearch, 
        handleLocationInputChange, locationSuggestions, isSearchingLocation, 
        handleSelectSuggestion, locationContainerRef
    } = data;

    return (
        <div className="w-full md:w-[45%] flex-1 bg-white dark:bg-[#121212] overflow-y-auto custom-scrollbar flex flex-col pb-safe md:pb-0" ref={pickerRef}>
            <div className="p-6 md:p-8 space-y-8 flex-1">
                
                {/* KHỐI CHỌN HÀNH TRÌNH */}
                <div className="relative" ref={journeyDropdownRef}>
                    <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2 pl-1">
                        Đăng vào Hành trình
                    </label>
                    <button 
                        onClick={() => setIsJourneyDropdownOpen(!isJourneyDropdownOpen)} 
                        className="w-full h-[56px] bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] rounded-[20px] px-5 flex items-center justify-between hover:bg-[#F4EBE1] dark:hover:bg-[#2B2A29] transition-all focus:border-[#1A1A1A] dark:focus:border-white"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            {selectedJourneyId ? (() => {
                                const j = activeJourneys.find(x => x.id === selectedJourneyId);
                                return j ? (
                                    <>
                                        <div className="w-8 h-8 bg-white dark:bg-[#3A3734] rounded-[10px] flex items-center justify-center text-[1.1rem] shadow-sm border border-[#D6CFC7]/50 dark:border-transparent shrink-0">
                                            {j.avatar || '🚀'}
                                        </div>
                                        <span className="text-[1.05rem] text-[#1A1A1A] dark:text-white font-bold truncate">{j.name}</span>
                                    </>
                                ) : <span className="text-sm text-[#8A8580]">Đang tải...</span>;
                            })() : (
                                <>
                                    <div className="w-8 h-8 bg-white dark:bg-[#3A3734] rounded-[10px] flex items-center justify-center shadow-sm border border-[#D6CFC7]/50 dark:border-transparent shrink-0">
                                        <Archive className="w-4 h-4 text-[#1A1A1A] dark:text-white" strokeWidth={2.5}/>
                                    </div>
                                    <span className="text-[1.05rem] text-[#1A1A1A] dark:text-white font-bold truncate">Lưu trữ cá nhân</span>
                                </>
                            )}
                        </div>
                        <ChevronDown size={20} className="text-[#8A8580] dark:text-[#A09D9A]" strokeWidth={2.5} />
                    </button>
                    
                    {isJourneyDropdownOpen && (
                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#3A3734] rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] z-50 p-2 max-h-[220px] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95">
                            <button onClick={() => { setSelectedJourneyId(''); setIsJourneyDropdownOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-[#F4EBE1] dark:hover:bg-[#2B2A29] rounded-[16px] transition-colors flex items-center gap-3 active:scale-[0.98]">
                                <div className="w-8 h-8 bg-[#F4EBE1] dark:bg-[#3A3734] rounded-[10px] flex items-center justify-center shrink-0"><Archive className="w-4 h-4 text-[#1A1A1A] dark:text-white" strokeWidth={2.5}/></div>
                                <span className="text-[1rem] font-bold text-[#1A1A1A] dark:text-white truncate">Lưu trữ cá nhân</span>
                            </button>
                            {activeJourneys.map(j => (
                                <button key={j.id} onClick={() => { setSelectedJourneyId(j.id); setIsJourneyDropdownOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-[#F4EBE1] dark:hover:bg-[#2B2A29] rounded-[16px] transition-colors flex items-center gap-3 active:scale-[0.98]">
                                    <div className="w-8 h-8 bg-[#F4EBE1] dark:bg-[#3A3734] rounded-[10px] flex items-center justify-center text-[1.1rem] shrink-0">{j.avatar || '🚀'}</div>
                                    <span className="text-[1rem] font-bold text-[#1A1A1A] dark:text-white truncate">{j.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* GHI CHÚ */}
                <div>
                    <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2 pl-1">
                        Ghi chú & Kỷ niệm
                    </label>
                    <div className="relative">
                        <textarea 
                            value={caption} onChange={e => setCaption(e.target.value)} 
                            placeholder="Chia sẻ câu chuyện của bạn..." 
                            className="w-full bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] rounded-[24px] p-5 text-[1rem] font-bold text-[#1A1A1A] dark:text-white placeholder:text-[#A09D9A] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-colors min-h-[120px] resize-none shadow-sm" 
                        />
                        <div className="absolute bottom-4 right-4 flex items-center gap-3">
                            <span className="text-[0.75rem] font-extrabold text-[#A09D9A]">{caption.length}/2200</span>
                            <button onClick={() => { setEmojiTarget('caption'); setShowEmojiPicker(!showEmojiPicker); }} className="p-2 bg-white dark:bg-[#2B2A29] text-[#8A8580] dark:text-[#A09D9A] hover:text-[#1A1A1A] dark:hover:text-white rounded-[14px] shadow-sm border border-[#D6CFC7]/50 dark:border-transparent transition-all active:scale-95">
                                <Smile size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {showEmojiPicker && emojiTarget === 'caption' && (
                        <div className="absolute right-6 mt-2 z-[60] shadow-[0_16px_40px_rgba(0,0,0,0.12)] rounded-[24px] overflow-hidden border border-[#D6CFC7]/50 dark:border-[#3A3734] bg-white dark:bg-[#1A1A1A] animate-in fade-in slide-in-from-top-2">
                            <EmojiPicker onEmojiClick={handleEmojiSelect} theme={appTheme === 'dark' ? Theme.DARK : Theme.LIGHT} width={300} height={350} previewConfig={{ showPreview: false }} />
                        </div>
                    )}
                </div>

                {/* VỊ TRÍ */}
                <div className="relative z-20" ref={locationContainerRef}>
                    <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2 pl-1">
                        Vị trí
                    </label>
                    <div className="flex items-center gap-3 bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] focus-within:border-[#1A1A1A] dark:focus-within:border-white rounded-[20px] px-5 h-[56px] transition-all shadow-sm">
                        <MapPin size={20} strokeWidth={2.5} className={latitude ? "text-blue-500 shrink-0" : "text-[#8A8580] dark:text-[#A09D9A] shrink-0"} />
                        <div className="flex-1 relative">
                            <input 
                                value={locationSearch} onChange={handleLocationInputChange} placeholder="Tìm kiếm địa điểm..." 
                                className="w-full bg-transparent text-[1rem] font-bold text-[#1A1A1A] dark:text-white placeholder:text-[#A09D9A] focus:outline-none py-1" 
                            />
                        </div>
                        {isSearchingLocation ? <Loader2 size={18} className="text-[#8A8580] animate-spin shrink-0" /> : (
                            <button onClick={handleAutoLocate} disabled={isLocating} className="p-2 rounded-[14px] bg-white dark:bg-[#2B2A29] text-[#8A8580] dark:text-[#A09D9A] hover:text-[#1A1A1A] dark:hover:text-white shadow-sm border border-[#D6CFC7]/50 dark:border-transparent transition-all active:scale-95 shrink-0">
                                {isLocating ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} strokeWidth={2.5} />}
                            </button>
                        )}
                    </div>

                    {locationSuggestions.length > 0 && (
                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#3A3734] rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar z-50 animate-in fade-in zoom-in-95 p-2">
                            {locationSuggestions.map((suggestion, idx) => (
                                <button key={idx} onClick={() => handleSelectSuggestion(suggestion)} className="w-full text-left px-4 py-3 hover:bg-[#F4EBE1] dark:hover:bg-[#2B2A29] rounded-[16px] transition-colors flex items-start gap-3 active:scale-[0.98]">
                                    <MapPin size={18} strokeWidth={2.5} className="text-[#8A8580] dark:text-[#A09D9A] mt-0.5 shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[0.95rem] font-bold text-[#1A1A1A] dark:text-white truncate">{suggestion.name || suggestion.display_name.split(',')[0]}</span>
                                        <span className="text-[0.75rem] font-semibold text-[#8A8580] dark:text-[#A09D9A] truncate">{suggestion.display_name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* HOẠT ĐỘNG */}
                <div className="space-y-4">
                    <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block pl-1">
                        Gắn thẻ hoạt động
                    </label>

                    <div className="flex flex-wrap gap-2.5">
                        {ACTIVITY_PRESETS.map((item) => (
                            <button 
                                key={item.type} 
                                onClick={() => { setSelectedActivity(item); setCustomContext(''); }}
                                className={cn(
                                    "px-4 h-[44px] rounded-[16px] text-[0.95rem] font-bold flex items-center gap-2 transition-all active:scale-95 border",
                                    (!customContext && selectedActivity.type === item.type)
                                    ? "bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] border-transparent shadow-[0_6px_16px_rgba(0,0,0,0.12)] -translate-y-0.5"
                                    : "bg-[#F4EBE1]/50 dark:bg-[#2B2A29] text-[#8A8580] dark:text-[#A09D9A] hover:bg-[#F4EBE1] dark:hover:bg-[#3A3734] border-[#D6CFC7]/50 dark:border-transparent"
                                )}
                            >
                                <span className="text-[1.1rem]">{item.emoji}</span> {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => { setEmojiTarget('activity'); setShowEmojiPicker(!showEmojiPicker); }} className="w-[52px] h-[52px] rounded-[16px] bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] text-[#8A8580] dark:text-[#A09D9A] hover:bg-[#F4EBE1] dark:hover:bg-[#2B2A29] hover:text-[#1A1A1A] dark:hover:text-white transition-colors flex items-center justify-center shrink-0">
                            <Smile size={22} strokeWidth={2.5} />
                        </button>
                        <input 
                            value={customContext} onChange={e => setCustomContext(e.target.value)} 
                            placeholder="Hoạt động khác (VD: Đọc sách)" 
                            className="flex-1 h-[52px] bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] focus:border-[#1A1A1A] dark:focus:border-white rounded-[16px] px-5 text-[1rem] font-bold text-[#1A1A1A] dark:text-white placeholder:text-[#A09D9A] outline-none transition-all shadow-sm"
                        />
                    </div>

                    {showEmojiPicker && emojiTarget === 'activity' && (
                        <div className="absolute right-6 mt-2 z-[60] shadow-[0_16px_40px_rgba(0,0,0,0.12)] rounded-[24px] overflow-hidden border border-[#D6CFC7]/50 dark:border-[#3A3734] bg-white dark:bg-[#1A1A1A] animate-in fade-in slide-in-from-top-2">
                            <EmojiPicker onEmojiClick={handleEmojiSelect} theme={appTheme === 'dark' ? Theme.DARK : Theme.LIGHT} width={300} height={350} previewConfig={{ showPreview: false }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};