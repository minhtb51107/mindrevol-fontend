// src/modules/feed/types.ts

// Enum tương ứng với InteractionType.java bên Backend
export enum InteractionType {
  PRIVATE_REPLY = 'PRIVATE_REPLY', // Chat 1-1 kiểu Locket
  GROUP_DISCUSS = 'GROUP_DISCUSS', // Comment công khai kiểu Facebook
  RESTRICTED = 'RESTRICTED'        // Chỉ xem, không tương tác
}

// Enum tương ứng với Emotion.java
export enum Emotion {
  EXCITED = 'EXCITED',
  NORMAL = 'NORMAL',
  TIRED = 'TIRED',
  HOPELESS = 'HOPELESS'
}

// Enum trạng thái Checkin
export enum CheckinStatus {
  NORMAL = 'NORMAL',
  FAILED = 'FAILED',
  COMEBACK = 'COMEBACK',
  REST = 'REST',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  REJECTED = 'REJECTED'
}

// Interface chính mapping với CheckinResponse.java
// LƯU Ý: Backend cần đảm bảo trả về interactionType (hoặc ta lấy từ Journey cha)
export interface JourneyPost {
  id: string; // UUID
  imageUrl: string;
  thumbnailUrl: string;
  emotion: Emotion;
  status: CheckinStatus;
  caption: string;
  createdAt: string; // ISO String

  // Thông tin người đăng (User)
  userId: number;
  userAvatar: string;
  userFullName: string;

  // Thông tin Journey (Cần thiết để xử lý logic tương tác)
  journeyId: string;
  journeyName?: string;
  interactionType: InteractionType; 

  // Thông tin thống kê (nếu có)
  reactionCount?: number;
  commentCount?: number;
  isLiked?: boolean; // User hiện tại đã like chưa?

  latestReactions: ReactionDetail[]; 
}

export interface ReactionDetail {
  id: string; // UUID reaction id
  userId: number; // Backend trả về userId là Long (number)
  userFullName: string;
  userAvatar: string;
  emoji: string;
  mediaUrl?: string;
  createdAt: string;
}