import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { blockService } from '../services/block.service';
import { UserSummary } from '../services/user.service';

export const useBlockedUsers = () => {
    const [blockedUsers, setBlockedUsers] = useState<UserSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlockList();
    }, []);

    const loadBlockList = async () => {
        try {
            setLoading(true);
            const data = await blockService.getBlockList();
            setBlockedUsers(data);
        } catch (error) {
            console.error("Failed to load blocked users list:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnblock = async (userId: string) => {
        if (window.confirm("Bạn có chắc chắn muốn bỏ chặn người dùng này không?")) {
            try {
                await blockService.unblockUser(userId);
                setBlockedUsers(prev => prev.filter(user => user.id !== userId));
                toast.success("Bỏ chặn thành công.");
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi bỏ chặn.");
            }
        }
    };

    return { blockedUsers, loading, handleUnblock };
};