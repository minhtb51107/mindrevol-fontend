import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Phone, Maximize2, Minimize2, Loader2, AlertCircle } from 'lucide-react';
import { useCustomWebRTC } from '../hooks/useCustomWebRTC';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { useCallStore } from '../store/useCallStore';

export const PiPCallWindow = () => {
    const { activeRoomId, outgoingCall, incomingCall, clearCall } = useCallStore();
    const { user } = useAuth();

    const callType = outgoingCall?.callType || incomingCall?.callType || 'video';
    
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    
    const [isMinimized, setIsMinimized] = useState(false);

    const { 
        localStream, remoteStream, isMicMuted, isCamMuted, 
        callStatus, toggleMic, toggleCam, hangUp 
    } = useCustomWebRTC(
        activeRoomId || "", 
        user, 
        callType === 'video'
    );

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
            localVideoRef.current.play().catch(e => console.log("Bỏ qua lỗi autoplay", e));
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play().catch(e => console.log("Bỏ qua lỗi autoplay", e));
        }
    }, [remoteStream]);

    if (!activeRoomId) return null;

    const handleEndCall = async () => {
        await hangUp();
        clearCall();
    };

    const renderStatusMessage = () => {
        switch (callStatus) {
            case 'FETCHING_TOKEN': return "Đang lấy quyền kết nối...";
            case 'CONNECTING_SERVER': return "Đang kết nối đến máy chủ...";
            case 'REQUESTING_MEDIA': return "Vui lòng cho phép Camera/Mic ở trình duyệt...";
            case 'WAITING_REMOTE': return "Đang chờ đối phương thiết lập Camera/Mic...";
            case 'ERROR': return "Kết nối thất bại. Vui lòng thử lại!";
            default: return "Đang xử lý...";
        }
    };

    return (
        <div className={`fixed z-[100000] transition-all duration-300 ease-in-out shadow-2xl overflow-hidden border border-white/10
            ${isMinimized 
                ? 'bottom-6 right-6 w-48 h-72 rounded-2xl' 
                : 'inset-0 w-full h-full bg-black'        
            }`}
        >
            {/* VIDEO ĐỐI PHƯƠNG */}
            {remoteStream ? (
                <video 
                    ref={remoteVideoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover bg-zinc-900" 
                />
            ) : (
                <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center text-center p-4">
                    {callStatus === 'ERROR' ? (
                        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    ) : (
                        <Loader2 className="w-12 h-12 text-zinc-500 animate-spin mb-4" />
                    )}
                    {!isMinimized && (
                        <span className={`font-medium text-sm ${callStatus === 'ERROR' ? 'text-red-400' : 'text-zinc-300'}`}>
                            {renderStatusMessage()}
                        </span>
                    )}
                </div>
            )}

            {/* VIDEO CỦA MÌNH */}
            <div className={`absolute bg-black rounded-xl overflow-hidden shadow-lg border border-white/20 transition-all duration-300
                ${isMinimized ? 'top-2 right-2 w-12 h-16' : 'top-6 right-6 w-28 h-40'}`}>
                <video 
                    ref={localVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className={`w-full h-full object-cover transform scale-x-[-1] ${isCamMuted ? 'hidden' : 'block'}`} 
                />
                {isCamMuted && (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <VideoOff size={isMinimized ? 14 : 24} className="text-zinc-500" />
                    </div>
                )}
            </div>

            {/* THANH ĐIỀU KHIỂN */}
            <div className={`absolute bottom-0 left-0 w-full p-4 flex items-center justify-center gap-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity 
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