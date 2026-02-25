import { http } from "@/lib/http";
import { 
    BoxPageResponse, 
    BoxResponse, 
    CreateBoxRequest, 
    UpdateBoxRequest, 
    BoxMemberPageResponse 
} from '../types';

export const boxService = {
    getMyBoxes: async (page = 0, size = 20): Promise<BoxPageResponse> => {
        const response = await http.get(`/boxes/me?page=${page}&size=${size}`);
        return response.data.data;
    },

    getBoxDetails: async (boxId: string): Promise<BoxResponse> => {
        const response = await http.get(`/boxes/${boxId}`);
        return response.data.data;
    },

    createBox: async (data: CreateBoxRequest): Promise<BoxResponse> => {
        const response = await http.post('/boxes', data);
        return response.data.data;
    },

    updateBox: async (boxId: string, data: UpdateBoxRequest): Promise<BoxResponse> => {
        const response = await http.put(`/boxes/${boxId}`, data);
        return response.data.data;
    },

    archiveBox: async (boxId: string): Promise<string> => {
        const response = await http.put(`/boxes/${boxId}/archive`);
        return response.data.message;
    },

    disbandBox: async (boxId: string): Promise<string> => {
        const response = await http.delete(`/boxes/${boxId}`);
        return response.data.message;
    },

    transferOwnership: async (boxId: string, newOwnerId: string): Promise<string> => {
        const response = await http.put(`/boxes/${boxId}/transfer-ownership/${newOwnerId}`);
        return response.data.message;
    },

    getBoxJourneys: async (boxId: string, page = 0, size = 20) => {
        const response = await http.get(`/boxes/${boxId}/journeys?page=${page}&size=${size}`);
        return response.data.data;
    },

    getBoxMembers: async (boxId: string, page = 0, size = 50): Promise<BoxMemberPageResponse> => {
        const response = await http.get(`/boxes/${boxId}/members?page=${page}&size=${size}`);
        return response.data.data;
    },

    inviteMember: async (boxId: string, targetUserId: string): Promise<string> => {
        const response = await http.post(`/boxes/${boxId}/invite`, null, {
            params: { targetUserId }
        });
        return response.data.message;
    },

    acceptInvite: async (boxId: string): Promise<string> => {
        const response = await http.post(`/boxes/${boxId}/accept-invite`);
        return response.data.message;
    },

    rejectInvite: async (boxId: string): Promise<string> => {
        const response = await http.post(`/boxes/${boxId}/reject-invite`);
        return response.data.message;
    },

    removeMember: async (boxId: string, targetUserId: string): Promise<string> => {
        const response = await http.delete(`/boxes/${boxId}/members/${targetUserId}`);
        return response.data.message;
    },

    // [THÊM MỚI] Dùng chung API removeMember nhưng truyền ID của chính mình
    leaveBox: async (boxId: string, myUserId: string): Promise<string> => {
        const response = await http.delete(`/boxes/${boxId}/members/${myUserId}`);
        return response.data.message;
    }
};