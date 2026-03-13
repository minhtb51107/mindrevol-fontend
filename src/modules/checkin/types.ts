export enum CheckinStatus {
  NORMAL = 'NORMAL',
  REST = 'REST',
  // Các status cũ như LATE, COMEBACK, FAILED có thể giữ để tương thích data cũ, 
  // nhưng logic tạo mới sẽ không dùng nữa.
  FAILED = 'FAILED', 
  LATE = 'LATE',
  COMEBACK = 'COMEBACK'
}

// [MỚI] Enum loại hoạt động (Khớp với Backend)
export enum ActivityType {
  DEFAULT = 'DEFAULT',
  LEARNING = 'LEARNING',
  WORKING = 'WORKING',
  EXERCISING = 'EXERCISING',
  TRAVELING = 'TRAVELING',
  DATING = 'DATING',
  GAMING = 'GAMING',
  EATING = 'EATING',
  READING = 'READING',
  CHILLING = 'CHILLING',
  CREATING = 'CREATING',
  CUSTOM = 'CUSTOM'
}

export interface Checkin {
  id: string;
  userId: string; // Backend trả về String UUID
  userFullName: string;
  userAvatar: string;
  journeyId: string;
  
  imageUrl: string;
  thumbnailUrl: string;
  caption: string;
  
  // [MỚI] Context Info
  activityType: ActivityType;
  activityName?: string;
  locationName?: string;
  emotion?: string;
  tags?: string[];

  status: CheckinStatus;
  createdAt: string;
  checkinDate: string;
  
  reactionCount: number;
  commentCount: number;
  latestReactions?: any[]; 
}

export interface CreateCheckinRequest {
  journeyId: string;
  file: File;
  caption?: string;
  
  // [MỚI] Các trường Platform
  emotion?: string;       // Emoji (🔥, 🌿...)
  activityType?: ActivityType;
  activityName?: string;  // Tên hiển thị ("Học bài", "Chill")
  locationName?: string;
  tags?: string[];
  
  statusRequest?: 'NORMAL' | 'REST'; 
  visibility?: 'PUBLIC' | 'PRIVATE' | 'FRIENDS';
}

export interface MapMarkerResponse {
  checkinId: string;
  latitude: number;
  longitude: number;
  thumbnailUrl: string;
  userAvatar: string;
  fullname: string;
}