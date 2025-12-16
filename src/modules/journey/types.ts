// src/modules/journey/types.ts

// --- ENUMS (Giữ nguyên các enum cũ và thêm mới) ---

export enum JourneyType {
  HABIT = 'HABIT',
  ROADMAP = 'ROADMAP',
  CHALLENGE = 'CHALLENGE',
  MEMORIES = 'MEMORIES',
  PROJECT = 'PROJECT'
}

export enum JourneyStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
  DROPPED = 'DROPPED'
}

export enum JourneyRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER'
}

export enum JourneyVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export enum InteractionType {
  PRIVATE_REPLY = 'PRIVATE_REPLY',
  GROUP_DISCUSS = 'GROUP_DISCUSS',
  RESTRICTED = 'RESTRICTED'
}

// [NEW] Mapping từ JourneyInvitationStatus.java
export enum JourneyInvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

// [NEW] Mapping từ WidgetStatus (trong JourneyWidgetResponse.java)
export enum WidgetStatus {
  ON_TRACK = 'ON_TRACK',
  AT_RISK = 'AT_RISK',
  COMPLETED = 'COMPLETED',
  FROZEN = 'FROZEN',
  OFF_TRACK = 'OFF_TRACK'
}

// --- INTERFACES ---

// 1. Request tạo mới (Giữ nguyên)
export interface CreateJourneyRequest {
  name: string;
  description: string;
  type: JourneyType;
  startDate: string;
  endDate: string;
  theme?: string;
  visibility: JourneyVisibility;
  interactionType: InteractionType;
  roadmapTasks?: {
    dayNo: number;
    title: string;
    description?: string;
  }[];
}

// 2. Response chi tiết hành trình (Giữ nguyên)
export interface JourneyResponse {
  id: string;
  name: string;
  description: string;
  type: JourneyType;
  status: JourneyStatus;
  startDate: string;
  endDate: string;
  theme: string;
  inviteCode: string;
  requireApproval: boolean;
  settingHasStreak: boolean;
  settingReqFreezeTicket: boolean;
  settingIsHardcore: boolean;
  visibility: JourneyVisibility;
  interactionType: InteractionType;
  createdAt: string;
  createdBy: string;
  creatorName: string;
  creatorAvatar: string;
  role?: JourneyRole;
  participantCount: number;
}

// 3. [UPDATE] Request cập nhật cài đặt
// Mapping từ: UpdateJourneySettingsRequest.java
export interface UpdateJourneySettingsRequest {
  name?: string;
  description?: string;
  theme?: string;
  hasStreak?: boolean;          // Dùng optional (?) vì bên Java là Boolean object
  requiresFreezeTicket?: boolean;
  isHardcore?: boolean;
  requireApproval?: boolean;    // <--- Đã thêm trường này theo yêu cầu
}

// 4. [NEW] Response cho Widget
// Mapping từ: JourneyWidgetResponse.java
export interface JourneyWidgetResponse {
  journeyName: string;
  currentStreak: number;
  isCompletedToday: boolean;
  latestThumbnailUrl?: string;
  status: WidgetStatus;
  statusLabel: string;
  ownerName: string;
  ownerAvatar?: string;
}

// 5. [NEW] Response thành viên
// Mapping từ: JourneyParticipantResponse.java
export interface JourneyParticipantResponse {
  userId: number;       // Lưu ý: Java là Long -> TS là number
  fullname: string;
  avatarUrl?: string;
  handle: string;
  role: JourneyRole;
}

// 6. [NEW] Response lời mời
// Mapping từ: JourneyInvitationResponse.java
export interface JourneyInvitationResponse {
  id: number;
  journeyId: string;    // UUID
  journeyName: string;
  inviterName: string;
  inviterAvatar?: string;
  status: JourneyInvitationStatus;
  sentAt: string;       // LocalDateTime -> string ISO
}

// 7. Request tham gia (Giữ nguyên)
export interface JoinJourneyRequest {
  inviteCode: string;
}