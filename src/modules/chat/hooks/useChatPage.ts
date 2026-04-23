import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useChatStore } from '../store/useChatStore';
import { chatService } from '../services/chat.service';
import { useGlobalChatSocket } from '../hooks/useGlobalChatSocket';
import { useChatSocket } from '../hooks/useChatSocket';

export const useChatPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { conversations, activeConversationId, setConversations, fetchConversations, openChat, closeChat } = useChatStore();

    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showMobileList, setShowMobileList] = useState(true);

    useGlobalChatSocket();
    useChatSocket(activeConversationId);

    // Tự động reset trạng thái khi rời khỏi trang Chat (Unmount)
    useEffect(() => {
        return () => {
            closeChat();
        };
    }, [closeChat]);

    // Lấy dữ liệu hội thoại lần đầu
    useEffect(() => {
        const initData = async () => {
            setIsLoading(true);
            try {
                if (fetchConversations) await fetchConversations();
                else setConversations(await chatService.getConversations() as any);
            } catch (e) {
                console.error("Lỗi tải danh sách chat:", e);
            } finally {
                setIsLoading(false);
            }
        };
        initData();
    }, [setConversations, fetchConversations]);

    // Xử lý ẩn hiện danh sách trên Mobile khi chọn Chat
    useEffect(() => {
        if (activeConversationId) setShowMobileList(false);
    }, [activeConversationId]);

    // Xử lý mở tự động Chat Box nếu có boxId trên URL
    useEffect(() => {
        const initBoxChat = async () => {
            const boxIdFromUrl = searchParams.get('boxId');
            if (!isLoading && boxIdFromUrl) {
                let targetConv = conversations.find(c => c.boxId === boxIdFromUrl);
                if (!targetConv) {
                    try {
                        targetConv = await chatService.getBoxConversation(boxIdFromUrl);
                        if (targetConv) setConversations([targetConv, ...conversations]);
                    } catch (e) {
                        console.error("Không thể lấy dữ liệu Box Chat", e);
                    }
                }
                if (targetConv && targetConv.id !== activeConversationId) {
                    openChat(targetConv.id);
                    searchParams.delete('boxId');
                    setSearchParams(searchParams, { replace: true });
                }
            }
        };
        initBoxChat();
    }, [isLoading, searchParams, activeConversationId, openChat, conversations, setConversations]);

    const handleBackToList = () => setShowMobileList(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return {
        isLoading,
        isSidebarOpen,
        setIsSidebarOpen,
        showMobileList,
        activeConversationId,
        handleBackToList,
        toggleSidebar
    };
};