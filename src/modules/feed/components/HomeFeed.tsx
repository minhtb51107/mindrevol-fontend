import React, { useEffect, useState, useMemo } from 'react';
import { feedService } from '../services/feed.service';
import { FeedItem } from '../types';
import { JourneyPostCard } from './JourneyPostCard';
import { Loader2, Sparkles, LayoutGrid } from 'lucide-react';
import { MemberFilter } from './MemberFilter'; // [THÊM MỚI] Import bộ lọc
import { useAuth } from '@/modules/auth/store/AuthContext'; // [THÊM MỚI] Lấy thông tin User hiện tại

interface HomeFeedProps {
  selectedJourneyId: string | null;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ selectedJourneyId }) => {
  const { user } = useAuth(); // Lấy thông tin user đăng nhập
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // [THÊM MỚI] State lưu người dùng đang được chọn để lọc
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // 1. Tải danh sách bài viết
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setPosts([]); 
      setSelectedUserId(null); // Reset bộ lọc khi đổi hành trình
      
      try {
        let data: FeedItem[] = [];
        if (selectedJourneyId) {
          data = await feedService.getJourneyFeed(selectedJourneyId);
        } else {
          data = await feedService.getRecentFeed();
        }
        setPosts(data);
      } catch (error) {
        console.error("Lỗi tải feed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedJourneyId]);

  // 2. [THÊM MỚI] Tự động trích xuất danh sách thành viên từ các bài viết hiện có
  const feedMembers = useMemo(() => {
    const membersMap = new Map();
    
    posts.forEach(post => {
      if (post.type === 'AD') return;
      
      // Tùy theo DTO của bạn, ID user có thể nằm ở post.userId hoặc post.user.id
      const uid = post.user?.id || post.userId;
      
      if (uid && !membersMap.has(uid)) {
        membersMap.set(uid, {
          id: uid,
          name: post.user?.name || 'User',
          avatar: post.user?.avatar,
          status: 'NORMAL',
          presenceRate: 0 // Có thể nối với API để lấy % điểm danh sau
        });
      }
    });
    
    return Array.from(membersMap.values());
  }, [posts]);

  // 3. [THÊM MỚI] Lọc bài viết theo người dùng được chọn
  const filteredPosts = useMemo(() => {
    if (!selectedUserId) return posts; // Nếu không chọn ai -> Hiện tất cả
    
    return posts.filter(post => {
      if (post.type === 'AD') return false;
      const uid = post.user?.id || post.userId;
      return String(uid) === String(selectedUserId);
    });
  }, [posts, selectedUserId]);

  // --- Header Title Component ---
  const FeedHeader = () => (
    <div className="w-full flex items-center gap-2 mb-6 mt-8">
      {selectedJourneyId ? (
        <>
          <LayoutGrid className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-bold text-white">Bài viết hành trình</h3>
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-white">Mới nhất cho bạn</h3>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="w-full max-w-[680px] mx-auto px-4 relative">
        <FeedHeader />
        <div className="w-full flex justify-center py-10">
          <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative pb-20">
        
      {/* [THÊM MỚI] Gọi Component Lọc Thành Viên */}
      {feedMembers.length > 0 && (
        <MemberFilter 
          members={feedMembers}
          currentUser={user}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
        />
      )}

      <div className="w-full max-w-[680px] mx-auto px-4 flex flex-col items-center">
        {/* Tiêu đề bảng tin */}
        <FeedHeader />

        {/* Danh sách bài viết SAU KHI LỌC */}
        {filteredPosts.length === 0 ? (
           <div className="w-full text-center py-10 text-zinc-500 text-sm bg-white/5 rounded-xl border border-white/5">
             {selectedUserId 
                ? "Thành viên này chưa có bài viết nào ở đây." 
                : selectedJourneyId 
                    ? "Hành trình này chưa có bài viết nào." 
                    : "Chưa có hoạt động nào gần đây."}
           </div>
        ) : (
           <div className="flex flex-col gap-8 w-full items-center">
             {filteredPosts.map((item) => {
                 if (item.type === 'AD') return null; 
                 return (
                   <JourneyPostCard 
                       key={item.id} 
                       post={item as any} 
                       isActive={true} 
                   />
                 );
             })}
           </div>
        )}
      </div>
    </div>
  );
};