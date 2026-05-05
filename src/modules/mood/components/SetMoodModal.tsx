import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Music, Search, MapPin, Gamepad2, Coffee, BookOpen, Dumbbell, Zap, Navigation, Disc3, Image as ImageIcon, Sparkles } from 'lucide-react';
import { MoodRequest } from '../types';
import { cn } from '@/lib/utils';
import { useMoodForm } from '../hooks/useMoodForm';
import { MOOD_LIST, MOOD_DICTIONARY } from '../constants/moodAssets';
import { http } from '@/lib/http';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: MoodRequest) => Promise<void>;
    currentIcon?: string;
    currentMessage?: string;
    currentSpotifyTrackId?: string;
    currentActivity?: string;
    currentLocation?: string;
}

const ACTIVITIES = [
    { id: "Đang cày game", icon: <Gamepad2 size={16} />, color: "text-purple-500" },
    { id: "Uống cafe", icon: <Coffee size={16} />, color: "text-amber-600" },
    { id: "Đang học bài", icon: <BookOpen size={16} />, color: "text-blue-500" },
    { id: "Đang tập thể dục", icon: <Dumbbell size={16} />, color: "text-green-500" },
    { id: "Tràn trề năng lượng", icon: <Zap size={16} />, color: "text-yellow-500" },
];

