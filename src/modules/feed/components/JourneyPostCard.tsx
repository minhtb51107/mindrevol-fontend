import React from 'react';
import { cn } from '@/lib/utils';
import { 
  MoreHorizontal, Trash2, Edit2, Flag, MapPin
} from 'lucide-react';
import { ReportModal } from '@/modules/report/components/ReportModal';
import { ReportTargetType } from '@/modules/report/services/report.service';
import { usePostCardLogic } from '../hooks/usePostCardLogic';
import { PostProps, Emotion } from '../types'; 

// --- CONFIG EMOJI CHUẨN ---
const EMOTION_EMOJIS: Record<string, string> = {
  [Emotion.EXCITED]:   '🤩',
  [Emotion.NORMAL]:    '🙂',
  [Emotion.TIRED]:     '😫',
  [Emotion.HOPELESS]:  '😞',
  'DEFAULT':           '✨',
};

const EMOTION_LABELS: Record<string, string> = {
  [Emotion.EXCITED]:   'Hào hứng',
  [Emotion.NORMAL]:    'Bình thường',
  [Emotion.TIRED]:     'Mệt mỏi',
  [Emotion.HOPELESS]:  'Chán nản',
  'DEFAULT':           'Check-in',
};

interface JourneyPostCardProps {
  post: PostProps;
  isActive: boolean;
  onDelete?: (postId: string) => void;
  onUpdate?: (postId: string, newCaption: string) => void;
}

export const JourneyPostCard = ({ post, isActive, onDelete, onUpdate }: JourneyPostCardProps) => {
  const { 
    isOwner, showMenu, setShowMenu, toggleMenu,
    showReportModal, setShowReportModal,
    isEditing, editCaption, setEditCaption, isSaving,
    handlers
  } = usePostCardLogic({ post, onDelete, onUpdate });

  const emoji = EMOTION_EMOJIS[post.emotion] || EMOTION_EMOJIS['DEFAULT'];
  const displayTitle = post.activityName || post.taskName || EMOTION_LABELS[post.emotion] || EMOTION_LABELS['DEFAULT'];

  const getDisplayCaption = (rawCaption: any) => {
      if (!rawCaption) return <span className="italic text-zinc-400/80">Không có ghi chú...</span>;
      if (typeof rawCaption === 'string') return rawCaption;
      return rawCaption.caption || JSON.stringify(rawCaption);
  };

  return (
    <div className={cn(
      "snap-center shrink-0 w-[85vw] md:w-[450px] aspect-square flex flex-col items-center justify-center transition-all duration-500 ease-out select-none relative group", 
      isActive 
        ? "scale-100 opacity-100 z-10" 
        : "scale-90 opacity-40 blur-[1px] grayscale-[50%] z-0"
    )}>
      
      {/* FRAME ẢNH VUÔNG BO TRÒN */}
      <div className={cn(
        "relative w-full h-full rounded-[36px] overflow-hidden bg-[#1c1c1e] transition-all duration-500 ring-1 ring-white/10",
        isActive ? "shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)]" : "shadow-none"
      )}>
        {/* Ảnh full cover */}
        <img src={post.image} className="w-full h-full object-cover" draggable={false} alt="Moment" />
        
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* --- Badge & Info --- */}
        <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-10 pointer-events-auto">
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-black/40 border border-white/10 shadow-lg backdrop-blur-md">
                 <span className="text-[18px] leading-none filter drop-shadow-sm">{emoji}</span>
                 <span className="text-[14px] font-bold text-white max-w-[160px] truncate">{displayTitle}</span>
            </div>
            {post.locationName && (
               <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm ml-1">
                  <MapPin className="w-3 h-3 text-red-500" />
                  <span className="text-zinc-200 text-[11px] font-medium truncate max-w-[140px]">{post.locationName}</span>
               </div>
            )}
        </div>

        {/* --- Menu --- */}
        {isActive && !isEditing && (
          <div className="absolute top-4 right-4 z-20 pointer-events-auto">
            <button onClick={toggleMenu} className="w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full text-white border border-white/10 shadow-lg">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-40 bg-[#121212] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-30">
                  {isOwner ? (
                    <>
                      <button onClick={handlers.handleEditClick} className="w-full text-left px-4 py-3 text-[13px] text-zinc-200 hover:bg-white/10 flex items-center gap-2"><Edit2 className="w-4 h-4 text-zinc-400"/> Chỉnh sửa</button>
                      <button onClick={handlers.handleDelete} className="w-full text-left px-4 py-3 text-[13px] text-red-400 hover:bg-white/5 flex items-center gap-2 border-t border-white/5"><Trash2 className="w-4 h-4"/> Xóa bài</button>
                    </>
                  ) : (
                    <button onClick={handlers.handleReport} className="w-full text-left px-4 py-3 text-[13px] text-zinc-200 hover:bg-white/10 flex items-center gap-2"><Flag className="w-4 h-4 text-zinc-400"/> Báo cáo</button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* --- Caption + Avatar (Hiệu ứng kính mờ) --- */}
        <div className="absolute bottom-0 inset-x-0 p-4 z-20">
          <div className={cn(
            // [THAY ĐỔI Ở ĐÂY]
            // bg-black/60: Nền đen trong suốt 60%
            // backdrop-blur-md: Làm mờ background phía sau
            // border-white/15: Viền sáng nhẹ
            "bg-black/50 backdrop-blur-md border border-white/15 transition-all origin-bottom-left shadow-xl", 
            
            isEditing ? "w-full rounded-2xl px-4 py-3" : "w-fit max-w-[95%] rounded-full p-1.5 pr-5"
          )}>
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <textarea value={editCaption} onChange={(e) => setEditCaption(e.target.value)} className="bg-transparent text-white border-none outline-none text-sm w-full resize-none min-h-[50px]" autoFocus />
                <div className="flex justify-end gap-2 border-t border-white/10 pt-2">
                    <button onClick={handlers.handleCancelEdit} className="px-3 py-1 text-zinc-400 text-xs hover:text-white">Hủy</button>
                    <button onClick={handlers.handleSaveEdit} disabled={isSaving} className="px-3 py-1 bg-white text-black text-xs font-bold rounded hover:bg-zinc-200">Lưu</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                  {/* Avatar User */}
                  <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-black/30 shadow-sm">
                      <img 
                          src={post.user.avatar} 
                          alt={post.user.name} 
                          className="w-full h-full object-cover" 
                      />
                  </div>
                  
                  {/* Nội dung Caption */}
                  {/* text-shadow-sm: Giúp chữ dễ đọc hơn trên nền kính */}
                  <p className="text-white/95 text-[13px] font-medium leading-relaxed break-words min-w-0 pr-1 drop-shadow-sm">
                      {getDisplayCaption(post.caption)}
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