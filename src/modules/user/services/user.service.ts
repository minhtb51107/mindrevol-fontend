import { http } from '@/lib/http';

// 1. Interface đầy đủ cho Profile User
export interface UserProfile {
  id: number;
  email: string;
  handle: string;
  fullname: string;
  avatarUrl: string;
  bio?: string;
  role?: string;
  friendshipStatus?: string;
}

// 2. Interface rút gọn cho Search/List
export interface UserSummary {
  id: number;
  fullname: string;
  handle: string;
  avatarUrl: string;
  friendshipStatus?: 'NONE' | 'PENDING' | 'ACCEPTED' | 'RECEIVED';
}

class UserService {
  
  // --- QUAN TRỌNG: Hàm này giúp AuthContext lấy thông tin User ---
  async getMyProfile(): Promise<UserProfile> {
    const response = await http.get<{ data: UserProfile }>('/users/me');
    return response.data.data;
  }

  // Tìm kiếm người dùng
  async searchUsers(query: string): Promise<UserSummary[]> {
    if (!query) return [];
    const res = await http.get<{ data: UserSummary[] }>(`/users/search`, { 
      params: { query } 
    });
    return res.data.data;
  }

  // Gửi lời mời kết bạn
  async sendFriendRequest(userId: number): Promise<void> {
    // API backend: POST /api/v1/friends/request/{targetId}
    // Bạn cần check lại controller xem path là 'request' hay 'requests'
    // Theo code cũ Java là: @PostMapping("/request/{targetUserId}")
    await http.post(`/friends/request/${userId}`);
  }

  // Chấp nhận lời mời
  async acceptFriendRequest(friendshipId: number): Promise<void> {
    // API backend: POST /api/v1/friends/accept/{friendshipId}
    await http.post(`/friends/accept/${friendshipId}`);
  }
}

export const userService = new UserService();