import { useEffect, useState, useMemo, useRef } from 'react';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { useChatStore } from '../store/useChatStore';
import { friendService, FriendshipResponse } from '@/modules/user/services/friend.service';
import { chatService } from '../services/chat.service';

export type TabType = 'ALL' | 'UNREAD' | 'GROUP';

export const useConversationList = () => {
    const { user } = useAuth();
    const { conversations, activeConversationId, openChat, fetchConversations, togglePin, toggleMute, hideConversation } = useChatStore();

    const [friendships, setFriendships] = useState<FriendshipResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        friendService.getMyFriends({ page: 0, size: 100 })
            .then(setFriendships)
            .finally(() => setIsLoading(false));
    }, []);

    const displayList = useMemo(() => {
        let friendListItems = friendships.map(f => {
            const existingConv = conversations.find(c => !c.boxId && String(c.partner?.id) === String(f.friend.id));
            return {
                id: existingConv ? existingConv.id : `friend_${f.friend.id}`,
                isGroup: false,
                userId: f.friend.id,
                name: f.friend.fullname || 'Người dùng',
                avatar: f.friend.avatarUrl,
                isOnline: f.friend.isOnline,
                conversationId: existingConv?.id || null,
                lastMessage: existingConv?.lastMessageContent || "Bắt đầu trò chuyện",
                lastMessageAt: existingConv?.lastMessageAt,
                unreadCount: existingConv?.unreadCount || 0,
                isSelfSender: existingConv ? String(existingConv.lastSenderId) === String(user?.id) : false,
                isPinned: existingConv?.isPinned || false,
                isMuted: existingConv?.isMuted || false
            };
        });

        const boxConversations = conversations.filter(c => c.boxId && c.boxName).map(c => ({
            id: c.id,
            isGroup: true,
            boxId: c.boxId,
            name: c.boxName || 'Không gian',
            avatar: c.boxAvatar || null,
            isOnline: false,
            conversationId: c.id,
            lastMessage: c.lastMessageContent || "Chưa có tin nhắn",
            lastMessageAt: c.lastMessageAt,
            unreadCount: c.unreadCount || 0,
            isSelfSender: String(c.lastSenderId) === String(user?.id),
            isPinned: c.isPinned || false,
            isMuted: c.isMuted || false
        }));

        const friendIds = new Set(friendships.map(f => String(f.friend.id)));
        const otherConversations = conversations.filter(c => !c.boxId && c.partner && !friendIds.has(String(c.partner.id))).map(c => ({
            id: c.id,
            isGroup: false,
            userId: c.partner!.id,
            name: c.partner!.fullname || 'Người dùng',
            avatar: c.partner!.avatarUrl,
            isOnline: false,
            conversationId: c.id,
            lastMessage: c.lastMessageContent || "Chưa có tin nhắn",
            lastMessageAt: c.lastMessageAt,
            unreadCount: c.unreadCount || 0,
            isSelfSender: String(c.lastSenderId) === String(user?.id),
            isPinned: c.isPinned || false,
            isMuted: c.isMuted || false
        }));

        let merged = [...boxConversations, ...friendListItems, ...otherConversations].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return (b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0) - (a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0);
        });

        if (searchTerm.trim()) {
            merged = merged.filter(item => (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (activeTab === 'UNREAD') {
            merged = merged.filter(item => item.unreadCount > 0 && !item.isMuted);
        } else if (activeTab === 'GROUP') {
            merged = merged.filter(item => item.isGroup);
        }

        return merged;
    }, [friendships, conversations, searchTerm, activeTab, user?.id]);

    const handleItemClick = async (item: any) => {
        if (item.conversationId) {
            await openChat(item.conversationId);
        } else {
            try {
                const newConv = await chatService.getOrCreateConversation(item.userId);
                if (newConv?.id) {
                    await fetchConversations();
                    await openChat(newConv.id);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const toggleMenu = (id: string | null) => {
        setMenuOpenId(prev => prev === id ? null : id);
    };

    return {
        searchTerm, setSearchTerm, activeTab, setActiveTab,
        isLoading, displayList, activeConversationId,
        menuOpenId, menuRef, toggleMenu,
        handleItemClick, togglePin, toggleMute, hideConversation
    };
};