import React, { useEffect, useState, useRef, useMemo } from 'react';
import { JourneyPostCard } from './JourneyPostCard';
import { FeedAdCard } from './FeedAdCard';
import { Send, SmilePlus, Activity, ChevronUp, ChevronDown } from 'lucide-react';
import { FeedItem, PostProps, AdProps } from '../types';
import { cn } from '@/lib/utils';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTheme } from '@/contexts/ThemeContext';
import { feedService } from '../services/feed.service'; 
import { chatService } from '@/modules/chat/services/chat.service'; 
import { useAuth } from '@/modules/auth/store/AuthContext'; 
import { ActivityModal } from './ActivityModal'; 
import { toast } from 'react-hot-toast'; 

interface LocketFeedProps {
  posts: FeedItem[];
}

const QUICK_REACTIONS = ['❤️', '🔥', '😂', '😮', '🥺'];

export const LocketFeedViewer: React.FC<LocketFeedProps> = ({ posts }) => {
  const { theme } = useTheme();
  const { user: currentUser } = useAuth(); 

  const [activePostId, setActivePostId] = useState<string | null>(posts[0]?.id || null);
  
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  
  const pickerRef = useRef<HTMLDivElement>(null);
  const headerTarget = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeItem = posts.find(p => p.id === activePostId) || posts[0];
  const activePost = activeItem?.type === 'POST' ? (activeItem as PostProps) : null;
  const isOwner = activePost?.userId === currentUser?.id || activePost?.user?.id === currentUser?.id;

  // [MỚI] Trích xuất danh sách Avatar của những người đã tương tác
  const interactorsAvatars = useMemo(() => {
      if (!activePost) return [];
      const users: any[] = [];
      
      // Lấy từ các trường tương tác có thể được API trả về
      if ((activePost as any).recentInteractors) users.push(...(activePost as any).recentInteractors);
      if ((activePost as any).reactions) users.push(...(activePost as any).reactions.map((r: any) => r.user));
      if ((activePost as any).comments) users.push(...(activePost as any).comments.map((c: any) => c.user));

      const unique = new Set<string>();
      const avatars: string[] = [];
      
      users.forEach(u => {
          // Chỉ lấy Avatar hợp lệ và loại trừ chính chủ (currentUser)
          if (u && u.avatar && !unique.has(u.avatar) && String(u.id) !== String(currentUser?.id)) {
              unique.add(u.avatar);
              avatars.push(u.avatar);
          }
      });
      
      return avatars.slice(0, 3); // Lấy tối đa 3 người
  }, [activePost, currentUser]);

  const totalInteractions = (activePost?.reactionCount || 0) + (activePost?.commentCount || 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const postId = entry.target.getAttribute('data-post-id');
          if (postId) setActivePostId(postId);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.6 });

    const elements = document.querySelectorAll('.snap-post-container');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [posts]);

  const handleScroll = (direction: 'up' | 'down') => {
    if (scrollContainerRef.current) {
      const height = scrollContainerRef.current.clientHeight;
      scrollContainerRef.current.scrollBy({
        top: direction === 'up' ? -height : height,
        behavior: 'smooth'
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activePost || !activePost.userId) return;
    setIsSending(true);
    try {
      const targetUserId = activePost.userId || activePost.user?.id;
      
      if (targetUserId) {
         await chatService.sharePostToChat(
            targetUserId, 
            activePost.id, 
            activePost.image, 
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
    if (!activePostId || !activePost) return;
    try {
      await feedService.toggleReaction(activePostId, emoji);
    } catch (error) {
      console.error("Lỗi thả cảm xúc", error);
    }
  };

  const handleSelectEmoji = (emojiData: any) => {
    handleReact(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  if (!posts || posts.length === 0) return null;

  return (
    <div className="relative w-full h-full bg-white dark:bg-[#121212] flex flex-col font-sans transition-colors duration-300 overflow-hidden">
      
      {/* NÚT ĐIỀU HƯỚNG BÀI VIẾT */}
      <div className="hidden md:flex flex-col gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-40">
        <button 
          onClick={() => handleScroll('up')}
          className="w-11 h-11 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5 shadow-md transition-all active:scale-95"
          title="Bài trước"
        >
          <ChevronUp className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <button 
          onClick={() => handleScroll('down')}
          className="w-11 h-11 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5 shadow-md transition-all active:scale-95"
          title="Bài tiếp theo"
        >
          <ChevronDown className="w-6 h-6" strokeWidth={2.5} />
        </button>
      </div>

      <div className="absolute top-0 left-0 w-full z-20 pt-16 md:pt-6 pb-2 pointer-events-none">
        <div ref={headerTarget}></div>
      </div>

      {/* DANH SÁCH BÀI VIẾT (Kéo cuộn) */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 w-full h-full overflow-y-scroll snap-y snap-mandatory relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {posts.map((item, index) => {
          const isAd = item.type === 'INTERNAL_AD' || item.type === 'AFFILIATE_AD';
          const key = isAd ? `ad-${item.id}-${index}` : `post-${item.id}`;

          return (
            <div 
              key={key} 
              data-post-id={item.id} 
              className="snap-post-container snap-always snap-center h-full w-full flex flex-col items-center justify-center shrink-0 px-4 pt-24 pb-12 md:pb-20"
            >
              <div className="w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px] relative transition-all duration-300">
                {isAd ? (
                  <FeedAdCard ad={item as AdProps} />
                ) : (
                  <JourneyPostCard post={item as PostProps} isActive={activePostId === item.id} headerTarget={headerTarget.current} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* THANH CÔNG CỤ TƯƠNG TÁC DƯỚI CÙNG */}
      {activePost && (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white/90 dark:from-[#121212] dark:via-[#121212]/90 to-transparent pt-8 pb-2 md:pt-20 md:pb-6 px-4 z-30 pointer-events-none transition-all duration-300">
          <div className="w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px] mx-auto flex flex-col gap-3 pointer-events-auto relative">
              
              {isOwner ? (
                // [ĐÃ SỬA] Nút Xem hoạt động được làm mới với Avatar Stack
                <button 
                  onClick={() => setIsActivityModalOpen(true)}
                  className="w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full py-2.5 px-4 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-zinc-900 dark:text-white active:scale-95 transition-transform"
                >
                  <div className="flex items-center gap-3">
                      <span className="text-[15px] font-extrabold tracking-wide">Hoạt động bài viết</span>
                  </div>

                  <div className="flex items-center gap-2">
                      {interactorsAvatars.length > 0 && (
                          <div className="flex -space-x-2.5">
                              {interactorsAvatars.map((avatar, idx) => (
                                  <img 
                                      key={idx} 
                                      src={avatar} 
                                      className="w-8 h-8 rounded-full border-[2.5px] border-white dark:border-[#18181b] object-cover bg-zinc-200 shadow-sm" 
                                      alt="user" 
                                  />
                              ))}
                          </div>
                      )}
                      
                      {totalInteractions > 0 ? (
                          <span className="text-[13px] font-bold text-zinc-500 dark:text-zinc-400 pr-1 pl-1">
                              {totalInteractions}
                          </span>
                      ) : (
                          <span className="text-[13px] font-semibold text-zinc-400 pr-1">Chưa có</span>
                      )}
                  </div>
                </button>
              ) : (
                <>
                  {showEmojiPicker && (
                    <div ref={pickerRef} className="absolute bottom-full left-0 mb-3 z-40 animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-2xl rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10">
                      <EmojiPicker theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT} onEmojiClick={handleSelectEmoji} lazyLoadEmojis={true} searchDisabled={true} skinTonesDisabled={true} height={350} />
                    </div>
                  )}

                  <div className="flex-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-300 dark:border-white/20 rounded-full pl-3 pr-2 py-2 flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-colors gap-2">
                    <button 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                      className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                        <SmilePlus className="w-6 h-6" />
                    </button>

                    <input
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Gửi tin nhắn riêng..." 
                      className="bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-white/60 outline-none w-full text-[15px] font-medium"
                      style={{ fontFamily: '"Jua", sans-serif' }}
                    />

                    {message.trim() ? (
                      <button 
                        onClick={handleSendMessage} 
                        disabled={isSending}
                        className="w-10 h-10 bg-zinc-900 text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center transition-transform active:scale-90 shrink-0 shadow-sm"
                      >
                        <Send className="w-4 h-4 ml-0.5" />
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
                </>
              )}

          </div>
        </div>
      )}
      
      {isActivityModalOpen && activePostId && activePost && (
        <ActivityModal 
          isOpen={isActivityModalOpen} 
          onClose={() => setIsActivityModalOpen(false)} 
          postId={activePostId} 
        />
      )}

    </div>
  );
};