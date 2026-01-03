import React from 'react';
import { X } from 'lucide-react';
// [FIX 1] Import Checkin từ module hiện tại (checkin/types) thay vì feed/types
import { Checkin, CheckinStatus } from '../types';
// [FIX 2] Import các Enum/Interface cần thiết cho Card từ feed/types
import { Emotion, InteractionType, PostProps } from '@/modules/feed/types';
import { JourneyPostCard } from '@/modules/feed/components/JourneyPostCard';

interface Props {
  checkin: Checkin;
  onClose: () => void;
}

export const CheckinDetailModal: React.FC<Props> = ({ checkin, onClose }) => {
  
  // Helper: Map status từ API sang format của Card
  const mapStatus = (status: string | CheckinStatus): PostProps['status'] => {
    const s = String(status).toUpperCase();
    
    if (s === 'COMEBACK' || s === CheckinStatus.COMEBACK) return 'comeback';
    if (s === 'FAILED' || s === CheckinStatus.FAILED) return 'failed';
    if (s === 'REST' || s === CheckinStatus.REST) return 'rest';
    // NORMAL hoặc các status khác coi như completed/normal
    return 'completed'; 
  };

  // Helper: Map Emotion string sang Enum Emotion
  const mapEmotion = (emo?: string): Emotion => {
    if (!emo) return Emotion.NORMAL;
    // Tìm key trong Enum Emotion khớp với string
    const key = Object.keys(Emotion).find(k => k === emo.toUpperCase());
    return key ? (Emotion as any)[key] : Emotion.NORMAL;
  }

  // Chuyển đổi dữ liệu từ Checkin (Module Checkin) -> PostProps (Module Feed)
  const postData: PostProps = {
    id: checkin.id,
    userId: String(checkin.userId),
    user: {
      name: checkin.userFullName,
      avatar: checkin.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(checkin.userFullName)}`
    },
    image: checkin.imageUrl,
    caption: checkin.caption,
    
    // 1. Status & Interaction
    status: mapStatus(checkin.status),
    // [FIX 3] Mặc định interactionType vì Checkin model không có field này
    interactionType: InteractionType.GROUP_DISCUSS,

    // 2. Data cho Badge (Nhãn)
    emotion: mapEmotion(checkin.emotion), 
    activityName: checkin.activityName,         
    locationName: checkin.locationName,         
    // [FIX 4] Checkin model không có taskTitle, có thể bỏ hoặc để undefined
    taskName: undefined,                
    
    // 3. Metadata
    timestamp: new Date(checkin.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reactionCount: checkin.reactionCount || 0,
    commentCount: checkin.commentCount || 0,
    latestReactions: checkin.latestReactions || [] 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      
      {/* Nút đóng */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-[110] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-sm"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Wrapper click ra ngoài */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      {/* Hiển thị Card ở chính giữa */}
      <div className="w-full max-w-[450px] aspect-square flex items-center justify-center relative z-10 pointer-events-none">
          <div className="pointer-events-auto w-full">
             <JourneyPostCard 
                post={postData} 
                isActive={true} 
             />
          </div>
      </div>
    </div>
  );
};