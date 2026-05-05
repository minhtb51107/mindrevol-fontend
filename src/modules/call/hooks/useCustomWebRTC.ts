import { useState, useRef, useEffect, useCallback } from 'react';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { http, DOMAIN } from '@/lib/http'; // Nhớ import DOMAIN từ http.ts
import toast from 'react-hot-toast';

export type CallStatus = 'INITIALIZING' | 'FETCHING_TOKEN' | 'CONNECTING_SERVER' | 'REQUESTING_MEDIA' | 'WAITING_REMOTE' | 'CONNECTED' | 'ERROR';

export const useCustomWebRTC = (roomId: string, user: any, isVideoCall: boolean) => {
    const zgRef = useRef<ZegoExpressEngine | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isCamMuted, setIsCamMuted] = useState(!isVideoCall);
    const [callStatus, setCallStatus] = useState<CallStatus>('INITIALIZING');

    const APP_ID = 2099025482; 
    const streamIdRef = useRef(`stream_${user?.id}_${Date.now()}`);

    useEffect(() => {
        let isMounted = true; 
        
        if (!roomId || !user || !user.id) return;

        // BẮT SỰ KIỆN REFRESH / ĐÓNG TAB ĐỂ BÁO VỀ BACKEND
        const handleUnload = () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                fetch(`${DOMAIN}/api/v1/calls/signaling/end/${roomId}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    keepalive: true // Cờ quan trọng giúp request chạy ngầm khi tab đóng
                }).catch(() => {});
            }
            if (zgRef.current) zgRef.current.logoutRoom(roomId);
        };
        window.addEventListener('beforeunload', handleUnload);

        const zg = new ZegoExpressEngine(APP_ID, `wss://webliveroom2099025482-api.coolzcloud.com/ws`);
        zgRef.current = zg;

        const initZego = async () => {
            try {
                setCallStatus('FETCHING_TOKEN');
                const res = await http.get(`/calls/token/${roomId}`);
                const payload = res.data;
                const token = payload?.data?.token || payload?.data || payload?.token || (typeof payload === 'string' ? payload : "");
                
                if (!token) throw new Error("Không lấy được Token");

                if (!isMounted) return;

                zg.on('roomStreamUpdate', async (roomID, updateType, streamList) => {
                    if (updateType === 'ADD' && streamList.length > 0) {
                        const remoteId = streamList[0].streamID;
                        const stream = await zg.startPlayingStream(remoteId);
                        if (isMounted) {
                            setRemoteStream(stream);
                            setCallStatus('CONNECTED');
                        }
                    } else if (updateType === 'DELETE') {
                        if (isMounted) {
                            setRemoteStream(null);
                            setCallStatus('WAITING_REMOTE');
                        }
                    }
                });

                setCallStatus('CONNECTING_SERVER');
                await zg.loginRoom(roomId, token, { userID: String(user.id), userName: user.fullname }, { userUpdate: true });

                if (!isMounted) {
                    zg.logoutRoom(roomId);
                    return;
                }

                setCallStatus('REQUESTING_MEDIA');
                const local = await zg.createStream({ camera: { video: !isCamMuted, audio: !isMicMuted } });
                
                if (!isMounted) {
                    zg.destroyStream(local);
                    return;
                }
                
                setLocalStream(local);
                zg.startPublishingStream(streamIdRef.current, local);
                setCallStatus('WAITING_REMOTE'); 
                
            } catch (error: any) {
                console.error("Zego WebRTC Init Error:", error);
                setCallStatus('ERROR');
                if (error.code === 1103010 || error.message?.includes('Permission denied')) {
                    toast.error("Vui lòng cấp quyền Micro/Camera!");
                }
            }
        };

        initZego();

        return () => {
            isMounted = false;
            window.removeEventListener('beforeunload', handleUnload);
            if (zgRef.current) {
                zgRef.current.stopPublishingStream(streamIdRef.current);
                if (localStream) zgRef.current.destroyStream(localStream);
                zgRef.current.logoutRoom(roomId);
            }
        };
    }, [roomId, user]);

    // ... (Phần toggleMic, toggleCam, hangUp giữ nguyên như cũ) ...
    const toggleMic = useCallback(() => {
        if (!zgRef.current || !localStream) return;
        const state = !isMicMuted;
        zgRef.current.mutePublishStreamAudio(localStream, state); 
        setIsMicMuted(state);
    }, [isMicMuted, localStream]);

    const toggleCam = useCallback(() => {
        if (!zgRef.current || !localStream) return;
        const state = !isCamMuted;
        zgRef.current.mutePublishStreamVideo(localStream, state);
        setIsCamMuted(state);
    }, [isCamMuted, localStream]);

    const hangUp = useCallback(async () => {
        try { await http.post(`/calls/signaling/end/${roomId}`); } catch (e) {}
        
        if (zgRef.current) {
            zgRef.current.stopPublishingStream(streamIdRef.current);
            if (localStream) zgRef.current.destroyStream(localStream);
            zgRef.current.logoutRoom(roomId);
        }
    }, [roomId, localStream]);

    return { localStream, remoteStream, isMicMuted, isCamMuted, callStatus, toggleMic, toggleCam, hangUp };
};