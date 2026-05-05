import React from 'react';
import { MapPin, ChevronDown, ChevronRight, X, LayoutGrid, Users, Map as MapIcon, Flame, Ghost, Eye, ScanLine } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { FriendshipResponse } from '@/modules/user/services/friend.service';

interface MapSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    filterType: 'me' | 'box' | 'journey' | 'friend';
    filterId: string;
    boxes: any[]; 
    boxJourneys: Record<string, any[]>;
    friends: FriendshipResponse[];
    expandedBox: string | null;
    mapMode: 'markers' | 'heatmap';
    ghostMode: 'PRECISE' | 'BLURRED' | 'HIDDEN';
    setMapMode: (mode: 'markers' | 'heatmap') => void;
    onGhostModeChange: (mode: 'PRECISE' | 'BLURRED' | 'HIDDEN') => void;
    onSelectMe: () => void;
    onToggleBox: (id: string) => void;
    onSelectBox: (id: string) => void;
    onSelectJourney: (id: string) => void;
    onSelectFriend: (id: string) => void;
}

export const MapSidebar: React.FC<MapSidebarProps> = ({
    isOpen, onClose, filterType, filterId,
    boxes, boxJourneys, expandedBox, friends,
    mapMode, setMapMode, ghostMode, onGhostModeChange,
    onSelectMe, onToggleBox, onSelectBox, onSelectJourney, onSelectFriend
}) => {
    const activeClass = "text-black dark:text-white font-black bg-gray-100/80 dark:bg-white/10";
    const inactiveClass = "text-gray-500 dark:text-gray-400 font-bold hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5";

    return (
        <div className={cn(
            "absolute top-0 right-0 bottom-0 w-[300px] sm:w-[340px] bg-white/95 dark:bg-[#121212]/95 backdrop-blur-3xl z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.05)] border-l border-gray-100 dark:border-white/5 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] font-quicksand",
            isOpen ? "translate-x-0" : "translate-x-full"
        )}>
            
            <div className="pt-10 pb-4 px-6 shrink-0 flex justify-between items-center">
                <h2 className="text-[1.3rem] font-black text-black dark:text-white tracking-tight">Lọc hiển thị</h2>
                <button onClick={onClose} className="p-1 text-gray-400 hover:text-black dark:hover:text-white transition-colors active:scale-95">
                    <X size={24} strokeWidth={2.5} />
                </button>
            </div>

            {/* THÊM TAILWIND CUSTOM SCROLLBAR VÀO THANH CUỘN (w-1) */}
            <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300/50 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                
                {/* --- LỌC NỘI DUNG --- */}
                <div className="space-y-4 border-b border-gray-100 dark:border-white/5 pb-6">
                    <button  
                        onClick={onSelectMe}
                        className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all text-[15px] active:scale-[0.98]", filterType === 'me' ? activeClass : inactiveClass)}
                    >
                        <MapPin size={18} strokeWidth={2.5} /> Tôi
                    </button>

                    <div>
                        <h3 className="text-[0.7rem] font-extrabold text-gray-400 uppercase tracking-widest mb-3 pl-4 flex items-center gap-2"><Users size={14} strokeWidth={3} /> Bạn bè</h3>
                        {friends.length === 0 ? (
                            <p className="text-[0.9rem] text-gray-400 px-4 font-medium italic">Chưa có bạn bè.</p>
                        ) : (
                            <div className="space-y-1">
                                {friends.map(f => (
                                    <button key={f.friend.id} onClick={() => onSelectFriend(f.friend.id)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-[16px] transition-all text-[14px] active:scale-[0.98]", (filterType === 'friend' && filterId === f.friend.id) ? activeClass : inactiveClass)}>
                                        <img src={f.friend.avatarUrl || `https://ui-avatars.com/api/?name=${f.friend.fullname}`} alt="avt" className="w-6 h-6 rounded-full object-cover shadow-sm bg-gray-200" />
                                        <span className="truncate flex-1 text-left">{f.friend.fullname}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-[0.7rem] font-extrabold text-gray-400 uppercase tracking-widest mb-3 pl-4">Không gian</h3>
                        {boxes.length === 0 ? (
                            <p className="text-[0.9rem] text-gray-400 px-4 font-medium italic">Trống.</p>
                        ) : (
                            <div className="space-y-1">
                                {boxes.map(box => (
                                    <div key={box.id} className="flex flex-col">
                                        <div className={cn("flex items-center rounded-[16px] transition-all", (filterType === 'box' && filterId === box.id) ? activeClass : inactiveClass)}>
                                            <button onClick={() => onToggleBox(box.id)} className="p-3.5 opacity-50 hover:opacity-100 transition-opacity">
                                                {expandedBox === box.id ? <ChevronDown size={18} strokeWidth={3} /> : <ChevronRight size={18} strokeWidth={3} />}
                                            </button>
                                            <button onClick={() => onSelectBox(box.id)} className="flex-1 text-left py-3.5 pr-4 text-[15px] truncate">{box.name}</button>
                                        </div>
                                        
                                        <div className={cn("overflow-hidden transition-all duration-300 ease-in-out pl-9", expandedBox === box.id ? "max-h-[500px] opacity-100 mt-1 mb-2" : "max-h-0 opacity-0")}>
                                            <div className="border-l-[2px] border-gray-100 dark:border-white/5 pl-2 py-1 space-y-1">
                                                {boxJourneys[box.id] === undefined ? (
                                                    <p className="text-[0.85rem] font-bold text-gray-300 py-2 pl-3">Đang tải...</p>
                                                ) : boxJourneys[box.id].map(journey => (
                                                    <button key={journey.id} onClick={() => onSelectJourney(journey.id)} className={cn("w-full text-left px-3 py-2.5 rounded-[12px] text-[14px] transition-all flex items-center gap-3 active:scale-[0.98]", (filterType === 'journey' && filterId === journey.id) ? "text-black dark:text-white font-black bg-gray-50 dark:bg-white/5" : "text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50/50 dark:hover:bg-white/5 font-semibold")}>
                                                        <LayoutGrid size={14} strokeWidth={2.5} className={(filterType === 'journey' && filterId === journey.id) ? "text-black dark:text-white" : "text-gray-300 dark:text-gray-600"} />
                                                        <span className="truncate">{journey.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- CHẾ ĐỘ XEM (HEATMAP) --- */}
                <div data-tour="map-mode">
                    <h3 className="text-[0.7rem] font-extrabold text-gray-400 uppercase tracking-widest mb-3 pl-1">Chế độ xem</h3>
                    <div className="flex bg-gray-100 dark:bg-[#1A1A1A] p-1.5 rounded-[16px]">
                        <button onClick={() => setMapMode('markers')} className={cn("flex-1 py-2 rounded-[12px] text-[0.85rem] font-bold transition-all flex items-center justify-center gap-2", mapMode === 'markers' ? "bg-white dark:bg-[#2B2A29] shadow-sm text-black dark:text-white" : "text-gray-500")}>
                            <MapIcon size={16} /> Kỷ niệm
                        </button>
                        <button onClick={() => setMapMode('heatmap')} className={cn("flex-1 py-2 rounded-[12px] text-[0.85rem] font-bold transition-all flex items-center justify-center gap-2", mapMode === 'heatmap' ? "bg-orange-500 shadow-sm text-white" : "text-gray-500")}>
                            <Flame size={16} /> Bản đồ nhiệt
                        </button>
                    </div>
                </div>

                {/* --- GHOST MODE (QUYỀN RIÊNG TƯ) --- */}
                <div data-tour="ghost-mode">
                    <h3 className="text-[0.7rem] font-extrabold text-gray-400 uppercase tracking-widest mb-3 pl-1 flex items-center gap-1">
                        <Ghost size={14} /> Vị trí
                    </h3>
                    <div className="space-y-2">
                        <GhostBtn active={ghostMode === 'PRECISE'} onClick={() => onGhostModeChange('PRECISE')} icon={<ScanLine size={16}/>} title="Chính xác" sub="Bản đồ chuẩn" color="text-green-500" />
                        <GhostBtn active={ghostMode === 'BLURRED'} onClick={() => onGhostModeChange('BLURRED')} icon={<Eye size={16}/>} title="Làm mờ" sub="Lệch ngẫu nhiên ~1km" color="text-blue-500" />
                        <GhostBtn active={ghostMode === 'HIDDEN'} onClick={() => onGhostModeChange('HIDDEN')} icon={<Ghost size={16}/>} title="Tàng hình" sub="Ẩn hoàn toàn khỏi bạn bè" color="text-gray-500" />
                    </div>
                </div>

            </div>
        </div>
    );
};

const GhostBtn = ({ active, onClick, icon, title, sub, color }: any) => (
    <button onClick={onClick} className={cn("w-full flex items-center gap-3 p-3 rounded-[16px] border-2 transition-all text-left", active ? "border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5" : "border-transparent hover:bg-gray-50 dark:hover:bg-white/5")}>
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#1A1A1A] shadow-sm", color)}>{icon}</div>
        <div className="flex flex-col"><span className="text-[0.9rem] font-bold text-black dark:text-white leading-tight">{title}</span><span className="text-[0.7rem] text-gray-500 font-semibold">{sub}</span></div>
    </button>
);