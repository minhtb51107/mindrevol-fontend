import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

export const AboutSection = () => {
  // Khởi tạo các vì sao mờ cho "Online Universe"
  const stars = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 90}%`,
    size: Math.random() * 10 + 5,
    duration: Math.random() * 3 + 3,
    delay: Math.random() * 2,
  }));

  return (
    <div id="about" className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-[#f8fafc] dark:bg-[#0e0e16] transition-colors duration-500">
      
      {/* ================= 1. BACKGROUND ================= */}
      {/* Blueprint Grid - Lưới kỹ thuật chìm thay đổi theo theme */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none transition-colors" />
      
      {/* Space Glows */}
      <div className="absolute top-[10%] right-[20%] w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[0%] left-[10%] w-[800px] h-[800px] bg-purple-500/10 dark:bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-indigo-500/30 dark:text-indigo-200/20 pointer-events-none flex items-center justify-center transition-colors"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" />
          </svg>
        </motion.div>
      ))}

      {/* ================= 2. DECORATIVE ELEMENTS ================= */}
      {/* Vertical text bên trái */}
      <div className="hidden lg:flex absolute left-8 top-0 bottom-0 flex-col justify-center z-20 pointer-events-none">
        <span 
          className="text-slate-400 dark:text-indigo-500/40 font-bold tracking-[0.4em] text-xs whitespace-nowrap transition-colors"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          MINDREVOL • CONNECT THE UNIVERSE
        </span>
      </div>

      {/* Sidebar chữ lớn mờ ảo bên phải (Watermark) */}
      <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none">
        <span 
          className="text-slate-900/[0.03] dark:text-white/[0.02] font-black text-[12rem] leading-none whitespace-nowrap transition-colors"
          style={{ writingMode: 'vertical-rl' }}
        >
          ABOUT US
        </span>
      </div>

      {/* ================= 3. CONTENT SECTION ================= */}
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-32 relative z-10 flex flex-col justify-center min-h-[80vh]">
        
        {/* --- HERO SECTION / VISION STATEMENT --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 md:mb-32 relative"
        >
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />
            <span className="text-indigo-600 dark:text-indigo-400 font-mono tracking-[0.2em] text-sm uppercase transition-colors">Vision 2030</span>
          </div>

          <h2 className="text-[2.5rem] md:text-[4rem] lg:text-[5rem] font-light leading-[1.1] tracking-tight text-slate-900 dark:text-white max-w-5xl transition-colors">
            <span className="text-indigo-600/30 dark:text-indigo-500/50 font-mono font-light mr-4">{"["}</span>
            Kiến tạo một <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-400">thế giới ảo</span> nơi khoảng cách không còn là rào cản.
            <span className="text-indigo-600/30 dark:text-indigo-500/50 font-mono font-light ml-4">{"]"}</span>
          </h2>
        </motion.div>

        {/* --- ABOUT US TEXT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block col-span-1 w-px bg-gradient-to-b from-indigo-500 to-transparent"
          />

          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-7 flex flex-col justify-center border-l-2 lg:border-l-0 border-indigo-500 pl-6 lg:pl-0"
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 tracking-wide transition-colors">VỀ CHÚNG TÔI</h3>
            
            <div className="space-y-6 text-slate-600 dark:text-zinc-400 text-lg font-medium leading-[1.8] transition-colors">
              <p>
                Chúng tôi là một đội ngũ đam mê công nghệ và sự sáng tạo, luôn nỗ lực mang đến những giải pháp giao tiếp đột phá. Dự án này được sinh ra từ mong muốn giúp mọi người lưu giữ những kỷ niệm đẹp nhất một cách sống động và chân thực.
              </p>
              <p>
                Hệ sinh thái của chúng tôi tập trung vào trải nghiệm người dùng, sự bảo mật và khả năng mở rộng không giới hạn trên mọi nền tảng thiết bị. Không chỉ là một ứng dụng, chúng tôi đang xây dựng một nền tảng định hình lại cách con người tương tác trong kỷ nguyên số.
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-4 flex flex-col justify-end gap-8 pt-8 lg:pt-0"
          >
            <div className="group border-b border-slate-200 dark:border-white/10 pb-6 hover:border-indigo-500/50 transition-colors">
              <p className="text-4xl font-light text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">1B+</p>
              <p className="text-sm font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-widest transition-colors">Tương tác dự kiến</p>
            </div>
            <div className="group border-b border-slate-200 dark:border-white/10 pb-6 hover:border-purple-500/50 transition-colors">
              <p className="text-4xl font-light text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Multi</p>
              <p className="text-sm font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-widest transition-colors">Nền tảng hệ sinh thái</p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};