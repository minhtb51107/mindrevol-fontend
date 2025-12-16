// src/modules/checkin/types.ts

export enum CheckinStatus {
  NORMAL = 'NORMAL',
  LATE = 'LATE',
  COMEBACK = 'COMEBACK',
  REST = 'REST',
  FAILED = 'FAILED'
}

export interface Checkin {
  id: string;
  userId: number;
  userFullName: string;
  userAvatar: string;
  journeyId: string;
  journeyName: string;
  imageUrl: string;
  thumbnailUrl: string;
  caption: string;
  status: CheckinStatus;
  taskTitle?: string;
  createdAt: string; // ISO String
  reactionCount: number;
  commentCount: number;
  // Có thể thêm fields khác tùy response backend
}

export interface CreateCheckinRequest {
  journeyId: string;
  file: File;
  caption?: string;
  emotion?: string; // EXCITED, SAD, etc.
  taskId?: string;
}