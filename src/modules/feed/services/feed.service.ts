import { http } from '@/lib/http';
import { FeedItem, PostProps, AdProps, InteractionType } from '../types';

// Helper map dữ liệu
const mapToFeedItem = (item: any): FeedItem => {
  
  // 1. Kiểm tra nếu là QUẢNG CÁO (Dựa trên trường type hoặc feedType từ Backend)
  if (item.type === 'AD' || item.feedType === 'AD') {
      return {
          id: item.id,
          type: 'AD',
          title: item.title || "Quảng cáo",
          description: item.description,
          imageUrl: item.imageUrl || item.image, // Ảnh quảng cáo
          ctaText: item.ctaText || "Xem thêm",
          ctaLink: item.ctaLink || "#",
          brandName: item.brandName,
          brandLogo: item.brandLogo
      } as AdProps;
  }

  // 2. Nếu là POST (Logic cũ)
  const date = new Date(item.timestamp || item.createdAt);
  const formattedTime = date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
  });

  return {
    ...item,
    type: 'POST', // Gán cứng
    id: item.id,
    userId: item.user?.id || item.userId,
    user: {
      id: item.user?.id,
      name: item.user?.fullname || item.user?.name || "Người dùng",
      avatar: item.user?.avatarUrl || item.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user?.fullname || 'User')}`,
    },
    image: item.imageUrl || item.image || item.thumbnailUrl,
    caption: item.caption,
    
    timestamp: formattedTime, 
    
    status: item.status?.toLowerCase() || 'normal',
    reactionCount: item.reactionCount || 0,
    commentCount: item.commentCount || 0,
    latestReactions: item.latestReactions || [],
    emotion: item.emotion || 'NORMAL',
    interactionType: item.interactionType || InteractionType.GROUP_DISCUSS,
    activityName: item.activityName,
    locationName: item.locationName,
    taskName: item.taskTitle || item.taskName
  } as PostProps;
};

export const feedService = {
  // 1. Lấy Feed tổng hợp (Unified)
  getUnifiedFeed: async (page: number, limit: number = 10): Promise<FeedItem[]> => {
    const response = await http.get<any>(`/checkins/unified`, { 
      params: { limit }
    });
    const rawData = response.data.data || [];
    return rawData.map(mapToFeedItem);
  },

  // 2. Lấy Feed của Journey (Đã fix lỗi cursor)
  getJourneyFeed: async (journeyId: string, cursor?: string, limit: number = 20): Promise<FeedItem[]> => {
    const response = await http.get<any>(`/checkins/journey/${journeyId}`, {
      params: { cursor, limit }
    });
    
    const rawData = response.data.data || [];
    return rawData.map(mapToFeedItem);
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
    return response.data.data;
  }
};