import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MoreHorizontal, Trash2, Edit2, Flag, 
  MapPin, Share2, Bookmark, BookmarkCheck, Clock,
  Send, Activity, SmilePlus, Loader2
} from 'lucide-react';
import { ReportModal } from '@/modules/report/components/ReportModal';
import { ReportTargetType } from '@/modules/report/services/report.service';
import { usePostCardLogic } from '../hooks/usePostCardLogic';
import { PostProps } from '../types'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/ThemeContext'; 

import EmojiPicker, { Theme } from 'emoji-picker-react';
import { checkinService } from '@/modules/checkin/services/checkin.service';
import { feedService } from '../services/feed.service'; 
import { chatService } from '@/modules/chat/services/chat.service'; 
import { ActivityModal } from './ActivityModal';
import { ShareModal } from './ShareModal'; 
import { LivePhotoViewer } from '@/components/ui/LivePhotoViewer';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface DetailPostCardProps {
  post: PostProps & { videoUrl?: string }; 
  isActive: boolean;
  headerTarget?: HTMLDivElement | null; 
  onDelete?: (postId: string) => void;
  onUpdate?: (postId: string, newCaption: string) => void;
}

const QUICK_REACTIONS = ['❤️', '🔥', '😂', '😮', '🥺'];

// Dùng chung bảng màu tùy theo cảm xúc (Mood)
const getMoodColorTheme = (emotion?: string) => {
    switch (emotion?.toUpperCase()) {
        case 'EXCITED':
        case 'HAPPY':
            return { overlay: 'from-amber-500/40 via-orange-500/20 to-transparent', tagBg: 'bg-orange-500/80', tagBorder: 'border-orange-300/50', shadow: 'shadow-orange-500/50' };
        case 'SAD':
        case 'HOPELESS':
            return { overlay: 'from-blue-600/40 via-indigo-800/20 to-transparent', tagBg: 'bg-blue-600/80', tagBorder: 'border-blue-400/50', shadow: 'shadow-blue-500/50' };
        case 'ANGRY':
            return { overlay: 'from-red-600/40 via-rose-700/20 to-transparent', tagBg: 'bg-red-600/80', tagBorder: 'border-red-400/50', shadow: 'shadow-red-500/50' };
        case 'TIRED':
            return { overlay: 'from-gray-600/40 via-slate-700/20 to-transparent', tagBg: 'bg-gray-600/80', tagBorder: 'border-gray-400/50', shadow: 'shadow-gray-500/50' };
        case 'NORMAL':
        default:
            return { overlay: 'from-black/60 via-black/20 to-transparent', tagBg: 'bg-black/60', tagBorder: 'border-white/20', shadow: 'shadow-black/50' };
    }
};

