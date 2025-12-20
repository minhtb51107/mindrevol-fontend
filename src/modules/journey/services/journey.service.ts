// src/modules/journey/services/journey.service.ts
import { http } from "@/lib/http";
import { 
  CreateJourneyRequest, 
  JourneyResponse, 
  JoinJourneyRequest,
  UpdateJourneySettingsRequest,
  JourneyWidgetResponse,
  JourneyParticipantResponse,
  JourneyInvitationResponse
} from "../types";

// Base URL
const JOURNEY_URL = "/journeys"; 
const INVITATION_URL = "/journey-invitations";

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

  // [NEW] Lấy danh sách mẫu (Templates)
  getDiscoveryTemplates: async (): Promise<JourneyResponse[]> => {
    // Nếu backend chưa có API này thì tạm thời trả về mảng rỗng hoặc mock data
    // const response = await http.get<{ data: JourneyResponse[] }>(`${JOURNEY_URL}/discovery`);
    // return response.data.data;
    return []; // Tạm thời trả về rỗng để không lỗi
  },

  // [NEW] Sao chép hành trình (Fork)
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
};