import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Flame, CloudRain, MoreHorizontal, Trash2, Edit2, Ban, Flag, CheckCircle } from 'lucide-react';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { blockService } from '@/modules/user/services/block.service';

export interface PostProps {
  id: string;
  userId?: string; 
  user: { name: string; avatar: string };
  image: string;
  caption: string;
  status: 'completed' | 'failed' | 'comeback';
  taskName?: string;
  timestamp: string;
}

export const JourneyPostCard = ({ post, isActive }: { post: PostProps; isActive: boolean }) => {
  const { user: currentUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = currentUser?.id.toString() === post.userId;

  const handleBlockUser = async () => {
    if(!post.userId) return;
    if (confirm(`Chặn ${post.user.name}? Bạn sẽ không thấy bài của họ nữa.`)) {
      try {
        await blockService.blockUser(parseInt(post.userId));
        alert('Đã chặn thành công.');
        setShowMenu(false);
      } catch (error) { alert('Lỗi khi chặn.'); }
    }
  };

  const handleReport = async () => {
    alert("Đã gửi báo cáo vi phạm.");
    setShowMenu(false);
  };

  const renderStatusBadge = () => {
    switch (post.status) {
      case 'completed':
        return <div className="flex items-center gap-1.5 bg-green-500/20 backdrop-blur-md border border-green-400/30 px-3 py-1 rounded-full shadow-lg"><Sparkles className="w-3.5 h-3.5 text-green-300 animate-pulse" /><span className="text-green-100 text-[10px] font-bold uppercase">Complete</span></div>;
      case 'comeback':
        return <div className="flex items-center gap-1.5 bg-orange-500/20 backdrop-blur-md border border-orange-400/30 px-3 py-1 rounded-full shadow-lg"><Flame className="w-3.5 h-3.5 text-orange-300 animate-bounce" /><span className="text-orange-100 text-[10px] font-bold uppercase">Comeback</span></div>;
      case 'failed':
        return <div className="flex items-center gap-1.5 bg-slate-500/20 backdrop-blur-md border border-slate-400/30 px-3 py-1 rounded-full"><CloudRain className="w-3.5 h-3.5 text-slate-300" /><span className="text-slate-200 text-[10px] font-bold uppercase">Missed</span></div>;
      default: return null;
    }
  };

  return (
    <div className={cn(
      "snap-center shrink-0 w-[90vw] md:w-[450px] aspect-square flex flex-col items-center justify-center transition-all duration-500 ease-out select-none relative", 
      isActive ? "scale-100 opacity-100 blur-0" : "scale-90 opacity-40 blur-[2px] grayscale"
    )}>
      
      {/* Khung ảnh bo tròn lớn (rounded-[32px]) để giống Locket */}
      <div className="relative w-full h-full rounded-[32px] md:rounded-[48px] overflow-hidden bg-zinc-900 border-4 border-white/5 shadow-2xl group">
        <img src={post.image} className="w-full h-full object-cover" draggable={false} />
        
        {/* Badge góc trái */}
        <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-2 opacity-90">
          {renderStatusBadge()}
          {post.taskName && (
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-white text-[10px] font-medium">{post.taskName}</span>
            </div>
          )}
        </div>

        {/* Menu 3 chấm */}
        {isActive && (
          <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 origin-top-right z-30">
                {isOwner ? (
                  <>
                    <button className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-white/10 flex items-center gap-2"><Edit2 className="w-4 h-4" /> Edit</button>
                    <button className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-t border-white/5"><Trash2 className="w-4 h-4" /> Delete</button>
                  </>
                ) : (
                  <>
                    <button onClick={handleReport} className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-white/10 flex items-center gap-2"><Flag className="w-4 h-4" /> Report</button>
                    <button onClick={handleBlockUser} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/10 flex items-center gap-2 border-t border-white/5"><Ban className="w-4 h-4" /> Block</button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className="absolute bottom-0 inset-x-0 p-6 pt-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex justify-center">
          <div className="bg-black/30 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-2xl max-w-[90%] shadow-sm">
            <p className="text-white text-base font-medium text-center leading-snug drop-shadow-md">{post.caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
};