import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Phone, Maximize2, Minimize2 } from 'lucide-react';
import { useCustomWebRTC } from '../hooks/useCustomWebRTC';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { useCallStore } from '../store/useCallStore';

// COMPONENT CON: Khung Video của từng người
const RemoteVideoTile = ({ stream, isMinimized }: { stream: MediaStream, isMinimized: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.log("Lỗi autoplay nhóm", e));
        }
    }, [stream]);

    return (
        <div className="relative w-full h-full bg-zinc-900 overflow-hidden flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        </div>
    );
};

export const PiPCallWindow = () => {
    const { activeRoomId, outgoingCall, incomingCall, clearCall } = useCallStore();
    const { user } = useAuth();
    const [isMinimized, setIsMinimized] = useState(false);

    const callType = outgoingCall?.callType || incomingCall?.callType || 'video';

    const { 
        localStream, remoteStreams, isMicMuted, isCamMuted, 
        toggleMic, toggleCam, hangUp, callStatus 
    } = useCustomWebRTC(activeRoomId || "", user, callType === 'video');

    // 🔥 SỬA LỖI MẤT CAMERA: Dùng useCallback ref thay vì useRef để React tự động gán stream mỗi khi thẻ <video> bị render lại
    const assignLocalStream = useCallback((node: HTMLVideoElement | null) => {
        if (node && localStream) {
            node.srcObject = localStream;
            node.play().catch(e => console.log("Lỗi autoplay", e));
        }
    }, [localStream]);

    if (!activeRoomId) return null;

    const handleEndCall = async () => {
        await hangUp();
        clearCall();
    };

    // TÍNH TOÁN GRID LƯỚI CHO NHIỀU CAMERA
    const totalUsers = remoteStreams.length;
    let gridClass = "grid-cols-1";
    if (totalUsers === 1) gridClass = "grid-cols-1 md:grid-cols-2"; // Mình và 1 người
    if (totalUsers >= 2 && totalUsers <= 3) gridClass = "grid-cols-2";
    if (totalUsers > 3) gridClass = "grid-cols-2 md:grid-cols-3";

    return (
        <div className={`fixed z-[100000] transition-all duration-300 ease-in-out shadow-2xl overflow-hidden border border-white/10 bg-black
            ${isMinimized 
                ? 'bottom-6 right-6 w-48 h-72 rounded-2xl' 
                : 'inset-0 w-full h-full'        
            }`}
        >
            {/* LƯỚI CAMERA CỦA NHÓM */}
            <div className={`w-full h-full grid ${isMinimized ? 'grid-cols-1' : gridClass} gap-1 p-1 pb-20`}>
                
                {/* HIỂN THỊ TRẠNG THÁI NẾU PHÒNG CHƯA CÓ AI KHÁC MÌNH */}
                {remoteStreams.length === 0 && (
                    <div className="w-full h-full col-span-full flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-zinc-800 animate-pulse mb-4 flex items-center justify-center">
                            <VideoIcon className="text-zinc-500 w-8 h-8 opacity-50" />
                        </div>
                        {!isMinimized && (
                            <span className={`font-medium tracking-wide ${callStatus.includes('❌') ? 'text-red-400' : 'text-white/80 animate-pulse'}`}>
                                {callStatus || "Đang đợi mọi người tham gia..."}
                            </span>
                        )}
                    </div>
                )}

                {/* MAP CÁC CAMERA KHÁC VÀO LƯỚI */}
                {remoteStreams.map((remote) => (
                    <RemoteVideoTile key={remote.id} stream={remote.stream} isMinimized={isMinimized} />
                ))}

                {/* Đưa luôn Camera của mình vào Grid nếu có nhiều người (Chỉ chạy ở màn hình To) */}
                {remoteStreams.length > 0 && !isMinimized && (
                    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center border border-white/10">
                        {/* 🔥 Gắn ref mới vào đây */}
                        <video ref={assignLocalStream} autoPlay playsInline muted className={`w-full h-full object-cover transform scale-x-[-1] ${isCamMuted ? 'hidden' : 'block'}`} />
                        {isCamMuted && <VideoOff size={32} className="text-zinc-600" />}
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur">Bạn</div>
                    </div>
                )}
            </div>

            {/* CAMERA CỦA MÌNH (Dạng trôi nổi - PiP) NẾU ĐANG THU NHỎ HOẶC ĐANG GỌI 1-1 */}
            {(isMinimized || remoteStreams.length === 0) && (
                <div className={`absolute bg-black rounded-xl overflow-hidden shadow-lg border border-white/20 transition-all duration-300
                    ${isMinimized ? 'top-2 right-2 w-12 h-16' : 'top-6 right-6 w-28 h-40'}`}>
                    {/* 🔥 Gắn ref mới vào đây */}
                    <video ref={assignLocalStream} autoPlay playsInline muted className={`w-full h-full object-cover transform scale-x-[-1] ${isCamMuted ? 'hidden' : 'block'}`} />
                    {isCamMuted && (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                            <VideoOff size={isMinimized ? 14 : 24} className="text-zinc-500" />
                        </div>
                    )}
                </div>
            )}

            {/* THANH ĐIỀU KHIỂN CHÍNH (Mic, Cam, Tắt) */}
            <div className={`absolute bottom-0 left-0 w-full p-4 flex items-center justify-center gap-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity 
                ${isMinimized ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                
                <button onClick={() => setIsMinimized(!isMinimized)} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-sm border border-white/10">
                    {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
                </button>
                <button onClick={toggleCam} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-sm border border-white/10">
                    {isCamMuted ? <VideoOff size={20} className="text-red-400"/> : <VideoIcon size={20} />}
                </button>
                <button onClick={toggleMic} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-sm border border-white/10">
                    {isMicMuted ? <MicOff size={20} className="text-red-400"/> : <Mic size={20} />}
                </button>
                <button onClick={handleEndCall} className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#FF3B30] flex items-center justify-center text-white hover:bg-[#FF3B30]/80 hover:scale-105 shadow-[0_8px_30px_rgba(255,59,48,0.4)] transition-all ml-2">
                    <Phone size={24} className="rotate-[135deg]" fill="currentColor" />
                </button>
            </div>
        </div>
    );
};