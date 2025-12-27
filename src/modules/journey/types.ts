// src/modules/journey/types.ts

import { Checkin } from "@/modules/checkin/types";

// --- ENUMS ---

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

export enum JourneyInvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum WidgetStatus {
  ON_TRACK = 'ON_TRACK',
  AT_RISK = 'AT_RISK',
  COMPLETED = 'COMPLETED',
  FROZEN = 'FROZEN',
  OFF_TRACK = 'OFF_TRACK'
}

// --- INTERFACES ---

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

export interface UpdateJourneySettingsRequest {
  name?: string;
  description?: string;
  theme?: string;
  hasStreak?: boolean;
  requiresFreezeTicket?: boolean;
  isHardcore?: boolean;
  requireApproval?: boolean;
}

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

export interface JourneyParticipantResponse {
  userId: number;
  fullname: string;
  avatarUrl?: string;
  handle: string;
  role: JourneyRole;
}

export interface JourneyInvitationResponse {
  id: number;
  journeyId: string;
  journeyName: string;
  inviterName: string;
  inviterAvatar?: string;
  status: JourneyInvitationStatus;
  sentAt: string;
}

export interface JoinJourneyRequest {
  inviteCode: string;
}

export interface JourneyRequestResponse {
  requestId: string;
  userId: number;
  fullname: string;
  avatarUrl?: string;
  handle: string;
  createdAt: string;
}

export interface UserActiveJourneyResponse {
  id: string;
  name: string;
  description: string;
  status: JourneyStatus;
  visibility: JourneyVisibility;
  startDate: string;
  totalCheckins: number;
  checkins: Checkin[];
}

// Alias để tương thích ngược nếu code cũ dùng "Journey"
export type Journey = JourneyResponse;