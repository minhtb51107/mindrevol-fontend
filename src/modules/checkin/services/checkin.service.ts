import { http } from '@/lib/http';
import { Checkin, CreateCheckinRequest } from '../types';

// Định nghĩa kiểu cho Comment
export interface Comment {
  id: string;
  userId: string;
  userFullName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

class CheckinService {
  private readonly BASE_URL = '/checkins';

  // ... (Các hàm cũ getFeed, createCheckin giữ nguyên) ...

  async getFeed(page = 0, limit = 20): Promise<Checkin[]> {
    const res = await http.get<{ data: any }>(`${this.BASE_URL}/feed`, { params: { page, limit } });
    return res.data.data;
  }

  async getJourneyFeed(journeyId: string, page = 0, limit = 20): Promise<Checkin[]> {
    const res = await http.get<{ data: { content: Checkin[] } }>(`${this.BASE_URL}/journey/${journeyId}`, { params: { page, limit } });
    return res.data.data.content;
  }

  async createCheckin(req: CreateCheckinRequest): Promise<Checkin> {
    const formData = new FormData();
    formData.append('file', req.file);
    formData.append('journeyId', req.journeyId);
    if (req.caption) formData.append('caption', req.caption);
    if (req.emotion) formData.append('emotion', req.emotion);
    
    const res = await http.post<{ data: Checkin }>(this.BASE_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  }

  // --- MỚI: Thả tim ---
  async toggleReaction(checkinId: string, type: 'HEART' | 'CLAP' | 'FIRE'): Promise<void> {
    await http.post(`${this.BASE_URL}/reaction`, { checkinId, type });
  }

  // --- MỚI: Gửi bình luận ---
  async postComment(checkinId: string, content: string): Promise<Comment> {
    const res = await http.post<{ data: Comment }>(`${this.BASE_URL}/${checkinId}/comments`, { content });
    return res.data.data;
  }

  // --- MỚI: Lấy danh sách bình luận ---
  async getComments(checkinId: string, page = 0): Promise<Comment[]> {
    const res = await http.get<{ data: { content: Comment[] } }>(`${this.BASE_URL}/${checkinId}/comments`, {
      params: { page, size: 50, sort: 'createdAt,asc' } // Lấy cũ nhất trước
    });
    return res.data.data.content;
  }
}

export const checkinService = new CheckinService();