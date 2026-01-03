// src/modules/feed/types.ts

// 1. Enums
export enum InteractionType {
  PRIVATE_REPLY = 'PRIVATE_REPLY',
  GROUP_DISCUSS = 'GROUP_DISCUSS',
  RESTRICTED = 'RESTRICTED'
}

export enum Emotion {
  EXCITED = 'EXCITED',
  NORMAL = 'NORMAL',
  TIRED = 'TIRED',
  HOPELESS = 'HOPELESS'
}

export enum CheckinStatus {
  NORMAL = 'NORMAL',
  FAILED = 'FAILED',
  COMEBACK = 'COMEBACK',
  REST = 'REST',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  REJECTED = 'REJECTED'
}

// 2. Data Models (API Response)
export interface ReactionDetail {
  id: string;
  userId: number;
  userFullName: string;
  userAvatar: string;
  emoji: string;
  mediaUrl?: string;
  createdAt: string;
}

export interface JourneyPost {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  emotion: Emotion;
  status: CheckinStatus;
  caption: string;
  createdAt: string;
  userId: number;
  userAvatar: string;
  userFullName: string;
  journeyId: string;
  journeyName?: string;
  interactionType: InteractionType;
  
  // Dữ liệu ngữ cảnh
  activityName?: string;
  locationName?: string;
  taskTitle?: string;

  reactionCount?: number;
  commentCount?: number;
  isLiked?: boolean;
  latestReactions: ReactionDetail[];
}

// Alias cho Service
export type Checkin = JourneyPost;

// 3. Request Models
export interface CreateCheckinRequest {
  file: File;
  journeyId: string;
  caption?: string;
  statusRequest?: string; 
  visibility?: 'PUBLIC' | 'PRIVATE' | 'FRIENDS';
  emotion?: Emotion;
  activityType?: string;  
  activityName?: string;
  locationName?: string;
  tags?: string[];
}

// 4. UI Props (Dữ liệu truyền vào Component)
// QUAN TRỌNG: Interface này được export để các component khác import
export interface PostProps {
  id: string;
  userId: string; 
  user: { 
    name: string; 
    avatar: string 
  };
  image: string;
  caption: string;
  
  // Logic hiển thị
  status: 'completed' | 'failed' | 'comeback' | 'rest' | 'normal'; 
  emotion: Emotion;           
  interactionType: InteractionType; 
  
  // Các trường hiển thị nhãn
  activityName?: string; 
  locationName?: string;
  taskName?: string; 
  
  timestamp: string;
  reactionCount: number;
  commentCount: number;
  latestReactions: ReactionDetail[];
}