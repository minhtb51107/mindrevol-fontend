import { create } from 'zustand';
import { http } from '@/lib/http';
import toast from 'react-hot-toast';

interface CallState {
    activeRoomId: string | null;
    incomingCall: any | null;
    outgoingCall: any | null;
    
    setActiveRoom: (roomId: string | null) => void;
    setIncomingCall: (call: any | null) => void;
    setOutgoingCall: (call: any | null) => void;
    clearCall: () => void;

    startCall: (receiverId: string, receiverName: string, receiverAvatar: string, type: 'voice' | 'video', conversationId: string) => Promise<void>;
    startBoxCall: (boxId: string, type: 'voice' | 'video', conversationId: string) => Promise<void>;
}

export const useCallStore = create<CallState>((set) => ({
    activeRoomId: null,
    incomingCall: null,
    outgoingCall: null,

    setActiveRoom: (roomId) => set({ activeRoomId: roomId }),
    setIncomingCall: (call) => set({ incomingCall: call }),
    setOutgoingCall: (call) => set({ outgoingCall: call }),
    
    clearCall: () => set({
        activeRoomId: null,
        incomingCall: null,
        outgoingCall: null
    }),

    startCall: async (receiverId, receiverName, receiverAvatar, type, conversationId) => {
        try {
            const res = await http.post(`/calls/signaling/initiate?receiverId=${receiverId}&type=${type}&conversationId=${conversationId}`);
            set({ 
                outgoingCall: {
                    roomId: res.data.roomId,
                    receiverId,
                    name: receiverName,
                    avatar: receiverAvatar,
                    callType: type
                }
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể thực hiện cuộc gọi");
        }
    },

    // 🔥 ĐÃ SỬA: Hiện màn hình "Đang gọi đi..." thay vì vào thẳng phòng
    startBoxCall: async (boxId, type, conversationId) => {
        try {
            const res = await http.post(`/calls/signaling/initiate-box?boxId=${boxId}&type=${type}&conversationId=${conversationId}`);
            const session = res.data?.data || res.data;
            
            if (session && session.roomId) {
                // Set outgoingCall để Component GlobalCallOverlay hiện giao diện chờ
                set({ 
                    outgoingCall: {
                        roomId: session.roomId,
                        receiverId: boxId,
                        name: "Nhóm Chat",
                        avatar: "https://ui-avatars.com/api/?name=Group",
                        callType: type,
                        isGroup: true
                    }
                });
            } else {
                toast.error("Không bóc tách được ID Phòng từ Backend!");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi tham gia gọi nhóm");
        }
    }
}));