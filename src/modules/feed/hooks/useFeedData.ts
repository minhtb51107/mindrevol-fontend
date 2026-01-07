import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { journeyService } from '@/modules/journey/services/journey.service';
import { feedService } from '../services/feed.service'; // [UPDATE] Dùng feedService
import { PostProps } from '../types';
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
  const [journeys, setJourneys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); 
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);

  // 1. Init Data
  useEffect(() => {
    const initData = async () => {
      try {
        const myJourneys = await journeyService.getMyJourneys();
        const now = new Date();
        const validJourneys = myJourneys.filter(j => {
             if (j.status === 'COMPLETED' || j.status === 'FINISHED') return false;
             if (j.endDate) {
                 const end = new Date(j.endDate);
                 end.setHours(23, 59, 59, 999);
                 return end >= now; 
             }
             return true; 
        });

        setJourneys(validJourneys);
        
        const urlJourneyId = searchParams.get('journeyId');
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

    // Chỉ hiện loading nếu chưa có bài nào (để trải nghiệm mượt hơn khi refresh)
    if (posts.length === 0) setIsLoading(true); 
    
    try {
      // [UPDATE] Dùng feedService thay vì checkinService
      const [feedData, participants] = await Promise.all([
        feedService.getJourneyFeed(currentId), 
        journeyService.getParticipants(currentId).catch(() => [])
      ]);

      // [UPDATE] Vì feedService đã map dữ liệu chuẩn rồi, ta set trực tiếp
      setPosts(feedData);

      // Map Participants (Giữ nguyên logic cũ nếu backend trả về user nested)
      const mappedMembers: FilterMember[] = participants.map((p: any) => {
          const userInfo = p.user || {}; // Đảm bảo lấy đúng object user
          const name = userInfo.fullname || userInfo.name || "Unknown";
          return {
              id: userInfo.id, 
              name: name,
              avatar: userInfo.avatarUrl || userInfo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
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

  // Logic lọc bài viết
  const filteredPosts = useMemo(() => {
    if (!selectedUserId) return posts; 
    // [DEBUG] Nếu vẫn không hiện, hãy bỏ comment dòng dưới để kiểm tra ID
    // console.log(`Filtering: Looking for ${selectedUserId}`, posts.map(p => p.userId));
    return posts.filter(p => String(p.userId) === String(selectedUserId));
  }, [posts, selectedUserId]);

  const currentJourneyName = journeys.find(j => j.id === selectedJourneyId)?.name || "Tất cả hành trình";
  const refreshFeed = fetchFeed;

  return {
    user, posts, members, journeys, isLoading,
    currentJourneyName, selectedJourneyId, selectedUserId, filteredPosts,
    setSelectedUserId, handleSelectJourney, handlePostDeleted, handlePostUpdated, refreshFeed 
  };
};