import React from 'react';
import { X } from 'lucide-react';
import { Checkin } from '../types';
// Import Component Card từ Feed để tái sử dụng giao diện
import { JourneyPostCard, PostProps } from '@/modules/feed/components/JourneyPostCard';

interface Props {
  checkin: Checkin;
  onClose: () => void;
}

export const CheckinDetailModal: React.FC<Props> = ({ checkin, onClose }) => {
  
  // Helper: Map status từ API sang format của Card
  const mapStatus = (status: string): 'completed' | 'failed' | 'comeback' | 'rest' | 'normal' => {
    const s = String(status).toUpperCase();
    if (s === 'COMEBACK') return 'comeback';
    if (s === 'FAILED' || s === 'FAIL') return 'failed';
    if (s === 'REST') return 'rest';
    return 'completed'; // Mặc định NORMAL/LATE là completed
  };

  // Chuyển đổi dữ liệu từ Checkin -> PostProps để truyền vào Card
  const postData: PostProps = {
    id: checkin.id,
    userId: String(checkin.userId),
    user: {
      name: checkin.userFullName,
      avatar: checkin.userAvatar || `https://ui-avatars.com/api/?name=${checkin.userFullName}`
    },
    image: checkin.imageUrl,
    caption: checkin.caption,
    status: mapStatus(checkin.status),
    taskName: checkin.taskTitle,
    // Format thời gian giống trang chủ
    timestamp: new Date(checkin.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reactionCount: checkin.reactionCount,
    commentCount: checkin.commentCount,
    latestReactions: [] // Trong modal xem nhanh có thể chưa cần list reaction chi tiết ngay
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      
      {/* Nút đóng to rõ ở góc */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-[110] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-sm"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Hiển thị Card ở chính giữa */}
      {/* Wrapper này giới hạn chiều rộng để Card không bị quá to trên màn hình lớn */}
      <div className="w-full max-w-[450px] aspect-square flex items-center justify-center relative z-10">
         <JourneyPostCard 
            post={postData} 
            isActive={true} // Luôn active để hiện rõ ảnh và caption
            // Nếu bạn muốn cho phép xóa/sửa ngay trong modal này thì truyền thêm handler vào đây
            // onDelete={() => { ...; onClose(); }} 
         />
      </div>
    </div>
  );
};