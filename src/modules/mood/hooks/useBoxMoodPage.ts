import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { useBoxMoods } from './useBoxMoods';

export const useBoxMoodPage = (boxId: string) => {
    const { user } = useAuth();
    const boxMoodsData = useBoxMoods(boxId, user?.id);
    const { moods, boxMembers, myMood, handleReplyToMood } = boxMoodsData;
    
    const [viewingUserId, setViewingUserId] = useState<string | undefined>(user?.id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [replyMessage, setReplyMessage] = useState("");

    // Tự động set ID của mình khi load xong user
    useEffect(() => {
        if (!viewingUserId && user?.id) {
            setViewingUserId(user.id);
        }
    }, [user?.id, viewingUserId]);

    const viewingMood = viewingUserId === user?.id ? myMood : moods.find(m => m.userId === viewingUserId);
    const isViewingMe = viewingUserId === user?.id;

    const viewingUser = useMemo(() => {
        return isViewingMe 
            ? { fullname: user?.fullname || "Bạn", avatarUrl: user?.avatarUrl } 
            : boxMembers.find(m => m.userId === viewingUserId) || { fullname: "Bạn bè", avatarUrl: "" };
    }, [isViewingMe, user, boxMembers, viewingUserId]);

    const handleReply = async () => {
        if (!viewingUserId || !viewingMood) return;
        await handleReplyToMood(viewingUserId, replyMessage, viewingMood.icon);
        setReplyMessage("");
    };

    const sortedMembers = useMemo(() => {
        return [...boxMembers.filter(m => m.userId !== user?.id)].sort((a, b) => {
            const moodA = moods.find(m => m.userId === a.userId);
            const moodB = moods.find(m => m.userId === b.userId);
            if (moodA && !moodB) return -1;
            if (!moodA && moodB) return 1;
            if (moodA && moodB) {
                return new Date(moodB.createdAt || 0).getTime() - new Date(moodA.createdAt || 0).getTime();
            }
            return 0;
        });
    }, [boxMembers, user?.id, moods]);

    return {
        user,
        ...boxMoodsData, // Kế thừa các hàm từ useBoxMoods
        viewingUserId, setViewingUserId,
        isModalOpen, setIsModalOpen,
        replyMessage, setReplyMessage,
        viewingMood, isViewingMe, viewingUser,
        handleReply, sortedMembers
    };
};