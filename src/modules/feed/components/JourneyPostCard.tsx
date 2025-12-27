import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  Flame, 
  MoreHorizontal, 
  Trash2, 
  Edit2, 
  Flag, 
  CheckCircle, 
  XCircle,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { checkinService } from '@/modules/checkin/services/checkin.service';
import { ReportModal } from '@/modules/report/components/ReportModal';
import { ReportTargetType } from '@/modules/report/services/report.service';

export interface PostProps {
  id: string;
  userId?: string; 
  user: { name: string; avatar: string };
  image: string;
  caption: string;
  status: 'completed' | 'failed' | 'comeback' | 'rest' | 'normal';
  taskName?: string;
  timestamp: string;
  reactionCount?: number;
  commentCount?: number;
  latestReactions?: any[];
}

interface JourneyPostCardProps {
  post: PostProps;
  isActive: boolean;
  onDelete?: (postId: string) => void;
  onUpdate?: (postId: string, newCaption: string) => void;
}

export const JourneyPostCard = ({ post, isActive, onDelete, onUpdate }: JourneyPostCardProps) => {
  const { user: currentUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption);
  const [isSaving, setIsSaving] = useState(false);

  const isOwner = currentUser?.id.toString() === post.userId;

  const handleReport = () => { setShowReportModal(true); setShowMenu(false); };

  const handleDelete = async () => {
    if (confirm("Bạn có chắc muốn xóa khoảnh khắc này?")) {
      try { await checkinService.deleteCheckin(post.id); if (onDelete) onDelete(post.id); } 
      catch (error) { console.error(error); }
    }
    setShowMenu(false);
  };

  const handleEditClick = () => { setEditCaption(post.caption); setIsEditing(true); setShowMenu(false); };
  
  const handleSaveEdit = async () => {
    if (editCaption === post.caption) { setIsEditing(false); return; }
    try { 
        setIsSaving(true); 
        await checkinService.updateCheckin(post.id, editCaption); 
        if (onUpdate) onUpdate(post.id, editCaption); 
        setIsEditing(false); 
    } catch (error) { console.error(error); alert("Lỗi cập nhật"); } finally { setIsSaving(false); }
  };

  const handleCancelEdit = () => { setEditCaption(post.caption); setIsEditing(false); };

  // STYLE MỚI: LIGHT & AIRY
  const renderStatusBadge = () => {
    switch (post.status) {
      case 'completed': 
        return <Badge icon={Sparkles} iconColor="text-emerald-400" label="Complete" />;
      case 'comeback': 
        return <Badge icon={Flame} iconColor="text-orange-400" label="Comeback" />;
      case 'failed': 
        return <Badge icon={XCircle} iconColor="text-red-400" label="Missed" />;
      default: return null;
    }
  };

  return (
    <div className={cn(
      "snap-center shrink-0 w-[85vw] md:w-[450px] aspect-square flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] select-none relative group", 
      isActive 
        ? "scale-100 opacity-100 translate-y-0 z-10" 
        : "scale-90 opacity-40 blur-[2px] grayscale-[60%] translate-y-4 z-0"
    )}>
      
      {/* FRAME */}
      <div className={cn(
        "relative w-full h-full rounded-[44px] overflow-hidden bg-[#1c1c1e] transition-all duration-500",
        isActive ? "shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]" : "shadow-none"
      )}>
        <img src={post.image} className="w-full h-full object-cover" draggable={false} alt="Moment" />
        
        {/* --- BADGES (TOP LEFT) - NHẸ NHÀNG --- */}
        <div className="absolute top-0 left-0 w-full p-5 flex flex-col items-start gap-3 z-10 pointer-events-none">
            <div className="flex flex-col items-start gap-2 transition-all duration-500 delay-100">
                {renderStatusBadge()}

                {post.taskName && (
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-white/90 text-[11px] font-medium tracking-wide shadow-black drop-shadow-sm">{post.taskName}</span>
                </div>
                )}
            </div>
        </div>

        {/* --- MENU (TOP RIGHT) --- */}
        {isActive && !isEditing && (
          <div className="absolute top-5 right-5 z-20 pointer-events-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="w-9 h-9 flex items-center justify-center bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white/90 hover:text-white transition-all border border-white/5 shadow-sm"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-40 bg-[#18181b]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 origin-top-right z-30 py-1">
                  {isOwner ? (
                    <>
                      <button onClick={handleEditClick} className="w-full text-left px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/5 flex items-center gap-2 transition-colors"><Edit2 className="w-4 h-4 text-zinc-400"/> Sửa</button>
                      <button onClick={handleDelete} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 border-t border-white/5 transition-colors"><Trash2 className="w-4 h-4"/> Xóa</button>
                    </>
                  ) : (
                    <button onClick={handleReport} className="w-full text-left px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/5 flex items-center gap-2 transition-colors"><Flag className="w-4 h-4 text-zinc-400"/> Báo cáo</button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* --- CAPTION (BOTTOM LEFT) - FROSTED GLASS --- */}
        <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-start pointer-events-none">
          <div className={cn(
            "pointer-events-auto transition-all duration-300 ease-out origin-bottom-left",
            // Style: Nền xám khói nhẹ (Black/40), Blur cực mạnh (XL). Viền trắng mảnh.
            // Đây là điểm cân bằng: Đủ tối để nổi chữ trắng, nhưng đủ trong để thấy ảnh.
            "bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg",
            "rounded-2xl px-4 py-3", 
            isEditing ? "w-full" : "w-fit max-w-[85%] hover:bg-black/50"
          )}>
            
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <textarea 
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="bg-transparent text-white border-none outline-none text-[14px] font-medium w-full placeholder:text-zinc-400 resize-none min-h-[50px] leading-relaxed"
                  placeholder="Viết cảm nghĩ..."
                  autoFocus
                />
                <div className="flex justify-end gap-2 border-t border-white/10 pt-2 mt-1">
                   <button onClick={handleCancelEdit} className="px-3 py-1 text-zinc-300 hover:text-white text-xs font-medium transition-colors">Hủy</button>
                   <button onClick={handleSaveEdit} disabled={isSaving} className="px-4 py-1 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 disabled:opacity-50 transition-all">
                     {isSaving ? "Lưu..." : "Lưu"}
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                 <p className="text-white text-[14px] font-normal leading-relaxed break-words text-left drop-shadow-sm">
                   {post.caption || <span className="italic text-white/50 text-sm">Chưa có chú thích</span>}
                 </p>
              </div>
            )}
          </div>
        </div>

      </div>

      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} targetId={post.id} targetType={ReportTargetType.CHECKIN} />
    </div>
  );
};

// Component Badge MỀM MẠI: Nền trong suốt, viền nhẹ
const Badge = ({ icon: Icon, iconColor, label }: any) => (
    <div className={cn(
        "flex items-center gap-2 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-md",
        // Nền rất mỏng (Black/20), Viền trắng mờ (White/5)
        "bg-black/20 border border-white/10"
    )}>
        <Icon className={cn("w-3.5 h-3.5", iconColor)} />
        {/* Text trắng hoàn toàn, có bóng nhẹ để dễ đọc */}
        <span className="text-white text-[11px] font-bold tracking-wide uppercase shadow-black drop-shadow-sm">{label}</span>
    </div>
);