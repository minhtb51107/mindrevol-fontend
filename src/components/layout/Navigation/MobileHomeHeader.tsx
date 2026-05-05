import React, { useState, useMemo } from 'react';
import { MessageCircle, Users, Bell, Settings, Crown, Gamepad2, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import các Modal và Auth
import { NotificationPanel } from './NotificationPanel';
import { SettingsModal } from '@/modules/user/components/SettingsModal';
import { FriendsModal } from '@/modules/user/components/FriendsModal';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { UpgradeModal } from '@/modules/payment/components/UpgradeModal';

// Component Icon Ngôi sao 4 cánh
const Star4 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 0C12 0 12 10.5 24 12C12 13.5 12 24 12 24C12 24 12 13.5 0 12C12 10.5 12 0 12 0Z" />
  </svg>
);

export const MobileHomeHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isGold = user?.accountType === 'GOLD';
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  // Tạo ngẫu nhiên các vì sao 1 lần duy nhất
  const stars = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 80}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 12 + 8,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  })), []);

  return (
    <>
      <div className="relative w-full h-[300px] block lg:hidden font-quicksand overflow-hidden bg-gradient-to-b from-[#eef2ff] via-[#e0e7ff] to-[#c7d2fe] dark:from-[#0e0e16] dark:via-[#1a1b41] dark:to-[#2e3192] transition-colors duration-500">
        
        {/* ================= BACKGROUND HIỆU ỨNG (Giống Landing Page) ================= */}
        {/* Glows */}
        <div className="absolute top-[10%] right-[-10%] w-[250px] h-[250px] bg-indigo-500/30 dark:bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-500/40 dark:bg-purple-600/30 rounded-full blur-[80px] pointer-events-none" />

        {/* Các vì sao lấp lánh */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute text-indigo-400/50 dark:text-white/30 pointer-events-none flex items-center justify-center"
            style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" />
            </svg>
          </motion.div>
        ))}

        {/* Vật thể mờ ở xa */}
        <div className="absolute top-[20%] right-[10%] w-12 h-12 bg-pink-500/60 dark:bg-pink-500/80 rounded-xl blur-[3px] -rotate-12 flex items-center justify-center z-0">
          <Gamepad2 className="w-6 h-6 text-white opacity-80" />
        </div>
        <div className="absolute bottom-[40%] left-[5%] w-14 h-14 bg-indigo-400/50 dark:bg-indigo-400/70 rounded-full blur-[4px] flex items-center justify-center z-0">
          <Headphones className="w-7 h-7 text-white opacity-80" />
        </div>

        {/* ================= NỘI DUNG FOREGROUND ================= */}
        {/* NÚT UPGRADE / BADGE GOLD */}
        <div className="absolute top-6 right-5 z-50">
          {!isGold ? (
            <button
              onClick={() => setIsUpgradeOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg active:scale-95 transition-transform"
            >
              <Crown size={16} strokeWidth={2.5} />
              <span>Nâng cấp</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg border border-yellow-300 cursor-default">
              <Crown size={16} strokeWidth={2.5} className="drop-shadow-sm" />
              <span>Gold</span>
            </div>
          )}
        </div>

        <div className="relative z-10 w-full h-[200px] flex flex-col items-start justify-center pt-2 px-8">
          <div className="relative ml-2 mb-2"> 
            <Star4 className="absolute -top-3 -left-5 w-6 h-6 text-indigo-500 dark:text-white animate-pulse drop-shadow-md" />
            <Star4 className="absolute -bottom-2 -right-8 w-6 h-6 text-indigo-400 dark:text-white/80 animate-pulse delay-75 drop-shadow-md" />
            <Star4 className="absolute top-1 -right-10 w-4 h-4 text-indigo-300 dark:text-white/60 animate-pulse delay-150 drop-shadow-sm" />
            
            <h1 className="text-slate-900 dark:text-white text-[2.6rem] font-black tracking-tight text-left drop-shadow-sm dark:drop-shadow-xl leading-none transition-colors">
              Mindrevol
            </h1>
          </div>
          
          <p className="text-slate-700 dark:text-zinc-200 text-[0.95rem] font-bold mt-1 text-left max-w-[280px] leading-relaxed drop-shadow-none dark:drop-shadow-md ml-2 transition-colors">
            Lưu giữ những kỷ niệm đẹp nhất cùng người thân yêu.
          </p>
        </div>

        {/* 2. KHỐI NỀN ĐỔI MÀU NỐI MƯỢT VỚI TRANG (Zinc style) */}
        <div className="absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-b from-transparent to-zinc-50 dark:to-[#121212] rounded-t-[40px] z-10 transition-colors duration-500" />

        {/* 3. BỘ 4 NÚT HÀNH ĐỘNG ĐỒNG BỘ STYLE ĐỨT NÉT (Zinc style) */}
        <div className="absolute bottom-8 left-0 w-full flex justify-between sm:justify-center sm:gap-6 z-20 px-6 sm:px-0">
          
          <button 
            onClick={() => setIsNotifOpen(true)} 
            className="w-[60px] h-[60px] md:w-[64px] md:h-[64px] rounded-[22px] bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white shadow-[0_6px_16px_rgba(0,0,0,0.03)] flex items-center justify-center transition-all active:scale-95 hover:-translate-y-1 group relative"
          >
            <Bell size={24} strokeWidth={2.5} className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            <span className="absolute top-2.5 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm animate-pulse" />
          </button>

          <button 
            onClick={() => navigate('/chat')} 
            className="w-[60px] h-[60px] md:w-[64px] md:h-[64px] rounded-[22px] bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white shadow-[0_6px_16px_rgba(0,0,0,0.03)] flex items-center justify-center transition-all active:scale-95 hover:-translate-y-1 group"
          >
            <MessageCircle size={24} strokeWidth={2.5} className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
          </button>

          <button 
            onClick={() => setIsFriendsOpen(true)} 
            className="w-[60px] h-[60px] md:w-[64px] md:h-[64px] rounded-[22px] bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white shadow-[0_6px_16px_rgba(0,0,0,0.03)] flex items-center justify-center transition-all active:scale-95 hover:-translate-y-1 group"
          >
            <Users size={24} strokeWidth={2.5} className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
          </button>

          <button 
            onClick={() => setIsSettingsOpen(true)} 
            className="w-[60px] h-[60px] md:w-[64px] md:h-[64px] rounded-[22px] bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white shadow-[0_6px_16px_rgba(0,0,0,0.03)] flex items-center justify-center transition-all active:scale-95 hover:-translate-y-1 group"
          >
            <Settings size={24} strokeWidth={2.5} className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
          </button>

        </div>
      </div>

      {/* --- PHẦN RENDER CÁC MODAL --- */}
      <NotificationPanel 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {isFriendsOpen && user && (
        <FriendsModal 
          isOpen={true} 
          userId={user.id} 
          onClose={() => setIsFriendsOpen(false)} 
        />
      )}

      {isUpgradeOpen && (
        <UpgradeModal 
          isOpen={isUpgradeOpen} 
          onClose={() => setIsUpgradeOpen(false)} 
        />
      )}
    </>
  );
};