export const DetailPostCard = ({ post, isActive, onDelete, onUpdate }: DetailPostCardProps) => {
  const { theme } = useTheme(); 

  const { 
    isOwner, showMenu, setShowMenu, toggleMenu,
    showReportModal, setShowReportModal,
    isEditing, editCaption, setEditCaption, isSaving, handlers
  } = usePostCardLogic({ post, onDelete, onUpdate });

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); 
  const [isSaved, setIsSaved] = useState(post.isSaved || false);

  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsSaved(post.isSaved || false);
  }, [post.isSaved]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleSave = async () => {
    const newSavedStatus = !isSaved;
    setIsSaved(newSavedStatus);
    post.isSaved = newSavedStatus; 
    setShowMenu(false); 
    try {
      await checkinService.toggleSave(post.id);
    } catch (error) {
      setIsSaved(!newSavedStatus);
      post.isSaved = !newSavedStatus;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;
    setIsSending(true);
    try {
      const targetUserId = post.userId || post.user?.id;
      if (targetUserId) {
         await chatService.sharePostToChat(
            targetUserId, 
            post.id, 
            post.image, 
            message 
         );
         setMessage('');
         toast.success("Đã gửi tin nhắn riêng");
      }
    } catch (error) {
      console.error("Lỗi gửi tin nhắn", error);
      toast.error("Không thể gửi tin nhắn");
    } finally {
      setIsSending(false);
    }
  };

  const handleReact = async (emoji: string) => {
    try {
      await feedService.toggleReaction(post.id, emoji);
      toast.success("Đã gửi cảm xúc!");
    } catch (error) {
      console.error("Lỗi thả cảm xúc", error);
    }
  };

  const handleSelectEmoji = (emojiData: any) => {
    handleReact(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Logic Render thẻ hiển thị (Caption, Location, Spotify...) giống Feed
  const renderDisplayTag = () => {
    const displayTag = (post as any).displayTag || 'NONE';
    const spotifyTrackId = (post as any).spotifyTrackId;
    const captionText = typeof post.caption === 'string' ? post.caption : (post.caption as any)?.caption || '';
    
    const moodTheme = getMoodColorTheme(post.emotion);

    if (isEditing) {
      return (
        <div className="flex flex-col gap-2 bg-black/60 backdrop-blur-lg rounded-2xl p-3 border border-white/10 w-[300px] pointer-events-auto animate-in zoom-in duration-200">
          <textarea value={editCaption} onChange={(e) => setEditCaption(e.target.value)} className="w-full bg-transparent p-0 text-sm text-white placeholder:text-white/50 focus:outline-none resize-none min-h-[60px]" placeholder="Viết ghi chú..." autoFocus />
          <div className="flex justify-end gap-1.5 pt-1">
            <button onClick={handlers.handleCancelEdit} className="px-3 py-1 text-white/80 text-xs font-medium hover:text-white transition-colors">Hủy</button>
            <button onClick={handlers.handleSaveEdit} disabled={isSaving} className="px-3 py-1 bg-white text-black text-xs font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">Lưu</button>
          </div>
        </div>
      );
    }

    const baseTagClass = cn(
        "backdrop-blur-xl px-5 py-3 rounded-[20px] text-white shadow-2xl border flex items-center gap-2 max-w-[85%] pointer-events-auto animate-in zoom-in duration-300",
        moodTheme.tagBg,
        moodTheme.tagBorder,
        moodTheme.shadow
    );

    switch (displayTag) {
      case 'CAPTION':
        if (!captionText) return null;
        return (
          <div className={cn(baseTagClass, "text-center")}>
            <p className="text-[14px] font-medium leading-relaxed whitespace-pre-line line-clamp-3">
              {captionText}
            </p>
          </div>
        );
      case 'LOCATION':
        if (!post.locationName) return null;
        return (
          <div className={baseTagClass}>
            <MapPin className="w-4 h-4 shrink-0 drop-shadow-md" strokeWidth={2.5} />
            <span className="text-[13px] font-bold tracking-wide truncate max-w-[200px] drop-shadow-md">{post.locationName}</span>
          </div>
        );
      case 'ACTIVITY':
        if (!post.activityName) return null;
        return (
          <div className={baseTagClass}>
            <Activity className="w-4 h-4 shrink-0 drop-shadow-md" strokeWidth={2.5} />
            <span className="text-[13px] font-bold tracking-wide truncate max-w-[200px] drop-shadow-md">{post.activityName}</span>
          </div>
        );
      case 'TIME':
        return (
          <div className={baseTagClass}>
            <Clock className="w-4 h-4 shrink-0 drop-shadow-md" strokeWidth={2.5} />
            <span className="text-[13px] font-bold tracking-widest drop-shadow-md">{post.timestamp}</span>
          </div>
        );
      case 'SPOTIFY':
        if (!spotifyTrackId) return null;
        return (
          <div className="w-[300px] h-[80px] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-zinc-900 pointer-events-auto animate-in zoom-in duration-300">
            <iframe
              src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0`}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-2xl"
            />
          </div>
        );
      case 'NONE':
      default:
        if (captionText) {
          return (
            <div className="bg-black/40 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/10 shadow-inner pointer-events-auto animate-in zoom-in duration-300">
              <p className="text-[14px] text-white font-medium leading-relaxed whitespace-pre-line line-clamp-3">
                {captionText}
              </p>
            </div>
          );
        }
        return null;
    }
  };

  const HeaderContent = (
    <div className="w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px] mx-auto flex flex-col pointer-events-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-white/20 shadow-lg">
            <AvatarImage src={post.user?.avatar || (post as any).userAvatar} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none hover:underline cursor-pointer tracking-tight">
              {post.user?.name || (post as any).userFullName || "Người dùng"}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[12px] font-medium text-white/90 drop-shadow-md">{post.timestamp}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button onClick={toggleMenu} className="p-2 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-colors">
            <MoreHorizontal className="w-5 h-5 drop-shadow-md" />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden py-1 z-30 animate-in fade-in zoom-in-95 origin-top-right">
                <button onClick={() => { setIsShareModalOpen(true); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors">
                  <Share2 className="w-4 h-4 text-zinc-500"/> Chia sẻ
                </button>
                <button onClick={handleToggleSave} className="w-full text-left px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors">
                  {isSaved ? <><BookmarkCheck className="w-4 h-4 text-primary"/> Bỏ lưu bài</> : <><Bookmark className="w-4 h-4 text-zinc-500"/> Lưu bài viết</>}
                </button>
                {isOwner ? (
                  <>
                    <button onClick={handlers.handleEditClick} className="w-full text-left px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors">
                      <Edit2 className="w-4 h-4 text-zinc-500"/> Chỉnh sửa
                    </button>
                    <button onClick={handlers.handleDelete} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 border-t border-zinc-100 dark:border-white/5 transition-colors">
                      <Trash2 className="w-4 h-4"/> Xóa bài
                    </button>
                  </>
                ) : (
                  <button onClick={handlers.handleReport} className="w-full text-left px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 border-t border-zinc-100 dark:border-white/5 transition-colors">
                    <Flag className="w-4 h-4 text-zinc-500"/> Báo cáo
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full relative flex flex-col">

      {/* ẢNH CHÍNH & OVERLAY */}
      <div className="relative w-full aspect-square z-10">
        
        {/* Lớp nền phát sáng khi có ảnh */}
        {isActive && post.image && (
          <div 
            className="absolute inset-0 -z-10 opacity-40 dark:opacity-[0.65] blur-[80px] md:blur-[60px] scale-110 md:scale-100 transition-all duration-700 ease-in-out rounded-[28px]"
            style={{
              backgroundImage: `url(${post.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        )}

        <div className="absolute inset-0 rounded-[32px] overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-200/50 dark:border-white/10">
          <LivePhotoViewer imageUrl={post.image} videoUrl={post.videoUrl} className="w-full h-full object-cover" />
          {/* Gradient trên và dưới để chữ luôn dễ đọc */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none opacity-80" />
        </div>

        {/* HEADER ĐƯỢC ĐƯA LÊN ĐẦU BÀI ĐĂNG (Nằm trong ảnh) */}
        <div className="absolute top-4 left-0 right-0 z-30 pointer-events-none px-4">
           {HeaderContent}
        </div>

        {/* THẺ TAG HIỂN THỊ (GÓC DƯỚI BÊN TRÁI) */}
        <div className="absolute bottom-4 left-4 right-12 z-20 pointer-events-none flex flex-col gap-2 items-start">
           {renderDisplayTag()}
        </div>
      </div>

      {/* CHÂN BÀI ĐĂNG DÀNH RIÊNG CHO MODAL (Thanh chat / Tương tác) */}
      <div className="mt-3.5 px-1 w-full z-10 pointer-events-auto relative">
        {isOwner ? (
          <button 
            onClick={() => setIsActivityModalOpen(true)}
            className="w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-300 dark:border-white/20 rounded-full py-3.5 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] gap-2 text-zinc-900 dark:text-white font-bold active:scale-95 transition-transform"
          >
            <Activity className="w-5 h-5 text-blue-500" />
            Xem hoạt động bài viết
          </button>
        ) : (
          <div className="relative flex flex-col w-full">
            {showEmojiPicker && (
              <div ref={pickerRef} className="absolute bottom-[calc(100%+12px)] left-0 z-40 animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-2xl rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10">
                <EmojiPicker theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT} onEmojiClick={handleSelectEmoji} lazyLoadEmojis={true} searchDisabled={true} skinTonesDisabled={true} height={350} />
              </div>
            )}

            <div className="w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-300 dark:border-white/20 rounded-full pl-3 pr-2 py-2 flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-colors gap-2">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors shrink-0"
              >
                  <SmilePlus className="w-6 h-6" />
              </button>

              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Nhắn cho ${post.user?.name?.split(' ')[0] || "người dùng"}...`}
                className="bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-white/60 outline-none w-full text-[15px] font-medium"
                style={{ fontFamily: '"Jua", sans-serif' }}
              />

              {message.trim() ? (
                <button 
                  onClick={handleSendMessage} 
                  disabled={isSending}
                  className="w-10 h-10 bg-zinc-900 text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center transition-transform active:scale-90 shrink-0 shadow-sm"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                </button>
              ) : (
                <div className="flex items-center gap-1 shrink-0 border-l border-zinc-300 dark:border-white/20 pl-2">
                  {QUICK_REACTIONS.map(em => (
                    <button 
                      key={em} 
                      onClick={() => handleReact(em)} 
                      className="text-[20px] hover:scale-125 hover:-translate-y-1 transition-all active:scale-90 leading-none p-1"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Các Modal Hỗ trợ */}
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} targetId={post.id} targetType={ReportTargetType.CHECKIN} />
      {isActivityModalOpen && <ActivityModal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} postId={post.id} />}
      {isShareModalOpen && <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} postId={post.id} postImage={post.image} />}
    </div>
  );
};