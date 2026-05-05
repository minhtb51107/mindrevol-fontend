import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, MessageSquare, Gamepad2, Heart, Headphones, Sparkles } from 'lucide-react';

export const HeroSection = () => {
  const stars = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 90}%`,
    size: Math.random() * 15 + 10,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    // Bổ sung các class hỗ trợ dark/light mode cho nền (nền sáng sẽ dùng màu pastel xanh/tím nhạt)
    <div id="home" className="relative min-h-[100dvh] w-full pt-28 pb-20 flex items-center overflow-hidden bg-gradient-to-b from-[#eef2ff] via-[#e0e7ff] to-[#c7d2fe] dark:from-[#0e0e16] dark:via-[#1a1b41] dark:to-[#2e3192] transition-colors duration-500">
      
      {/* ================= BACKGROUND ================= */}
      {/* Glows: Đổi độ trong suốt tùy theo mode */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-500/20 dark:bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] left-[5%] w-[600px] h-[600px] bg-purple-500/30 dark:bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-indigo-400/40 dark:text-white/30 pointer-events-none flex items-center justify-center"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" />
          </svg>
        </motion.div>
      ))}

      {/* VẬT THỂ MỜ Ở XA */}
      <div className="absolute top-[15%] left-[45%] w-20 h-20 bg-pink-500/80 rounded-2xl blur-[6px] -rotate-12 flex items-center justify-center z-0">
        <Gamepad2 className="w-10 h-10 text-white opacity-80" />
      </div>
      <div className="absolute bottom-[20%] right-[5%] w-24 h-24 bg-indigo-400/70 rounded-full blur-[8px] flex items-center justify-center z-0">
        <Headphones className="w-12 h-12 text-white opacity-80" />
      </div>

      <div className="max-w-[1280px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 relative z-10 items-center">
        
        {/* ================= BÊN TRÁI: TEXT & CTA ================= */}
        <div className="flex flex-col justify-center text-center lg:text-left pt-10 lg:pt-0">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-[2.8rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] leading-[1.05] font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 drop-shadow-sm dark:drop-shadow-lg transition-colors"
          >
            KHÔNG GIAN <br className="hidden md:block" /> 
            ĐẦY THÚ VỊ VÀ <br className="hidden md:block" />
            CÁC CẢM XÚC
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg lg:text-xl text-slate-700 dark:text-zinc-200 font-medium leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 drop-shadow-none dark:drop-shadow-md transition-colors"
          >
            Nền tảng cực kỳ lý tưởng để tương tác, chia sẻ hành trình và trò chuyện với bạn bè. Hãy tùy chỉnh thiết bị không gian của riêng bạn để vui chơi và giao lưu.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
          >
            <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-zinc-900 rounded-[28px] font-bold text-[1.05rem] hover:bg-slate-800 dark:hover:text-indigo-600 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_8px_24px_rgba(255,255,255,0.25)] transition-all">
              <Download className="w-5 h-5" /> 
              Tải về cho Windows
            </button>
            <Link to="/login" className="group flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 dark:bg-[#5865F2] hover:bg-indigo-700 dark:hover:bg-[#4752C4] text-white rounded-[28px] font-bold text-[1.05rem] transition-all shadow-[0_8px_24px_rgba(79,70,229,0.3)] dark:shadow-[0_8px_24px_rgba(88,101,242,0.4)]">
              Mở trên trình duyệt
            </Link>
          </motion.div>
        </div>


        {/* ================= BÊN PHẢI: CARTOON 3D MOCKUPS ================= */}
        <div className="relative h-[450px] md:h-[550px] w-full flex items-center justify-center lg:justify-end mt-10 lg:mt-0">
          
          {/* Bóng dưới sàn */}
          <div className="absolute bottom-[0px] md:bottom-[10px] right-[5%] md:right-[15%] w-[80%] h-[40px] bg-slate-400/60 dark:bg-black/60 blur-[20px] rounded-[50%] z-0 transform -rotate-3 transition-colors" />

          {/* ====== 1. MÔ HÌNH MÁY TÍNH CARTOON (DESKTOP) ====== */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="relative z-10 w-[95%] md:w-[580px]"
            style={{ transform: 'perspective(1200px) rotateY(-22deg) rotateX(8deg) rotateZ(-2deg)' }}
          >
            {/* Lớp vỏ màu Tím Đặc Trưng (Cartoon Shell) */}
            <div 
              className="bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-[#5865F2] dark:to-[#4752C4] p-3 md:p-4 rounded-[28px] relative z-20 border-[3px] border-indigo-900 dark:border-[#3b429f] transition-colors"
              style={{ boxShadow: '12px 18px 0px 0px rgba(46, 49, 146, 0.8), 25px 35px 60px rgba(0,0,0,0.5)' }}
            >
              {/* --- CHI TIẾT TRANG TRÍ --- */}
              <div className="absolute top-20 -left-4 w-4 h-12 bg-amber-500 rounded-l-lg border-y-2 border-l-2 border-amber-600 shadow-inner" />
              <div className="absolute -top-8 right-16 w-2 h-8 bg-zinc-400 border-2 border-zinc-600 rounded-t-full" />
              <div className="absolute -top-10 right-14 w-6 h-6 bg-pink-500 rounded-full border-2 border-pink-700 shadow-md" />
              <div className="absolute bottom-16 -right-4 w-4 h-16 bg-emerald-400 rounded-r-lg border-y-2 border-r-2 border-emerald-600" />
              
              {/* Lớp viền đen bên trong (Inner Bezel) */}
              <div className="bg-slate-900 dark:bg-[#111214] p-2 md:p-[6px] rounded-[16px] border border-slate-800 dark:border-zinc-800 relative transition-colors">
                {/* Camera mờ */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full border border-slate-700 dark:border-zinc-800 z-30" />
                
                {/* === Màn hình hiển thị UI === */}
                <div className="h-[280px] md:h-[330px] bg-slate-800 dark:bg-[#313338] rounded-xl overflow-hidden flex border border-slate-700 dark:border-[#1e1f22] transition-colors">
                  {/* Sidebar */}
                  <div className="w-16 bg-slate-900 dark:bg-[#1e1f22] flex flex-col items-center py-4 gap-4 transition-colors">
                    <div className="w-10 h-10 bg-indigo-500 dark:bg-[#5865F2] rounded-[16px] flex items-center justify-center shadow-lg"><Gamepad2 className="w-6 h-6 text-white" /></div>
                    <div className="w-10 h-10 bg-slate-800 dark:bg-[#2b2d31] rounded-full"></div>
                    <div className="w-10 h-10 bg-slate-800 dark:bg-[#2b2d31] rounded-full"></div>
                  </div>
                  {/* Channel List */}
                  <div className="w-36 md:w-40 bg-slate-800 dark:bg-[#2b2d31] flex flex-col p-3 gap-2 border-r border-slate-700 dark:border-[#1e1f22] transition-colors">
                    <div className="h-4 w-20 bg-white/20 dark:bg-white/10 rounded mb-2"></div>
                    <div className="h-8 w-full bg-white/10 dark:bg-white/5 rounded flex items-center px-2 gap-2"><div className="w-3 h-3 rounded-full bg-slate-500 dark:bg-zinc-500"></div><div className="h-2 w-16 bg-white/30 dark:bg-white/20 rounded"></div></div>
                    <div className="h-8 w-full bg-white/20 dark:bg-white/10 rounded flex items-center px-2 gap-2"><div className="w-3 h-3 rounded-full bg-slate-500 dark:bg-zinc-500"></div><div className="h-2 w-12 bg-white/50 dark:bg-white/40 rounded"></div></div>
                  </div>
                  {/* Chat Area */}
                  <div className="flex-1 flex flex-col bg-slate-700 dark:bg-[#313338] transition-colors">
                    <div className="h-12 border-b border-slate-600 dark:border-[#1e1f22] flex items-center px-4 gap-3 transition-colors">
                      <span className="text-slate-400 dark:text-zinc-400 font-bold text-lg">#</span><span className="text-white font-bold text-sm">general</span>
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-end gap-5">
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-500 shrink-0"></div>
                        <div className="space-y-2 flex-1"><div className="h-3 w-20 bg-white/50 dark:bg-white/40 rounded"></div><div className="h-10 w-4/5 bg-slate-800 dark:bg-[#2b2d31] rounded-lg"></div></div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-green-500 shrink-0"></div>
                        <div className="space-y-2 flex-1"><div className="h-3 w-24 bg-white/50 dark:bg-white/40 rounded"></div><div className="h-14 w-full bg-slate-800 dark:bg-[#2b2d31] rounded-lg"></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* === Cằm máy (Chin) === */}
              <div className="h-8 w-full mt-2 md:mt-3 flex items-center justify-between px-4">
                {/* Lưới loa */}
                <div className="grid grid-cols-5 gap-1.5 opacity-40">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-black dark:bg-[#111214] rounded-full shadow-inner" />
                  ))}
                </div>
                {/* Logo Branding */}
                <div className="w-10 h-3 bg-white/30 dark:bg-white/20 rounded-full" />
                {/* Nút điều khiển */}
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-white/50 dark:bg-white/30 rounded-full" />
                  <div className="w-6 h-6 bg-yellow-400 border-2 border-yellow-600 rounded-full shadow-sm" />
                </div>
              </div>
            </div>

            {/* Chân đế máy tính Cartoon */}
            <div className="absolute -bottom-10 md:-bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
              <div className="w-16 h-12 md:h-14 bg-gradient-to-b from-indigo-900 to-slate-900 dark:from-[#3b429f] dark:to-[#1e1f22] border-x-4 border-slate-900 dark:border-[#1e1f22]" />
              <div className="w-48 md:w-64 h-4 md:h-5 bg-gradient-to-r from-indigo-700 to-indigo-500 dark:from-[#4752C4] dark:to-[#5865F2] rounded-t-[16px] border-x-[3px] border-t-[3px] border-indigo-900 dark:border-[#3b429f] border-b-[6px] border-b-slate-900 dark:border-b-[#1e1f22]" />
            </div>
          </motion.div>


          {/* ====== 2. MÔ HÌNH ĐIỆN THOẠI CARTOON ====== */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute -bottom-6 md:-bottom-8 right-0 md:right-4 z-30"
            style={{ transform: 'perspective(1200px) rotateY(-20deg) rotateX(10deg) rotateZ(4deg)' }}
          >
            <div 
              className="w-[120px] md:w-[145px] h-[240px] md:h-[290px] bg-gradient-to-br from-pink-500 to-rose-700 dark:from-[#ec4899] dark:to-[#be123c] p-[5px] md:p-[6px] rounded-[1.75rem] md:rounded-[2rem] relative z-10 border-[3px] border-rose-900 dark:border-[#9f1239] transition-colors"
              style={{ boxShadow: '6px 10px 0px 0px rgba(136, 19, 55, 0.8)' }}
            >
              {/* Nút bấm */}
              <div className="absolute top-10 -left-2 w-2 h-6 bg-yellow-400 rounded-l-md border-y-2 border-l-2 border-yellow-600" />
              <div className="absolute top-20 -left-2 w-2 h-10 bg-indigo-500 dark:bg-[#5865F2] rounded-l-md border-y-2 border-l-2 border-indigo-800 dark:border-[#3b429f]" />
              <div className="absolute top-16 -right-2 w-2 h-12 bg-emerald-400 rounded-r-md border-y-2 border-r-2 border-emerald-600" />

              {/* Viền đen và Màn hình */}
              <div className="w-full h-full bg-slate-900 dark:bg-[#111214] p-1 rounded-[1.35rem] md:rounded-[1.5rem] transition-colors">
                <div className="w-full h-full bg-slate-800 dark:bg-[#313338] rounded-[1.1rem] md:rounded-[1.25rem] overflow-hidden flex flex-col relative transition-colors">
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-3.5 bg-black rounded-full z-20 flex justify-end items-center px-1">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  </div>
                  <div className="flex-1 p-1.5 pt-6 grid grid-cols-2 gap-1.5">
                    <div className="bg-indigo-500 rounded-lg"></div>
                    <div className="bg-pink-500 rounded-lg"></div>
                    <div className="bg-emerald-500 rounded-lg"></div>
                    <div className="bg-amber-500 rounded-lg"></div>
                  </div>
                  <div className="h-12 bg-slate-900 dark:bg-[#1e1f22] flex items-center justify-center gap-2 pb-1 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-white/20 dark:bg-white/10"></div>
                    <div className="w-6 h-6 rounded-full bg-red-500"></div>
                    <div className="w-6 h-6 rounded-full bg-white/20 dark:bg-white/10"></div>
                  </div>
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/40 dark:bg-white/30 rounded-full z-20" />
                </div>
              </div>
            </div>
            {/* Bóng điện thoại */}
            <div className="absolute bottom-[-6px] left-1 w-[100%] h-4 bg-slate-500/80 dark:bg-black/90 blur-[8px] rounded-[50%] z-0 transition-colors" />
          </motion.div>

          {/* ====== ICONS LƠ LỬNG ====== */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute -top-8 right-24 w-14 h-14 md:w-16 md:h-16 bg-indigo-500 dark:bg-[#5865F2] rounded-[16px] rotate-12 shadow-[0_10px_30px_rgba(99,102,241,0.5)] dark:shadow-[0_10px_30px_rgba(88,101,242,0.6)] flex items-center justify-center z-40 border-2 border-indigo-400"
          >
            <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-white" fill="white" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-6 md:bottom-12 -left-2 md:-left-8 w-14 h-14 md:w-16 md:h-16 bg-pink-500 dark:bg-[#EB459E] rounded-full shadow-[0_10px_30px_rgba(236,72,153,0.5)] dark:shadow-[0_10px_30px_rgba(235,69,158,0.6)] flex items-center justify-center z-40 border-2 border-pink-400"
          >
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-white" fill="white" />
          </motion.div>

          <div className="absolute top-1/2 left-[-5%] text-yellow-500 dark:text-yellow-400 z-30 opacity-80">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)] dark:drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
          </div>
        </div>

      </div>
    </div>
  );
};