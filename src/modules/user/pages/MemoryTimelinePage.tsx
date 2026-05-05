import React, { useMemo, useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { Flame, Clock, CalendarDays, Hourglass, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useProfileData } from '../hooks/useProfileData';
import { MonthCalendarBlock } from '../components/profile/MonthCalendarBlock';

const generateMonthsFromDate = (startDateStr?: string) => {
  const result = [];
  const end = new Date();
  const max = new Date(end.getFullYear(), end.getMonth(), 1);
  
  const start = startDateStr ? new Date(startDateStr) : new Date(end.getFullYear(), end.getMonth() - 6, 1);
  let current = new Date(start.getFullYear(), start.getMonth(), 1);

  let safety = 0;
  while (current <= max && safety < 100) {
    result.push({ year: current.getFullYear(), month: current.getMonth() + 1 });
    current.setMonth(current.getMonth() + 1);
    safety++;
  }
  return result; 
};

const MemoryTimelinePage = () => {
  const { user } = useAuth();
  const { userProfile, isLoading } = useProfileData(user?.id, false);
  const endOfListRef = useRef<HTMLDivElement>(null);
  
  const monthsList = useMemo(() => generateMonthsFromDate(userProfile?.createdAt), [userProfile?.createdAt]);

  useEffect(() => {
    const timer = setTimeout(() => {
        endOfListRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'end', block: 'end' });
    }, 300); 
    return () => clearTimeout(timer);
  }, [monthsList]);

  if (!user) return null;

  return (
    <MainLayout>
      <div className="absolute inset-0 flex flex-col bg-[#FDFBF9] dark:bg-[#09090b] font-quicksand overflow-y-auto md:overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-w-0">
        
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 pt-6 md:pt-10 shrink-0">
            
            {/* =========================================================
                [KAWAII DIARY BANNER - LUÔN LUÔN SÁNG]
                Đã gỡ bỏ toàn bộ class dark: ở khu vực này
            ========================================================= */}
            <div className="relative w-full h-[320px] md:h-[380px] rounded-[32px] md:rounded-[40px] mb-8 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] bg-gradient-to-br from-[#FFF8F3] to-[#FDF1E6] transition-all duration-500">
                
                <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[150%] bg-white/60 rounded-full blur-[80px] animate-[pulse_6s_infinite]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[120%] bg-[#FFE8D6]/50 rounded-full blur-[80px] animate-[pulse_8s_infinite]"></div>
                
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[12%] right-[10%] md:right-[15%] w-24 h-24 md:w-32 md:h-32 bg-white/70 backdrop-blur-xl rounded-[20px] md:rounded-[28px] border border-white shadow-xl rotate-6 animate-[bounce_6s_infinite] transition-transform duration-700 flex flex-col items-center justify-center gap-2">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-[#FFD3B6] to-[#FFE8D6] rounded-full flex items-center justify-center shadow-inner">
                            <CalendarDays className="w-5 h-5 md:w-7 md:h-7 text-white drop-shadow-sm" strokeWidth={2.5} />
                        </div>
                        <div className="w-10 h-1.5 md:h-2 bg-[#EBE4DC] rounded-full"></div>
                    </div>

                    <div className="absolute bottom-[20%] right-[32%] md:right-[38%] w-16 h-16 md:w-24 md:h-24 bg-white/80 backdrop-blur-xl rounded-[16px] md:rounded-[20px] border border-white shadow-lg -rotate-12 animate-[bounce_5s_infinite_1s] flex items-center justify-center">
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-tr from-[#FFDAB9] to-[#FDF3E7] rounded-full flex items-center justify-center shadow-inner">
                            <Flame className="w-4 h-4 md:w-6 md:h-6 text-orange-400 fill-orange-400 drop-shadow-sm" strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="absolute top-[25%] left-[10%] md:left-[18%] w-14 h-14 md:w-16 md:h-16 bg-white/60 backdrop-blur-xl rounded-full border border-white shadow-[0_8px_16px_rgba(0,0,0,0.04)] flex items-center justify-center -rotate-6 animate-[bounce_7s_infinite_0.5s]">
                        <Clock className="w-6 h-6 md:w-7 md:h-7 text-[#D69066]" strokeWidth={2.5} />
                    </div>

                    <div className="absolute bottom-[30%] left-[22%] md:left-[28%] w-10 h-10 md:w-12 md:h-12 bg-white/50 backdrop-blur-md rounded-[12px] md:rounded-[14px] border border-white shadow-sm flex items-center justify-center rotate-12 animate-[bounce_6s_infinite_1.5s]">
                        <Hourglass className="w-5 h-5 text-[#B3AAA0]" strokeWidth={2.5} />
                    </div>

                    <Sparkles className="absolute top-[25%] left-[45%] w-5 h-5 text-yellow-500/60 animate-[pulse_3s_infinite]" />
                    <Sparkles className="absolute bottom-[35%] right-[45%] w-4 h-4 text-orange-400/50 animate-[pulse_4s_infinite_1s]" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center pb-12 z-20 pointer-events-none">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/60 w-fit mb-4 shadow-sm">
                        <CalendarDays className="w-4 h-4 text-zinc-700" strokeWidth={2.5} />
                        <span className="text-zinc-800 text-xs font-black tracking-widest uppercase">Trạm Ký Ức</span>
                    </div>
                    
                    <h1 className="text-[2.2rem] md:text-[3.2rem] font-black text-[#4A4238] leading-[1.1] tracking-tight text-center">
                        Nhật ký <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D69066] to-[#BFA58F]">
                            thời gian
                        </span>
                    </h1>
                    
                    <p className="text-[0.95rem] md:text-[1.05rem] font-bold text-[#A69E95] mt-3 md:mt-4 max-w-[280px] md:max-w-[420px] leading-relaxed text-center">
                        Gói ghém từng phút giây, lưu giữ những trang ký ức đáng giá của riêng bạn.
                    </p>
                </div>
            </div>
        </div>

        <div className="flex-1 w-full max-w-[1440px] mx-auto relative z-30 -mt-20 md:-mt-28 pb-40 md:pb-10 pointer-events-none min-w-0">
            <div className="w-full h-full flex flex-col md:flex-row md:overflow-x-auto gap-8 md:gap-6 items-center md:items-start px-4 md:px-10 pointer-events-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {monthsList.map((m) => (
                    <MonthCalendarBlock 
                        key={`${m.year}-${m.month}`}
                        userId={user.id}
                        year={m.year}
                        month={m.month}
                        onImageClick={(id) => console.log('Mở bài đăng có ID:', id)}
                    />
                ))}
                <div ref={endOfListRef} className="w-1 h-1 md:w-4 md:h-4 shrink-0 opacity-0"></div>
            </div>
        </div>

        {/* THAY ĐỔI Ở ĐÂY: Thêm class `md:absolute` thay cho `fixed` trên màn hình desktop */}
        <div className="fixed md:absolute bottom-[90px] md:bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto w-[max-content]">
            <div className="bg-white/80 dark:bg-[#1E1B18]/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_16px_40px_rgba(140,125,110,0.15)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)] rounded-full px-6 py-3 flex items-center gap-6 md:gap-10 hover:scale-105 transition-transform duration-300">
                
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F7F3EE] dark:bg-[#26221E] rounded-full flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-[#B3AAA0] dark:text-[#7A746D]" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[0.65rem] font-extrabold text-[#A69E95] dark:text-[#8C847A] uppercase tracking-widest leading-none mb-1">Đã đăng</span>
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-[#4A4238] dark:border-[#F2EBE1] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <span className="text-[1.2rem] font-black text-[#4A4238] dark:text-[#F2EBE1] leading-none">{userProfile?.totalCheckins || 0}</span>
                        )}
                    </div>
                </div>

                <div className="w-px h-8 bg-[#EBE6DF] dark:bg-[#332E2A]"></div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFF0E5] dark:bg-[#3D2516] rounded-full flex items-center justify-center">
                        <Flame className="w-5 h-5 text-[#E6A175] fill-[#E6A175] animate-pulse" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[0.65rem] font-extrabold text-[#A69E95] dark:text-[#8C847A] uppercase tracking-widest leading-none mb-1">Chuỗi</span>
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-[#E6A175] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <span className="text-[1.2rem] font-black text-[#D69066] leading-none">{userProfile?.currentStreak || 0}</span>
                        )}
                    </div>
                </div>

            </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default MemoryTimelinePage;