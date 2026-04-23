import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { friendService, FriendshipResponse, UserSummary } from '../services/friend.service';

export const useFriendsModal = (isOpen: boolean, onClose: () => void, userId?: string) => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const isMe = !userId || userId === currentUser?.id;
    const [activeTab, setActiveTab] = useState<'FIND' | 'REQUESTS' | 'FRIENDS'>('FRIENDS');

    const [friends, setFriends] = useState<FriendshipResponse[]>([]);
    const [requests, setRequests] = useState<FriendshipResponse[]>([]);
    const [searchResults, setSearchResults] = useState<UserSummary[]>([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // ==========================================
    // GESTURE: KÉO ĐỂ ĐÓNG (DRAG TO DISMISS)
    // ==========================================
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);

    const onDragStart = (clientY: number) => {
        dragStartY.current = clientY;
        setIsDragging(true);
    };

    const onDragMove = (clientY: number) => {
        if (!isDragging) return;
        const delta = clientY - dragStartY.current;
        if (delta > 0) setDragY(delta);
    };

    const onDragEnd = () => {
        setIsDragging(false);
        if (dragY > 150) { 
            onClose();
            setTimeout(() => setDragY(0), 300);
        } else {
            setDragY(0); 
        }
    };

    // ==========================================
    // DATA FETCHING & LOGIC
    // ==========================================
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'FRIENDS') {
                let data = isMe ? await friendService.getMyFriends() : await friendService.getUserFriends(userId!);
                setFriends(data || []);
            } else if (activeTab === 'REQUESTS' && isMe) {
                const data = await friendService.getIncomingRequests();
                setRequests(data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, isMe, userId]);

    useEffect(() => {
        if (isOpen) {
            if (!isMe) setActiveTab('FRIENDS'); 
            fetchData();
            document.body.style.overflow = 'hidden';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen, activeTab, isMe, fetchData]);

    const handleSearch = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await friendService.searchUsers(searchQuery);
            setSearchResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    // Xử lý Search với Debounce
    useEffect(() => {
        if (activeTab === 'FIND' && searchQuery.trim().length > 1) {
            const timer = setTimeout(() => handleSearch(), 500);
            return () => clearTimeout(timer);
        }
    }, [searchQuery, activeTab, handleSearch]);

    const handleSendRequest = async (targetId: string) => {
        try {
            await friendService.sendFriendRequest(targetId);
            setSearchResults(prev => prev.map(u => u.id === targetId ? { ...u, friendshipStatus: 'PENDING' } : u));
        } catch (error) {
            alert("Lỗi khi gửi lời mời.");
        }
    };

    const handleAccept = async (friendshipId: string) => {
        try {
            await friendService.acceptRequest(friendshipId);
            setRequests(prev => prev.filter(r => r.id !== friendshipId));
            fetchData(); 
        } catch (error) {
            alert("Lỗi xử lý");
        }
    };

    const handleDecline = async (friendshipId: string) => {
        try {
            await friendService.declineRequest(friendshipId);
            setRequests(prev => prev.filter(r => r.id !== friendshipId));
        } catch (error) {
            console.error(error);
        }
    };

    const handleNavigateToProfile = (friendId: string) => {
        onClose(); 
        navigate(`/profile/${friendId}`); 
    };

    return {
        isMe, navigate,
        activeTab, setActiveTab,
        friends, requests, searchResults,
        isLoading, searchQuery, setSearchQuery,
        dragY, isDragging, onDragStart, onDragMove, onDragEnd,
        handleSendRequest, handleAccept, handleDecline, handleNavigateToProfile
    };
};