import React from 'react';
import { ArrowLeft, MessageCircle, MoreVertical, Edit, Archive, Trash2, Users, UserPlus } from 'lucide-react';
import { BoxResponse } from '../types';

interface BoxHeaderProps {
    box: BoxResponse;
    isOwner: boolean;
    navigate: (path: string) => void;
    menuRef: React.RefObject<HTMLDivElement | null>; // [ĐÃ SỬA LỖI TYPESCRIPT Ở ĐÂY]
    isMenuOpen: boolean;
    setIsMenuOpen: (val: boolean) => void;
    setIsUpdateBoxModalOpen: (val: boolean) => void;
    handleArchiveBox: () => void;
    handleDisbandBox: () => void;
    setIsMembersModalOpen: (val: boolean) => void;
}

export const BoxHeader: React.FC<BoxHeaderProps> = ({
    box, isOwner, navigate, menuRef, isMenuOpen, setIsMenuOpen,
    setIsUpdateBoxModalOpen, handleArchiveBox, handleDisbandBox, setIsMembersModalOpen
}) => {
    return (
        <div className="relative">
            {/* Ảnh bìa */}
            <div className="h-48 md:h-64 w-full bg-zinc-200 dark:bg-zinc-800 relative" style={{ backgroundColor: box.themeColor || undefined }}>
                {/* [ĐÃ SỬA] Gradient tương thích Sáng/Tối: Trên màu nhạt, dưới chìm vào màu nền trang web */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-50/60 dark:from-[#121212] dark:via-[#121212]/60 to-transparent"></div>
            </div>

            {/* Thanh công cụ trên cùng */}
            <div className="absolute top-6 left-4 right-4 md:left-8 md:right-8 flex justify-between items-center z-10">
                <button onClick={() => navigate('/box')} className="w-10 h-10 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-white/60 dark:hover:bg-black/60 transition text-zinc-900 dark:text-white shadow-sm">
                    <ArrowLeft size={20} />
                </button>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => navigate(`/chat?boxId=${box.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900/10 dark:bg-white/10 hover:bg-zinc-900/20 dark:hover:bg-white/20 backdrop-blur-md border border-zinc-900/10 dark:border-white/20 rounded-full font-bold text-sm transition-all text-zinc-900 dark:text-white shadow-sm"
                    >
                        <MessageCircle size={16} />
                        <span className="hidden md:inline">Phòng Chat</span>
                    </button>

                    {isOwner && (
                        <div className="relative" ref={menuRef}>
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="w-10 h-10 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-white/60 dark:hover:bg-black/60 transition text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white shadow-sm"
                            >
                                <MoreVertical size={20} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute top-12 right-0 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 z-50">
                                    <button onClick={() => { setIsUpdateBoxModalOpen(true); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-zinc-800 flex items-center gap-2">
                                        <Edit size={16} /> Chỉnh sửa
                                    </button>
                                    <button onClick={handleArchiveBox} className="w-full text-left px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-zinc-800 flex items-center gap-2">
                                        <Archive size={16} /> Lưu trữ
                                    </button>
                                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
                                    <button onClick={handleDisbandBox} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                                        <Trash2 size={16} /> Giải tán
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Thông tin Box */}
            <div className="max-w-5xl mx-auto px-4 md:px-8 relative -mt-16 md:-mt-20 z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        {box.avatar && <span className="text-4xl md:text-5xl drop-shadow-md">{box.avatar}</span>}
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm text-zinc-900 dark:text-white">{box.name}</h1>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300 text-sm md:text-base max-w-2xl">{box.description || "Nơi lưu giữ những câu chuyện và khoảnh khắc."}</p>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <div onClick={() => setIsMembersModalOpen(true)} className="flex items-center gap-2 bg-zinc-900/5 dark:bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-900/10 dark:border-white/5 cursor-pointer hover:bg-zinc-900/10 dark:hover:bg-white/20 transition-all shadow-sm">
                        <Users size={16} className="text-zinc-700 dark:text-zinc-300" />
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">{box.memberCount} người</span>
                    </div>
                    <button onClick={() => setIsMembersModalOpen(true)} className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all hover:scale-105 active:scale-95">
                        <UserPlus size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};