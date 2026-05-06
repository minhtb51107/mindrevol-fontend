import { useState, useEffect } from 'react';
import { journeyService } from '@/modules/journey/services/journey.service';
import { checkinService } from '@/modules/checkin/services/checkin.service';
import { Checkin, CheckinStatus } from '../types';
import { Emotion, InteractionType, PostProps } from '@/modules/feed/types';
import toast from 'react-hot-toast';

interface UseCheckinDetailProps {
    checkin: Checkin;
    onClose: () => void;
}

export const useCheckinDetail = ({ checkin, onClose }: UseCheckinDetailProps) => {
    const [showMoveMenu, setShowMoveMenu] = useState(false);
    const [activeJourneys, setActiveJourneys] = useState<any[]>([]);
    const [isMoving, setIsMoving] = useState(false);
    const [isLoadingJourneys, setIsLoadingJourneys] = useState(false);
    const [headerTarget, setHeaderTarget] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const handleOpenMoveMenu = async () => {
        if (!showMoveMenu && activeJourneys.length === 0) {
            setIsLoadingJourneys(true);
            try {
                const journeys = await journeyService.getUserActiveJourneys('me');
                setActiveJourneys(journeys);
            } catch (error) {
                toast.error("Không thể lấy danh sách hành trình");
            } finally {
                setIsLoadingJourneys(false);
            }
        }
        setShowMoveMenu(!showMoveMenu);
    };

    const handleMoveToJourney = async (journeyId: string) => {
        try {
            setIsMoving(true);
            await checkinService.updateCheckin(checkin.id, { journeyId: journeyId });
            toast.success('Đã chuyển bài đăng về hành trình!');
            setShowMoveMenu(false);
            onClose(); 
            window.location.reload(); 
        } catch (error) {
            toast.error('Có lỗi xảy ra khi chuyển bài');
        } finally {
            setIsMoving(false);
        }
    };

    const mapStatus = (status: string | CheckinStatus): PostProps['status'] => {
        const s = String(status || '').toUpperCase();
        if (s === 'COMEBACK' || s === CheckinStatus.COMEBACK) return 'comeback';
        if (s === 'FAILED' || s === CheckinStatus.FAILED) return 'failed';
        if (s === 'REST' || s === CheckinStatus.REST) return 'rest';
        return 'completed'; 
    };

    const mapEmotion = (emo?: string): Emotion => {
        if (!emo) return Emotion.NORMAL;
        const key = Object.keys(Emotion).find(k => k === emo.toUpperCase());
        return key ? (Emotion as any)[key] : Emotion.NORMAL;
    }

    const getUserInfo = (item: any) => {
        if (item.user) {
            const name = item.user.fullname || item.user.name || "Người dùng";
            return {
                id: item.user.id || item.userId,
                name: name,
                avatar: item.user.avatarUrl || item.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            };
        }
        const name = item.userFullName || "Người dùng";
        return {
            id: item.userId || 'unknown',
            name: name,
            avatar: item.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        };
    };

    const userInfo = getUserInfo(checkin);

    let safeTimestamp = 'Vừa xong';
    try {
        if (checkin.createdAt) {
            const d = Array.isArray(checkin.createdAt) 
                ? new Date(checkin.createdAt[0], checkin.createdAt[1]-1, checkin.createdAt[2], checkin.createdAt[3]||0, checkin.createdAt[4]||0)
                : new Date(checkin.createdAt);
            safeTimestamp = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        }
    } catch (e) {
        console.warn("Lỗi parse ngày tháng:", e);
    }

    const postData: any = {
        type: 'POST', 
        id: checkin.id || 'temp-id',
        userId: String(userInfo.id),
        user: { id: String(userInfo.id), name: userInfo.name, avatar: userInfo.avatar },
        journeyId: checkin.journeyId || '', 
        image: checkin.imageUrl || checkin.thumbnailUrl || '',
        videoUrl: checkin.videoUrl, 
        caption: checkin.caption || '', 
        status: mapStatus(checkin.status),
        interactionType: InteractionType.GROUP_DISCUSS,
        emotion: mapEmotion(checkin.emotion), 
        activityName: checkin.activityName,        
        locationName: checkin.locationName,        
        timestamp: safeTimestamp,
        reactionCount: checkin.reactionCount || 0,
        commentCount: checkin.commentCount || 0,
        latestReactions: checkin.latestReactions || [],

        // --- [SỬA LỖI] TRUYỀN THẺ HIỂN THỊ VÀ SPOTIFY VÀO ĐÂY ---
        displayTag: checkin.displayTag,
        spotifyTrackId: checkin.spotifyTrackId 
    };

    return {
        showMoveMenu, setShowMoveMenu,
        activeJourneys, isMoving, isLoadingJourneys,
        headerTarget, setHeaderTarget,
        handleOpenMoveMenu, handleMoveToJourney, postData
    };
};