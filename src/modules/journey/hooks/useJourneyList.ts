import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { journeyService } from '../services/journey.service';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { JourneyResponse, JourneyStatus, UserActiveJourneyResponse } from '../types';

export interface MergedJourney extends JourneyResponse {
    memberAvatars?: (string | null)[];
    daysRemaining?: number;
    totalMembers?: number;
    thumbnailUrl?: string; 
    previewImages?: string[];
}

export const useJourneyList = (isOpen: boolean, onClose: () => void) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [activeTab, setActiveTab] = useState<'MY_JOURNEYS' | 'INVITATIONS'>('MY_JOURNEYS');
    const [selectedJourney, setSelectedJourney] = useState<MergedJourney | null>(null);
    const [modalType, setModalType] = useState<'SETTINGS' | 'INVITE' | 'REQUESTS' | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [journeys, setJourneys] = useState<MergedJourney[]>([]);
    const [listLoading, setListLoading] = useState(false);

    const [alerts, setAlerts] = useState({
        invitations: 0,
        requests: 0,
        journeyIdsWithRequests: new Set<string>()
    });

    const fetchJourneys = async () => {
        setListLoading(true);
        try {
            const [myList, activeList] = await Promise.all([
                journeyService.getMyJourneys(),
                journeyService.getUserActiveJourneys("me")
            ]);

            const merged: MergedJourney[] = myList.map((journey: JourneyResponse) => {
                const extraData = activeList.find((a: UserActiveJourneyResponse) => a.id === journey.id);
                const checkinImages = extraData?.checkins
                    ?.filter((c: any) => c.imageUrl)
                    .map((c: any) => c.imageUrl as string) || [];

                return {
                    ...journey,
                    memberAvatars: extraData?.memberAvatars || [],
                    daysRemaining: extraData?.daysRemaining,
                    totalMembers: extraData?.totalMembers || journey.participantCount || 1,
                    themeColor: extraData?.themeColor || journey.themeColor,
                    avatar: extraData?.avatar || journey.avatar,
                    thumbnailUrl: extraData?.thumbnailUrl,
                    previewImages: checkinImages.length > 0 ? checkinImages : (extraData?.thumbnailUrl ? [extraData.thumbnailUrl] : [])
                };
            });
            setJourneys(merged);
        } catch (error) {
            console.error("Failed to load active journeys", error);
        } finally {
            setListLoading(false);
        }
    };

    const fetchAlerts = async () => {
        try {
            const data = await journeyService.getAlerts();
            setAlerts({
                invitations: data.journeyPendingInvitations,
                requests: data.waitingApprovalRequests,
                journeyIdsWithRequests: new Set(data.journeyIdsWithRequests)
            });
        } catch (e) {
            console.error("Failed to fetch alerts", e);
        }
    };

    const refreshAll = useCallback(async () => {
        await Promise.all([fetchJourneys(), fetchAlerts()]);
    }, []);

    useEffect(() => {
        if (isOpen) refreshAll();
    }, [isOpen, refreshAll]);

    const activeJourneys = useMemo(() => {
        if (!journeys) return [];
        return journeys.filter(j => 
            [JourneyStatus.ACTIVE, JourneyStatus.ONGOING, JourneyStatus.UPCOMING].includes(j.status as JourneyStatus)
        );
    }, [journeys]);

    const MAX_JOURNEYS = 5;
    const currentCount = activeJourneys.length;
    const isLimitReached = currentCount >= MAX_JOURNEYS;

    const handleEnterJourney = (journeyId: string) => {
        onClose();
        navigate(`/?journeyId=${journeyId}`);
        window.dispatchEvent(new CustomEvent('JOURNEY_SELECTED', { detail: journeyId }));
    };

    const handleActionWhenLimitReached = () => {
        if (isLimitReached) {
            toast.error(`Bạn đã đạt giới hạn ${MAX_JOURNEYS} Hành trình đang hoạt động.`);
            return true;
        }
        return false;
    };

    return {
        user,
        activeTab, setActiveTab,
        selectedJourney, setSelectedJourney,
        modalType, setModalType,
        isCreateOpen, setIsCreateOpen,
        listLoading, activeJourneys,
        alerts, refreshAll,
        MAX_JOURNEYS, currentCount, isLimitReached,
        handleEnterJourney, handleActionWhenLimitReached
    };
};