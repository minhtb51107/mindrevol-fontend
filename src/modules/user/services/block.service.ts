import { http } from '@/lib/http';
import { UserSummary } from './user.service';

export const blockService = {
  // Lấy danh sách chặn
  getBlockedUsers: async (): Promise<UserSummary[]> => {
    const res = await http.get<{ data: UserSummary[] }>('/users/blocked');
    return res.data.data;
  },

  // Chặn người dùng
  blockUser: async (userId: number): Promise<void> => {
    await http.post(`/users/${userId}/block`);
  },

  // Bỏ chặn
  unblockUser: async (userId: number): Promise<void> => {
    await http.delete(`/users/${userId}/block`);
  }
};