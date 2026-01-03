import { http } from '@/lib/http';
import { JourneyResponse } from '@/modules/journey/types'; 

// 1. Interface đầy đủ cho Profile User
export interface UserProfile {
  id: string; // Đổi sang string cho thống nhất với UUID backend
  email?: string; // Có thể ẩn nếu là public profile
  handle: string;
  fullname: string;
  avatarUrl: string;
  bio?: string;
  coverUrl?: string;
  role?: string;
  
  // Stats
  friendCount: number;
  journeyCount?: number;

  // [MỚI] Trạng thái quan hệ (Dùng cho UI xem profile người khác)
  friendshipStatus?: 'NONE' | 'PENDING' | 'ACCEPTED' | 'DECLINED';
  isBlockedByMe?: boolean;
  isBlockedByThem?: boolean;
  isMe?: boolean;
}

// 2. Interface rút gọn cho Search/List
export interface UserSummary {
  id: string;
  fullname: string;
  handle: string;
  avatarUrl: string;
  friendshipStatus?: 'NONE' | 'PENDING' | 'ACCEPTED' | 'RECEIVED';
}

// 3. Interface cho Settings
export interface NotificationSettings {
  emailDailyReminder: boolean;
  emailUpdates: boolean;
  pushFriendRequest: boolean;
  pushNewComment: boolean;
  pushJourneyInvite: boolean;
  pushReaction: boolean;
}

export interface LinkedAccount {
  provider: string;
  email: string;
  avatarUrl: string;
  connected: boolean;
}

export interface UpdateProfileData {
  fullname?: string;
  handle?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  avatar?: File; 
}

export interface ChangePasswordData {
  oldPassword?: string;
  newPassword?: string;
}

class UserService {
  
  // --- USER PROFILE ---
  async getMyProfile(): Promise<UserProfile> {
    const response = await http.get<{ data: UserProfile }>('/users/me');
    return response.data.data;
  }

  // [MỚI] Lấy profile người khác theo ID
  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await http.get<{ data: UserProfile }>(`/users/${userId}/profile`);
    return response.data.data;
  }

  async searchUsers(query: string): Promise<UserSummary[]> {
    if (!query) return [];
    const res = await http.get<{ data: UserSummary[] }>(`/users/search`, { 
      params: { query } 
    });
    return res.data.data;
  }

  async getUserRecaps(userId: string): Promise<JourneyResponse[]> {
    const response = await http.get<{ data: JourneyResponse[] }>(`/users/${userId}/recaps`);
    return response.data.data;
  }

  // --- PROFILE UPDATE ---
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const formData = new FormData();
    if (data.fullname) formData.append('fullname', data.fullname);
    if (data.handle) formData.append('handle', data.handle);
    if (data.bio) formData.append('bio', data.bio);
    if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
    if (data.gender) formData.append('gender', data.gender);
    if (data.avatar) formData.append('file', data.avatar); 

    const response = await http.put<{ data: UserProfile }>('/users/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  }

  // --- SECURITY ---
  async hasPassword(): Promise<boolean> {
    const res = await http.get<{ data: boolean }>('/auth/has-password');
    return res.data.data;
  }

  async createPassword(newPassword: string): Promise<void> {
    await http.post('/auth/create-password', { newPassword });
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    await http.post('/auth/change-password', data);
  }

  // --- SETTINGS API ---
  async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await http.get<{ data: NotificationSettings }>('/users/settings/notifications');
    return response.data.data;
  }

  async updateNotificationSettings(data: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const response = await http.put<{ data: NotificationSettings }>('/users/settings/notifications', data);
    return response.data.data;
  }

  // --- SOCIAL ACCOUNTS ---
  async getLinkedAccounts(): Promise<LinkedAccount[]> {
    const response = await http.get<{ data: LinkedAccount[] }>('/users/me/social-accounts');
    return response.data.data;
  }

  async unlinkSocialAccount(provider: string): Promise<void> {
    await http.delete(`/users/me/social-accounts/${provider}`);
  }

  // --- SYSTEM / FEEDBACK ---
  async getSystemConfigs(): Promise<Record<string, string>> {
    const response = await http.get<{ data: Record<string, string> }>('/system/configs');
    return response.data.data;
  }

  async sendFeedback(data: { type: string; content: string; appVersion?: string }): Promise<void> {
    await http.post('/system/feedback', data);
  }

  async deleteAccount(): Promise<void> {
    await http.delete('/users/me');
  }
}

export const userService = new UserService();