// src/modules/journey/services/journey.service.ts

import { http } from "@/lib/http";
import { 
  CreateJourneyRequest, 
  JourneyResponse, 
  JoinJourneyRequest,
  UpdateJourneySettingsRequest,
  JourneyWidgetResponse,
  JourneyParticipantResponse,
  JourneyInvitationResponse,
  JourneyRequestResponse,
  UserActiveJourneyResponse
} from "../types";
import { Checkin } from "@/modules/checkin/types";

// Base URL
const JOURNEY_URL = "/journeys"; 
const INVITATION_URL = "/journey-invitations";

// Interface hỗ trợ cho Page response
interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export const journeyService = {
  
  // --- NHÓM API CƠ BẢN (CRUD) ---
  createJourney: async (data: CreateJourneyRequest): Promise<JourneyResponse> => {
    const response = await http.post<{ data: JourneyResponse }>(JOURNEY_URL, data);
    return response.data.data;
  },

  getMyJourneys: async (): Promise<JourneyResponse[]> => {
    const response = await http.get<{ data: JourneyResponse[] }>(`${JOURNEY_URL}/me`);
    return response.data.data;
  },

  // [NEW] Lấy danh sách đang hoạt động (cho Profile Tab 1)
  getUserActiveJourneys: async (userId: number | string): Promise<UserActiveJourneyResponse[]> => {
    const response = await http.get<{ data: UserActiveJourneyResponse[] }>(`${JOURNEY_URL}/users/${userId}/active`);
    return response.data.data;
  },

  // [NEW] Lấy danh sách đã kết thúc (cho Profile Tab 2)
  getUserFinishedJourneys: async (userId: number | string): Promise<UserActiveJourneyResponse[]> => {
    const response = await http.get<{ data: UserActiveJourneyResponse[] }>(`${JOURNEY_URL}/users/${userId}/finished`);
    return response.data.data;
  },

  updateSettings: async (journeyId: string, settings: UpdateJourneySettingsRequest): Promise<JourneyResponse> => {
    const response = await http.patch<{ data: JourneyResponse }>(`${JOURNEY_URL}/${journeyId}/settings`, settings);
    return response.data.data;
  },

  deleteJourney: async (journeyId: string): Promise<void> => {
    await http.delete(`${JOURNEY_URL}/${journeyId}`);
  },

  // --- NHÓM API THÀNH VIÊN & THAM GIA ---
  joinJourney: async (data: JoinJourneyRequest): Promise<JourneyResponse> => {
    const response = await http.post<{ data: JourneyResponse }>(`${JOURNEY_URL}/join`, data);
    return response.data.data;
  },

  leaveJourney: async (journeyId: string): Promise<void> => {
    await http.delete(`${JOURNEY_URL}/${journeyId}/leave`);
  },

  kickMember: async (journeyId: string, memberId: number): Promise<void> => {
    await http.delete(`${JOURNEY_URL}/${journeyId}/members/${memberId}`);
  },

  getParticipants: async (journeyId: string): Promise<JourneyParticipantResponse[]> => {
    const response = await http.get<{ data: JourneyParticipantResponse[] }>(`${JOURNEY_URL}/${journeyId}/participants`);
    return response.data.data;
  },

  transferOwnership: async (journeyId: string, newOwnerId: number): Promise<void> => {
    await http.post(`${JOURNEY_URL}/${journeyId}/transfer-ownership`, null, {
      params: { newOwnerId }
    });
  },

  approveRequest: async (requestId: string): Promise<void> => {
    await http.post(`${JOURNEY_URL}/requests/${requestId}/approve`);
  },

  rejectRequest: async (requestId: string): Promise<void> => {
    await http.post(`${JOURNEY_URL}/requests/${requestId}/reject`);
  },

  // --- NHÓM API WIDGET & TIỆN ÍCH ---
  getWidgetInfo: async (journeyId: string): Promise<JourneyWidgetResponse> => {
    const response = await http.get<{ data: JourneyWidgetResponse }>(`${JOURNEY_URL}/${journeyId}/widget-info`);
    return response.data.data;
  },

  getDiscoveryTemplates: async (): Promise<JourneyResponse[]> => {
    return []; 
  },

  forkJourney: async (journeyId: string): Promise<JourneyResponse> => {
    const response = await http.post<{ data: JourneyResponse }>(`${JOURNEY_URL}/${journeyId}/fork`);
    return response.data.data;
  },

  nudgeMember: async (journeyId: string, memberId: number): Promise<void> => {
    await http.post(`${JOURNEY_URL}/${journeyId}/members/${memberId}/nudge`);
  },

  // --- NHÓM API INVITATION ---
  inviteFriend: async (journeyId: string, friendId: number): Promise<void> => {
    await http.post(`${INVITATION_URL}/invite`, { journeyId, friendId });
  },

  acceptInvitation: async (invitationId: number): Promise<void> => {
    await http.post(`${INVITATION_URL}/${invitationId}/accept`);
  },

  rejectInvitation: async (invitationId: number): Promise<void> => {
    await http.post(`${INVITATION_URL}/${invitationId}/reject`);
  },

  getMyPendingInvitations: async (): Promise<JourneyInvitationResponse[]> => {
    const response = await http.get<{ data: { content: JourneyInvitationResponse[] } }>(`${INVITATION_URL}/pending`);
    return response.data.data.content;
  },

  getPendingRequests: async (journeyId: string): Promise<JourneyRequestResponse[]> => {
    const response = await http.get<{ data: JourneyRequestResponse[] }>(`${JOURNEY_URL}/${journeyId}/requests/pending`);
    return response.data.data;
  },

  // --- API LẤY FEED RECAP ---
  getRecapFeed: async (journeyId: string): Promise<PageResponse<Checkin>> => {
    // Lưu ý: Đảm bảo backend có endpoint này, hoặc dùng API lấy checkin theo hành trình
    const response = await http.get<{ data: PageResponse<Checkin> }>(`${JOURNEY_URL}/${journeyId}/recap`); 
    return response.data.data;
  },
};