export const SetMoodModal: React.FC<Props> = ({ 
    isOpen, onClose, onSubmit, 
    currentIcon, currentMessage, currentSpotifyTrackId, currentActivity, currentLocation 
}) => {
    const { 
        icon, setIcon, message, setMessage, 
        activity, setActivity, location, setLocation, 
        spotifyTrackId, setSpotifyTrackId,
        loading, handleSubmit,
        isFetchingLocation, handleGetLocation
    } = useMoodForm(isOpen, onClose, onSubmit, currentIcon, currentMessage, currentSpotifyTrackId, currentActivity, currentLocation, "default");
    
    const [activeTab, setActiveTab] = useState<'mood' | 'activity'>('mood');
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedTrack, setSelectedTrack] = useState<any | null>(null);

    const currentAsset = MOOD_DICTIONARY[icon] || MOOD_DICTIONARY['default'];

    const handleSearchMusic = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.trim().length > 2) {
            setIsSearching(true);
            try {
                const response = await http.get(`/spotify/search`, { params: { q: query } });
                const tracks = response.data?.data || response.data || [];
                setSearchResults(tracks);
            } catch (error) {
                console.error("Lỗi tìm nhạc:", error);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSave = async () => {
        await handleSubmit(selectedTrack ? selectedTrack.id : undefined);
        setSelectedTrack(null); 
        setSearchQuery("");
        setTimeout(() => setActiveTab('mood'), 300);
    };

    const handleRemoveOldTrack = () => {
        setSpotifyTrackId(""); 
        setSelectedTrack(null); 
    };

    const renderFormContent = () => (
        <>
            <div className="w-full flex justify-center pt-3 pb-1 lg:hidden shrink-0">
                <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between px-6 py-4 shrink-0">
                <h2 className="text-[1.25rem] font-black text-zinc-900 dark:text-white tracking-tight">Tâm trạng của bạn</h2>
                <button onClick={onClose} className="lg:hidden p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 transition-colors">
                    <X size={20} strokeWidth={2.5} className="text-zinc-600 dark:text-zinc-400" />
                </button>
            </div>

            <div className="px-6 pb-4 shrink-0 z-10">
                <div className={cn("w-full rounded-[28px] p-5 flex flex-col items-center gap-3 border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b transition-colors duration-500 shadow-inner", currentAsset.themeColor)}>
                    <img src={currentAsset.gif} alt={currentAsset.label} className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-xl animate-in zoom-in-95" />
                    <input 
                        type="text" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        placeholder="Hôm nay bạn thấy thế nào?" 
                        maxLength={50} 
                        className="bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-2xl text-center text-zinc-900 dark:text-white placeholder:text-zinc-500 text-[1rem] font-bold w-full py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-sm transition-all" 
                    />
                </div>
            </div>

            <div className="flex w-full px-6 mb-2 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                <button
                    onClick={() => setActiveTab('mood')}
                    className={cn(
                        "flex-1 pb-3 text-[0.85rem] font-bold border-b-[3px] transition-all flex items-center justify-center gap-2", 
                        activeTab === 'mood' ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white" : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    )}
                >
                    <ImageIcon size={16} /> Cảm Xúc
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    className={cn(
                        "flex-1 pb-3 text-[0.85rem] font-bold border-b-[3px] transition-all flex items-center justify-center gap-2 relative", 
                        activeTab === 'activity' ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white" : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    )}
                >
                    <Sparkles size={16} /> Ngữ Cảnh
                    {(location || activity || spotifyTrackId) && activeTab !== 'activity' && (
                        <span className="absolute top-0 right-4 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                    )}
                </button>
            </div>

            {/* CLASS THANH CUỘN MỎNG HOẶC ẨN (Trị triệt để lỗi viền dày) */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full px-6 pt-2 pb-6">
                
                {activeTab === 'mood' && (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                        <h3 className="text-zinc-500 text-[0.7rem] mb-3 font-extrabold uppercase tracking-widest flex items-center gap-2">Kho Mascot</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {MOOD_LIST.map((item) => (
                                <button
                                    type="button"
                                    key={item.id}
                                    onClick={() => setIcon(item.id)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-3 rounded-[20px] transition-all active:scale-95 border-[2px]",
                                        icon === item.id 
                                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md scale-105" 
                                            : "border-transparent bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                    )}
                                >
                                    <img src={item.gif} alt={item.label} className="w-10 h-10 md:w-12 md:h-12 object-contain mb-2" loading="lazy" />
                                    <span className={cn("text-[0.65rem] md:text-[0.7rem] text-center font-extrabold truncate w-full", icon === item.id ? "text-purple-600 dark:text-purple-400" : "text-zinc-500 dark:text-zinc-400")}>
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-zinc-500 text-[0.7rem] mb-2 font-extrabold uppercase tracking-widest flex items-center gap-2">
                                    <MapPin size={14} /> Vị trí
                                </h3>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="VD: Sân trường, Quán Cafe..." 
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[0.9rem] font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleGetLocation} 
                                        disabled={isFetchingLocation}
                                        className="w-[46px] h-[46px] shrink-0 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-xl transition-colors active:scale-95 disabled:opacity-50"
                                    >
                                        {isFetchingLocation ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-zinc-500 text-[0.7rem] mb-2 font-extrabold uppercase tracking-widest">
                                    Đang làm gì
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {ACTIVITIES.map(act => (
                                        <button 
                                            key={act.id}
                                            onClick={() => setActivity(activity === act.id ? "" : act.id)}
                                            className={cn(
                                                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[0.8rem] font-bold border transition-all",
                                                activity === act.id 
                                                    ? "bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-500 shadow-sm scale-105"
                                                    : "bg-zinc-50 border-zinc-200 text-zinc-600 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                            )}
                                        >
                                            <span className={act.color}>{act.icon}</span> {act.id}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-zinc-500 text-[0.7rem] mb-2 font-extrabold uppercase tracking-widest flex items-center gap-2">
                                <Music size={14} /> Gắn nhạc Spotify
                            </h3>
                            {spotifyTrackId && !selectedTrack && (
                                <div className="mb-3 flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-[16px] border border-zinc-200 dark:border-zinc-700">
                                    <div className="flex items-center gap-3">
                                        <Disc3 size={28} className="text-purple-500 animate-[spin_6s_linear_infinite]" />
                                        <div>
                                            <p className="text-[0.8rem] font-bold text-zinc-800 dark:text-zinc-200">Đang phát 1 bài hát</p>
                                            <p className="text-[0.7rem] text-zinc-500">Tải không ghi đè</p>
                                        </div>
                                    </div>
                                    <button onClick={handleRemoveOldTrack} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-red-500">
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                            
                            {!selectedTrack ? (
                                <div className="relative">
                                    <div className="flex items-center bg-zinc-50 dark:bg-zinc-900/50 rounded-xl px-4 py-3 border border-zinc-200 dark:border-zinc-800 focus-within:border-purple-500 transition-colors">
                                        <Search size={16} className="text-zinc-400 mr-2" />
                                        <input 
                                            type="text" 
                                            placeholder={spotifyTrackId ? "Tìm bài khác..." : "Tìm tên bài hát..."}
                                            value={searchQuery}
                                            onChange={handleSearchMusic}
                                            className="bg-transparent w-full focus:outline-none text-[0.9rem] font-bold text-zinc-900 dark:text-white"
                                        />
                                        {isSearching && <Loader2 size={14} className="animate-spin text-zinc-400 ml-2" />}
                                    </div>

                                    {/* THANH CUỘN KHUNG TÌM KIẾM CŨNG ÉP MỎNG LUN */}
                                    {searchResults.length > 0 && (
                                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden z-50 animate-in fade-in max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                                            {searchResults.map(track => (
                                                <div 
                                                    key={track.id} 
                                                    onClick={() => { setSelectedTrack(track); setSearchResults([]); setSearchQuery(""); }}
                                                    className="flex items-center gap-3 p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                                                >
                                                    <img src={track.albumArt} className="w-10 h-10 rounded-lg shadow-sm object-cover" alt="album" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[0.85rem] font-bold text-zinc-900 dark:text-white truncate">{track.title}</p>
                                                        <p className="text-[0.7rem] text-zinc-500 font-semibold truncate">{track.artist}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-2.5 rounded-[16px] border border-green-200 dark:border-green-800/30">
                                    <div className="flex items-center gap-3">
                                        <img src={selectedTrack.albumArt} className="w-10 h-10 rounded-full animate-[spin_4s_linear_infinite] shadow-md border-[2px] border-zinc-800 object-cover" alt="vinyl" />
                                        <div>
                                            <p className="text-[0.85rem] font-bold text-green-700 dark:text-green-400 truncate max-w-[180px]">{selectedTrack.title}</p>
                                            <p className="text-[0.7rem] text-green-600/70 dark:text-green-500/70 font-semibold truncate">{selectedTrack.artist}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedTrack(null)} className="p-2 hover:bg-green-100 dark:hover:bg-green-800/50 rounded-full transition-colors">
                                        <X size={16} className="text-green-700 dark:text-green-400" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 md:p-6 bg-white dark:bg-[#121212] border-t border-zinc-100 dark:border-zinc-800 shrink-0 z-20">
                <button onClick={handleSave} disabled={loading} className="w-full h-[52px] md:h-[56px] rounded-[16px] font-extrabold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:scale-[0.98] transition-all shadow-lg flex justify-center items-center gap-2 text-[1rem]">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lưu thay đổi"}
                </button>
            </div>
        </>
    );

    return (
        <>
            <div className={cn(
                "hidden lg:block h-full transition-all duration-500 ease-in-out shrink-0 overflow-hidden z-30",
                isOpen ? "w-[320px] xl:w-[340px] border-l border-zinc-200/50 dark:border-zinc-800/50" : "w-0 border-l-0"
            )}>
                <div className="w-[320px] xl:w-[340px] h-full flex flex-col bg-white/90 dark:bg-[#121212]/90 backdrop-blur-3xl shadow-[-10px_0_30px_rgba(0,0,0,0.02)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.2)]">
                    {renderFormContent()}
                </div>
            </div>

            {isOpen && createPortal(
                <div className="lg:hidden fixed inset-0 z-[10000] flex items-end justify-center p-0 font-quicksand">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
                    
                    <div className="relative w-full bg-white dark:bg-[#121212] rounded-t-[32px] flex flex-col h-[85vh] animate-in slide-in-from-bottom-1/2 duration-300 ease-out">
                        {renderFormContent()}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};