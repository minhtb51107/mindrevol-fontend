import { useState, useRef, useEffect, useCallback } from 'react';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { http } from '@/lib/http';
import toast from 'react-hot-toast';

export const useCustomWebRTC = (roomId: string, user: any, isVideoCall: boolean) => {
    const zgRef = useRef<ZegoExpressEngine | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<{ id: string, stream: MediaStream }[]>([]);
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isCamMuted, setIsCamMuted] = useState(!isVideoCall);
    const [callStatus, setCallStatus] = useState<string>("Đang kết nối...");

    const APP_ID = 2099025482; 
    const userId = String(user?.id);
    const userName = String(user?.fullname || "User");
    const streamIdRef = useRef(`stream_${userId}_${Date.now()}`);

    useEffect(() => {
        let isMounted = true; 
        if (!roomId || !userId || userId === 'undefined') return;

        const SERVER_URL = 'wss://webliveroom2099025482-api.coolzcloud.com/ws';
        const zg = new ZegoExpressEngine(APP_ID, SERVER_URL);
        
        zgRef.current = zg;

        const initZego = async () => {
            try {
                // 1. LẤY TOKEN
                const res = await http.get(`/calls/token/${roomId}`);
                let token = "";
                if (typeof res.data === 'string') {
                    token = res.data;
                } else if (typeof res.data?.message === 'string' && res.data.message.startsWith('04')) {
                    token = res.data.message; 
                } else if (typeof res.data?.data === 'string') {
                    token = res.data.data;
                }
                
                if (!token) {
                    if (isMounted) setCallStatus("❌ Không lấy được Token từ Backend!");
                    return;
                }

                // 🔥 LẮNG NGHE TRẠNG THÁI PHÒNG (QUAN TRỌNG NHẤT ĐỂ TÌM LỖI)
                zg.on('roomStateUpdate', (roomID, state, errorCode, extendedData) => {
                    console.log("📍 [Zego] Trạng thái phòng:", state, "Mã lỗi:", errorCode);
                    if (!isMounted) return;
                    
                    if (state === 'DISCONNECTED') {
                        setCallStatus(`❌ Bị ngắt kết nối! (Mã lỗi: ${errorCode})`);
                    } else if (state === 'CONNECTING') {
                        setCallStatus("⏳ Đang cố gắng kết nối lại...");
                    } else if (state === 'CONNECTED') {
                        setCallStatus(""); // Kết nối thành công, xóa status
                    }
                });

                // 🔥 LẮNG NGHE TRẠNG THÁI ĐẨY STREAM CỦA MÌNH LÊN
                zg.on('publisherStateUpdate', (result) => {
                    console.log("📍 [Zego] Trạng thái đẩy Stream:", result);
                    if (result.state === 'NO_PUBLISH' && isMounted) {
                        setCallStatus(`❌ Lỗi đẩy Video lên mạng! (Mã: ${result.errorCode})`);
                    }
                });

                // 🔥 LẮNG NGHE NGƯỜI VÀO RA PHÒNG
                zg.on('roomStreamUpdate', async (roomID, updateType, streamList) => {
                    console.log("📍 [Zego] Có biến động stream:", updateType, streamList);
                    if (updateType === 'ADD' && streamList.length > 0) {
                        for (const streamInfo of streamList) {
                            try {
                                const stream = await zg.startPlayingStream(streamInfo.streamID);
                                if (isMounted) {
                                    setRemoteStreams(prev => {
                                        if (prev.find(s => s.id === streamInfo.streamID)) return prev;
                                        return [...prev, { id: streamInfo.streamID, stream }];
                                    });
                                }
                            } catch (e: any) {
                                console.error("Lỗi kéo video người khác:", e);
                                if (isMounted) setCallStatus(`❌ Kéo video thất bại: ${e.code || e.message}`);
                            }
                        }
                    } else if (updateType === 'DELETE') {
                        for (const streamInfo of streamList) {
                            zg.stopPlayingStream(streamInfo.streamID);
                            if (isMounted) {
                                setRemoteStreams(prev => prev.filter(s => s.id !== streamInfo.streamID));
                            }
                        }
                    }
                });

                // 2. ĐĂNG NHẬP VÀO PHÒNG
                const loginResult = await zg.loginRoom(roomId, token, { userID: userId, userName: userName }, { userUpdate: true });
                console.log("📍 [Zego] Kết quả Login Room:", loginResult);
                
                if (!loginResult || !isMounted) {
                    zg.logoutRoom(roomId);
                    if (isMounted) setCallStatus("❌ Đăng nhập phòng Zego thất bại!");
                    return;
                }

                // 3. KHỞI TẠO CAMERA & MIC
                const local = await zg.createStream({
                    camera: { video: !isCamMuted, audio: !isMicMuted }
                });
                
                if (!isMounted) {
                    zg.destroyStream(local);
                    return;
                }
                
                setLocalStream(local);
                zg.startPublishingStream(streamIdRef.current, local);

                if (isMounted && remoteStreams.length === 0) setCallStatus("Đang chờ đối phương...");
                
            } catch (error: any) {
                console.error("🔥 Lỗi WebRTC bắt được:", error);
                if (isMounted) {
                    if (error?.name === 'NotAllowedError') setCallStatus("❌ Bị chặn Camera/Mic!");
                    else if (error?.name === 'NotFoundError') setCallStatus("❌ Không tìm thấy thiết bị thu!");
                    // 👉 IN RÕ MÃ LỖI VÀ TEXT LÊN MÀN HÌNH:
                    else setCallStatus(`❌ Lỗi Zego: Mã ${error?.code || ''} - ${error?.message || 'Không xác định'}`);
                }
            }
        };

        initZego();

        return () => {
            isMounted = false;
            if (zgRef.current) {
                if (localStream) zgRef.current.destroyStream(localStream);
                zgRef.current.stopPublishingStream(streamIdRef.current);
                zgRef.current.logoutRoom(roomId);
            }
        };
    }, [roomId, userId, userName]); 

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
            if (localStream) zgRef.current.destroyStream(localStream);
            zgRef.current.logoutRoom(roomId);
        }
    }, [roomId, localStream]);

    return { localStream, remoteStreams, isMicMuted, isCamMuted, toggleMic, toggleCam, hangUp, callStatus };
};