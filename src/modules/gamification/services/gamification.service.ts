import { http } from '@/lib/http';
import { Badge, PointHistory } from '../types';

export const gamificationService = {
  getMyBadges: async (): Promise<Badge[]> => {
    // API backend đã sửa: GET /api/v1/gamification/badges
    const response = await http.get<{ data: Badge[] }>('/gamification/badges'); 
    return response.data.data;
  },

  getPointHistory: async (): Promise<PointHistory[]> => {
    // API backend đã sửa: GET /api/v1/gamification/points/history
    const response = await http.get<{ data: PointHistory[] }>('/gamification/points/history');
    return response.data.data;
  }
};