import React from 'react';
import { MessageSquare, Headphones, Gamepad2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DefaultThumbnailProps {
  className?: string;
  text?: string;
}

export const DefaultThumbnail: React.FC<DefaultThumbnailProps> = ({ 
  className, 
  text = "MINDREVOL"
}) => {
  // Khởi tạo các vì sao lấp lánh ngẫu nhiên
  const stars = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
    size: Math.random() * 12 + 8,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className={cn(
      "relative w-full overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#e0e7ff] to-[#f8fafc] dark:from-[#2e3192] dark:via-[#1a1b41] dark:to-[#0e0e16] transition-colors duration-500 flex items-center justify-center group",
      className
    )}>
      
      {/* 1. Lưới nền Blueprint */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none transition-colors" />

      {/* 2. Hiệu ứng Glows vũ trụ */}
      <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[80%] bg-indigo-500/20 dark:bg-indigo-500/30 rounded-full blur-[60px] pointer-events-none transition-transform duration-700" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] bg-pink-500/20 dark:bg-pink-600/20 rounded-full blur-[60px] pointer-events-none transition-transform duration-700" />

      {/* 3. Các ngôi sao lấp lánh */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-indigo-400/50 dark:text-white/40 pointer-events-none flex items-center justify-center transition-colors"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" />
          </svg>
        </motion.div>
      ))}

      {/* 4. Các biểu tượng lơ lửng (Floating Objects) */}
      <motion.div 
        animate={{ y: [-15, 15, -15], rotate: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[15%] w-12 h-12 md:w-16 md:h-16 bg-indigo-500/80 rounded-2xl blur-[4px] rotate-12 shadow-lg flex items-center justify-center z-0"
      >
        <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-white opacity-80" />
      </motion.div>

      <motion.div 
        animate={{ y: [15, -15, 15], rotate: [0, 15, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[25%] left-[10%] w-16 h-16 md:w-20 md:h-20 bg-pink-400/70 rounded-full blur-[5px] shadow-lg flex items-center justify-center z-0"
      >
        <Headphones className="w-8 h-8 md:w-10 md:h-10 text-white opacity-80" />
      </motion.div>

      <motion.div 
        animate={{ y: [-10, 15, -10], rotate: [-10, 15, -10] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[15%] left-[20%] w-10 h-10 md:w-14 md:h-14 bg-emerald-400/60 rounded-[1rem] blur-[3px] -rotate-12 shadow-lg flex items-center justify-center z-0"
      >
        <Gamepad2 className="w-5 h-5 md:w-7 md:h-7 text-white opacity-80" />
      </motion.div>

      <motion.div 
        animate={{ y: [10, -10, 10], rotate: [10, -15, 10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-[30%] right-[25%] w-10 h-10 md:w-14 md:h-14 bg-amber-400/60 rounded-full blur-[3px] shadow-lg flex items-center justify-center z-0"
      >
        <Heart className="w-5 h-5 md:w-7 md:h-7 text-white opacity-80" />
      </motion.div>

      {/* 5. Tên người dùng làm điểm nhấn ở giữa */}
      <div className="relative z-10 flex flex-col items-center justify-center -translate-y-6 md:-translate-y-8 pointer-events-none select-none">
        <span className="text-slate-400 dark:text-indigo-400/60 font-black tracking-[0.4em] text-xs md:text-sm whitespace-nowrap mb-2 transition-colors">
          MINDREVOL UNIVERSE
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800/20 dark:text-white/10 tracking-tight uppercase drop-shadow-sm transition-colors max-w-[90vw] truncate px-4">
          {text}
        </h2>
      </div>

    </div>
  );
};