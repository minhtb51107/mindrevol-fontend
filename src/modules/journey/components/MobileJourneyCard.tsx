import React from 'react';
import { UserActiveJourneyResponse } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Clock, Image as ImageIcon } from 'lucide-react';

interface MobileJourneyCardProps {
  journey: UserActiveJourneyResponse;
  onClick?: () => void;
  className?: string;
}

export const MobileJourneyCard: React.FC<MobileJourneyCardProps> = ({ journey, onClick, className }) => {
  const hasImage = !!journey.thumbnailUrl;
  const themeColor = journey.themeColor || '#3b82f6'; 
  const avatarIcon = journey.avatar || '🚀';

  return (
    <div 
      onClick={onClick}
      // 1. [QUAN TRỌNG] LỚP VỎ BỌC AN TOÀN NGOÀI CÙNG
      // Thêm p-4 (khoảng trống 16px ở cả 4 cạnh) để hứng trọn các góc nhọn khi thẻ bị xoay
      className={cn(
        "w-full flex-shrink-0 cursor-pointer group transition-all duration-300 active:scale-95",
        "p-4", 
        // Vì có thêm padding ăn vào trong, ta tăng chiều cao tổng thể lên một chút để bù lại
        className || "h-[220px]" 
      )}
    >
      
      {/* 2. LỚP ĐỊNH VỊ CHÍNH (Chứa toàn bộ các lớp giấy) */}
      <div className="relative w-full h-full">
          
          {/* --- CÁC LỚP GIẤY XẾP CHỒNG ĐÃ ĐƯỢC GIAM BÊN TRONG VÙNG AN TOÀN --- */}
          {/* Tờ giấy 1: Xoay sang phải */}
          <div 
            className="absolute inset-0 rounded-2xl rotate-[5deg] origin-bottom-right transition-transform duration-300 group-hover:rotate-[8deg] z-0 shadow-sm" 
            style={{ backgroundColor: themeColor, opacity: 0.25 }}
          />
          
          {/* Tờ giấy 2: Xoay sang trái */}
          <div 
            className="absolute inset-0 rounded-2xl -rotate-[3deg] origin-bottom-left transition-transform duration-300 group-hover:-rotate-[5deg] z-0 shadow-sm" 
            style={{ backgroundColor: themeColor, opacity: 0.5 }}
          />


          {/* --- THẺ CHÍNH LỚP TRÊN CÙNG --- */}
          <div 
            className="relative w-full h-full rounded-2xl overflow-hidden shadow-md bg-zinc-900 z-10"
            style={{ border: `1px solid ${themeColor}50` }}
          >
            {/* Lớp Nền */}
            {hasImage ? (
              <img 
                  src={journey.thumbnailUrl} 
                  alt={journey.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <div 
                  className="absolute inset-0 w-full h-full flex flex-col items-center justify-center transition-transform duration-700 group-hover:scale-105"
                  style={{ background: `linear-gradient(to bottom right, #18181b, ${themeColor}40)` }}
              >
                  <ImageIcon className="w-10 h-10 text-white/20 mb-2" strokeWidth={1.5} />
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Icon Góc */}
            <div className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg text-sm bg-black/40 backdrop-blur-md z-10 border border-white/10">
              {avatarIcon}
            </div>

            {/* Nội dung Đáy */}
            <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col z-10">
              <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md mb-3">
                {journey.name}
              </h3>

              <div className="flex items-center justify-between w-full">
                  <div className="flex items-center -space-x-2">
                      {journey.memberAvatars?.slice(0, 3).map((url, idx) => (
                          <Avatar key={idx} className="w-7 h-7 border-2 border-zinc-900 shadow-sm">
                              <AvatarImage src={url || undefined} />
                              <AvatarFallback className="text-[9px] bg-zinc-800 text-white">U</AvatarFallback>
                          </Avatar>
                      ))}
                      {journey.totalMembers > 3 && (
                          <div className="w-7 h-7 rounded-full bg-zinc-800/80 backdrop-blur-sm border-2 border-zinc-900 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                              +{journey.totalMembers - 3}
                          </div>
                      )}
                  </div>

                  <div 
                    className="text-[11px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md text-white border"
                    style={{ backgroundColor: `${themeColor}60`, borderColor: `${themeColor}80` }}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{journey.daysRemaining > 0 ? `${journey.daysRemaining} ngày` : 'Kết thúc'}</span>
                  </div>
              </div>
            </div>
          </div>
          
      </div>

    </div>
  );
};