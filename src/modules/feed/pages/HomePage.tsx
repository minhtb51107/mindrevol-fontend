import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import MainLayout from '@/components/layout/MainLayout';
import { JourneyPostCard, PostProps } from '../components/JourneyPostCard';
import { ActivityModal } from '../components/ActivityModal'; // Import ActivityModal
import { 
  Camera, Send, Smile, Loader2, Map as MapIcon, ChevronDown, LayoutGrid, X, 
  Check, Flame, AlertCircle, XCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { checkinService } from '@/modules/checkin/services/checkin.service';
import { journeyService } from '@/modules/journey/services/journey.service';
import { JourneyResponse } from '@/modules/journey/types';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { chatService } from '@/modules/chat/services/chat.service';
import { feedService } from '../services/feed.service';
import { toast } from 'react-hot-toast';

// --- TYPES ---
type MemberStatus = 'COMPLETED' | 'FAILED' | 'COMEBACK' | 'LATE_SOON' | 'NORMAL' | 'REST';

interface FilterMember {
  id: string | number;
  name: string;
  avatar: string;
  status?: MemberStatus; 
}

// --- COMPONENT: MEMBER ITEM ---
const MemberAvatarItem = ({ 
  member, 
  isSelected, 
  onClick, 
  isMe = false 
}: { 
  member: FilterMember, 
  isSelected: boolean, 
  onClick: () => void, 
  isMe?: boolean 
}) => {
  
  const getStatusColor = (status?: MemberStatus) => {
    switch (status) {
      case 'COMPLETED': return "border-emerald-500";
      case 'COMEBACK': return "border-orange-500";
      case 'FAILED': return "border-red-500";
      case 'LATE_SOON': return "border-yellow-400";
      default: return isSelected ? "border-blue-500" : "border-transparent";
    }
  };

  const borderColor = getStatusColor(member.status);

  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 min-w-[50px] transition-all duration-300", 
        isSelected ? "opacity-100 scale-110" : "opacity-50 hover:opacity-90"
      )}
    >
      <div className="relative">
        <div className={cn(
          "w-11 h-11 rounded-full p-[2px] border-2 transition-all bg-[#121212]",
          borderColor
        )}>
           <img 
             src={member.avatar} 
             alt={member.name} 
             className="w-full h-full rounded-full object-cover bg-zinc-800" 
           />
        </div>
        
        {member.status === 'COMEBACK' && (
            <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-0.5 border border-black animate-pulse">
                <Flame className="w-2.5 h-2.5 text-white fill-white" />
            </div>
        )}
      </div>
      
      <span className={cn(
        "text-[10px] font-medium text-white shadow-black drop-shadow-md truncate max-w-[60px]",
        isSelected ? "text-white" : "text-zinc-400"
      )}>
        {isMe ? "Tôi" : member.name}
      </span>
    </button>
  );
};

