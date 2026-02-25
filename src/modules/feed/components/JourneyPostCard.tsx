import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  MoreHorizontal, Trash2, Edit2, Flag, 
  MapPin, MessageCircle, Share2, SmilePlus, Sparkles 
} from 'lucide-react';
import { ReportModal } from '@/modules/report/components/ReportModal';
import { ReportTargetType } from '@/modules/report/services/report.service';
import { usePostCardLogic } from '../hooks/usePostCardLogic';
import { usePostReaction } from '../hooks/usePostReaction';
import { PostProps, Emotion } from '../types'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EmojiPicker, { Theme } from 'emoji-picker-react';

// --- CÁC COMPONENT CON ---
import { ActivityModal } from './ActivityModal';
import { PostComments } from './PostComments'; 
import { ShareModal } from './ShareModal'; // [THÊM MỚI] Import ShareModal

// --- CONFIG EMOJI CHUẨN ---
const EMOTION_EMOJIS: Record<string, string> = {
  [Emotion.EXCITED]:   '🤩',
  [Emotion.NORMAL]:    '🙂',
  [Emotion.TIRED]:     '😫',
  [Emotion.HOPELESS]:  '😞',
  'DEFAULT':           '✨',
};

interface JourneyPostCardProps {
  post: PostProps;
  isActive: boolean;
  onDelete?: (postId: string) => void;
  onUpdate?: (postId: string, newCaption: string) => void;
}

