import { http } from '@/lib/http';
import { JourneyPost, ReactionDetail } from '../types';

export const feedService = {
  // 1. Lấy Feed tổng hợp
  getUnifiedFeed: async (page: number, limit: number = 10) => {
    const response = await http.get<any>(`/checkins/feed`, {
      params: { page, limit }
    });
    return response.data.data as JourneyPost[];
  },

  // 2. Lấy Feed của Journey
  getJourneyFeed: async (journeyId: string, cursor?: string, limit: number = 20) => {
    const response = await http.get<any>(`/checkins/journey/${journeyId}/cursor`, {
      params: { cursor, limit }
    });
    return response.data.data as JourneyPost[];
  },

  // 3. Thả tim/Reaction (SỬA LẠI CHO ĐÚNG ENDPOINT)
  toggleReaction: async (checkinId: string, emoji: string) => {
    // Endpoint mới: POST /api/v1/checkins/{id}/reactions
    return await http.post(`/checkins/${checkinId}/reactions`, { 
      emoji: emoji // Gửi emoji string (vd: "❤️")
    });
  },

  // 4. Gửi Comment (SỬA LẠI NẾU CẦN)
  postComment: async (checkinId: string, content: string) => {
      // Endpoint: POST /api/v1/checkins/{id}/comments
      return await http.post(`/checkins/${checkinId}/comments`, { content });
  },

  // 5. Lấy danh sách Reaction & Comment (Activity Modal)
  getPostReactions: async (checkinId: string) => {
    const response = await http.get<any>(`/checkins/${checkinId}/reactions`);
    return response.data.data as ReactionDetail[];
  }
};