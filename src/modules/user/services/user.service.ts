import { http } from '@/lib/http';
import { JourneyResponse } from '@/modules/journey/types'; 

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
  friendCount?: number;
}

// 2. Interface rút gọn cho Search/List
export interface UserSummary {
  id: number;
  fullname: string;
  handle: string;
  avatarUrl: string;
  friendshipStatus?: 'NONE' | 'PENDING' | 'ACCEPTED' | 'RECEIVED';
}

// 3. Interface cho Settings (Mới)
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

// [MỚI] Interface cho Update Profile
export interface UpdateProfileData {
  fullname?: string;
  handle?: string;
  bio?: string;
  dateOfBirth?: string; // Format YYYY-MM-DD
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  avatar?: File; // File ảnh upload
}

// [MỚI] Interface cho Password
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

  async searchUsers(query: string): Promise<UserSummary[]> {
    if (!query) return [];
    const res = await http.get<{ data: UserSummary[] }>(`/users/search`, { 
      params: { query } 
    });
    return res.data.data;
  }

  async sendFriendRequest(userId: number): Promise<void> {
    await http.post(`/friends/request/${userId}`);
  }

  async acceptFriendRequest(friendshipId: number): Promise<void> {
    await http.post(`/friends/accept/${friendshipId}`);
  }

  async getUserRecaps(userId: number): Promise<JourneyResponse[]> {
    const response = await http.get<{ data: JourneyResponse[] }>(`/users/${userId}/recaps`);
    return response.data.data;
  }

  // --- [MỚI] PROFILE UPDATE ---
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const formData = new FormData();
    if (data.fullname) formData.append('fullname', data.fullname);
    if (data.handle) formData.append('handle', data.handle);
    if (data.bio) formData.append('bio', data.bio);
    if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
    if (data.gender) formData.append('gender', data.gender);
    if (data.avatar) formData.append('file', data.avatar); // Backend nhận @RequestParam("file")

    const response = await http.put<{ data: UserProfile }>('/users/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  }

  // --- [MỚI] SECURITY ---
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

  // --- SETTINGS API (MỚI) ---
  
  async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await http.get<{ data: NotificationSettings }>('/users/settings/notifications');
    return response.data.data;
  }

  async updateNotificationSettings(data: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const response = await http.put<{ data: NotificationSettings }>('/users/settings/notifications', data);
    return response.data.data;
  }

  // --- SOCIAL ACCOUNTS (MỚI) ---
  
  async getLinkedAccounts(): Promise<LinkedAccount[]> {
    const response = await http.get<{ data: LinkedAccount[] }>('/users/me/social-accounts');
    return response.data.data;
  }

  async unlinkSocialAccount(provider: string): Promise<void> {
    await http.delete(`/users/me/social-accounts/${provider}`);
  }

  // --- SYSTEM / FEEDBACK (MỚI) ---
  
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