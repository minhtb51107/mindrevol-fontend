import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import MainLayout from '@/components/layout/MainLayout';
import { JourneyPostCard, PostProps } from '../components/JourneyPostCard';
import { CheckinModal } from '@/modules/checkin/components/CheckinModal';
import { ActivityModal } from '../components/ActivityModal';
import { Camera, Send, Smile, Loader2, Map as MapIcon, ChevronDown, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { checkinService } from '@/modules/checkin/services/checkin.service';
import { journeyService } from '@/modules/journey/services/journey.service';
import { JourneyResponse } from '@/modules/journey/types';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { chatService } from '@/modules/chat/services/chat.service';
import { feedService } from '../services/feed.service';
import { ReactionDetail } from '../types';

// Định nghĩa type đơn giản cho Member trong filter
interface FilterMember {
    id: string | number;
    name: string;
    avatar: string;
}

const HomePage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
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

  // 1. INIT DATA
  useEffect(() => {
    const initData = async () => {
      try {
        const myJourneys = await journeyService.getMyJourneys();
        setJourneys(myJourneys);
        
        const urlJourneyId = searchParams.get('journeyId');
        if (urlJourneyId && myJourneys.find(j => j.id === urlJourneyId)) {
           setSelectedJourneyId(urlJourneyId);
        } else if (myJourneys.length > 0) {
           setSelectedJourneyId(myJourneys[0].id);
        }
      } catch (error) {
        console.error("Failed to init data", error);
      }
    };
    initData();
  }, [searchParams]);

  // 2. FETCH FEED
  const fetchFeed = async () => {
    if (!selectedJourneyId) return;
    if (posts.length === 0) setIsLoading(true); 
    
    try {
      const rawCheckins = await checkinService.getJourneyFeed(selectedJourneyId);
      
      const mappedPosts: PostProps[] = rawCheckins.map(c => ({
          id: c.id,
          userId: c.userId.toString(),
          user: { 
            name: c.userFullName, 
            avatar: c.userAvatar || `https://ui-avatars.com/api/?name=${c.userFullName}` 
          },
          image: c.imageUrl,
          caption: c.caption,
          status: c.status === 'COMEBACK' ? 'comeback' : c.status === 'FAILED' ? 'failed' : 'completed',
          taskName: c.taskTitle,
          timestamp: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactionCount: (c as any).reactionCount || 0,
          commentCount: (c as any).commentCount || 0,
          latestReactions: (c as any).latestReactions || [] 
      }));
      setPosts(mappedPosts);

      try {
          const participants = await journeyService.getParticipants(selectedJourneyId);
          const mappedMembers: FilterMember[] = participants.map((p) => ({
              id: p.userId,
              name: p.fullname,
              avatar: p.avatarUrl || `https://ui-avatars.com/api/?name=${p.fullname}`
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
    fetchFeed();
  }, [selectedJourneyId, user?.id]);

  const filteredPosts = useMemo(() => {
    if (!selectedUserId) return posts; 
    return posts.filter(p => p.userId === selectedUserId);
  }, [posts, selectedUserId]);

  const activePost = filteredPosts[activeIndex] || null;
  const currentJourneyName = journeys.find(j => j.id === selectedJourneyId)?.name || "Tất cả hành trình";
  
  const isOwner = useMemo(() => {
     return user && activePost && String(user.id) === String(activePost.userId);
  }, [user, activePost]);

  // --- HÀM XỬ LÝ QUAN TRỌNG NHẤT: GỬI CẢ 2 NƠI ---
  const handleSendReply = async (content?: string) => {
    const messageContent = content || chatInput;
    if (!messageContent.trim() || !activePost) return;
    
    setIsSending(true);
    try {
      // Xác định loại tương tác: Nếu có content từ param (emoji click) thì là Reaction, ngược lại là Comment
      const isReaction = !!content;

      // 1. Gửi vào Chat System (Direct Message - Để hiện trong Messenger)
      const chatPromise = chatService.sendMessage({
        receiverId: parseInt(activePost.userId!),
        content: messageContent,
        // Gửi metadata để bên Chat hiển thị reply ảnh nào
        metadata: { 
            replyToPostId: activePost.id, 
            replyToImage: activePost.image,
            type: isReaction ? 'REACTION' : 'COMMENT' // Optional info
        }
      });

      // 2. Gửi vào Feed System (Public Activity - Để hiện lên Modal & Face Pile)
      const feedPromise = isReaction
         ? feedService.toggleReaction(activePost.id, messageContent) // Emoji
         : feedService.postComment(activePost.id, messageContent);   // Text

      // Chạy song song cả hai (User không cần chờ cái này xong mới tới cái kia)
      await Promise.all([chatPromise, feedPromise]);

      // UI Updates
      setChatInput('');
      setShowEmojiPicker(false);
      
      // Refresh feed để cập nhật Face Pile ngay lập tức
      await fetchFeed();

      // alert("Đã gửi!"); // Có thể bỏ alert cho mượt

    } catch (error) { 
        alert("Có lỗi xảy ra khi gửi tương tác"); 
        console.error(error);
    } finally { 
        setIsSending(false); 
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    handleSendReply(emojiData.emoji);
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

  // Drag handlers
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

  const handleCheckinSuccess = () => {
      if (selectedJourneyId) {
          fetchFeed(); 
      }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedJourneyId) { setSelectedFile(file); setIsCheckinModalOpen(true); }
    else if (!selectedJourneyId) alert("Vui lòng chọn một hành trình!");
    e.target.value = ''; 
  };

  return (
    <MainLayout>
      <div className="relative h-screen w-full bg-[#121212] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Blur */}
        <div className="absolute inset-0 z-0 transition-opacity duration-1000">
           {activePost && (
             <img src={activePost.image} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[100px] scale-150" draggable={false}/>
           )}
           <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#121212]/90 to-black" />
        </div>

        {/* HEADER AREA */}
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
                  <button key={j.id} onClick={() => { setSelectedJourneyId(j.id); setShowJourneySelector(false); }} className={cn("w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2", selectedJourneyId === j.id ? "text-blue-400 bg-blue-500/10" : "text-zinc-300")}>
                    <span className="w-2 h-2 rounded-full bg-current" />{j.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Members Filter */}
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
                <div className="w-[1px] h-6 bg-white/20" />
                {user && (
                    <button 
                        onClick={() => setSelectedUserId(String(user.id))}
                        className={cn("flex flex-col items-center gap-1 min-w-[50px] transition-all", selectedUserId === String(user.id) ? "opacity-100 scale-110" : "opacity-50 hover:opacity-80")}
                    >
                        <div className={cn("w-11 h-11 rounded-full p-[2px] border-2 transition-all", selectedUserId === String(user.id) ? "border-blue-500" : "border-transparent")}>
                           <img src={user.avatar} alt="Me" className="w-full h-full rounded-full object-cover bg-zinc-800" />
                        </div>
                        <span className="text-[10px] font-medium text-white shadow-black drop-shadow-md">Tôi</span>
                    </button>
                )}
                {members.map(member => (
                    <button 
                        key={member.id}
                        onClick={() => setSelectedUserId(String(member.id))}
                        className={cn("flex flex-col items-center gap-1 min-w-[50px] transition-all", selectedUserId === String(member.id) ? "opacity-100 scale-110" : "opacity-50 hover:opacity-80")}
                    >
                        <div className={cn("w-11 h-11 rounded-full p-[2px] border-2 transition-all", selectedUserId === String(member.id) ? "border-green-500" : "border-transparent")}>
                           <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover bg-zinc-800" />
                        </div>
                        <span className="text-[10px] font-medium text-white truncate max-w-[60px] shadow-black drop-shadow-md">{member.name}</span>
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Carousel & Content */}
        {isLoading && posts.length === 0 && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
        )}

        {/* Info Overlay */}
        {activePost && (
          <div className="absolute top-48 z-20 flex flex-col items-center pointer-events-none animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-extrabold text-white drop-shadow-md">{activePost.user.name}</h2>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 mt-1">
              <span>{activePost.timestamp}</span>
              {activePost.taskName && <span className="text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full border border-green-500/20">{activePost.taskName}</span>}
            </div>
          </div>
        )}

        {/* Horizontal Carousel */}
        <div 
          ref={scrollRef} 
          onScroll={handleScroll} 
          onMouseDown={onMouseDown} 
          onMouseLeave={onMouseLeave} 
          onMouseUp={onMouseUp} 
          onMouseMove={onMouseMove} 
          className={cn("relative z-10 w-full h-[55vh] flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory pt-10", isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-mandatory")}
        >
          {filteredPosts.length > 0 ? (
            <>
              <div className="min-w-[calc(50vw-45vw)] md:min-w-[calc(50vw-225px)] h-full shrink-0" />
              {filteredPosts.map((post, index) => (
                <div key={post.id} className="post-card-wrapper mx-2 md:mx-6 shrink-0" onClick={() => scrollToPost(index)}>
                  <JourneyPostCard post={post} isActive={index === activeIndex} />
                </div>
              ))}
              <div className="min-w-[calc(50vw-45vw)] md:min-w-[calc(50vw-225px)] h-full shrink-0" />
            </>
          ) : (
            !isLoading && <div className="w-full text-center text-zinc-500 mt-10">Không có bài đăng nào.</div>
          )}
        </div>

        {/* INPUT AREA (Locket Style) */}
        <div className="absolute bottom-6 md:bottom-10 z-20 w-full max-w-[500px] px-4">
          {activePost && (
              !isOwner ? (
                /* Giao diện người xem: Input + Emoji Picker */
                <div className="flex gap-2 items-center">
                  <div className="flex-1 h-14 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-full flex items-center px-2 pl-6 shadow-2xl focus-within:bg-black transition-all">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                      placeholder={`Nhắn tin...`} 
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-zinc-500 h-full" 
                    />
                    <div className="flex items-center gap-1 pr-1">
                      <button onClick={() => handleSendReply()} disabled={!chatInput.trim() || isSending} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50">
                        {isSending ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5 ml-0.5" strokeWidth={2.5} />}
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 mb-4 z-50 animate-in zoom-in-95 duration-200">
                         <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
                         <div className="relative z-50 shadow-2xl rounded-2xl overflow-hidden">
                           <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} width={300} height={350} searchDisabled skinTonesDisabled />
                         </div>
                      </div>
                    )}
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="w-14 h-14 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-yellow-400 hover:scale-110 active:scale-95 transition-all shadow-2xl">
                      <Smile className="w-7 h-7" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Giao diện chủ bài viết: FACE PILE (Hiển thị avatar người tương tác) */
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
                    <button 
                      onClick={() => setShowActivityModal(true)}
                      className="group flex items-center gap-3 bg-black/40 hover:bg-black/60 backdrop-blur-xl px-5 py-3 rounded-full border border-white/10 transition-all active:scale-95"
                    >
                      {/* Face Pile: 3 Avatar xếp chồng */}
                      <div className="flex -space-x-3">
                        {(activePost.latestReactions && activePost.latestReactions.length > 0) ? (
                            activePost.latestReactions.slice(0, 3).map((reaction, index) => (
                              <div key={reaction.id || index} className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-zinc-800 overflow-hidden relative z-0 group-hover:z-10 transition-all">
                                 <img 
                                    src={reaction.userAvatar || `https://ui-avatars.com/api/?name=${reaction.userFullName}&background=random`} 
                                    className="w-full h-full object-cover" 
                                    alt={reaction.userFullName}
                                 />
                                 {/* Icon cảm xúc nhỏ góc dưới */}
                                 {reaction.emoji && (
                                    <div className="absolute bottom-0 right-0 text-[10px] leading-none bg-black/50 rounded-full w-4 h-4 flex items-center justify-center border border-[#1a1a1a]">
                                        {reaction.emoji}
                                    </div>
                                 )}
                              </div>
                            ))
                        ) : (
                            // Placeholder nếu chưa có ai
                            <div className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">?</div>
                        )}
                      </div>

                      <div className="flex flex-col items-start ml-2">
                          <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                            {/* Hiển thị tổng số người tương tác + bình luận */}
                            {(activePost.reactionCount + activePost.commentCount) > 0 
                               ? `${activePost.reactionCount + activePost.commentCount} tương tác` 
                               : "Chưa có tương tác"}
                          </span>
                      </div>
                    </button>
                </div>
              )
          )}
        </div>

        {/* Camera Button (Chỉ hiện khi không nhập liệu) */}
        {!chatInput && (
           <div className="fixed top-6 right-6 md:top-auto md:bottom-10 md:right-10 z-[60]">
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
             <button onClick={() => fileInputRef.current?.click()} className="group relative">
               <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-12 h-12 md:w-20 md:h-20 bg-[#1a1a1a] border-2 md:border-4 border-blue-500/20 hover:border-blue-400 rounded-full md:rounded-[28px] flex items-center justify-center shadow-2xl hover:scale-110 hover:-rotate-6 transition-all duration-300">
                 <Camera className="w-6 h-6 md:w-9 md:h-9 text-white" strokeWidth={2.5} />
               </div>
             </button>
           </div>
        )}

        {/* Modal Checkin */}
        {selectedJourneyId && (
          <CheckinModal isOpen={isCheckinModalOpen} onClose={() => setIsCheckinModalOpen(false)} file={selectedFile} journeyId={selectedJourneyId} onSuccess={handleCheckinSuccess} />
        )}
        
        {/* Modal Activity */}
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