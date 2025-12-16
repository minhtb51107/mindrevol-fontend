import { http } from '@/lib/http';

export interface Friend {
  id: number;
  fullname: string;
  avatarUrl: string;
  handle: string;
  isOnline: boolean;
}

export interface FriendshipResponse {
  id: number; // ID của mối quan hệ (dùng để accept/decline)
  friend: Friend;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED';
  isRequester: boolean;
  createdAt: string;
}

// Interface cho kết quả tìm kiếm user
export interface UserSummary {
  id: number;
  fullname: string;
  handle: string;
  avatarUrl: string;
  // Trạng thái quan hệ với user này để hiển thị nút bấm phù hợp
  friendshipStatus: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED' | 'NONE';
}

class FriendService {
  // 1. Lấy danh sách bạn bè
  async getMyFriends(): Promise<FriendshipResponse[]> {
    const res = await http.get<any>('/friends'); 
    // Backend trả về Page, ta lấy content
    return res.data?.data?.content || [];
  }

  // 2. Lấy danh sách lời mời kết bạn đang chờ (Incoming)
  async getIncomingRequests(): Promise<FriendshipResponse[]> {
    const res = await http.get<any>('/friends/requests/incoming');
    return res.data?.data?.content || [];
  }

  // 3. Tìm kiếm người dùng (MỚI)
  async searchUsers(query: string): Promise<UserSummary[]> {
    // API tìm kiếm user. Lưu ý: query param là 'q' hoặc 'query' tùy backend bạn cài
    const res = await http.get<any>('/users/search', { params: { query } });
    return res.data?.data || [];
  }

  // 4. Gửi lời mời kết bạn
  async sendFriendRequest(targetUserId: number): Promise<void> {
    await http.post('/friends/request', { targetUserId });
  }

  // 5. Chấp nhận lời mời
  async acceptRequest(friendshipId: number): Promise<void> {
    await http.post(`/friends/accept/${friendshipId}`);
  }

  // 6. Từ chối lời mời
  async declineRequest(friendshipId: number): Promise<void> {
    await http.post(`/friends/decline/${friendshipId}`);
  }

  // 7. Hủy kết bạn
  async unfriend(targetUserId: number): Promise<void> {
    await http.delete(`/friends/${targetUserId}`);
  }
}

export const friendService = new FriendService();