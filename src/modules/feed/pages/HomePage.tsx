import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { JourneyPostCard, PostProps } from '../components/JourneyPostCard';
import { CheckinModal } from '@/modules/checkin/components/CheckinModal';
import { Camera, Send, Heart, Filter, Loader2, Map as MapIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { checkinService, Checkin } from '@/modules/checkin/services/checkin.service';
import { friendService, Friend } from '@/modules/user/services/friend.service';
import { journeyService } from '@/modules/journey/services/journey.service';
import { JourneyResponse } from '@/modules/journey/types';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { chatService } from '@/modules/chat/services/chat.service';
import { feedService } from '../services/feed.service';

const HomePage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATE ---
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [journeys, setJourneys] = useState<JourneyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Filters
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const [showJourneySelector, setShowJourneySelector] = useState(false);

  // Modal & Input
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Drag Scroll
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 1. INIT
  useEffect(() => {
    const initData = async () => {
      try {
        const [myJourneys, myFriends] = await Promise.all([
          journeyService.getMyJourneys(),
          friendService.getMyFriends()
        ]);
        setJourneys(myJourneys);
        setFriends(myFriends);
        
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
    setIsLoading(true);
    try {
      let rawCheckins: Checkin[] = [];
      if (selectedJourneyId) {
        rawCheckins = await checkinService.getJourneyFeed(selectedJourneyId);
      } else {
        rawCheckins = await checkinService.getFeed();
      }

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
        timestamp: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      setPosts(mappedPosts);
    } catch (error) {
      console.error("Feed error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [selectedJourneyId]);

  // Logic UI
  const filteredPosts = selectedUserId ? posts.filter(p => p.userId === selectedUserId.toString()) : posts;
  const activePost = filteredPosts[activeIndex] || null;
  const currentJourneyName = journeys.find(j => j.id === selectedJourneyId)?.name || "Tất cả hành trình";

  // Actions
  const handleSendReply = async () => {
    if (!chatInput.trim() || !activePost) return;
    setIsSending(true);
    try {
      await chatService.sendMessage({
        receiverId: parseInt(activePost.userId!),
        content: chatInput,
        metadata: {
          replyToPostId: activePost.id,
          replyToImage: activePost.image
        }
      });
      setChatInput('');
      alert("Đã gửi tin nhắn!");
    } catch (error) {
      alert("Lỗi gửi tin nhắn");
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickReact = async () => {
    if (!activePost) return;
    try {
        await feedService.toggleReaction(activePost.id, 'HEART');
        alert("Đã thả tim ❤️");
    } catch (e) { console.error(e); }
  };

  // Scroll & Drag Handlers
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

  // [HÀM CÒN THIẾU ĐÃ ĐƯỢC BỔ SUNG]
  const handleCheckinSuccess = () => {
    fetchFeed(); 
    alert("Đăng bài thành công!");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!selectedJourneyId) {
        alert("Vui lòng chọn một hành trình để check-in!");
        return;
      }
      setSelectedFile(file);
      setIsCheckinModalOpen(true);
    }
    e.target.value = ''; 
  };

  return (
    <MainLayout>
      <div className="relative h-screen w-full bg-[#121212] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Blur */}
        <div className="absolute inset-0 z-0 transition-opacity duration-1000">
           {activePost && (
             <img 
               src={activePost.image} 
               className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[100px] scale-150 animate-pulse-slow" 
               draggable={false}
             />
           )}
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#121212]/90 to-black" />
        </div>

        {/* Loading */}
        {isLoading && posts.length === 0 && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
        )}

        {/* Header */}
        <div className="absolute top-6 left-0 right-0 z-30 flex flex-col items-center gap-4 pointer-events-none">
          <div className="relative pointer-events-auto">
            <button onClick={() => setShowJourneySelector(!showJourneySelector)} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-full border border-white/10 text-white font-bold text-sm transition-all">
              <MapIcon className="w-4 h-4 text-blue-400" />
              {currentJourneyName}
              <ChevronDown className={`w-4 h-4 transition-transform ${showJourneySelector ? 'rotate-180' : ''}`} />
            </button>
            {showJourneySelector && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 z-50">
                {journeys.map(j => (
                  <button key={j.id} onClick={() => { setSelectedJourneyId(j.id); setShowJourneySelector(false); }} className={cn("w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2", selectedJourneyId === j.id ? "text-blue-400 bg-blue-500/10" : "text-zinc-300")}>
                    <span className="w-2 h-2 rounded-full bg-current" />{j.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {friends.length > 0 && (
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex gap-2 pointer-events-auto shadow-2xl overflow-x-auto no-scrollbar max-w-[90vw]">
              <button onClick={() => setSelectedUserId(null)} className={cn("h-9 px-4 rounded-full text-xs font-bold shrink-0", !selectedUserId ? "bg-white text-black" : "text-zinc-400 hover:text-white")}>{!selectedUserId ? "Mọi người" : <Filter className="w-3 h-3" />}</button>
              <div className="w-[1px] bg-white/10 my-1 shrink-0" />
              {friends.map(friend => (
                <button key={friend.id} onClick={() => setSelectedUserId(selectedUserId === friend.id ? null : friend.id)} className={cn("relative w-9 h-9 rounded-full transition-all border-2 shrink-0", selectedUserId === friend.id ? "border-blue-500 scale-110" : "border-transparent opacity-60 hover:opacity-100")}>
                  <img src={friend.avatarUrl} className="w-full h-full rounded-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Overlay */}
        {activePost && (
          <div className="absolute top-32 z-20 flex flex-col items-center pointer-events-none animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-extrabold text-white drop-shadow-md">{activePost.user.name}</h2>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 mt-1">
              <span>{activePost.timestamp}</span>
              {activePost.taskName && <span className="text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full border border-green-500/20">{activePost.taskName}</span>}
            </div>
          </div>
        )}

        {/* Carousel */}
        <div 
          ref={scrollRef} 
          onScroll={handleScroll} 
          onMouseDown={onMouseDown} 
          onMouseLeave={onMouseLeave} 
          onMouseUp={onMouseUp} 
          onMouseMove={onMouseMove} 
          className={cn(
            "relative z-10 w-full h-[55vh] flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory",
            isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-mandatory"
          )}
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
            !isLoading && <div className="w-full text-center text-zinc-500">Chưa có bài đăng nào.</div>
          )}
        </div>

        {/* Input */}
        <div className="absolute bottom-6 md:bottom-10 z-20 w-full max-w-[500px] px-4">
          {activePost && (
            <div className="flex gap-2 items-center">
              <div className="flex-1 h-14 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-full flex items-center px-2 pl-6 shadow-2xl focus-within:bg-black transition-all">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  placeholder={`Nhắn tin cho ${activePost.user.name}...`} 
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-zinc-600 h-full" 
                />
                <div className="flex items-center gap-1 pr-1">
                  <button onClick={handleSendReply} disabled={!chatInput.trim() || isSending} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50">
                    {isSending ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5 ml-0.5" strokeWidth={2.5} />}
                  </button>
                </div>
              </div>
              <button onClick={handleQuickReact} className="w-14 h-14 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-red-500 hover:scale-110 active:scale-95 transition-all shadow-2xl">
                <Heart className="w-7 h-7 fill-current" />
              </button>
            </div>
          )}
        </div>

        {/* Camera */}
        <div className="fixed top-6 right-6 md:top-auto md:bottom-10 md:right-10 z-[60]">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
          <button onClick={() => fileInputRef.current?.click()} className="group relative">
            <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 md:w-20 md:h-20 bg-[#1a1a1a] border-2 md:border-4 border-blue-500/20 hover:border-blue-400 rounded-full md:rounded-[28px] flex items-center justify-center shadow-2xl hover:scale-110 hover:-rotate-6 transition-all duration-300">
              <Camera className="w-6 h-6 md:w-9 md:h-9 text-white" strokeWidth={2.5} />
            </div>
          </button>
        </div>

        {selectedJourneyId && (
          <CheckinModal 
            isOpen={isCheckinModalOpen} 
            onClose={() => setIsCheckinModalOpen(false)}
            file={selectedFile}
            journeyId={selectedJourneyId}
            onSuccess={handleCheckinSuccess}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;