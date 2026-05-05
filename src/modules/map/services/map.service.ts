import { http } from "@/lib/http";
import { MapMarkerResponse } from "@/modules/checkin/types"; 

export const mapService = {
  getJourneyMarkers: async (journeyId: string): Promise<MapMarkerResponse[]> => {
    const response = await http.get<any>(`/checkins/map/journey/${journeyId}`);
    return response.data.data || response.data;
  },

  getBoxMarkers: async (boxId: string): Promise<MapMarkerResponse[]> => {
    try {
        const response = await http.get(`/checkins/map/box/${boxId}`);
        return response.data?.data || [];
    } catch (error) {
        console.error("Map API error:", error);
        return []; 
    }
  },

  getMyMarkers: async (): Promise<MapMarkerResponse[]> => {
    const response = await http.get<any>(`/checkins/map/me`);
    return response.data.data || response.data;
  },

  // --- THÊM MỚI: API lấy marker của bạn bè ---
  getUserMarkers: async (userId: string): Promise<MapMarkerResponse[]> => {
    const response = await http.get<any>(`/checkins/map/user/${userId}`);
    return response.data.data || response.data;
  }
};