import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { boxService } from '../services/box.service';
import { BoxResponse, BoxInvitationResponse, BoxTab } from '../types';

export const useBoxList = () => {
    const [boxes, setBoxes] = useState<BoxResponse[]>([]);
    const [invitations, setInvitations] = useState<BoxInvitationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [activeTab, setActiveTab] = useState<BoxTab>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'invitations') {
                const invitesData = await boxService.getMyPendingInvitations(debouncedSearch);
                setInvitations(invitesData || []);
                setBoxes([]);
            } else {
                const boxData = await boxService.getMyBoxes(activeTab, debouncedSearch, 0, 50);
                setBoxes(boxData.content || []);
                setInvitations([]);
            }
        } catch (error) {
            console.error("Error loading Box data:", error);
            toast.error("Không thể tải danh sách Box");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, debouncedSearch]);

    const handleAcceptInvite = async (invitationId: number) => {
        try {
            await boxService.acceptInvite(invitationId); 
            toast.success("Đã tham gia Box thành công! ✨");
            fetchData(); 
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi khi tham gia Box");
        }
    };

    const handleRejectInvite = async (invitationId: number) => {
        try {
            await boxService.rejectInvite(invitationId);
            toast.success("Đã từ chối lời mời");
            fetchData(); 
        } catch (error: any) {
            toast.error("Lỗi khi từ chối lời mời");
        }
    };

    return {
        boxes,
        invitations,
        loading,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isCreateModalOpen,
        setIsCreateModalOpen,
        handleAcceptInvite,
        handleRejectInvite,
        fetchData
    };
};