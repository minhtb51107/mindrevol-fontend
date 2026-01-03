import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { journeyService } from '@/modules/journey/services/journey.service';
import { checkinService } from '@/modules/checkin/services/checkin.service';
import { JourneyResponse } from '@/modules/journey/types';
import { PostProps, CheckinStatus, Emotion, InteractionType } from '../types';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/modules/auth/store/AuthContext';

export type MemberStatus = 'COMPLETED' | 'FAILED' | 'COMEBACK' | 'LATE_SOON' | 'NORMAL' | 'REST';

export interface FilterMember {
  id: string | number;
  name: string;
  avatar: string;
  status?: MemberStatus; 
  activityPersona?: string; 
  presenceRate?: number;
  currentStreak?: number;
  totalActiveDays?: number;
}

export const useFeedData = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [members, setMembers] = useState<FilterMember[]>([]); 
  const [journeys, setJourneys] = useState<JourneyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); 
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);

  // 1. Init Data (ĐÃ CẬP NHẬT LỌC NGÀY)
  useEffect(() => {
    const initData = async () => {
      try {
        const myJourneys = await journeyService.getMyJourneys();
        
        // --- [FIX LỖI HIỂN THỊ] ---
        const now = new Date();
        const validJourneys = myJourneys.filter(j => {
             // 1. Nếu backend đã đóng -> Ẩn
             if (j.status === 'COMPLETED' || j.status === 'FINISHED') return false;
             
             // 2. Nếu có ngày kết thúc -> Kiểm tra xem đã qua chưa
             if (j.endDate) {
                 const end = new Date(j.endDate);
                 // Đặt là 23:59:59 của ngày kết thúc để hôm nay vẫn hiện
                 end.setHours(23, 59, 59, 999);
                 return end >= now; 
             }
             return true; 
        });

        setJourneys(validJourneys);
        // --------------------------
        
        const urlJourneyId = searchParams.get('journeyId');
        // Sử dụng danh sách đã lọc để check
        const isValidJourney = urlJourneyId && validJourneys.some(j => j.id === urlJourneyId);

        if (isValidJourney) {
           setSelectedJourneyId(urlJourneyId);
        } else if (validJourneys.length > 0) {
           const defaultId = validJourneys[0].id;
           setSelectedJourneyId(defaultId);
           setSearchParams({ journeyId: defaultId }, { replace: true });
        }
      } catch (error) {
        console.error("Failed to init data", error);
      }
    };
    initData();
  }, []);

  // 2. Fetch Feed Content
  const fetchFeed = async () => {
    const currentId = selectedJourneyId || searchParams.get('journeyId');
    if (!currentId) return;

    if (posts.length === 0) setIsLoading(true); 
    
    try {
      const [feedResponse, participants] = await Promise.all([
        checkinService.getJourneyFeed(currentId),
        journeyService.getParticipants(currentId).catch(() => [])
      ]);

      const rawCheckins = Array.isArray(feedResponse) 
          ? feedResponse 
          : ((feedResponse as any).content || []); 

      const mappedPosts: PostProps[] = rawCheckins.map((c: any) => {
        const rawStatus = c.status as CheckinStatus;
        let uiStatus: PostProps['status'] = 'normal';

        if (rawStatus === CheckinStatus.COMEBACK) uiStatus = 'comeback';
        else if (rawStatus === CheckinStatus.FAILED) uiStatus = 'failed';
        else if (rawStatus === CheckinStatus.REST) uiStatus = 'rest';
        else if (rawStatus === CheckinStatus.NORMAL) uiStatus = 'completed';

        return {
          id: c.id,
          userId: c.userId.toString(),
          user: { 
            name: c.userFullName, 
            avatar: c.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.userFullName)}` 
          },
          image: c.imageUrl,
          caption: c.caption,
          status: uiStatus,
          emotion: c.emotion || Emotion.NORMAL,
          interactionType: c.interactionType || InteractionType.GROUP_DISCUSS,
          activityName: c.activityName,
          locationName: c.locationName,
          taskName: c.taskTitle || c.taskName,
          timestamp: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactionCount: c.reactionCount || 0,
          commentCount: c.commentCount || 0,
          latestReactions: c.latestReactions || [] 
        };
      });
      setPosts(mappedPosts);

      const mappedMembers: FilterMember[] = participants.map((p: any) => {
          const userInfo = p.user || {}; 
          const name = userInfo.fullname || "Unknown";
          return {
              id: userInfo.id, 
              name: name,
              avatar: userInfo.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
              status: p.status || 'NORMAL',
              activityPersona: p.activityPersona || 'NEWBIE', 
              presenceRate: p.presenceRate || 0,
              currentStreak: p.currentStreak || 0,
              totalActiveDays: p.totalActiveDays || 0
          };
      });
      setMembers(mappedMembers);

    } catch (error: any) {
      if (error.response?.status === 403 || error.response?.status === 400) {
          toast.error("Không thể tải dữ liệu hành trình này.");
      }
      console.error("Fetch error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlId = searchParams.get('journeyId');
    const targetId = selectedJourneyId || urlId;
    if (targetId) {
        if (selectedJourneyId !== targetId) setSelectedJourneyId(targetId);
        fetchFeed();
    }
  }, [selectedJourneyId, searchParams.get('journeyId')]); 

  const handleSelectJourney = (id: string) => {
      setSelectedJourneyId(id);
      setSearchParams({ journeyId: id });
      setPosts([]); 
      setIsLoading(true);
  };

  const handlePostDeleted = (deletedPostId: string) => {
    setPosts(prev => prev.filter(p => p.id !== deletedPostId));
  };

  const handlePostUpdated = (postId: string, newCaption: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, caption: newCaption } : p));
  };

  const filteredPosts = useMemo(() => {
    if (!selectedUserId) return posts; 
    return posts.filter(p => p.userId === selectedUserId);
  }, [posts, selectedUserId]);

  const currentJourneyName = journeys.find(j => j.id === selectedJourneyId)?.name || "Tất cả hành trình";
  const refreshFeed = fetchFeed;

  return {
    user, posts, members, journeys, isLoading,
    currentJourneyName, selectedJourneyId, selectedUserId, filteredPosts,
    setSelectedUserId, handleSelectJourney, handlePostDeleted, handlePostUpdated, refreshFeed 
  };
};