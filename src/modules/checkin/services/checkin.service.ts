// src/modules/checkin/services/checkin.service.ts
import { http } from '@/lib/http';
import { Checkin, CreateCheckinRequest } from '@/modules/feed/types'; 

class CheckinService {
  private readonly BASE_URL = '/checkins'; 

  // 1. Lấy Feed
  async getJourneyFeed(journeyId: string, page = 0, limit = 20): Promise<Checkin[]> {
    const res = await http.get<{ data: any }>(`${this.BASE_URL}/journey/${journeyId}`, { params: { page, limit } });
    const responseData = res.data.data;
    if (Array.isArray(responseData)) return responseData;
    if (responseData && responseData.content) return responseData.content;
    return [];
  }

  // 2. Tạo Check-in
  async createCheckin(req: CreateCheckinRequest): Promise<Checkin> {
    const formData = new FormData();
    formData.append('file', req.file);
    formData.append('journeyId', req.journeyId);
    
    if (req.caption) formData.append('caption', req.caption);
    if (req.statusRequest) formData.append('statusRequest', req.statusRequest);
    if (req.visibility) formData.append('visibility', req.visibility);

    // Append Context fields
    if (req.emotion) formData.append('emotion', req.emotion);
    if (req.activityType) formData.append('activityType', req.activityType);
    if (req.activityName) formData.append('activityName', req.activityName);
    if (req.locationName) formData.append('locationName', req.locationName);
    
    // Xử lý Tags
    if (req.tags && req.tags.length > 0) {
        req.tags.forEach(tag => formData.append('tags', tag));
    }

    const res = await http.post<{ data: Checkin }>(this.BASE_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  }

  // 3. Xóa Check-in
  async deleteCheckin(checkinId: string) {
      return await http.delete(`${this.BASE_URL}/${checkinId}`);
  }

  // 4. Cập nhật Caption
  async updateCheckin(checkinId: string, caption: string) {
      return await http.put(`${this.BASE_URL}/${checkinId}`, { caption });
  }

  // 5. Comment
  async postComment(checkinId: string, content: string) {
     return http.post(`${this.BASE_URL}/${checkinId}/comments`, { content }).then(res => res.data.data);
  }
}

export const checkinService = new CheckinService();