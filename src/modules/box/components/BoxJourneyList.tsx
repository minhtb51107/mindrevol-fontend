import React from 'react';
import { Compass, LayoutGrid, ListTree, Plus, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BoxJourneyListProps {
    journeys: any[];
    viewMode: 'grid' | 'timeline';
    setViewMode: (mode: 'grid' | 'timeline') => void;
    setIsCreateJourneyModalOpen: (val: boolean) => void;
    navigate: (path: string) => void;
    boxName: string;
}

const formatDate = (dateString: string) => {
    if (!dateString) return "Kỷ niệm chưa xác định";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' }).format(date); 
};

// [THÊM COMPONENT LƯỚI ẢNH] Lấy dữ liệu thật từ previewImages
const MiniCalendarGrid = ({ previewImages = [] }: { previewImages?: string[] }) => {
    const totalDays = 31; // Lưới 31 ngày tiêu chuẩn
    
    return (
        <div className="grid grid-cols-7 gap-[3px] w-full my-4">
            {Array.from({ length: totalDays }).map((_, i) => {
                const imgUrl = previewImages[i]; 
                return (
                    <div key={i} className={cn(
                        "aspect-square rounded-[3px] overflow-hidden transition-all",
                        imgUrl ? "bg-zinc-800 ring-1 ring-white/10 shadow-sm" : "bg-white/5 border border-white/5"
                    )}>
                        {imgUrl && <img src={imgUrl} alt="checkin" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />}
                    </div>
                );
            })}
        </div>
    );
};

export const BoxJourneyList: React.FC<BoxJourneyListProps> = ({
    journeys, viewMode, setViewMode, setIsCreateJourneyModalOpen, navigate, boxName
}) => {
    return (
        <div className="mt-16">
            {/* --- HEADER KHU VỰC --- */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6 border-b border-zinc-800 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 tracking-wide">
                        <BookOpen className="text-zinc-500" size={28} strokeWidth={1.5} />
                        Các giai đoạn
                    </h2>
                    <p className="text-zinc-500 text-sm mt-2 tracking-wide">Dấu chân thời gian của "{boxName}"</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-zinc-900/50 rounded-full p-1 border border-zinc-800/50">
                        <button 
                            onClick={() => setViewMode('timeline')}
                            className={cn("px-4 py-2 rounded-full transition-all flex items-center gap-2 text-sm font-bold", viewMode === 'timeline' ? "bg-zinc-800 text-zinc-200 shadow-sm" : "text-zinc-600 hover:text-zinc-400")}
                        >
                            <ListTree size={16} /> <span className="hidden sm:inline">Dòng thời gian</span>
                        </button>
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={cn("px-4 py-2 rounded-full transition-all flex items-center gap-2 text-sm font-bold", viewMode === 'grid' ? "bg-zinc-800 text-zinc-200 shadow-sm" : "text-zinc-600 hover:text-zinc-400")}
                        >
                            <LayoutGrid size={16} /> <span className="hidden sm:inline">Dạng lưới</span>
                        </button>
                    </div>

                    <button 
                        onClick={() => setIsCreateJourneyModalOpen(true)} 
                        className="flex items-center gap-2 bg-zinc-200 text-zinc-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-white transition-colors"
                    >
                        <Plus size={18} /><span className="hidden sm:inline">Viết tiếp</span>
                    </button>
                </div>
            </div>

            {/* --- TRẠNG THÁI TRỐNG --- */}
            {journeys.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-zinc-900/20 rounded-2xl border border-zinc-800/50 border-dashed">
                    <BookOpen className="text-zinc-700 w-12 h-12 mb-4" strokeWidth={1} />
                    <h3 className="text-lg font-bold text-zinc-300 mb-2">Trang giấy còn trống</h3>
                    <p className="text-zinc-600 text-center max-w-sm mb-8 text-sm leading-relaxed">Mỗi không gian là một cuốn sách. Hãy bắt đầu lưu giữ những chương đầu tiên của bạn.</p>
                    <button 
                        onClick={() => setIsCreateJourneyModalOpen(true)} 
                        className="flex items-center gap-2 border border-zinc-700 text-zinc-300 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-800 hover:text-white transition-all"
                    >
                        Bắt đầu chặng đường
                    </button>
                </div>
            ) : (
                <>
                    {/* =========================================
                        CHẾ ĐỘ 1: DẠNG LƯỚI (TỐI GIẢN) 
                    ========================================= */}
                    {viewMode === 'grid' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {journeys.map((journey) => (
                                <div 
                                    key={journey.id} 
                                    onClick={() => navigate(`/journey/${journey.id}`)} 
                                    className="bg-transparent rounded-xl p-4 border border-zinc-800/60 hover:border-zinc-600 transition-all cursor-pointer group flex flex-col h-full"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        {journey.avatar ? (
                                            <span className="text-xl grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100">{journey.avatar}</span>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500"><Compass size={16}/></div>
                                        )}
                                        <h3 className="font-bold text-lg text-zinc-200 group-hover:text-white transition-colors truncate">{journey.name}</h3>
                                    </div>
                                    
                                    {/* NHÚNG LƯỚI ẢNH VÀO GRID */}
                                    <MiniCalendarGrid previewImages={journey.previewImages} />

                                    <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                            {formatDate(journey.createdAt || journey.startDate)}
                                        </span>
                                        <ArrowRight size={14} className="text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* =========================================
                        CHẾ ĐỘ 2: DÒNG THỜI GIAN
                    ========================================= */}
                    {viewMode === 'timeline' && (
                        <div className="w-full">
                            
                            {/* --- MOBILE: TIMELINE DỌC --- */}
                            <div className="block md:hidden relative pl-6 py-4">
                                <div className="absolute top-0 bottom-0 left-[11px] w-[2px] border-l-2 border-dashed border-zinc-800"></div>

                                <div className="space-y-12">
                                    {journeys.map((journey) => (
                                        <div key={journey.id} className="relative group">
                                            <div className="absolute -left-[18px] top-6 w-3 h-3 rounded-full bg-zinc-500 ring-4 ring-[#121212] group-hover:bg-zinc-200 transition-colors z-10"></div>

                                            <div 
                                                onClick={() => navigate(`/journey/${journey.id}`)}
                                                className="ml-6 bg-transparent py-4 cursor-pointer group"
                                            >
                                                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <Clock size={12} /> {formatDate(journey.createdAt || journey.startDate)}
                                                </div>
                                                <h3 className="font-bold text-xl text-zinc-200 group-hover:text-white transition-colors mb-2 flex items-center gap-2">
                                                    {journey.avatar && <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{journey.avatar}</span>}
                                                    {journey.name}
                                                </h3>
                                                
                                                {/* NHÚNG LƯỚI ẢNH VÀO MOBILE TIMELINE */}
                                                <div className="pr-4"><MiniCalendarGrid previewImages={journey.previewImages} /></div>

                                                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center mt-2 group-hover:text-zinc-300 transition-colors">
                                                    Khám phá <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <div className="relative pt-4">
                                        <div className="absolute -left-[16px] top-5 w-2 h-2 rounded-full bg-zinc-700 ring-4 ring-[#121212] z-10"></div>
                                        <span className="ml-6 text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Khởi nguồn</span>
                                    </div>
                                </div>
                            </div>

                            {/* --- DESKTOP: TIMELINE NGANG --- */}
                            <div className="hidden md:flex flex-col relative py-8">
                                <div className="absolute top-[82px] left-0 right-0 h-px border-t-2 border-dashed border-zinc-800 z-0"></div>

                                <div className="flex flex-row overflow-x-auto custom-scrollbar snap-x snap-mandatory gap-8 pb-8 pt-4">
                                    {journeys.map((journey) => (
                                        <div 
                                            key={journey.id} 
                                            className="relative flex flex-col w-[280px] shrink-0 snap-start cursor-pointer group"
                                            onClick={() => navigate(`/journey/${journey.id}`)}
                                        >
                                            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-4 pl-2">
                                                {formatDate(journey.createdAt || journey.startDate)}
                                            </div>

                                            <div className="w-3 h-3 rounded-full bg-zinc-500 ring-4 ring-[#121212] group-hover:bg-zinc-200 transition-colors z-10 relative mb-8"></div>

                                            <div className="bg-transparent hover:bg-zinc-900/30 rounded-xl p-4 transition-all h-full flex flex-col border border-transparent hover:border-zinc-800/50">
                                                <h3 className="font-bold text-lg text-zinc-200 group-hover:text-white transition-colors mb-1 flex items-center gap-2">
                                                    {journey.avatar && <span className="text-xl grayscale group-hover:grayscale-0 opacity-80">{journey.avatar}</span>}
                                                    <span className="truncate">{journey.name}</span>
                                                </h3>
                                                
                                                {/* NHÚNG LƯỚI ẢNH VÀO DESKTOP TIMELINE */}
                                                <MiniCalendarGrid previewImages={journey.previewImages} />

                                                <div className="mt-2 flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-zinc-300 transition-colors">
                                                    Mở chặng đường <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="relative flex flex-col w-[150px] shrink-0 snap-start">
                                        <div className="text-[11px] text-transparent mb-4">.</div>
                                        <div className="w-2 h-2 rounded-full bg-zinc-700 ring-4 ring-[#121212] z-10 relative mb-8"></div>
                                        <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Khởi nguồn</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </>
            )}
        </div>
    );
};