export const JourneyPostCard = ({ post, isActive, onDelete, onUpdate }: JourneyPostCardProps) => {
  // 1. Hook quản lý logic bài viết (Sửa, Xóa, Báo cáo)
  const { 
    isOwner, showMenu, setShowMenu, toggleMenu,
    showReportModal, setShowReportModal,
    isEditing, editCaption, setEditCaption, isSaving, handlers
  } = usePostCardLogic({ post, onDelete, onUpdate });

  // 2. Hook quản lý logic Thả cảm xúc
  const { 
    localReactionCount, showEmojiPicker, pickerRef, 
    handleSelectEmoji, toggleEmojiPicker 
  } = usePostReaction(post.id, post.reactionCount || 0, post.isLiked);

  // 3. State quản lý các Modal & Mở rộng UI
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // [THÊM MỚI] State cho ShareModal
  
  const emoji = EMOTION_EMOJIS[post.emotion] || EMOTION_EMOJIS['DEFAULT'];

  return (
    <div className="w-full mb-6 relative">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-zinc-800">
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-zinc-100 leading-none">
              {post.user.name}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-zinc-500">{post.timestamp}</span>
              {post.locationName && (
                <>
                  <span className="text-zinc-600 text-[10px]">•</span>
                  <div className="flex items-center gap-0.5 text-zinc-400">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs truncate max-w-[120px]">{post.locationName}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menu 3 chấm */}
        <div className="relative">
          <button onClick={toggleMenu} className="p-2 hover:bg-zinc-800/50 rounded-full transition-colors text-zinc-400">
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-40 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden py-1 z-30">
                {isOwner ? (
                  <>
                    <button onClick={handlers.handleEditClick} className="w-full text-left px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-800 flex items-center gap-2">
                      <Edit2 className="w-4 h-4 text-zinc-400"/> Chỉnh sửa
                    </button>
                    <button onClick={handlers.handleDelete} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800 flex items-center gap-2 border-t border-zinc-800">
                      <Trash2 className="w-4 h-4"/> Xóa bài
                    </button>
                  </>
                ) : (
                  <button onClick={handlers.handleReport} className="w-full text-left px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-800 flex items-center gap-2">
                    <Flag className="w-4 h-4 text-zinc-400"/> Báo cáo
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- CAPTION --- */}
      <div className="px-2 pb-3">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea 
              value={editCaption} 
              onChange={(e) => setEditCaption(e.target.value)} 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-zinc-500 resize-none min-h-[80px]" 
              autoFocus 
            />
            <div className="flex justify-end gap-2">
              <button onClick={handlers.handleCancelEdit} className="px-3 py-1.5 text-zinc-400 text-xs font-medium hover:text-white transition-colors">Hủy</button>
              <button onClick={handlers.handleSaveEdit} disabled={isSaving} className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-md hover:bg-zinc-200 transition-colors">Lưu</button>
            </div>
          </div>
        ) : (
          <p className="text-[14px] text-zinc-200 leading-relaxed whitespace-pre-line">
            {post.caption ? (
               typeof post.caption === 'string' ? post.caption : (post.caption as any).caption || ''
            ) : (
               <span className="italic text-zinc-500 text-xs">Không có ghi chú...</span>
            )}
          </p>
        )}
      </div>

      {/* --- IMAGE BACKGROUND BLUR --- */}
      <div className="w-full relative overflow-hidden rounded-xl bg-zinc-900/50 flex items-center justify-center max-h-[650px]">
        <div 
          className="absolute inset-0 -z-10 bg-cover bg-center blur-2xl scale-110 opacity-60 saturate-150"
          style={{ backgroundImage: `url(${post.image})` }}
          aria-hidden="true" 
        />
        <img 
          src={post.image} 
          alt="Post content" 
          className="relative z-10 w-auto h-auto max-w-full max-h-[650px] object-contain shadow-sm" 
          draggable={false} 
        />
      </div>

      {/* --- FOOTER: Actions & Stats --- */}
      <div className="px-2 py-4 flex items-center justify-between relative">
        
        {/* Left Actions */}
        <div className="flex items-center gap-5 relative">
          
          {/* TRƯỜNG HỢP LÀ CHỦ BÀI VIẾT: Hiện nút Xem Tương tác (Ngôi sao) */}
          {isOwner ? (
            <button 
              onClick={() => setIsActivityModalOpen(true)}
              className="flex items-center gap-1.5 group transition-transform active:scale-95"
              title="Xem tương tác"
            >
              <Sparkles className={cn(
                "w-6 h-6 transition-all", 
                localReactionCount > 0 
                  ? "text-yellow-500 fill-yellow-500/20" 
                  : "text-zinc-400 group-hover:text-yellow-500" 
              )} />
              {localReactionCount > 0 && (
                <span className="text-sm font-semibold text-yellow-500">
                  {localReactionCount}
                </span>
              )}
            </button>
          ) : (
            /* TRƯỜNG HỢP LÀ NGƯỜI XEM: Hiện nút Thả Emoji */
            <>
              {showEmojiPicker && (
                <div 
                  ref={pickerRef}
                  className="absolute bottom-full left-0 mb-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-2xl rounded-xl"
                >
                  <EmojiPicker 
                    theme={Theme.DARK} 
                    onEmojiClick={handleSelectEmoji} 
                    lazyLoadEmojis={true} 
                    searchDisabled={true} 
                    skinTonesDisabled={true} 
                    height={350} 
                  />
                </div>
              )}
              <button 
                onClick={toggleEmojiPicker}
                className="flex items-center gap-1.5 group transition-transform active:scale-90"
              >
                <SmilePlus className={cn(
                  "w-6 h-6 transition-colors", 
                  localReactionCount > 0 ? "text-yellow-500" : "text-zinc-400 group-hover:text-yellow-500"
                )} />
                {localReactionCount > 0 && (
                  <span className={cn("text-sm font-medium", localReactionCount > 0 ? "text-yellow-500" : "text-zinc-400")}>
                    {localReactionCount}
                  </span>
                )}
              </button>
            </>
          )}
          
          {/* Nút bật/tắt bình luận */}
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 group active:scale-95 transition-transform"
          >
            <MessageCircle className={cn(
              "w-6 h-6 transition-colors", 
              showComments ? "text-blue-500" : "text-zinc-400 group-hover:text-blue-500"
            )} />
            {post.commentCount > 0 && (
              <span className={cn(
                "text-sm font-medium", 
                showComments ? "text-blue-500" : "text-zinc-400"
              )}>
                {post.commentCount}
              </span>
            )}
          </button>

          {/* Nút Chia sẻ (Share) -> Mở ShareModal */}
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="group active:scale-95 transition-transform"
          >
            <Share2 className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Right Info: Activity / Emotion */}
        <div className="flex items-center gap-2">
           <span className="text-xl leading-none">{emoji}</span>
           {(post.activityName || post.taskName) && (
             <span className="text-[11px] font-medium text-zinc-400">
               {post.activityName || post.taskName}
             </span>
           )}
        </div>
      </div>

      <div className="w-full h-px bg-zinc-800/60 mt-2" />

      {/* --- KHUNG BÌNH LUẬN INLINE --- */}
      {showComments && (
        <PostComments 
          postId={post.id} 
          onClose={() => setShowComments(false)}
        />
      )}

      {/* --- CÁC MODAL CỦA POST --- */}
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} targetId={post.id} targetType={ReportTargetType.CHECKIN} />
      
      {isActivityModalOpen && (
        <ActivityModal 
          isOpen={isActivityModalOpen} 
          onClose={() => setIsActivityModalOpen(false)} 
          postId={post.id}
        />
      )}

      {/* [THÊM MỚI]: Share Modal */}
      {isShareModalOpen && (
        <ShareModal 
          isOpen={isShareModalOpen} 
          onClose={() => setIsShareModalOpen(false)} 
          postId={post.id} 
          postImage={post.image} // <--- THÊM DÒNG NÀY ĐỂ TRUYỀN ẢNH XUỐNG
        />
      )}

    </div>
  );
};