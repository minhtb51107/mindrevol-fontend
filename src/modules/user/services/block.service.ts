import { http } from '@/lib/http';

export interface BlockedUser {
  id: number;
  userId: number;
  blockedUserId: number;
  blockedUser: {
    id: number;
    fullname: string;
    handle: string;
    avatarUrl: string;
  };
  createdAt: string;
}

class BlockService {
  
  // CẬP NHẬT ĐƯỜNG DẪN TẠI ĐÂY
  async getBlockList(): Promise<BlockedUser[]> {
    // Đổi thành /users/me/blocks
    const response = await http.get<{ data: BlockedUser[] }>('/users/me/blocks');
    return response.data.data;
  }

  async blockUser(userId: number): Promise<void> {
    await http.post(`/users/blocks/${userId}`);
  }

  async unblockUser(userId: number): Promise<void> {
    await http.delete(`/users/blocks/${userId}`);
  }
}

export const blockService = new BlockService();