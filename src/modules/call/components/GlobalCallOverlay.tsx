import React, { useEffect, useRef } from 'react';
import { useCallStore } from '../store/useCallStore';
import { socket } from '@/lib/socket';
import { http } from '@/lib/http';
import { Phone, Video, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const GlobalCallOverlay = () => {
    const { incomingCall, outgoingCall, setIncomingCall, setOutgoingCall, setActiveRoom, clearCall } = useCallStore();

    const incomingAudio = useRef(new Audio('/sounds/ringtone.mp3'));
    const outgoingAudio = useRef(new Audio('/sounds/dialing.mp3'));

    useEffect(() => {
        incomingAudio.current.loop = true;
        outgoingAudio.current.loop = true;
        return () => {
            incomingAudio.current.pause();
            outgoingAudio.current.pause();
        };
    }, []);

    useEffect(() => {
        if (incomingCall) incomingAudio.current.play().catch(() => {});
        else { incomingAudio.current.pause(); incomingAudio.current.currentTime = 0; }

        if (outgoingCall) outgoingAudio.current.play().catch(() => {});
        else { outgoingAudio.current.pause(); outgoingAudio.current.currentTime = 0; }
    }, [incomingCall, outgoingCall]);

    // LẮNG NGHE TÍN HIỆU SOCKET
    useEffect(() => {
        const sub = socket.subscribe('/user/queue/notifications', (noti: any) => {
            if (noti.type === 'INCOMING_CALL') {
                const args = noti.messageArgs.split('|');
                setIncomingCall({
                    roomId: noti.referenceId,
                    callerId: args[0], callerName: args[1], callType: args[2], callerAvatar: args[3]
                });
            } 
            else if (noti.type === 'CALL_ACCEPTED' || noti.type === 'BOX_CALL_ACCEPTED') {
    const roomId = noti.referenceId;
    setOutgoingCall(null); // Tắt màn hình chờ
    setActiveRoom(roomId); // Mở PiPCallWindow
}
            else if (noti.type === 'CALL_REJECTED') {
                toast.error("Đối phương đã từ chối cuộc gọi.");
                clearCall();
            }
            else if (noti.type === 'CALL_ENDED' || noti.type === 'MISSED_CALL' || noti.type === 'BOX_CALL_ENDED') {
                clearCall();
            }
            // 🔥 LOGIC MỚI ĐÃ FIX: Kích hoạt giao diện đổ chuông cho gọi nhóm
            else if (noti.type === 'BOX_CALL_STARTED') {
                const args = noti.messageArgs.split('|');
                // Fix lỗi lấy sai tên (args[1] mới là tên, args[2] là VIDEO/VOICE)
                setIncomingCall({
                    roomId: noti.referenceId,
                    callerId: args[0], 
                    callerName: args[1] + " (Gọi Nhóm)", // Thêm note để nhận biết
                    callType: args[2], 
                    callerAvatar: args[3],
                    isGroup: true // 🔥 Cờ quan trọng để bypass API respond bên dưới
                });
            }
        });
        return () => {
            if (sub && typeof sub.unsubscribe === 'function') sub.unsubscribe();
        };
    }, [outgoingCall, incomingCall, setActiveRoom, clearCall, setIncomingCall, setOutgoingCall]);

    // 🔥 XỬ LÝ KHI BẤM NGHE MÁY
    const handleAccept = async () => {
        if (!incomingCall) return;
        
        // Nếu là gọi nhóm thì vào thẳng phòng Zego, không cần gọi API Accept của 1-1
        if (incomingCall.isGroup) {
            const roomId = incomingCall.roomId;
            setIncomingCall(null);
            setActiveRoom(roomId);
            return;
        }

        // Gọi 1-1 bình thường
        try {
            await http.post(`/calls/signaling/respond/${incomingCall.roomId}?action=ACCEPT`);
            const roomId = incomingCall.roomId;
            setIncomingCall(null);
            setActiveRoom(roomId);
        } catch (error) {
            toast.error("Không thể kết nối.");
            clearCall();
        }
    };

    // 🔥 XỬ LÝ KHI BẤM TỪ CHỐI
    const handleReject = async () => {
        if (!incomingCall) return;

        // Nếu là gọi nhóm, từ chối chỉ cần tắt chuông/ẩn màn hình
        if (incomingCall.isGroup) {
            clearCall();
            return;
        }

        try { await http.post(`/calls/signaling/respond/${incomingCall.roomId}?action=REJECT`); } catch (e) {}
        clearCall();
    };

    const handleCancelOutgoing = async () => {
        if (!outgoingCall) return;
        try { await http.post(`/calls/signaling/end/${outgoingCall.roomId}`); } catch (e) {}
        clearCall();
    };
    // RENDER: CÓ NGƯỜI GỌI ĐẾN (1-1)
    if (incomingCall) {
        const bgAvatar = incomingCall.callerAvatar || `https://ui-avatars.com/api/?name=${incomingCall.callerName}`;
        return (
            <div className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden bg-black animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 scale-110 blur-3xl pointer-events-none" style={{ backgroundImage: `url('${bgAvatar}')` }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center pt-24">
                    <p className="text-white/70 text-lg font-medium mb-4 tracking-wide uppercase">{incomingCall.callType === 'video' ? 'Cuộc gọi Video tới' : 'Cuộc gọi Thoại tới'}</p>
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping scale-150"></div>
                        <img src={bgAvatar} className="w-32 h-32 rounded-full object-cover shadow-2xl relative z-10 border-2 border-white/20" alt="Avatar" />
                    </div>
                    <h2 className="text-white text-4xl font-bold tracking-tight drop-shadow-lg">{incomingCall.callerName}</h2>
                    <p className="text-white/60 mt-2 font-medium">MindRevol</p>
                </div>
                <div className="relative z-10 flex justify-around items-end pb-20 px-8 w-full max-w-md mx-auto">
                    <div className="flex flex-col items-center gap-3">
                        <button onClick={handleReject} className="w-16 h-16 rounded-full bg-[#FF3B30] flex items-center justify-center hover:bg-[#FF3B30]/80 transition-all hover:scale-105 shadow-[0_8px_30px_rgba(255,59,48,0.4)]"><X className="w-8 h-8 text-white" strokeWidth={2.5} /></button>
                        <span className="text-white/80 font-medium text-sm tracking-wide">Từ chối</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <button onClick={handleAccept} className="w-16 h-16 rounded-full bg-[#34C759] flex items-center justify-center hover:bg-[#34C759]/80 transition-all hover:scale-105 shadow-[0_8px_30px_rgba(52,199,89,0.4)] animate-bounce">
                            {incomingCall.callType === 'video' ? <Video className="w-7 h-7 text-white" fill="currentColor" /> : <Phone className="w-7 h-7 text-white" fill="currentColor" />}
                        </button>
                        <span className="text-white/80 font-medium text-sm tracking-wide">Nghe máy</span>
                    </div>
                </div>
            </div>
        );
    }

    // RENDER: ĐANG GỌI ĐI (1-1)
    if (outgoingCall) {
        const bgAvatar = outgoingCall.avatar || `https://ui-avatars.com/api/?name=${outgoingCall.name}`;
        return (
            <div className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden bg-black animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-cover bg-center opacity-30 scale-110 blur-3xl pointer-events-none" style={{ backgroundImage: `url('${bgAvatar}')` }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90 pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center pt-24">
                    <img src={bgAvatar} className="w-32 h-32 rounded-full object-cover mb-6 border-2 border-white/10 shadow-2xl" alt="Avatar" />
                    <h2 className="text-white text-4xl font-bold tracking-tight drop-shadow-lg">{outgoingCall.name}</h2>
                    <p className="text-white/60 mt-3 font-medium flex items-center gap-2">Đang đổ chuông...</p>
                </div>
                <div className="relative z-10 flex justify-center pb-20 w-full">
                    <div className="flex flex-col items-center gap-3">
                        <button onClick={handleCancelOutgoing} className="w-16 h-16 rounded-full bg-[#FF3B30] flex items-center justify-center hover:bg-[#FF3B30]/80 transition-all hover:scale-105 shadow-[0_8px_30px_rgba(255,59,48,0.4)]"><Phone className="w-8 h-8 text-white rotate-[135deg]" fill="currentColor" /></button>
                        <span className="text-white/80 font-medium text-sm tracking-wide">Hủy</span>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};