import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import { journeyService } from '@/modules/journey/services/journey.service';
import { feedService } from '../services/feed.service';
import { useJourneyList } from '@/modules/journey/hooks/useJourneyList'; 
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

// Định nghĩa kiểu dữ liệu trả về của Query để TypeScript hiểu rõ
interface FeedQueryData {
  posts: PostProps[];
  members: FilterMember[];
}

export const useFeedData = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); 
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(searchParams.get('journeyId'));

  // =========================================================================
  // 1. DÙNG HOOK NÀY ĐỂ TỰ ĐỘNG CẬP NHẬT DANH SÁCH KHI CÓ THAY ĐỔI
  // =========================================================================
  const { data: rawJourneys, isLoading: listLoading } = useJourneyList();

  // Lọc hành trình hợp lệ
  const journeys = useMemo(() => {
    if (!rawJourneys) return [];
    const now = new Date();
    return rawJourneys.filter(j => {
        if (j.status === 'COMPLETED' || j.status === 'FINISHED') return false;
        if (j.endDate) {
            const end = new Date(j.endDate);
            end.setHours(23, 59, 59, 999);
            return end >= now; 
        }
        return true; 
    });
  }, [rawJourneys]);

  // =========================================================================
  // 2. TỰ ĐỘNG CHỌN HÀNH TRÌNH NẾU CHƯA CHỌN
  // =========================================================================
  useEffect(() => {
    if (journeys.length > 0) {
        const urlId = searchParams.get('journeyId');
        const isValid = urlId && journeys.some(j => j.id === urlId);
        
        if (!isValid) {
            const defaultId = journeys[0].id;
            setSelectedJourneyId(defaultId);
            setSearchParams({ journeyId: defaultId }, { replace: true });
        } else if (!selectedJourneyId) {
             setSelectedJourneyId(urlId);
        }
    }
  }, [journeys, searchParams, setSearchParams, selectedJourneyId]);

  // =========================================================================
  // 3. LẤY BÀI VIẾT (FEED)
  // =========================================================================
  const { data: feedDataRaw, isLoading: feedLoading, refetch: refetchFeed } = useQuery<FeedQueryData>({
    queryKey: ['feed', selectedJourneyId],
    queryFn: async () => {
        if (!selectedJourneyId) return { posts: [], members: [] };
        
        const [posts, participants] = await Promise.all([
            feedService.getJourneyFeed(selectedJourneyId),
            journeyService.getParticipants(selectedJourneyId).catch(() => [])
        ]);

        const mappedMembers: FilterMember[] = participants.map((p: any) => {
            const userInfo = p.user || {}; 
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

        return { posts, members: mappedMembers };
    },
    enabled: !!selectedJourneyId,
    staleTime: 1000 * 60,
  });

  // [FIX] Ép kiểu rõ ràng ở đây để bên dưới dùng không bị lỗi
  const posts = (feedDataRaw?.posts as PostProps[]) || [];
  const members = (feedDataRaw?.members as FilterMember[]) || [];
  
  const isLoading = listLoading || (!!selectedJourneyId && feedLoading);

  // =========================================================================
  // 4. CÁC HÀM XỬ LÝ (ACTIONS)
  // =========================================================================

  const handleSelectJourney = (id: string) => {
      setSelectedJourneyId(id);
      setSearchParams({ journeyId: id });
  };

  const handlePostDeleted = (deletedPostId: string) => {
    queryClient.setQueryData(['feed', selectedJourneyId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
            ...oldData,
            // [FIX] Thay 'any' bằng PostProps
            posts: oldData.posts.filter((p: PostProps) => p.id !== deletedPostId)
        };
    });
  };

  const handlePostUpdated = (postId: string, newCaption: string) => {
     queryClient.setQueryData(['feed', selectedJourneyId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
            ...oldData,
            // [FIX] Thay 'any' bằng PostProps
            posts: oldData.posts.map((p: PostProps) => p.id === postId ? { ...p, caption: newCaption } : p)
        };
    });
  };

  const filteredPosts = useMemo(() => {
    if (!selectedUserId) return posts; 
    // [FIX LỖI CHÍNH] Thêm kiểu (p: PostProps) để TypeScript không báo lỗi "implicitly has an 'any' type"
    return posts.filter((p: PostProps) => String(p.userId) === String(selectedUserId));
  }, [posts, selectedUserId]);

  const currentJourneyName = journeys.find(j => j.id === selectedJourneyId)?.name || "Tất cả hành trình";

  return {
    user, 
    posts, 
    members, 
    journeys, 
    isLoading,
    currentJourneyName, 
    selectedJourneyId, 
    selectedUserId, 
    filteredPosts,
    setSelectedUserId, 
    handleSelectJourney, 
    handlePostDeleted, 
    handlePostUpdated, 
    refreshFeed: refetchFeed 
  };
};