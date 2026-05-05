import React from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Mouse, ArrowDown } from 'lucide-react';

const LandingPage = () => {
  return (
    // Bọc toàn bộ Landing Page: Xử lý màu sắc sáng/tối đồng bộ
    <div className="bg-[#f8fafc] dark:bg-[#0e0e16] text-slate-900 dark:text-zinc-200 h-[100dvh] font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden transition-colors duration-500">
      
      {/* Header cố định */}
      <LandingHeader />
      
      {/* Vùng cuộn (Scroll Container): Bật snap-y bắt buộc cho từng Section */}
      <main className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        <section className="snap-start w-full min-h-[100dvh]">
          <HeroSection />
        </section>
        
        <section className="snap-start w-full min-h-[100dvh]">
          <FeaturesSection />
        </section>
        
        <section className="snap-start w-full min-h-[100dvh]">
          <AboutSection />
        </section>
        
        <section className="snap-start w-full">
          <LandingFooter />
        </section>

      </main>

      {/* BIỂU TƯỢNG CUỘN CHUỘT (Chỉ đặt 1 cái duy nhất ở đây cho toàn page) */}
      <div className="fixed right-6 md:right-10 bottom-10 flex flex-col items-center gap-3 z-[1000] pointer-events-none opacity-60">
        <Mouse className="w-6 h-6 text-slate-600 dark:text-white animate-bounce transition-colors" strokeWidth={2} />
        <div className="w-px h-12 bg-gradient-to-b from-slate-600 dark:from-white to-transparent transition-colors" />
        <ArrowDown className="w-4 h-4 text-slate-600/50 dark:text-white/50 transition-colors" />
      </div>

    </div>
  );
};

export default LandingPage;