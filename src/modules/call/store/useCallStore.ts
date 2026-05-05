import { create } from 'zustand';

interface CallState {
    incomingCall: any | null;   // Dữ liệu khi có người gọi đến
    outgoingCall: any | null;   // Dữ liệu khi mình đang gọi đi (chờ bắt máy)
    activeRoomId: string | null;// Đang trong phòng gọi
    
    setIncomingCall: (data: any) => void;
    setOutgoingCall: (data: any) => void;
    setActiveRoom: (roomId: string | null) => void;
    clearCall: () => void;
}

export const useCallStore = create<CallState>((set) => ({
    incomingCall: null,
    outgoingCall: null,
    activeRoomId: null,

    setIncomingCall: (data) => set({ incomingCall: data }),
    setOutgoingCall: (data) => set({ outgoingCall: data }),
    setActiveRoom: (roomId) => set({ activeRoomId: roomId, incomingCall: null, outgoingCall: null }),
    clearCall: () => set({ incomingCall: null, outgoingCall: null, activeRoomId: null }),
}));