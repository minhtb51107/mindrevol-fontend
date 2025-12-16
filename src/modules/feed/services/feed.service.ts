// src/modules/feed/services/feed.service.ts
import {http} from '@/lib/http';
import { JourneyPost } from '../types';

export const feedService = {
  // 1. Lấy Feed tổng hợp (Home Page)
  getUnifiedFeed: async (page: number, limit: number = 10) => {
    // Gọi endpoint: /api/v1/checkins/feed
    const response = await http.get<any>(`/api/v1/checkins/feed`, {
      params: { page, limit }
    });
    // Giả sử backend trả về ApiResponse<List<CheckinResponse>>
    // Nếu backend trả về { data: [...] }, ta return response.data.data
    return response.data.data as JourneyPost[];
  },

  // 2. Lấy Feed của một Journey cụ thể (Journey Detail)
  getJourneyFeed: async (journeyId: string, cursor?: string, limit: number = 20) => {
    const response = await http.get<any>(`/api/v1/checkins/journey/${journeyId}/cursor`, {
      params: { cursor, limit }
    });
    return response.data.data as JourneyPost[];
  },

  // 3. Thả tim/Reaction
  toggleReaction: async (checkinId: string, type: 'HEART' | 'CLAP' | 'FIRE') => {
    // Gọi endpoint: /api/v1/checkins/reaction
    return http.post('/api/v1/checkins/reaction', {
      checkinId,
      type
    });
  }
};