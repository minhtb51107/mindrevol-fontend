import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Compass, Gamepad2, Headphones, Sparkles, MessageSquare } from 'lucide-react';

const FEATURES = [
  {
    id: 'connect',
    title: "KẾT NỐI KHÔNG GIỚI HẠN",
    description: "Nhắn tin và gọi điện hoàn toàn miễn phí với chất lượng cao. Giữ liên lạc với những người quan trọng nhất dù bạn ở bất cứ đâu trong không gian số.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000",
    thumb: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=150"
  },
  {
    id: 'memory',
    title: "HÀNH TRÌNH KÝ ỨC",
    description: "Tạo ra những Box hành trình chung để cùng nhau lưu giữ hình ảnh, video và tọa độ những nơi nhóm bạn đã đi qua. Kỷ niệm luôn được bảo vệ an toàn.",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1000",
    thumb: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=150"
  },
  {
    id: 'map',
    title: "BẢN ĐỒ TƯƠNG TÁC",
    description: "Xem vị trí thời gian thực của bạn bè và những khoảnh khắc được gắn trên bản đồ 3D sinh động. Định vị chính xác, chia sẻ dễ dàng.",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1000",
    thumb: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=150"
  }
];

export const FeaturesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % FEATURES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const activeFeature = FEATURES[activeIndex];

  // Khởi tạo sao lấp lánh (vũ trụ)
  const stars = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 90}%`,
    size: Math.random() * 15 + 10,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    // Dải gradient nối tiếp từ HeroSection hỗ trợ cả Sáng và Tối
    <div id="features" className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#eef2ff] via-[#e0e7ff] to-[#f8fafc] dark:from-[#2e3192] dark:via-[#1a1b41] dark:to-[#0e0e16] transition-colors duration-500">
      
      {/* ================= 1. BACKGROUND (ONLINE UNIVERSE) ================= */}
      {/* Blueprint Grid thay đổi màu theo theme */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none transition-colors" />
      
      {/* Space Glows */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[600px] h-[600px] bg-pink-500/10 dark:bg-pink-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Các ngôi sao lấp lánh */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-indigo-400/40 dark:text-white/30 pointer-events-none flex items-center justify-center transition-colors"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" />
          </svg>
        </motion.div>
      ))}

      {/* FLOATING OBJECTS - MỜ (TẠO CHIỀU SÂU BỂ CẢNH) */}
      <motion.div 
        animate={{ y: [-20, 20, -20], rotate: [0, -15, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[40%] w-16 h-16 bg-indigo-500/80 rounded-2xl blur-[5px] rotate-12 shadow-lg flex items-center justify-center z-0"
      >
        <MessageSquare className="w-8 h-8 text-white opacity-80" />
      </motion.div>

      <motion.div 
        animate={{ y: [20, -20, 20], rotate: [0, 15, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[30%] left-[5%] w-24 h-24 bg-pink-400/60 rounded-full blur-[8px] shadow-lg flex items-center justify-center z-0"
      >
        <Headphones className="w-12 h-12 text-white opacity-80" />
      </motion.div>

      {/* ================= 2. VERTICAL BRANDING (LEFT) ================= */}
      <div className="hidden lg:flex absolute left-8 top-0 bottom-0 flex-col justify-end pb-32 z-20 pointer-events-none">
        <span 
          className="text-slate-400 dark:text-zinc-500/60 font-black tracking-[0.3em] text-sm whitespace-nowrap transition-colors"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          EXPLORE FEATURES • MINDREVOL
        </span>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 pt-10">
        
        {/* ================= 4. LEFT: MÀN HÌNH MÁY TÍNH CARTOON ================= */}
        <div className="lg:col-span-7 relative h-[400px] md:h-[550px] w-full flex items-center justify-center lg:justify-start perspective-1000">
          
          {/* Bóng dưới sàn màn hình */}
          <div className="absolute bottom-[20px] md:bottom-[40px] left-[5%] w-[80%] h-[40px] bg-slate-400/60 dark:bg-black/50 blur-[20px] rounded-[50%] z-0 transform rotate-3 transition-colors" />

          {/* MÔ HÌNH MÁY TÍNH CARTOON (Nghiêng nhẹ sang phải hướng về chữ) */}
          <motion.div 
            initial={{ opacity: 0, x: -50, rotateY: 10 }} animate={{ opacity: 1, x: 0, rotateY: 12, rotateX: 4, rotateZ: 1 }} transition={{ duration: 0.8 }}
            className="relative z-10 w-[95%] md:w-[600px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Lớp vỏ màu Tím Đặc Trưng (Cartoon Shell) */}
            <div 
              className="bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-[#5865F2] dark:to-[#4752C4] p-3 md:p-4 rounded-[28px] relative z-20 border-[3px] border-indigo-900 dark:border-[#3b429f] transition-colors"
              style={{ boxShadow: '-12px 18px 0px 0px rgba(46,49,146,0.8), -25px 35px 60px rgba(0,0,0,0.5)' }}
            >
              {/* --- CHI TIẾT TRANG TRÍ MÁY TÍNH --- */}
              <div className="absolute top-20 -right-4 w-4 h-12 bg-pink-500 rounded-r-lg border-y-2 border-r-2 border-pink-700 shadow-inner" />
              <div className="absolute -top-8 left-16 w-2 h-8 bg-zinc-400 border-2 border-zinc-600 rounded-t-full" />
              <div className="absolute -top-10 left-14 w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-md" />
              <div className="absolute bottom-16 -left-4 w-4 h-16 bg-emerald-400 rounded-l-lg border-y-2 border-l-2 border-emerald-600" />
              
              {/* Lớp viền đen bên trong */}
              <div className="bg-slate-900 dark:bg-[#111214] p-2 md:p-[6px] rounded-[16px] border border-slate-800 dark:border-zinc-800 relative transition-colors">
                {/* Camera mờ */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#000] rounded-full border border-slate-700 dark:border-zinc-800 z-30 transition-colors" />
                
                {/* === MÀN HÌNH HIỂN THỊ HÌNH ẢNH (CHUYỂN CẢNH Ở ĐÂY) === */}
                <div className="h-[260px] md:h-[350px] bg-slate-800 dark:bg-[#0e0e16] rounded-xl overflow-hidden relative border border-slate-700 dark:border-[#1e1f22] flex transition-colors">
                  
                  {/* Fake Sidebar */}
                  <div className="w-16 bg-slate-900 dark:bg-[#1e1f22] flex flex-col items-center py-4 gap-4 hidden md:flex transition-colors">
                    <div className="w-10 h-10 bg-indigo-500 dark:bg-[#5865F2] rounded-[16px] flex items-center justify-center"><Gamepad2 className="w-6 h-6 text-white" /></div>
                    <div className="w-10 h-10 bg-slate-800 dark:bg-[#2b2d31] rounded-full"></div>
                  </div>

                  <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeFeature.id}
                        initial={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-0"
                      >
                        <img 
                          src={activeFeature.image} 
                          alt={activeFeature.title} 
                          className="w-full h-full object-cover opacity-90 mix-blend-luminosity dark:mix-blend-luminosity" 
                        />
                        {/* Lớp overlay gradient xanh nhẹ tạo cảm giác màn hình */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-transparent to-purple-900/10 dark:from-indigo-900/60 dark:to-purple-900/20 mix-blend-overlay" />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* === Cằm máy (Chin): Chứa Loa và Nút bấm === */}
              <div className="h-8 w-full mt-2 md:mt-3 flex items-center justify-between px-4">
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-amber-400 border-2 border-amber-600 rounded-full shadow-sm" />
                  <div className="w-4 h-4 bg-white/50 dark:bg-white/30 rounded-full mt-1" />
                </div>
                <div className="w-10 h-3 bg-white/40 dark:bg-white/20 rounded-full" />
                <div className="grid grid-cols-5 gap-1.5 opacity-40">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-black dark:bg-[#111214] rounded-full shadow-inner transition-colors" />
                  ))}
                </div>
              </div>
            </div>

            {/* Chân đế máy tính Cartoon */}
            <div className="absolute -bottom-10 md:-bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
              <div className="w-16 h-12 md:h-14 bg-gradient-to-b from-indigo-900 to-slate-900 dark:from-[#3b429f] dark:to-[#1e1f22] border-x-4 border-slate-900 dark:border-[#1e1f22] transition-colors" />
              <div className="w-48 md:w-64 h-4 md:h-5 bg-gradient-to-r from-indigo-700 to-indigo-500 dark:from-[#4752C4] dark:to-[#5865F2] rounded-t-[16px] border-x-[3px] border-t-[3px] border-indigo-900 dark:border-[#3b429f] border-b-[6px] border-b-slate-900 dark:border-b-[#1e1f22] transition-colors" />
            </div>

            {/* Module "INTRO VIDEO" lơ lửng đè lên góc phải dưới của máy tính */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -right-6 md:-right-10 w-[200px] bg-white/80 dark:bg-[#1e1f22]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-3 flex items-center gap-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-30 transition-colors"
              style={{ transform: 'translateZ(50px)' }} // Giúp nó nổi bật lên khỏi màn hình 3D
            >
              <button className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl flex items-center justify-center shrink-0 hover:scale-105 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                <Play className="w-5 h-5 ml-1" fill="currentColor" />
              </button>
              <div>
                <p className="text-slate-900 dark:text-white text-[11px] font-black tracking-widest uppercase transition-colors">Trải nghiệm</p>
                <p className="text-indigo-600 dark:text-indigo-400 text-[9px] uppercase tracking-widest mt-0.5 transition-colors">Xem video Demo</p>
              </div>
            </motion.div>
          </motion.div>
        </div>


        {/* ================= 5. RIGHT: TEXT CONTENT ================= */}
        <div className="lg:col-span-5 flex flex-col justify-center pb-24 lg:pb-0 relative z-20">
          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold tracking-widest text-sm uppercase mb-4 transition-colors">
                  <Compass className="w-4 h-4" /> Feature Highlights
                </div>
                
                <h2 className="text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight drop-shadow-sm dark:drop-shadow-lg transition-colors">
                  {activeFeature.title}
                </h2>
                
                <p className="text-slate-600 dark:text-zinc-300 text-lg leading-relaxed font-medium transition-colors">
                  {activeFeature.description}
                </p>

                {/* Các tag/link mạng xã hội mô phỏng layout */}
                <div className="flex flex-wrap gap-4 mt-8">
                  {['Tương tác', 'Khám phá', 'Cộng đồng'].map((tag, idx) => (
                    <span key={idx} className="text-xs font-bold text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-300 uppercase tracking-widest cursor-pointer transition-colors border-b border-transparent hover:border-indigo-600 dark:hover:border-indigo-400 pb-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* ================= 6. BOTTOM CAROUSEL ================= */}
      <div className="absolute bottom-6 md:bottom-12 w-full max-w-[1400px] px-6 lg:px-24 flex justify-center lg:justify-end z-30 pointer-events-auto">
        <div className="flex gap-3 bg-white/60 dark:bg-[#111214]/80 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-2xl transition-colors">
          {FEATURES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleItemClick(idx)}
              className={cn(
                "relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden transition-all duration-300",
                idx === activeIndex 
                  ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-[#0e0e16] scale-100 opacity-100" 
                  : "opacity-60 dark:opacity-40 hover:opacity-100 scale-95 hover:scale-100"
              )}
            >
              <img src={item.thumb} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
              {idx === activeIndex && (
                <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Trang trí thêm một chút Sparkles */}
      <div className="absolute top-1/2 right-[5%] text-yellow-500 dark:text-yellow-400 z-30 opacity-80">
        <Sparkles className="w-8 h-8 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)] dark:drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] transition-colors" />
      </div>

    </div>
  );
};