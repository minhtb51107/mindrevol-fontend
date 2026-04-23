import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { boxService } from '../services/box.service';
import { friendService } from '@/modules/user/services/friend.service';
import { BoxMemberResponse } from '../types';

interface UseBoxMembersProps {
    boxId: string;
    isOpen: boolean;
    onClose: () => void;
    onMemberChange: () => void;
}

export const useBoxMembers = ({ boxId, isOpen, onClose, onMemberChange }: UseBoxMembersProps) => {
    const [members, setMembers] = useState<BoxMemberResponse[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [membersData, friendsResponse] = await Promise.all([
                boxService.getBoxMembers(boxId, 0, 50),
                friendService.getMyFriends()
            ]);
            setMembers(membersData.content || []);
            const extractedFriends = (friendsResponse || []).map((item: any) => item.friend);
            setFriends(extractedFriends);
        } catch (error) {
            console.error("Lỗi tải dữ liệu", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && boxId) {
            fetchData();
        }
    }, [isOpen, boxId]);

    const invitableFriends = useMemo(() => {
        return friends.filter(friend => !members.some(m => m.userId === friend.id));
    }, [friends, members]);

    const filteredFriends = useMemo(() => {
        if (!searchQuery.trim()) return invitableFriends;
        return invitableFriends.filter(f => 
            f.fullname.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (f.handle && f.handle.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [invitableFriends, searchQuery]);

    const handleInvite = async (friendId: string) => {
        try {
            setInvitedIds(prev => new Set(prev).add(friendId));
            await boxService.inviteMember(boxId, friendId); 
            toast.success("Đã gửi lời mời!");
        } catch (err: any) {
            setInvitedIds(prev => {
                const next = new Set(prev);
                next.delete(friendId);
                return next;
            });
            toast.error(err?.response?.data?.message || "Lỗi khi gửi lời mời.");
        }
    };

    const handleRemoveMember = async (userIdToRemove: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa thành viên này khỏi Box không?")) return;
        try {
            await boxService.removeMember(boxId, userIdToRemove);
            await fetchData();
            onMemberChange();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Lỗi khi xóa thành viên.");
        }
    };

    const handleTransferOwnership = async (newOwnerId: string, newOwnerName: string) => {
        if (!window.confirm(`Chuyển quyền chủ Box cho ${newOwnerName}? Bạn sẽ trở thành thành viên bình thường.`)) return;
        try {
            await boxService.transferOwnership(boxId, newOwnerId);
            toast.success(`Đã chuyển quyền cho ${newOwnerName}`);
            onClose(); 
            onMemberChange(); 
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Lỗi khi chuyển quyền.");
        }
    };

    return {
        members, isLoading, searchQuery, setSearchQuery, 
        filteredFriends, invitedIds,
        handleInvite, handleRemoveMember, handleTransferOwnership
    };
};