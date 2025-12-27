import { http } from '@/lib/http';
import { Checkin, CreateCheckinRequest } from '../types';

export interface Comment {
  id: string;
  userId: string;
  userFullName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

class CheckinService {
  // [FIX] Sửa dòng này: Bỏ "/api/v1" đi, chỉ để "/checkins"
  // Vì http instance trong @/lib/http đã có sẵn baseURL là /api/v1 rồi
  private readonly BASE_URL = '/checkins'; 

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
    if (req.taskId) formData.append('taskId', req.taskId);
    
    // Gửi statusRequest để Backend biết là FAILED hay NORMAL
    if (req.statusRequest) {
        formData.append('statusRequest', req.statusRequest);
    }
    
    if (req.visibility) formData.append('visibility', req.visibility);
    
    const res = await http.post<{ data: Checkin }>(this.BASE_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  }

  async toggleReaction(checkinId: string, type: 'HEART' | 'CLAP' | 'FIRE' | string): Promise<void> {
    await http.post(`${this.BASE_URL}/reaction`, { checkinId, type });
  }

  async postComment(checkinId: string, content: string): Promise<Comment> {
    const res = await http.post<{ data: Comment }>(`${this.BASE_URL}/${checkinId}/comments`, { content });
    return res.data.data;
  }

  async getComments(checkinId: string, page = 0): Promise<Comment[]> {
    const res = await http.get<{ data: { content: Comment[] } }>(`${this.BASE_URL}/${checkinId}/comments`, {
      params: { page, size: 50, sort: 'createdAt,asc' }
    });
    return res.data.data.content;
  }

  // [MỚI] Xóa bài
  async deleteCheckin(checkinId: string): Promise<void> {
    await http.delete(`${this.BASE_URL}/${checkinId}`);
  }

  // [MỚI] Sửa caption
  async updateCheckin(checkinId: string, caption: string): Promise<void> {
    // Backend cần có API PATCH /checkins/{id} nhận body { caption: "..." }
    await http.patch(`${this.BASE_URL}/${checkinId}`, { caption });
  }
}

export const checkinService = new CheckinService();