// --- MAIN PAGE ---
const HomePage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATE ---
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [members, setMembers] = useState<FilterMember[]>([]); 
  const [journeys, setJourneys] = useState<JourneyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); 
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const [showJourneySelector, setShowJourneySelector] = useState(false);

  // Modal & Input
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Drag Scroll State
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const userAvatar = useMemo(() => {
      if (!user) return '';
      return (user as any).avatar || (user as any).avatarUrl || `https://ui-avatars.com/api/?name=${user.fullname}`;
  }, [user]);

  // 1. INIT DATA & SYNC URL
  useEffect(() => {
    const initData = async () => {
      try {
        const myJourneys = await journeyService.getMyJourneys();
        setJourneys(myJourneys);
        
        const urlJourneyId = searchParams.get('journeyId');
        const isValidJourney = urlJourneyId && myJourneys.some(j => j.id === urlJourneyId);

        if (isValidJourney) {
           setSelectedJourneyId(urlJourneyId);
        } else if (myJourneys.length > 0) {
           const defaultId = myJourneys[0].id;
           setSelectedJourneyId(defaultId);
           setSearchParams({ journeyId: defaultId }, { replace: true });
        }
      } catch (error) {
        console.error("Failed to init data", error);
      }
    };
    initData();
  }, []); 

  // 2. CHECK ACCESS
  useEffect(() => {
    const urlJourneyId = searchParams.get('journeyId');
    if (!urlJourneyId) return;

    const checkAccess = async () => {
      try {
        await journeyService.getParticipants(urlJourneyId);
      } catch (error: any) {
        if (error.response?.status === 403 || error.response?.status === 400) {
          toast.error("Bạn không còn quyền truy cập hành trình này.");
          const myJourneys = await journeyService.getMyJourneys();
          if (myJourneys.length > 0) {
             const nextId = myJourneys[0].id;
             setSelectedJourneyId(nextId);
             setSearchParams({ journeyId: nextId });
          } else {
             setSearchParams({});
             setSelectedJourneyId(null);
          }
        }
      }
    };
    checkAccess();
  }, [searchParams]);

  // 3. FETCH FEED
  const fetchFeed = async () => {
    const currentId = searchParams.get('journeyId') || selectedJourneyId;
    if (!currentId) return;

    if (posts.length === 0) setIsLoading(true); 
    
    try {
      const rawCheckins = await checkinService.getJourneyFeed(currentId);
      
      const mappedPosts: PostProps[] = rawCheckins.map(c => {
        const rawStatus = (c.status as unknown as string).toUpperCase(); 
        let finalStatus: 'completed' | 'failed' | 'comeback' = 'completed';
        if (rawStatus === 'COMEBACK') finalStatus = 'comeback';
        else if (rawStatus === 'FAILED' || rawStatus === 'FAIL') finalStatus = 'failed';

        return {
          id: c.id,
          userId: c.userId.toString(),
          user: { 
            name: c.userFullName, 
            avatar: c.userAvatar || `https://ui-avatars.com/api/?name=${c.userFullName}` 
          },
          image: c.imageUrl,
          caption: c.caption,
          status: finalStatus,
          taskName: c.taskTitle,
          timestamp: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactionCount: (c as any).reactionCount || 0,
          commentCount: (c as any).commentCount || 0,
          latestReactions: (c as any).latestReactions || [] 
        };
      });

      setPosts(mappedPosts);

      try {
          const participants = await journeyService.getParticipants(currentId);
          const mappedMembers: FilterMember[] = participants.map((p: any) => ({
              id: p.userId,
              name: p.fullname,
              avatar: p.avatarUrl || `https://ui-avatars.com/api/?name=${p.fullname}`,
              status: p.status || 'NORMAL'
          }));
          setMembers(mappedMembers.filter(m => String(m.id) !== String(user?.id)));
      } catch (err) {
          console.error("Failed to fetch participants", err);
          setMembers([]); 
      }

    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlId = searchParams.get('journeyId');
    if (urlId) {
        setSelectedJourneyId(urlId);
        fetchFeed();
    }
  }, [searchParams, user?.id]);

  const handleSelectJourney = (id: string) => {
      setSelectedJourneyId(id);
      setSearchParams({ journeyId: id }); 
      setShowJourneySelector(false);
      setPosts([]); 
      setIsLoading(true);
  };

  const filteredPosts = useMemo(() => {
    if (!selectedUserId) return posts; 
    return posts.filter(p => p.userId === selectedUserId);
  }, [posts, selectedUserId]);

  const activePost = filteredPosts[activeIndex] || null;
  const currentJourneyName = journeys.find(j => j.id === selectedJourneyId)?.name || "Tất cả hành trình";
  
  const isOwner = useMemo(() => {
     return user && activePost && String(user.id) === String(activePost.userId);
  }, [user, activePost]);

  const handlePostDeleted = (deletedPostId: string) => {
    setPosts(prev => prev.filter(p => p.id !== deletedPostId));
    if (activeIndex >= posts.length - 1) setActiveIndex(Math.max(0, posts.length - 2));
  };

  const handlePostUpdated = (postId: string, newCaption: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, caption: newCaption } : p));
  };

  const handleSendReply = async (content?: string) => {
    const messageContent = content || chatInput;
    if (!messageContent.trim() || !activePost) return;
    
    setIsSending(true);
    try {
      const isReaction = !!content;
      const chatPromise = chatService.sendMessage({
        receiverId: parseInt(activePost.userId!),
        content: messageContent,
        metadata: { 
            replyToPostId: activePost.id, 
            replyToImage: activePost.image,
            type: isReaction ? 'REACTION' : 'COMMENT'
        }
      });
      const feedPromise = isReaction
         ? feedService.toggleReaction(activePost.id, messageContent)
         : feedService.postComment(activePost.id, messageContent);
      await Promise.all([chatPromise, feedPromise]);
      setChatInput('');
      setShowEmojiPicker(false);
      await fetchFeed();
    } catch (error) { 
        console.error(error);
    } finally { 
        setIsSending(false); 
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const center = container.scrollLeft + container.offsetWidth / 2;
    let closest = 0;
    let minDiff = Number.MAX_VALUE;
    container.querySelectorAll('.post-card-wrapper').forEach((card, idx) => {
      const htmlCard = card as HTMLElement;
      const diff = Math.abs(center - (htmlCard.offsetLeft + htmlCard.offsetWidth / 2));
      if (diff < minDiff) { minDiff = diff; closest = idx; }
    });
    if (closest !== activeIndex) setActiveIndex(closest);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const onMouseUp = () => setIsDragging(false);
  const onMouseLeave = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  
  const scrollToPost = (index: number) => {
    scrollRef.current?.querySelectorAll('.post-card-wrapper')[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const reactionCount = (activePost?.reactionCount || 0);
  const commentCount = (activePost?.commentCount || 0);
  const totalInteractions = reactionCount + commentCount;

  return (
    <MainLayout>
      <div className="relative h-screen w-full bg-[#121212] flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden">
        
        {/* Background Ambient */}
        <div className="absolute inset-0 z-0 transition-opacity duration-1000">
           {activePost && (
             <img src={activePost.image} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[100px] scale-150" draggable={false}/>
           )}
           <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#121212]/90 to-black" />
        </div>

        {/* --- HEADER --- */}
        <div className="absolute top-4 left-0 right-0 z-30 flex flex-col items-center gap-3 pointer-events-none">
          
          {/* Journey Selector */}
          <div className="relative pointer-events-auto">
            <button onClick={() => setShowJourneySelector(!showJourneySelector)} className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800/60 hover:bg-zinc-700/60 backdrop-blur-xl rounded-full border border-white/10 text-white font-bold text-sm transition-all shadow-lg">
              <MapIcon className="w-4 h-4 text-blue-400" />
              {currentJourneyName}
              <ChevronDown className={`w-4 h-4 transition-transform ${showJourneySelector ? 'rotate-180' : ''}`} />
            </button>
            {showJourneySelector && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                {journeys.map(j => (
                  <button 
                    key={j.id} 
                    onClick={() => handleSelectJourney(j.id)}
                    className={cn("w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2", selectedJourneyId === j.id ? "text-blue-400 bg-blue-500/10" : "text-zinc-300")}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />{j.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Member Filter Bar */}
          <div className="w-full max-w-md px-4 pointer-events-auto">
            <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar py-2">
                <button 
                  onClick={() => setSelectedUserId(null)}
                  className={cn("flex flex-col items-center gap-1 min-w-[50px] transition-all", selectedUserId === null ? "opacity-100 scale-110" : "opacity-50 hover:opacity-80")}
                >
                  <div className={cn("w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all bg-zinc-800", selectedUserId === null ? "border-white" : "border-transparent")}>
                      <LayoutGrid className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-white shadow-black drop-shadow-md">Tất cả</span>
                </button>
                
                <div className="w-[1px] h-6 bg-white/20 self-center" />
                
                {user && (
                    <MemberAvatarItem 
                        member={{ 
                            id: user.id, 
                            name: "Tôi", 
                            avatar: userAvatar,
                            status: 'COMPLETED'
                        }}
                        isSelected={selectedUserId === String(user.id)}
                        onClick={() => setSelectedUserId(String(user.id))}
                        isMe={true}
                    />
                )}

                {members.map(member => (
                    <MemberAvatarItem 
                        key={member.id}
                        member={member}
                        isSelected={selectedUserId === String(member.id)}
                        onClick={() => setSelectedUserId(String(member.id))}
                    />
                ))}
            </div>
          </div>
        </div>

        {/* --- CONTENT ZONE --- */}
        <div className="w-full flex-1 flex flex-col items-center justify-center relative z-10 min-h-0">
            {isLoading && posts.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
            )}

            <div 
              ref={scrollRef} 
              onScroll={handleScroll} 
              onMouseDown={onMouseDown} 
              onMouseLeave={onMouseLeave} 
              onMouseUp={onMouseUp} 
              onMouseMove={onMouseMove} 
              className={cn("w-full max-h-[55vh] flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory py-2", isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-mandatory")}
            >
              {filteredPosts.length > 0 ? (
                <>
                  <div className="min-w-[calc(50vw-45vw)] md:min-w-[calc(50vw-225px)] h-full shrink-0" />
                  {filteredPosts.map((post, index) => (
                    <div key={post.id} className="post-card-wrapper mx-2 md:mx-6 shrink-0" onClick={() => scrollToPost(index)}>
                      <JourneyPostCard 
                          post={post} 
                          isActive={index === activeIndex} 
                          onDelete={handlePostDeleted}
                          onUpdate={handlePostUpdated}
                      />
                    </div>
                  ))}
                  <div className="min-w-[calc(50vw-45vw)] md:min-w-[calc(50vw-225px)] h-full shrink-0" />
                </>
              ) : (
                !isLoading && <div className="w-full text-center text-zinc-500">Không có bài đăng nào.</div>
              )}
            </div>

            {activePost && (
              <div className="flex flex-col items-center mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <h2 className="text-xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {activePost.user.name}
                </h2>
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-300 mt-2 bg-zinc-900/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5">
                  <span className="drop-shadow-md">{activePost.timestamp}</span>
                  {activePost.taskName && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-white/50" />
                      <span className="text-green-400 max-w-[150px] truncate">{activePost.taskName}</span>
                    </>
                  )}
                </div>
              </div>
            )}
        </div>

        {/* --- INPUT AREA & ACTIVITY BUTTON --- */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 w-full max-w-[450px] px-4 transition-all duration-300">
          {activePost && (
              !isOwner ? (
                /* Viewer Mode */
                <div className="relative">
                    {showEmojiPicker && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowEmojiPicker(false)} />
                        <div className="absolute bottom-full left-0 mb-4 z-40 animate-in zoom-in-95 duration-200 shadow-2xl rounded-2xl overflow-hidden border border-white/10">
                            <EmojiPicker onEmojiClick={(e) => setChatInput(prev => prev + e.emoji)} theme={Theme.DARK} width={320} height={350} searchDisabled skinTonesDisabled />
                        </div>
                      </>
                    )}
                    <div className="w-full h-14 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-full flex items-center px-1.5 shadow-2xl transition-all focus-within:bg-black/60 focus-within:border-white/20">
                        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={cn("w-11 h-11 flex items-center justify-center rounded-full transition-all active:scale-95", showEmojiPicker ? "bg-white/10 text-yellow-400" : "text-yellow-400 hover:bg-white/10")}>
                            {showEmojiPicker ? <X className="w-5 h-5 text-zinc-400" /> : <Smile className="w-6 h-6" strokeWidth={2.5} />}
                        </button>
                        <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendReply()} placeholder={`Gửi tin nhắn...`} className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-zinc-500 h-full px-2 font-medium" />
                        <button onClick={() => handleSendReply()} disabled={!chatInput.trim() || isSending} className={cn("w-11 h-11 rounded-full flex items-center justify-center transition-all", chatInput.trim() ? "bg-white text-black hover:scale-105 shadow-lg shadow-white/20" : "bg-white/5 text-zinc-600 cursor-not-allowed")}>
                            {isSending ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5 ml-0.5" strokeWidth={2.5} />}
                        </button>
                    </div>
                </div>
              ) : (
                /* Owner Mode */
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
                    <button onClick={() => setShowActivityModal(true)} className="group flex items-center gap-3 bg-black/40 hover:bg-black/60 backdrop-blur-xl px-5 py-3 rounded-full border border-white/10 transition-all active:scale-95">
                      <div className="flex -space-x-3">
                        {(activePost.latestReactions && activePost.latestReactions.length > 0) ? (
                            activePost.latestReactions.slice(0, 3).map((reaction, index) => (
                              <div key={reaction.id || index} className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-zinc-800 overflow-hidden relative z-0 group-hover:z-10 transition-all">
                                 <img src={reaction.userAvatar || `https://ui-avatars.com/api/?name=${reaction.userFullName}&background=random`} className="w-full h-full object-cover" alt={reaction.userFullName} />
                                 {reaction.emoji && (<div className="absolute bottom-0 right-0 text-[10px] leading-none bg-black/50 rounded-full w-4 h-4 flex items-center justify-center border border-[#1a1a1a]">{reaction.emoji}</div>)}
                              </div>
                            ))
                        ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">?</div>
                        )}
                      </div>
                      <div className="flex flex-col items-start ml-2">
                          <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                            {totalInteractions > 0 ? `${totalInteractions} tương tác` : "Chưa có tương tác"}
                          </span>
                      </div>
                    </button>
                </div>
              )
          )}
        </div>

        {/* [FIX] MODAL ACTIVITY - PHẢI ĐẶT Ở ĐÂY ĐỂ RENDER */}
        {activePost && (
            <ActivityModal 
              isOpen={showActivityModal}
              onClose={() => setShowActivityModal(false)}
              postId={activePost.id}
            />
        )}

      </div>
    </MainLayout>
  );
};

export default HomePage;