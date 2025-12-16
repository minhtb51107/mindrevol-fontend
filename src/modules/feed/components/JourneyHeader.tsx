import React from 'react';
import { Plus, Zap, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data cho thành viên
const MOCK_MEMBERS = [
  { id: 1, name: 'Bạn', avatar: 'https://i.pravatar.cc/150?u=me', status: 'pending' }, // pending, completed, late
  { id: 2, name: 'Hải', avatar: 'https://i.pravatar.cc/150?u=2', status: 'completed' },
  { id: 3, name: 'Linh', avatar: 'https://i.pravatar.cc/150?u=3', status: 'late' },
  { id: 4, name: 'Minh', avatar: 'https://i.pravatar.cc/150?u=4', status: 'completed' },
  { id: 5, name: 'Tú', avatar: 'https://i.pravatar.cc/150?u=5', status: 'pending' },
];

export const JourneyHeader = () => {
  return (
    <div className="w-full flex flex-col gap-4 mb-6">
      {/* Tên hành trình & Các nút chức năng phụ */}
      <div className="flex items-center justify-between px-4 md:px-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">30 Ngày Chạy Bộ 🏃‍♂️</h1>
          <p className="text-sm text-muted-foreground">Ngày 12/30 - Chủ đề: Bền bỉ</p>
        </div>
        <div className="flex gap-2">
           {/* Nơi đặt các nút phụ nếu cần */}
        </div>
      </div>

      {/* Dải Avatar trạng thái thành viên */}
      <div className="flex gap-4 overflow-x-auto pb-2 px-4 md:px-0 no-scrollbar">
        {/* Nút mời thêm bạn */}
        <div className="flex flex-col items-center gap-1 min-w-[64px]">
          <button className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center hover:bg-accent/50 transition-colors">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </button>
          <span className="text-xs text-muted-foreground font-medium">Mời</span>
        </div>

        {MOCK_MEMBERS.map((mem) => (
          <div key={mem.id} className="flex flex-col items-center gap-1 min-w-[64px] relative group cursor-pointer">
            <div className={cn(
              "w-16 h-16 rounded-full p-[3px] transition-all duration-300 relative",
              mem.status === 'completed' && "bg-gradient-to-tr from-green-400 to-emerald-600", // Đã xong: Viền xanh
              mem.status === 'late' && "bg-gradient-to-tr from-orange-400 to-red-500 animate-pulse", // Trễ: Viền cam đỏ nhấp nháy
              mem.status === 'pending' && "bg-muted border-2 border-transparent" // Chưa xong: Xám
            )}>
              <img 
                src={mem.avatar} 
                alt={mem.name} 
                className="w-full h-full rounded-full object-cover border-2 border-background"
              />
              
              {/* Icon trạng thái nhỏ gắn trên Avatar */}
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                {mem.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100" />}
                {mem.status === 'late' && <Clock className="w-5 h-5 text-orange-500 fill-orange-100" />}
                {mem.status === 'pending' && <div className="w-4 h-4 bg-gray-300 rounded-full border-2 border-background" />}
              </div>
            </div>
            
            <span className={cn(
              "text-xs font-medium truncate w-full text-center",
              mem.status === 'late' ? "text-orange-500" : "text-foreground"
            )}>
              {mem.name}
            </span>

            {/* Tooltip nhắc nhở (Hiện khi hover vào người trễ/chưa làm) */}
            {mem.status !== 'completed' && mem.id !== 1 && (
               <div className="absolute -top-8 bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                 Nhắc nhở 👋
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};