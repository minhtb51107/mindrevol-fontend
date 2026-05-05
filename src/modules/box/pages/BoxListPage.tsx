import React, { useState } from 'react';
import { Plus, Package, Check, X, Search, Filter, Sparkles, Heart, Image as ImageIcon, Camera, Film } from 'lucide-react';
import { BoxTab } from '../types';
import MainLayout from '@/components/layout/MainLayout';
import { CreateBoxModal } from '../components/CreateBoxModal'; 
import { BoxCard } from '../components/BoxCard';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useBoxList } from '../hooks/useBoxList';
import { cn } from '@/lib/utils';

const tabs: { id: BoxTab; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'personal', label: 'Cá nhân' },
    { id: 'friends', label: 'Bạn bè' },
    { id: 'invitations', label: 'Lời mời' }
];

const BoxListPage: React.FC = () => {
    const {
        boxes, invitations, loading,
        activeTab, setActiveTab,
        searchQuery, setSearchQuery,
        isCreateModalOpen, setIsCreateModalOpen,
        handleAcceptInvite, handleRejectInvite, fetchData
    } = useBoxList();

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    return (
        <MainLayout>
            <div className="w-full min-h-[100dvh] bg-zinc-50 dark:bg-[#121212] relative overflow-x-hidden transition-colors duration-500 pb-24 font-quicksand">
                <div className="max-w-[1440px] mx-auto px-4 md:px-10 relative z-10 pt-8 md:pt-14">
                    
                    {/* =========================================================
                        [KAWAII MODERN CHINESE BANNER] - ĐÃ SỬA LỖI CHÌM MÀU
                    ========================================================= */}
                    <div className="relative w-full h-[240px] md:h-[300px] rounded-[32px] md:rounded-[40px] mb-8 md:mb-12 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-500 group bg-white dark:bg-[#18181b] dark:ring-1 dark:ring-white/5">
                        
                        {/* ĐÃ SỬA: Thay thế mix-blend-screen bằng mix-blend-normal và màu pastel sáng để nổi bật trên nền tối */}
                        <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[150%] bg-gradient-to-br from-[#FFE1E8] to-[#E2F0FF] dark:from-[#FF8DA1]/20 dark:to-[#8DB8FF]/20 rounded-full blur-[80px] opacity-80 mix-blend-multiply dark:mix-blend-normal animate-[pulse_6s_infinite]"></div>
                        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[120%] bg-gradient-to-tl from-[#FFF0D4] to-[#E8FFEA] dark:from-[#FFAFBD]/20 dark:to-[#A1C4FD]/20 rounded-full blur-[80px] opacity-80 mix-blend-multiply dark:mix-blend-normal animate-[pulse_8s_infinite]"></div>
                        
                        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-[12%] right-[10%] md:right-[15%] w-24 h-32 md:w-36 md:h-48 bg-white/70 dark:bg-white/10 backdrop-blur-xl rounded-xl md:rounded-[20px] p-2 md:p-3 border border-white dark:border-white/20 shadow-xl rotate-12 animate-[bounce_6s_infinite] transition-transform duration-700">
                                <div className="w-full h-[70%] bg-gradient-to-br from-[#FFD6E0] to-[#C9E4FF] dark:from-[#ff9a9e] dark:to-[#fecfef] rounded-lg md:rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
                                    <ImageIcon className="w-6 h-6 md:w-10 md:h-10 text-white/90 drop-shadow-sm" strokeWidth={2} />
                                </div>
                                <div className="w-1/2 h-1.5 md:h-2.5 mt-3 md:mt-4 bg-zinc-200/60 dark:bg-white/20 rounded-full mx-auto"></div>
                            </div>

                            <div className="absolute bottom-[10%] right-[32%] md:right-[35%] w-20 h-28 md:w-28 md:h-36 bg-white/80 dark:bg-white/10 backdrop-blur-xl rounded-xl md:rounded-[18px] p-2 md:p-2.5 border border-white dark:border-white/20 shadow-lg -rotate-6 animate-[bounce_5s_infinite_1s]">
                                <div className="w-full h-[70%] bg-gradient-to-tr from-[#FFDFD6] to-[#E2FFDF] dark:from-[#a18cd1] dark:to-[#fbc2eb] rounded-lg md:rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
                                    <Heart className="w-5 h-5 md:w-8 md:h-8 text-white/90 drop-shadow-sm" fill="currentColor" />
                                </div>
                                <div className="w-2/3 h-1.5 md:h-2 mt-2 md:mt-3 bg-zinc-200/60 dark:bg-white/20 rounded-full mx-auto"></div>
                            </div>

                            <div className="absolute top-[25%] right-[45%] md:right-[42%] w-12 h-12 md:w-16 md:h-16 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-full border border-white dark:border-white/10 shadow-[0_8px_16px_rgba(0,0,0,0.06)] flex items-center justify-center -rotate-12 animate-[bounce_7s_infinite_0.5s]">
                                <Camera className="w-5 h-5 md:w-7 md:h-7 text-[#FF8DA1] dark:text-[#FFAFBD]" strokeWidth={2.5} />
                            </div>

                            <div className="absolute bottom-[35%] right-[5%] md:right-[8%] w-10 h-10 md:w-14 md:h-14 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white dark:border-white/10 shadow-md flex items-center justify-center rotate-45 animate-[bounce_6s_infinite_1.5s]">
                                <Film className="w-4 h-4 md:w-6 md:h-6 text-[#8DB8FF] dark:text-[#A1C4FD]" strokeWidth={2.5} />
                            </div>

                            <Sparkles className="absolute top-[20%] left-[35%] md:left-[45%] w-5 h-5 md:w-7 md:h-7 text-yellow-400/80 animate-[pulse_3s_infinite]" />
                            <Sparkles className="absolute bottom-[20%] left-[10%] w-4 h-4 md:w-5 md:h-5 text-blue-400/60 animate-[pulse_4s_infinite_1s]" />
                        </div>

                        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 z-20 pointer-events-none">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/60 dark:border-white/10 w-fit mb-3 md:mb-5 shadow-sm">
                                <ImageIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-700 dark:text-zinc-300" strokeWidth={2.5} />
                                <span className="text-zinc-800 dark:text-zinc-200 text-[10px] md:text-xs font-black tracking-widest uppercase">Trạm Ký Ức</span>
                            </div>
                            
                            <h1 className="text-[2.2rem] md:text-[3.4rem] font-black text-zinc-900 dark:text-white leading-[1.1] tracking-tight">
                                Không gian <br className="md:hidden" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8DA1] to-[#8DB8FF] dark:from-[#FFAFBD] dark:to-[#A1C4FD]">
                                    của bạn
                                </span>
                            </h1>
                            
                            <p className="text-[0.95rem] md:text-[1.1rem] font-bold text-zinc-500 dark:text-zinc-400 mt-3 md:mt-4 max-w-[260px] md:max-w-[420px] leading-relaxed">
                                Trạm dừng chân lưu giữ những mảnh ghép ký ức, góc nhỏ riêng tư để sẻ chia cùng người thương.
                            </p>
                        </div>
                    </div>


                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="hidden md:flex overflow-x-auto custom-scrollbar gap-3 pb-2 -mx-2 px-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "whitespace-nowrap px-6 py-3 rounded-[20px] text-[0.95rem] font-bold transition-all duration-300",
                                        activeTab === tab.id 
                                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md' 
                                            : 'bg-white dark:bg-[#18181b] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-white/10'
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 relative">
                            <div className="relative flex-1 md:w-[320px]">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-zinc-400" strokeWidth={2.5} />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-11 pr-4 h-[52px] md:h-[52px] bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-[18px] md:rounded-[20px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm transition-all font-bold text-[0.95rem]"
                                    placeholder="Tìm kiếm Không gian..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <button 
                                onClick={() => setIsMobileFilterOpen(true)}
                                className={cn(
                                    "md:hidden h-[52px] px-4 rounded-[18px] flex items-center justify-center border transition-all shadow-sm shrink-0",
                                    activeTab !== 'all' 
                                        ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900" 
                                        : "bg-white dark:bg-[#18181b] border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white"
                                )}
                            >
                                <Filter size={22} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>


                    {isMobileFilterOpen && (
                        <div className="md:hidden fixed inset-0 z-[100] flex flex-col justify-end">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileFilterOpen(false)} />
                            <div className="bg-white dark:bg-[#121212] rounded-t-[32px] p-6 relative z-10 animate-in slide-in-from-bottom-full duration-300">
                                <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-6" />
                                <h3 className="text-[1.2rem] font-black text-zinc-900 dark:text-white mb-4 text-center">Phân loại Không gian</h3>
                                <div className="flex flex-col gap-2 pb-6">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setIsMobileFilterOpen(false);
                                            }}
                                            className={cn(
                                                "w-full py-4 px-5 rounded-[20px] text-left font-bold text-[1rem] transition-all flex items-center justify-between",
                                                activeTab === tab.id 
                                                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" 
                                                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400"
                                            )}
                                        >
                                            {tab.label}
                                            {activeTab === tab.id && <Check size={20} strokeWidth={3} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}


                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-zinc-900 dark:border-white border-t-transparent"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'invitations' && (
                                <div className="animate-in fade-in slide-in-from-top-4">
                                    {invitations.length === 0 ? (
                                        <div className="text-center py-20 text-zinc-500 font-bold text-[1.1rem]">Không có lời mời nào.</div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {invitations.map(invite => (
                                                <div key={invite.id} className="bg-white dark:bg-[#18181b] shadow-sm border border-zinc-200 dark:border-white/10 rounded-[28px] md:rounded-[32px] p-5 md:p-6 flex flex-col justify-between transition-all">
                                                    <div className="flex items-center gap-4 overflow-hidden mb-6">
                                                        <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-[20px] flex items-center justify-center shrink-0 overflow-hidden">
                                                            {invite.boxAvatar ? (
                                                                (invite.boxAvatar.includes('/') || invite.boxAvatar.startsWith('http')) ? (
                                                                    <img src={invite.boxAvatar} alt="Box Avatar" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <span className="text-2xl drop-shadow-sm">{invite.boxAvatar}</span>
                                                                )
                                                            ) : invite.inviterAvatar ? (
                                                                <img src={invite.inviterAvatar} alt="Inviter Avatar" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Package size={24} className="text-zinc-400" strokeWidth={2.5} />
                                                            )}
                                                        </div>
                                                        <div className="truncate">
                                                            <p className="text-[0.85rem] text-zinc-500 truncate mb-0.5 font-medium">
                                                                <span className="font-bold text-zinc-900 dark:text-white">{invite.inviterName}</span> mời
                                                            </p>
                                                            <p className="text-[1.1rem] font-bold text-zinc-900 dark:text-white truncate">{invite.boxName}</p>
                                                            <p className="text-[0.75rem] text-zinc-400 mt-0.5 font-bold tracking-wide uppercase">
                                                                {formatDistanceToNow(new Date(invite.sentAt), { addSuffix: true, locale: vi })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <button onClick={() => handleAcceptInvite(invite.id)} className="flex-1 h-12 rounded-[16px] bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-zinc-900 flex items-center justify-center transition-all active:scale-95"><Check size={20} strokeWidth={3} /></button>
                                                        <button onClick={() => handleRejectInvite(invite.id)} className="flex-1 h-12 rounded-[16px] bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:text-red-500 flex items-center justify-center transition-all active:scale-95"><X size={20} strokeWidth={3} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab !== 'invitations' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 pb-16 animate-in fade-in slide-in-from-top-4">
                                    {boxes.length === 0 && searchQuery && (
                                        <div className="col-span-full text-center py-20 text-zinc-500 font-bold text-[1.1rem]">
                                            Không tìm thấy Không gian nào phù hợp với "{searchQuery}".
                                        </div>
                                    )}
                                    <button onClick={() => setIsCreateModalOpen(true)} className="group w-full aspect-[7/4] rounded-[28px] md:rounded-[32px] border-2 border-dashed border-zinc-300 dark:border-white/20 hover:border-zinc-900 dark:hover:border-white bg-transparent hover:bg-zinc-50 dark:hover:bg-white/5 transition-all duration-300 flex flex-col items-center justify-center gap-4 active:scale-[0.98]">
                                        <div className="w-12 h-12 md:w-14 md:h-14 bg-zinc-900 dark:bg-white rounded-[16px] md:rounded-[20px] flex items-center justify-center text-white dark:text-zinc-900 shadow-sm group-hover:-translate-y-1 transition-transform duration-300"><Plus size={24} strokeWidth={3} className="md:w-7 md:h-7" /></div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-zinc-900 dark:text-white text-[1.1rem] md:text-[1.2rem] font-bold">Tạo Không gian</span>
                                            <span className="text-zinc-500 text-[0.85rem] md:text-[0.9rem] font-medium mt-0.5">Mở khu vực riêng của bạn</span>
                                        </div>
                                    </button>
                                    {boxes.map((box) => <BoxCard key={box.id} box={box} />)}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <CreateBoxModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={fetchData} />
        </MainLayout>
    );
};

export default BoxListPage;