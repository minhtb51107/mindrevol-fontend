import React, { useState } from 'react';
import { UserActiveJourneyResponse } from '../types';
import { MobileJourneyCard } from './MobileJourneyCard'; 

// ==========================================
// 1. DỮ LIỆU GIẢ LẬP (MOCK DATA) ĐỂ TEST UI
// ==========================================
const MOCK_JOURNEYS: any[] = [
  {
    id: 'journey-mock-1',
    name: 'Thanh Xuân Ở Đà Lạt - Ký sự mây và núi',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    themeColor: '#3b82f6', // Xanh dương
    avatar: '☁️',
    memberAvatars: [
      'https://i.pravatar.cc/150?u=1',
      'https://i.pravatar.cc/150?u=2',
      'https://i.pravatar.cc/150?u=3',
      'https://i.pravatar.cc/150?u=4',
    ],
    totalMembers: 6,
    daysRemaining: 12,
  },
  {
    id: 'journey-mock-2',
    name: 'Nhật ký 30 ngày dạo quanh phố phường Hà Nội',
    thumbnailUrl: null, // Cố tình để null để test giao diện thẻ không có ảnh bìa
    themeColor: '#10b981', // Xanh lá
    avatar: '🍂',
    memberAvatars: [
      'https://i.pravatar.cc/150?u=5',
      'https://i.pravatar.cc/150?u=6',
    ],
    totalMembers: 2,
    daysRemaining: 5,
  },
  {
    id: 'journey-mock-3',
    name: 'Khoảnh khắc lễ Tốt Nghiệp Khóa 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
    themeColor: '#f59e0b', // Vàng
    avatar: '🎓',
    memberAvatars: [
      'https://i.pravatar.cc/150?u=7',
      'https://i.pravatar.cc/150?u=8',
      'https://i.pravatar.cc/150?u=9',
    ],
    totalMembers: 3,
    daysRemaining: 0, // Cố tình để 0 để test nhãn "Kết thúc"
  }
];

interface Props {
  onJourneySelect?: (id: string) => void;
  selectedId?: string | null;
}

export const MobileActiveJourneyList: React.FC<Props> = ({ 
  onJourneySelect, 
  selectedId 
}) => {
  // 2. SỬ DỤNG MOCK DATA VÀ BỎ QUA LOADING
  const [journeys] = useState<any[]>(MOCK_JOURNEYS);
  const loading = false; // Tắt loading để hiện luôn UI
  
  /* Tạm thời comment đoạn gọi API thật
  const { user } = useAuth(); 
  useEffect(() => {
    const fetchJourneys = async () => {
      if (!user?.id) return;
      try {
        const data = await journeyService.getUserActiveJourneys(user.id);
        setJourneys(data);
      } catch (error) { ... } finally { setLoading(false); }
    };
    if (user?.id) fetchJourneys();
  }, [user?.id]);
  */

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-340px)] overflow-hidden flex flex-col items-center gap-6 py-4 px-4 bg-transparent">
        <div className="w-full h-10 flex items-center mb-2">
            <div className="w-32 h-6 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="w-full h-[220px] bg-zinc-200 dark:bg-zinc-800/50 rounded-2xl animate-pulse shrink-0 shadow-sm" />
        ))}
      </div>
    );
  }

  if (journeys.length === 0) {
      return (
        <div className="w-full flex justify-center py-10 bg-transparent">
            <span className="text-sm font-medium text-muted">Chưa có hành trình nào đang diễn ra.</span>
        </div>
      );
  }

  return (
    // Con số 340px là ước lượng tổng chiều cao của Header + Stats Panel + Khoảng cách. 
    // Bạn có thể tăng/giảm con số 340 này để 2 ô thống kê nằm vừa vặn nhất ở đáy!
    <div className="w-full h-[calc(100vh-340px)] flex flex-col bg-transparent pt-4 px-4">
      
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 1. PHẦN TIÊU ĐỀ */}
      <div className="w-full mb-4 shrink-0">
        <h2 className="text-foreground text-lg font-bold text-left drop-shadow-sm">
          Đang diễn ra
        </h2>
        <div className="h-px w-full bg-border mt-4" />
      </div>
      
      {/* 2. KHUNG CUỘN DANH SÁCH */}
      <div className="flex-1 overflow-y-auto hide-scroll w-full">
        <div className="flex flex-col items-center gap-6 w-full pb-6">
          {journeys.map((journey) => (
              <div 
                  key={journey.id}
                  className={`w-full transition-all duration-300 rounded-2xl shrink-0 ${
                      selectedId === journey.id 
                      ? 'scale-[1.02] z-10 shadow-xl ring-2 ring-primary' 
                      : 'scale-100' 
                  }`}
              >
                  <MobileJourneyCard 
                      journey={journey}
                      className="w-full h-[220px]" 
                      onClick={() => {
                          if (onJourneySelect) onJourneySelect(journey.id);
                      }} 
                  />
              </div>
          ))}
        </div>
      </div>

    </div>
  );
};