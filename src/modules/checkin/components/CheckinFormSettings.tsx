import React from 'react';
import { MapPin, Smile, ChevronDown, Archive, Loader2, Type, Activity, Music, Clock, X, Search, Navigation } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { ACTIVITY_PRESETS, useCheckinModal } from '../hooks/useCheckinModal';
import { cn } from '@/lib/utils';
import { DisplayTag } from '../types';

interface CheckinFormSettingsProps {
    data: ReturnType<typeof useCheckinModal>;
    appTheme: 'light' | 'dark';
}

export const CheckinFormSettings: React.FC<CheckinFormSettingsProps> = ({ data, appTheme }) => {
    const {
        activeTag, setActiveTag,
        caption, setCaption, selectedActivity, setSelectedActivity,
        customContext, setCustomContext, showEmojiPicker, setShowEmojiPicker, 
        pickerRef, emojiTarget, setEmojiTarget, handleEmojiSelect,
        activeJourneys, selectedJourneyId, setSelectedJourneyId, 
        isJourneyDropdownOpen, setIsJourneyDropdownOpen, journeyDropdownRef,
        
        latitude, isLocating, handleAutoLocate, locationSearch, 
        handleLocationInputChange, locationSuggestions, isSearchingLocation, 
        handleSelectSuggestion, locationContainerRef,

        searchMusicQuery, setSearchMusicQuery, isSearchingMusic, musicSearchResults, 
        setMusicSearchResults, selectedTrack, setSelectedTrack, handleSearchMusic
    } = data;

    const renderTagInput = () => {
        switch (activeTag) {
            case 'CAPTION':
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2 pl-1">
                            Câu ngắn gọn
                        </label>
                        <div className="relative">
                            <textarea 
                                maxLength={50}
                                value={caption} onChange={e => setCaption(e.target.value)} 
                                placeholder="Ghi chú điều gì đó (Tối đa 50 ký tự)..."
                                className="w-full bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] rounded-[24px] p-5 text-[1rem] font-bold text-[#1A1A1A] dark:text-white placeholder:text-[#A09D9A] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-white transition-colors min-h-[120px] resize-none shadow-sm" 
                            />
                            <div className="absolute bottom-4 right-4 flex items-center gap-3">
                                <span className="text-[0.75rem] font-extrabold text-[#A09D9A]">{caption.length}/50</span>
                                <button onClick={() => { setEmojiTarget('caption'); setShowEmojiPicker(!showEmojiPicker); }} className="p-2 bg-white dark:bg-[#2B2A29] text-[#8A8580] dark:text-[#A09D9A] hover:text-[#1A1A1A] dark:hover:text-white rounded-[14px] shadow-sm border border-[#D6CFC7]/50 dark:border-transparent transition-all active:scale-95">
                                    <Smile size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'ACTIVITY':
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2 pl-1">
                            Thẻ hoạt động
                        </label>
                        <div className="flex flex-wrap gap-2.5 mb-4">
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
                            <button onClick={() => { setEmojiTarget('activity'); setShowEmojiPicker(!showEmojiPicker); }} className="w-[52px] h-[52px] rounded-[16px] bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] text-[#8A8580] dark:text-[#A09D9A] transition-colors flex items-center justify-center shrink-0">
                                <Smile size={22} strokeWidth={2.5} />
                            </button>
                            <input 
                                value={customContext} onChange={e => setCustomContext(e.target.value)} 
                                placeholder="Hoạt động khác (VD: Đọc sách)" 
                                className="flex-1 h-[52px] bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] focus:border-[#1A1A1A] dark:focus:border-white rounded-[16px] px-5 text-[1rem] font-bold text-[#1A1A1A] dark:text-white placeholder:text-[#A09D9A] outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>
                );
            case 'SPOTIFY':
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300 relative z-20">
                        <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2 pl-1">
                            Thẻ Nhạc
                        </label>
                        {!selectedTrack ? (
                            <div className="relative">
                                <div className="flex items-center bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] focus-within:border-[#1A1A1A] dark:focus-within:border-white rounded-[20px] px-5 h-[56px] transition-all shadow-sm">
                                    <Search size={20} className="text-[#8A8580] dark:text-[#A09D9A] shrink-0 mr-3" />
                                    <input 
                                        value={searchMusicQuery} onChange={handleSearchMusic} placeholder="Tìm bài hát, nghệ sĩ..."
                                        className="w-full bg-transparent text-[1rem] font-bold text-[#1A1A1A] dark:text-white placeholder:text-[#A09D9A] focus:outline-none py-1" 
                                    />
                                    {isSearchingMusic && <Loader2 size={18} className="text-[#8A8580] animate-spin shrink-0 ml-2" />}
                                </div>
                                {musicSearchResults.length > 0 && (
                                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#3A3734] rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar z-50 animate-in fade-in zoom-in-95 p-2">
                                        {musicSearchResults.map((track: any) => (
                                            <button key={track.id} onClick={() => { setSelectedTrack(track); setMusicSearchResults([]); setSearchMusicQuery(""); }} className="w-full text-left px-3 py-2.5 hover:bg-[#F4EBE1] dark:hover:bg-[#2B2A29] rounded-[16px] transition-colors flex items-center gap-3 active:scale-[0.98]">
                                                <img src={track.albumArt} className="w-10 h-10 rounded-lg shadow-sm object-cover shrink-0" alt="album" />
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[0.9rem] font-bold text-[#1A1A1A] dark:text-white truncate">{track.title}</span>
                                                    <span className="text-[0.75rem] font-semibold text-[#8A8580] dark:text-[#A09D9A] truncate">{track.artist}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-[20px] border border-green-200 dark:border-green-800/30">
                                <div className="flex items-center gap-3 min-w-0">
                                    <img src={selectedTrack.albumArt} className="w-12 h-12 rounded-full animate-[spin_4s_linear_infinite] shadow-md border-[2px] border-zinc-800 object-cover shrink-0" alt="vinyl" />
                                    <div className="min-w-0">
                                        <p className="text-[0.95rem] font-bold text-green-700 dark:text-green-400 truncate">{selectedTrack.title}</p>
                                        <p className="text-[0.8rem] text-green-600/70 dark:text-green-500/70 font-semibold truncate">{selectedTrack.artist}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedTrack(null)} className="p-2 hover:bg-green-100 dark:hover:bg-green-800/50 rounded-full transition-colors shrink-0">
                                    <X size={18} className="text-green-700 dark:text-green-400" />
                                </button>
                            </div>
                        )}
                    </div>
                );
            case 'LOCATION':
            case 'TIME':
                return null; // 2 thẻ này hiển thị tự động, ko cần ô nhập
            default:
                return null;
        }
    };

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
                        className="w-full h-[56px] bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] rounded-[20px] px-5 flex items-center justify-between hover:bg-[#F4EBE1] dark:hover:bg-[#2B2A29] transition-all"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            {selectedJourneyId ? (() => {
                                const j = activeJourneys.find(x => x.id === selectedJourneyId);
                                return j ? (
                                    <>
                                        <div className="w-8 h-8 bg-white dark:bg-[#3A3734] rounded-[10px] flex items-center justify-center text-[1.1rem] shadow-sm shrink-0">
                                            {j.avatar || '🌍'}
                                        </div>
                                        <span className="text-[1.05rem] text-[#1A1A1A] dark:text-white font-bold truncate">{j.name}</span>
                                    </>
                                ) : <span className="text-sm text-[#8A8580]">Đang tải...</span>;
                            })() : (
                                <>
                                    <div className="w-8 h-8 bg-white dark:bg-[#3A3734] rounded-[10px] flex items-center justify-center shadow-sm shrink-0">
                                        <Archive className="w-4 h-4 text-[#1A1A1A] dark:text-white" strokeWidth={2.5}/>
                                    </div>
                                    <span className="text-[1.05rem] text-[#1A1A1A] dark:text-white font-bold truncate">Lưu trữ ẩn</span>
                                </>
                            )}
                        </div>
                        <ChevronDown size={20} className="text-[#8A8580] dark:text-[#A09D9A]" strokeWidth={2.5} />
                    </button>
                    
                    {isJourneyDropdownOpen && (
                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#3A3734] rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] z-50 p-2 max-h-[220px] overflow-y-auto animate-in fade-in zoom-in-95">
                            <button onClick={() => { setSelectedJourneyId(''); setIsJourneyDropdownOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-[#F4EBE1] dark:hover:bg-[#2B2A29] rounded-[16px] transition-colors flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#F4EBE1] dark:bg-[#3A3734] rounded-[10px] flex items-center justify-center shrink-0"><Archive className="w-4 h-4 text-[#1A1A1A] dark:text-white"/></div>
                                <span className="text-[1rem] font-bold text-[#1A1A1A] dark:text-white">Lưu trữ ẩn</span>
                            </button>
                            {activeJourneys.map(j => (
                                <button key={j.id} onClick={() => { setSelectedJourneyId(j.id); setIsJourneyDropdownOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-[#F4EBE1] dark:hover:bg-[#2B2A29] rounded-[16px] transition-colors flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#F4EBE1] dark:bg-[#3A3734] rounded-[10px] flex items-center justify-center text-[1.1rem] shrink-0">{j.avatar || '🌍'}</div>
                                    <span className="text-[1rem] font-bold text-[#1A1A1A] dark:text-white truncate">{j.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- KHỐI VỊ TRÍ GỘP CHUNG (CHO CẢ BẢN ĐỒ VÀ THẺ) --- */}
                <div className="relative z-20" ref={locationContainerRef}>
                    <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2 pl-1">
                        Gắn vị trí
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
                                {isLocating ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} strokeWidth={2.5} />}
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

                {/* --- TABS THẺ HIỂN THỊ --- */}
                <div>
                    <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-3 pl-1">
                        Thẻ hiển thị trên ảnh
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'NONE', icon: X, label: 'Không gắn' },
                            { id: 'CAPTION', icon: Type, label: 'Chữ' },
                            { id: 'TIME', icon: Clock, label: 'Giờ' },
                            { id: 'LOCATION', icon: MapPin, label: 'Vị trí' },
                            { id: 'ACTIVITY', icon: Activity, label: 'Hoạt động' },
                            { id: 'SPOTIFY', icon: Music, label: 'Nhạc' },
                        ].map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => setActiveTag(tag.id as DisplayTag)}
                                className={cn(
                                    "px-4 py-2.5 rounded-[16px] text-[0.85rem] font-bold flex items-center gap-2 shrink-0 transition-all border",
                                    activeTag === tag.id
                                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-md -translate-y-0.5"
                                        : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                                )}
                            >
                                <tag.icon size={16} /> {tag.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- INPUT DỰA THEO THẺ ĐƯỢC CHỌN --- */}
                {renderTagInput()}
                
                {/* Emoji Picker Overlay */}
                {showEmojiPicker && (
                    <div className="absolute right-6 bottom-20 z-[60] shadow-2xl rounded-[24px] overflow-hidden border border-[#D6CFC7]/50 dark:border-[#3A3734] bg-white dark:bg-[#1A1A1A] animate-in fade-in slide-in-from-bottom-4">
                        <EmojiPicker onEmojiClick={handleEmojiSelect} theme={appTheme === 'dark' ? Theme.DARK : Theme.LIGHT} width={300} height={350} previewConfig={{ showPreview: false }} />
                    </div>
                )}
            </div>
        </div>
    );
};