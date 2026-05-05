import React from 'react';
import { 
    MessageCircle, Edit, Archive, Trash2, Package, LogOut, 
    ChevronLeft, UserPlus, Settings 
} from 'lucide-react';
import { BoxDetailResponse } from '../types';

interface BoxHeaderProps {
    box: BoxDetailResponse;
    isOwner: boolean;
    navigate: (path: string) => void;
    menuRef: React.RefObject<HTMLDivElement | null>;
    isMenuOpen: boolean;
    setIsMenuOpen: (val: boolean) => void;
    setIsUpdateBoxModalOpen: (val: boolean) => void;
    handleArchiveBox: () => void;
    handleDisbandBox: () => void;
    setIsMembersModalOpen: (val: boolean) => void;
    handleLeaveBox?: () => void;
}

export const BoxHeader: React.FC<BoxHeaderProps> = ({
    box, isOwner, navigate, menuRef, isMenuOpen, setIsMenuOpen,
    setIsUpdateBoxModalOpen, handleArchiveBox, handleDisbandBox, setIsMembersModalOpen, handleLeaveBox
}) => {
    const isThemeUrl = box.themeSlug && box.themeSlug !== 'default';
    const isAvatarUrl = box.avatar?.includes('/') || box.avatar?.startsWith('http') || box.avatar?.startsWith('blob:');

    return (
        <>
            {/* HEADER - Đè lên thumbnail */}
            <div className="absolute top-0 left-0 right-0 z-[100] w-full flex flex-col bg-transparent transition-all">
                <div className="w-full flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
                    
                    {/* Trái: Quay lại (Đã thêm nền bg-white/90 để nổi bật) */}
                    <button 
                        onClick={() => navigate('/box')} 
                        className="flex items-center gap-1.5 md:gap-2 font-bold text-[#1A1A1A] dark:text-white bg-white/90 dark:bg-[#1A1A1A]/90 shadow-sm hover:bg-white dark:hover:bg-[#2B2A29] px-3 py-1.5 md:py-2 rounded-xl md:rounded-[14px] transition-all active:scale-95"
                    >
                        <ChevronLeft size={20} strokeWidth={2.5} /> 
                        <span className="text-[0.95rem] md:text-[1rem]">Quay lại</span>
                    </button>

                    {/* Phải: Các nút thao tác (Đã thêm nền) */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <button 
                            onClick={() => navigate(`/chat?boxId=${box.id}`)}
                            className="flex items-center gap-2 font-bold text-[#1A1A1A] dark:text-white bg-white/90 dark:bg-[#1A1A1A]/90 shadow-sm hover:bg-white dark:hover:bg-[#2B2A29] px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-[14px] transition-all active:scale-95"
                        >
                            <MessageCircle size={18} strokeWidth={2.5} /> 
                            <span className="hidden md:inline text-[0.95rem]">Nhắn tin</span>
                        </button>

                        <button 
                            onClick={() => setIsMembersModalOpen(true)}
                            className="flex items-center gap-2 font-bold text-[#1A1A1A] dark:text-white bg-white/90 dark:bg-[#1A1A1A]/90 shadow-sm hover:bg-white dark:hover:bg-[#2B2A29] px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-[14px] transition-all active:scale-95"
                        >
                            <UserPlus size={18} strokeWidth={2.5} /> 
                            <span className="hidden md:inline text-[0.95rem]">Mời thêm</span>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="relative" ref={menuRef}>
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 font-bold text-[#1A1A1A] dark:text-white bg-white/90 dark:bg-[#1A1A1A]/90 shadow-sm hover:bg-white dark:hover:bg-[#2B2A29] px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-[14px] transition-all active:scale-95"
                            >
                                <Settings size={18} strokeWidth={2.5} /> 
                                <span className="hidden md:inline text-[0.95rem]">Cài đặt</span>
                            </button>

                            {isMenuOpen && (
                                <div className="absolute top-[110%] right-0 w-56 bg-white dark:bg-[#1A1A1A] rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.15)] border border-transparent dark:border-[#2B2A29] overflow-hidden animate-in fade-in zoom-in-95 z-50 p-2">
                                    {isOwner ? (
                                        <>
                                            <button onClick={() => { setIsUpdateBoxModalOpen(true); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-[0.95rem] font-medium text-[#1A1A1A] dark:text-white hover:bg-gray-100 dark:hover:bg-[#2B2A29] rounded-[16px] flex items-center gap-3 transition-colors">
                                                <Edit size={18} strokeWidth={2} className="text-[#8A8580]" /> Chỉnh sửa
                                            </button>
                                            <button onClick={handleArchiveBox} className="w-full text-left px-4 py-3 text-[0.95rem] font-medium text-[#1A1A1A] dark:text-white hover:bg-gray-100 dark:hover:bg-[#2B2A29] rounded-[16px] flex items-center gap-3 transition-colors mt-1">
                                                <Archive size={18} strokeWidth={2} className="text-[#8A8580]" /> Lưu trữ
                                            </button>
                                            <div className="h-px bg-gray-200 dark:bg-[#4A4D55]/30 my-2 mx-3" />
                                            <button onClick={handleDisbandBox} className="w-full text-left px-4 py-3 text-[0.95rem] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-[16px] flex items-center gap-3 transition-colors">
                                                <Trash2 size={18} strokeWidth={2} /> Giải tán Box
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => { setIsMenuOpen(false); handleLeaveBox && handleLeaveBox(); }} className="w-full text-left px-4 py-3 text-[0.95rem] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-[16px] flex items-center gap-3 transition-colors">
                                            <LogOut size={18} strokeWidth={2} /> Rời Không gian
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. KHU VỰC THUMBNAIL */}
            <div className="w-full flex flex-col mb-8 md:mb-12 relative z-10">
                <div className="w-full relative flex flex-col items-center z-10">
                    <div className="w-full h-[240px] md:h-[420px] relative overflow-hidden">
                        {isThemeUrl ? (
                            <img src={box.themeSlug} alt="Box Theme" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100 dark:from-[#2B2A29] dark:to-[#1A1A1A]" />
                        )}
                        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white dark:from-[#121212] to-transparent pointer-events-none" />
                    </div>

                    <div className="relative -mt-20 md:-mt-24 z-20">
                        <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-[36px] md:rounded-[48px] border-[8px] border-white dark:border-[#121212] bg-gray-100 dark:bg-[#2B2A29] flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden shrink-0">
                            {isAvatarUrl ? (
                                <img src={box.avatar} className="w-full h-full object-cover" alt="Box Avatar" />
                            ) : box.avatar === '📦' ? (
                                <Package className="w-12 h-12 md:w-16 md:h-16 text-[#8A8580] dark:text-[#A09D9A]" />
                            ) : (
                                <span className="text-[4rem] md:text-[5.5rem] leading-none mb-1 md:mb-2">{box.avatar}</span>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 md:mt-6 px-4 text-center z-20 flex flex-col items-center">
                        <h1 className="text-[2rem] md:text-[2.8rem] font-black text-[#1A1A1A] dark:text-white leading-tight tracking-tight">
                            {box.name}
                        </h1>
                        {box.description && (
                            <p className="text-[1rem] md:text-[1.1rem] font-medium text-[#8A8580] dark:text-[#A09D9A] mt-2 max-w-2xl">
                                {box.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};