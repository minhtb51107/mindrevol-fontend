import { http } from '@/lib/http';
import { JourneyPost, ReactionDetail } from '../types';

// Helper map dữ liệu (Giữ nguyên logic này vì nó quan trọng để hiển thị User)
// Hàm helper map dữ liệu
const mapToJourneyPost = (item: any): JourneyPost => {
  // 1. Xử lý thời gian: Chuyển ISO string sang đối tượng Date
  const date = new Date(item.timestamp || item.createdAt);
  
  // 2. Format thành giờ:phút (Ví dụ: 22:53 hoặc 10:53 PM)
  // Bạn có thể thêm 'en-US' hoặc 'vi-VN' vào tham số đầu tiên nếu muốn cố định ngôn ngữ
  const formattedTime = date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false // Đặt true nếu muốn hiện AM/PM
  });

  // (Tùy chọn) Nếu muốn hiện thêm ngày tháng:
  // const formattedTime = date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });

  return {
    ...item,
    id: item.id,
    userId: item.user?.id || item.userId,
    user: {
      id: item.user?.id,
      name: item.user?.fullname || item.user?.name || "Người dùng",
      avatar: item.user?.avatarUrl || item.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user?.fullname || 'User')}`,
    },
    image: item.imageUrl || item.image || item.thumbnailUrl,
    caption: item.caption,
    
    // [CẬP NHẬT] Sử dụng thời gian đã format
    timestamp: formattedTime, 
    
    status: item.status?.toLowerCase() || 'normal',
    reactionCount: item.reactionCount || 0,
    commentCount: item.commentCount || 0,
    latestReactions: item.latestReactions || [],
    emotion: item.emotion || 'NORMAL',
    activityName: item.activityName,
    locationName: item.locationName,
    taskName: item.taskTitle || item.taskName
  };
};

export const feedService = {
  // 1. Lấy Feed tổng hợp (Unified)
  getUnifiedFeed: async (page: number, limit: number = 10) => {
    // API: /api/v1/checkins/unified?cursor=...&limit=...
    // Backend đang để là /unified, không phải /feed. Cần sửa đúng theo CheckinController:
    const response = await http.get<any>(`/checkins/unified`, { 
      params: { 
        // Backend dùng cursor (datetime), không phải page (int). 
        // Nếu bạn chưa implement logic chuyển page -> cursor ở FE, backend sẽ lấy time hiện tại.
        limit 
      }
    });
    const rawData = response.data.data || [];
    return rawData.map(mapToJourneyPost);
  },

  // 2. Lấy Feed của Journey
  getJourneyFeed: async (journeyId: string, cursor?: string, limit: number = 20) => {
    // [SỬA LỖI Ở ĐÂY]: Xóa chữ '/cursor' đi để khớp với @GetMapping("/journey/{journeyId}")
    const response = await http.get<any>(`/checkins/journey/${journeyId}`, {
      params: { cursor, limit }
    });
    
    const rawData = response.data.data || [];
    return rawData.map(mapToJourneyPost);
  },

  // ... (Các hàm interaction giữ nguyên)
  toggleReaction: async (checkinId: string, emoji: string) => {
    return await http.post(`/checkins/${checkinId}/reactions`, { emoji });
  },

  postComment: async (checkinId: string, content: string) => {
      return await http.post(`/checkins/${checkinId}/comments`, { content });
  },

  getPostReactions: async (checkinId: string) => {
    const response = await http.get<any>(`/checkins/${checkinId}/reactions`);
    return response.data.data as ReactionDetail[];
  }
};