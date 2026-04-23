import { useMemo, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useChat } from './useChat';
import { useVoiceCall } from './useVoiceCall';

export const useChatWindow = () => {
    const { activeConversationId, conversations, forwardingMessage, setForwardingMessage } = useChatStore();
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

    // Xác định thông tin phòng chat hiện tại
    const activeConv = useMemo(() => {
        const existingConv = conversations.find(c => c.id === activeConversationId);
        if (existingConv) return existingConv;
        
        if (activeConversationId && activeConversationId.startsWith('friend_')) {
            const friendId = activeConversationId.split('_')[1];
            return { id: activeConversationId, partner: { id: friendId, fullname: 'Người dùng mới', avatarUrl: '' }, isVirtual: true } as any;
        }
        return null;
    }, [activeConversationId, conversations]);

    // Gọi các Hook con
    const chatData = useChat(activeConversationId, activeConv?.partner?.id);
    const callData = useVoiceCall(chatData.currentUserId || '', remoteAudioRef);

    // Logic xử lý khi nhận cuộc gọi
    const handleAcceptCall = async () => {
        if (!callData.incomingCall) return;
        const isReady = await callData.initWebRTC(callData.incomingCall.senderId); 
        if (isReady) { 
            callData.sendSignal({ type: 'call-accept', targetId: callData.incomingCall.senderId, senderId: chatData.currentUserId }); 
            callData.setIsInCall(true); 
        }
    };

    return {
        activeConv,
        forwardingMessage,
        setForwardingMessage,
        remoteAudioRef,
        chatData,
        callData,
        handleAcceptCall
    };
};