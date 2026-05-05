import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { userService, CalendarRecap } from '@/modules/user/services/user.service';

interface Props {
  userId: string;
  year: number;
  month: number;
  onImageClick?: (checkinId: string) => void;
}

export const MonthCalendarBlock: React.FC<Props> = ({ userId, year, month, onImageClick }) => {
  const [recapData, setRecapData] = useState<CalendarRecap[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    const fetchCalendar = async () => {
      setIsLoading(true);
      try {
        const data = await userService.getUserCalendar(userId, year, month);
        if (isMounted) setRecapData(data);
      } catch (error) {
        console.error('Lỗi lấy lịch:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchCalendar();

    return () => { isMounted = false; };
  }, [userId, year, month]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const isCurrentMonth = new Date().getMonth() + 1 === month && new Date().getFullYear() === year;

  return (
    // Thẻ lịch giữ kích thước cố định, bóng đổ mềm mại, không có thanh cuộn bên trong
    <div className="w-[85vw] sm:w-[340px] md:w-[400px] shrink-0 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-xl p-6 md:p-8 rounded-[32px] border border-white/60 dark:border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] relative z-20">
      
      {/* HEADER THÁNG - Tone Nâu/Đen nhạt */}
      <div className="flex flex-col items-center justify-center mb-6">
        <span className="text-[1.3rem] md:text-[1.5rem] font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-widest drop-shadow-sm">
          {monthNames[month - 1]}
        </span>
        <span className="text-zinc-400 dark:text-zinc-500 text-[1rem] font-extrabold mt-0.5">
          {year}
        </span>
      </div>

      {/* Tên các ngày trong tuần */}
      <div className="grid grid-cols-7 gap-2 mb-3 text-center text-[0.7rem] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Khối Grid Lịch */}
      <div className="grid grid-cols-7 gap-2 relative min-h-[220px]">
        {isLoading && (
          <div className="absolute inset-0 z-30 bg-white/50 dark:bg-black/50 flex items-center justify-center backdrop-blur-sm rounded-[24px]">
             <div className="w-8 h-8 border-[3px] border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Các ô trống đầu tháng */}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square rounded-[14px] bg-transparent" />
        ))}

        {/* Các ngày trong tháng */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const recap = recapData.find(r => r.day === day);
          const isToday = isCurrentMonth && new Date().getDate() === day;

          return (
            <div key={day} className="relative aspect-square">
              {recap ? (
                <button 
                  onClick={() => onImageClick && onImageClick(recap.checkinId)}
                  className="w-full h-full rounded-[14px] overflow-hidden shadow-sm hover:shadow-lg hover:z-20 transition-all duration-300 relative group cursor-pointer border-[2px] border-transparent hover:border-white dark:hover:border-zinc-700"
                >
                  <img src={recap.imageUrl} alt={`Day ${day}`} className="w-full h-full object-cover pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90 transition-opacity pointer-events-none" />
                  <div className="absolute bottom-1 w-full text-center pointer-events-none">
                    <span className="text-white text-[0.8rem] font-black drop-shadow-md">{day}</span>
                  </div>
                </button>
              ) : (
                <div className={cn(
                  "w-full h-full rounded-[14px] flex items-center justify-center transition-all",
                  isToday 
                    // Bỏ hiệu ứng phóng to (scale), sử dụng nền màu Cam ấm áp
                    ? "bg-orange-400 dark:bg-orange-500/80 text-white shadow-md z-10 font-black" 
                    : "bg-[#F7F5F2] dark:bg-zinc-800/50 border border-[#EBE6DF] dark:border-zinc-700/50 font-extrabold"
                )}>
                  <span className={cn(
                    "text-[0.8rem]",
                    isToday ? "text-white" : "text-[#B3A9A0] dark:text-zinc-500"
                  )}>{day}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};