import React, { useEffect, useState, useMemo } from 'react';
import { feedService } from '../services/feed.service';
import { journeyService } from '@/modules/journey/services/journey.service';
import { FeedItem } from '../types';
import { LocketFeedViewer } from './LocketFeedViewer'; 
import { Loader2 } from 'lucide-react';
import { MemberFilter } from './MemberFilter'; 
import { useAuth } from '@/modules/auth/store/AuthContext'; 
import { cn } from '@/lib/utils';
import { InviteMembersModal } from '@/modules/journey/components/InviteMembersModal'; 
import { toast } from 'react-hot-toast';
import { http } from '@/lib/http'; 

interface HomeFeedProps {
  selectedJourneyId: string | null;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ selectedJourneyId }) => {
  const { user } = useAuth(); 
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [isRightSidebarExpanded, setIsRightSidebarExpanded] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [journeyMembers, setJourneyMembers] = useState<any[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<'OWNER' | 'ADMIN' | 'MEMBER'>('MEMBER');

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      setLoading(true);
      if (isActive) {
        setPosts([]); 
        setSelectedUserId(null); 
      }
      try {
        let data: FeedItem[] = [];
        if (selectedJourneyId) {
          data = await feedService.getJourneyFeed(selectedJourneyId);
        } else {
          data = await feedService.getRecentFeed();
        }
        
        if (isActive) {
            setPosts(data);
        }
      } catch (error) {
        console.error("Lỗi tải feed:", error);
      } finally {
        if (isActive) setLoading(false);
      }
    };
    loadData();

    return () => {
        isActive = false; 
    };
  }, [selectedJourneyId]);

  useEffect(() => {
    const fetchParticipants = async () => {
       if (!selectedJourneyId) {
          setJourneyMembers([]);
          setCurrentUserRole('MEMBER');
          return;
       }
       try {
          const journeyRes = await http.get<{data: any}>(`/journeys/${selectedJourneyId}`);
          const creatorId = String(journeyRes.data?.data?.creatorId);

          const participants = await journeyService.getParticipants(selectedJourneyId);
          
          const mappedMembers = participants.map((p: any) => {
             const uid = String(p.user?.id || p.userId || p.id);
             
             let finalRole = 'MEMBER';
             if (uid === creatorId) {
                 finalRole = 'OWNER'; 
             } else {
                 const rawRole = String(p.role || p.journeyRole || '').toUpperCase();
                 if (rawRole.includes('ADMIN')) finalRole = 'ADMIN';
             }

             return {
                 id: uid,
                 name: p.user?.fullname || p.fullname || p.name || 'User',
                 avatar: p.user?.avatarUrl || p.avatarUrl || p.avatar,
                 role: finalRole as 'OWNER' | 'ADMIN' | 'MEMBER', 
                 status: 'NORMAL', 
                 presenceRate: p.presenceRate || 0,
                 totalCheckins: p.totalCheckins || 0
             };
          });

          setJourneyMembers(mappedMembers);

          const me = mappedMembers.find(m => m.id === String(user?.id));
          if (me) {
              setCurrentUserRole(me.role as 'OWNER' | 'ADMIN' | 'MEMBER'); 
          }
       } catch(err) {
          console.error("Lỗi lấy danh sách thành viên", err);
       }
    };
    fetchParticipants();
  }, [selectedJourneyId, user?.id]);

  // Bộ bóc tách dự phòng cho Feed tổng hợp
  const feedMembersExtracted = useMemo(() => {
    if (selectedJourneyId) return []; 
    const membersMap = new Map();
    posts.forEach(item => {
      if (item.type === 'POST') {
        const uid = String(item.user?.id || item.userId);
        if (uid && uid !== 'undefined') {
          if (!membersMap.has(uid)) {
            membersMap.set(uid, {
              id: uid, name: item.user?.name || 'User', avatar: item.user?.avatar, status: 'NORMAL', presenceRate: 0, role: 'MEMBER', totalCheckins: 1
            });
          } else {
            const existing = membersMap.get(uid);
            existing.totalCheckins += 1;
          }
        }
      }
    });
    return Array.from(membersMap.values());
  }, [posts, selectedJourneyId]);

  // [SỬA ĐỔI LỚN] Hợp nhất và Tính toán chính xác số lượng Checkin (Chống lag chậm số)
  const displayMembers = useMemo(() => {
    const source = selectedJourneyId ? journeyMembers : feedMembersExtracted;

    // 1. Quét một vòng đếm xem thực tế đang có bao nhiêu bài trên Feed
    const feedPostCounts = new Map<string, number>();
    posts.forEach(post => {
        if (post.type === 'POST') {
            const uid = String(post.user?.id || post.userId);
            feedPostCounts.set(uid, (feedPostCounts.get(uid) || 0) + 1);
        }
    });

    // 2. Map lại dữ liệu và sửa các thông số ảo
    const uniqueMembersMap = new Map();
    source.forEach(m => {
        const feedCount = feedPostCounts.get(m.id) || 0;
        const backendCount = m.totalCheckins || 0;
        // Lấy con số thực tế nhất (Cái nào cao hơn thì tin cái đó)
        const realTotalCheckins = Math.max(feedCount, backendCount);

        if (!uniqueMembersMap.has(m.id)) {
            uniqueMembersMap.set(m.id, {
                ...m,
                totalCheckins: realTotalCheckins
            });
        } else {
            const existing = uniqueMembersMap.get(m.id);
            existing.totalCheckins = Math.max(existing.totalCheckins, realTotalCheckins);
            if (m.role === 'OWNER' || m.role === 'ADMIN') existing.role = m.role;
        }
    });

    return Array.from(uniqueMembersMap.values());
  }, [selectedJourneyId, journeyMembers, feedMembersExtracted, posts]);

  const filteredPosts = useMemo(() => {
    if (!selectedUserId) return posts; 
    return posts.filter(item => {
      if (item.type === 'POST') {
          const uid = String(item.user?.id || item.userId);
          return uid === String(selectedUserId);
      }
      return false; 
    });
  }, [posts, selectedUserId]);

  const handleKickMember = async (memberId: string) => {
      if (!selectedJourneyId) return;
      if (window.confirm("Bạn có chắc chắn muốn mời người này khỏi hành trình?")) {
          try {
              await journeyService.kickMember(selectedJourneyId, memberId);
              setJourneyMembers(prev => prev.filter(m => m.id !== String(memberId)));
              if (selectedUserId === memberId) setSelectedUserId(null); 
              toast.success("Đã mời thành viên khỏi hành trình");
          } catch (err) {
              toast.error("Không thể xoá thành viên này");
          }
      }
  };

  const handleTransferOwnership = async (memberId: string) => {
      if (!selectedJourneyId) return;
      if (window.confirm("Bạn có chắc muốn chuyển quyền Chủ hành trình? Bạn sẽ trở thành thành viên thường.")) {
          try {
              await journeyService.transferOwnership(selectedJourneyId, memberId);
              toast.success("Chuyển quyền thành công!");
              setCurrentUserRole('MEMBER');
              setJourneyMembers(prev => prev.map(m => {
                  if (m.id === String(user?.id)) return { ...m, role: 'MEMBER' };
                  if (m.id === String(memberId)) return { ...m, role: 'OWNER' };
                  return m;
              }));
          } catch (err) {
              toast.error("Lỗi khi chuyển quyền");
          }
      }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-transparent">
        <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
      </div>
    );
  }

  if (filteredPosts.length === 0) {
     return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-zinc-500 bg-transparent">
            {selectedUserId ? "Thành viên này chưa có bài viết nào ở đây." : selectedJourneyId ? "Hành trình này chưa có bài viết nào." : "Chưa có hoạt động nào gần đây."}
        </div>
     );
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-transparent relative overflow-hidden">
        
      {displayMembers.length > 0 && (
        <MemberFilter 
            members={displayMembers} 
            currentUser={user} 
            selectedUserId={selectedUserId} 
            onSelectUser={setSelectedUserId} 
            isDesktop={false} 
            currentUserRole={currentUserRole}
            onInviteClick={() => setIsInviteModalOpen(true)}
            onKickMember={handleKickMember}
            onTransferOwnership={handleTransferOwnership}
        />
      )}

      <div className="flex-1 w-full h-full relative overflow-hidden">
        <LocketFeedViewer posts={filteredPosts} />
      </div>

      {displayMembers.length > 0 && (
         <div className={cn(
             "hidden md:flex h-full shrink-0 border-l border-zinc-200 dark:border-white/10 bg-white dark:bg-[#121212]",
             "transition-all duration-300 ease-in-out",
             isRightSidebarExpanded ? "w-[280px]" : "w-[72px]" 
         )}>
            <MemberFilter 
                members={displayMembers} 
                currentUser={user} 
                selectedUserId={selectedUserId} 
                onSelectUser={setSelectedUserId} 
                isDesktop={true}
                isDesktopExpanded={isRightSidebarExpanded}
                onToggleDesktop={() => setIsRightSidebarExpanded(!isRightSidebarExpanded)}
                currentUserRole={currentUserRole}
                onInviteClick={() => setIsInviteModalOpen(true)}
                onKickMember={handleKickMember}
                onTransferOwnership={handleTransferOwnership}
            />
         </div>
      )}
      
      {selectedJourneyId && (
        <InviteMembersModal 
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          journeyId={selectedJourneyId}
        />
      )}
    </div>
  );
};