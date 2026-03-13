import React from 'react';
import { UserPlus, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Props {
  journey: any; 
  isOwner: boolean;
  isPending: boolean;
  hasPendingRequests: boolean;
  canInvite: boolean;
  onEnter: (id: string) => void;
  onInvite: (journey: any) => void;
  onSettings: (journey: any) => void;
}

export const ActiveJourneyCard: React.FC<Props> = ({
  journey,
  isOwner,
  isPending,
  hasPendingRequests,
  canInvite,
  onEnter,
  onInvite,
  onSettings
}) => {
  // Hình nền
  const bgStyle = journey.themeColor?.includes('/') 
    ? { backgroundImage: `url('${journey.themeColor}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: journey.themeColor || '#f4f4f5' };

  // Dữ liệu hiển thị
  const avatars = journey.memberAvatars || [];
  const totalMembers = journey.totalMembers || journey.participantCount || 1;
  const extraCount = Math.max(0, totalMembers - Math.min(avatars.length, 3)); 

  let daysLeft = journey.daysRemaining;
  if (daysLeft === undefined && journey.endDate) {
      const end = new Date(journey.endDate);
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      daysLeft = Math.ceil(diff / (1000 * 3600 * 24));
  }

  // Tách riêng hàm xử lý click Card để không ảnh hưởng đến các nút con
  const handleCardClick = (e: React.MouseEvent) => {
    if (isPending) return;
    
    // Nếu người dùng click trúng các thẻ svg, button bên trong cụm Action, ta bỏ qua
    const target = e.target as HTMLElement;
    if (target.closest('.action-buttons-container')) {
        return; 
    }
    
    onEnter(journey.id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={cn(
          "group relative min-h-[130px] rounded-[24px] p-4 sm:p-5 transition-all overflow-hidden flex flex-col justify-between border-2 border-transparent select-none",
          isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:border-white/50 active:scale-[0.98]"
      )}
      style={bgStyle}
    >
      {/* [SỬA LỖI HITBOX]: Cụm nút bấm được đặt riêng biệt với z-50, 
        tăng p-2.5 để dễ bấm trên điện thoại.
        Class 'action-buttons-container' dùng để check click chặn bong bóng sự kiện. 
      */}
      {!isPending && (
        <div className="absolute top-2 right-2 flex items-center gap-1 z-50 action-buttons-container drop-shadow-md">
          {canInvite && (
            <button 
              type="button"
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation(); 
                onInvite(journey); 
              }}
              className="p-2.5 text-zinc-800 bg-white/60 hover:bg-white rounded-full transition-all backdrop-blur-md active:scale-90"
              title="Invite members"
            >
              <UserPlus className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>
          )}

          <button 
            type="button"
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation(); 
              onSettings(journey); 
            }}
            className={cn(
                "p-2.5 rounded-full transition-all backdrop-blur-md relative active:scale-90",
                hasPendingRequests 
                    ? "text-red-700 bg-red-100/90 hover:bg-red-200" 
                    : "text-zinc-800 bg-white/60 hover:bg-white"
            )}
            title="Journey settings"
          >
            <Settings className={cn("w-[18px] h-[18px]", hasPendingRequests && "animate-pulse")} strokeWidth={2.5} />
            {hasPendingRequests && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
            )}
          </button>
        </div>
      )}

      {/* TEXT CONTENT */}
      <div className="relative z-10 pr-20 mb-6 pointer-events-none">
        <div className="flex items-center gap-2">
          <h3 
            className="font-bold text-zinc-900 text-[22px] truncate drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]" 
            style={{ fontFamily: '"Jua", sans-serif' }}
          >
            {journey.avatar && <span className="mr-2 drop-shadow-none">{journey.avatar}</span>}
            {journey.name}
          </h3>
          {isPending && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border bg-white/90 text-orange-600 border-orange-400/50 backdrop-blur-md whitespace-nowrap shadow-sm pointer-events-auto">
              PENDING
            </span>
          )}
        </div>
      </div>

      {/* FOOTER: AVATARS & DAYS */}
      <div className="relative z-10 flex items-end justify-between mt-auto drop-shadow-md pointer-events-none">
        
        <div className="flex items-center -space-x-2">
            {avatars.slice(0, 3).map((url: string, idx: number) => (
                <Avatar key={idx} className="w-8 h-8 border-2 border-white/80 shadow-sm bg-white/50 backdrop-blur-sm">
                    <AvatarImage src={url || undefined} />
                    <AvatarFallback className="text-[10px] bg-zinc-100 text-zinc-800 font-bold">
                        <Users className="w-3.5 h-3.5" />
                    </AvatarFallback>
                </Avatar>
            ))}
            {extraCount > 0 && (
                <div className="w-8 h-8 rounded-full bg-white/90 border-2 border-white/80 flex items-center justify-center text-[11px] text-zinc-900 font-bold backdrop-blur-md shadow-sm z-10">
                    +{extraCount}
                </div>
            )}
        </div>

        {daysLeft !== undefined && (
            <div 
                className="text-zinc-900 text-[16px] font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] tracking-wide" 
                style={{ fontFamily: '"Jua", sans-serif' }}
            >
                {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
            </div>
        )}
      </div>
    </div>
  );
};