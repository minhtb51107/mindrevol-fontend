// src/modules/map/components/MapHeader.tsx
import React from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapHeaderProps {
    onBack: () => void;
    isSidebarOpen: boolean;
    onOpenSidebar: () => void;
}

export const MapHeader: React.FC<MapHeaderProps> = ({ onBack, isSidebarOpen, onOpenSidebar }) => {
    return (
        <>
            {/* Nút Back & Tiêu đề - Góc trái */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 pointer-events-none font-quicksand">
                <div className="pointer-events-auto flex items-center gap-3 px-5 py-3 bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full shadow-sm transition-colors duration-300">
                    <button 
                        onClick={onBack} 
                        className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors active:scale-95"
                    >
                        <ArrowLeft size={22} strokeWidth={2.5} />
                    </button>
                    <h1 className="text-[1.1rem] md:text-[1.2rem] font-black text-black dark:text-white tracking-tight">
                        Bản đồ Kỷ niệm
                    </h1>
                </div>
            </div>

            {/* Nút Mở Bộ lọc - Góc phải */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 pointer-events-none font-quicksand">
                <button
                    onClick={onOpenSidebar}
                    className={cn(
                        "pointer-events-auto w-[52px] h-[52px] flex items-center justify-center bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full shadow-sm text-black dark:text-white hover:scale-105 active:scale-95 transition-all duration-300",
                        isSidebarOpen ? "opacity-0 invisible scale-90" : "opacity-100 visible scale-100"
                    )}
                >
                    <Filter size={22} strokeWidth={2.5} />
                </button>
            </div>
        </>
    );
};