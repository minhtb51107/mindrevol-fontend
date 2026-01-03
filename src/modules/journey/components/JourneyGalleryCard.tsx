import React from 'react';
import { UserActiveJourneyResponse } from '../types';
import { Checkin } from '@/modules/checkin/types';
import { format, isValid } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Plus, Heart, Calendar } from 'lucide-react'; // Thêm icon Calendar cho đẹp nếu muốn

// Helper format ngày an toàn
const safeFormatDate = (dateString: string | undefined | null, pattern: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return isValid(date) ? format(date, pattern) : '';
};

interface Props {
  journey: UserActiveJourneyResponse;
  onCheckinClick: (checkin: Checkin) => void;
  isMe?: boolean;
}

export const JourneyGalleryCard: React.FC<Props> = ({ journey, onCheckinClick, isMe = false }) => {
  const navigate = useNavigate();

  // [MỚI] Logic hiển thị ngày tháng
  const renderDate = () => {
    const startStr = safeFormatDate(journey.startDate, "dd 'thg' MM, yyyy");
    const endStr = safeFormatDate(journey.endDate, "dd 'thg' MM, yyyy");

    if (journey.endDate && endStr) {
      // Nếu có ngày kết thúc: hiển thị khoảng thời gian (VD: 01 thg 01 - 05 thg 01, 2025)
      // Để ngắn gọn, ta có thể bỏ chữ "Bắt đầu" khi hiển thị range
      return `${startStr} - ${endStr}`;
    }
    // Nếu chưa kết thúc: hiển thị như cũ
    return `Bắt đầu ${startStr}`;
  };

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between px-2 mb-4">
        <div 
            onClick={() => navigate(`/journeys/${journey.id}`)}
            className="group cursor-pointer flex flex-col"
        >
            <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors tracking-tight">
                    {journey.name}
                </h3>
                <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-1 rounded-full border border-zinc-700">
                    {journey.totalCheckins ?? 0}
                </span>
            </div>
            {/* [SỬA] Hiển thị ngày tháng theo logic mới */}
            <p className="text-xs font-medium text-zinc-500 mt-1 flex items-center gap-1.5">
                {/* Optional: Thêm icon lịch nhỏ nếu thích */}
                {/* <Calendar className="w-3 h-3 mb-0.5" /> */}
                {renderDate()}
            </p>
        </div>
      </div>

      {/* --- SLIDER ẢNH --- */}
      <div className="flex gap-4 overflow-x-auto pb-6 px-2 snap-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700">
        
        {/* Chỉ hiện nút Thêm ảnh nếu là isMe */}
        {isMe && (
            <div 
                onClick={() => navigate(`/journeys/${journey.id}`)}
                className="flex-shrink-0 w-36 h-36 md:w-44 md:h-44 rounded-[2rem] bg-zinc-900 border-4 border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-600 hover:bg-zinc-800 transition-all snap-start group"
            >
                <div className="w-12 h-12 rounded-full bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center mb-2 transition-colors">
                    <Plus className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                </div>
                <span className="text-xs font-bold text-zinc-500 group-hover:text-white">Thêm ảnh</span>
            </div>
        )}

        {/* Danh sách ảnh Check-in */}
        {journey.checkins && journey.checkins.length > 0 ? (
            journey.checkins.map((checkin) => (
                <div 
                    key={checkin.id} 
                    onClick={() => onCheckinClick(checkin)}
                    className="flex-shrink-0 w-36 h-36 md:w-44 md:h-44 relative snap-start cursor-pointer group"
                >
                    <div className="w-full h-full rounded-[2rem] overflow-hidden border-4 border-zinc-950 shadow-lg relative z-10 transition-transform duration-200 group-hover:scale-95">
                        <img 
                            src={checkin.imageUrl} 
                            className="w-full h-full object-cover" 
                            loading="lazy"
                            alt="checkin"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    </div>
                    
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 w-max pointer-events-none">
                        <div className="bg-zinc-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 shadow-sm">
                             {safeFormatDate(checkin.checkinDate, 'dd/MM')}
                        </div>
                    </div>

                    {checkin.reactionCount && checkin.reactionCount > 0 ? (
                        <div className="absolute top-2 right-2 z-20 bg-red-500 text-white text-[10px] font-bold h-6 min-w-[24px] px-1.5 flex items-center justify-center rounded-full border-2 border-zinc-950 shadow-md transform group-hover:scale-110 transition-transform">
                            <Heart className="w-3 h-3 fill-white mr-0.5" />
                            {checkin.reactionCount}
                        </div>
                    ) : null}
                </div>
            ))
        ) : (
            !isMe && (
                <div className="flex items-center justify-center w-full py-10 text-zinc-600 text-sm italic">
                    Chưa có ảnh check-in nào.
                </div>
            )
        )}
      </div>
    </div>
  );
};