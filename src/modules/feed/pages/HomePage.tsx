import React, { useState, useMemo, useEffect } from 'react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import MainLayout from '@/components/layout/MainLayout';
import { JourneyPostCard } from '../components/JourneyPostCard';
import { ActivityModal } from '../components/ActivityModal';
import { MemberFilter } from '../components/MemberFilter'; 
import { CreateJourneyModal } from '@/modules/journey/components/CreateJourneyModal';
import { Send, Smile, Loader2, Map as MapIcon, ChevronDown, X, Plus, Rocket, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatService } from '@/modules/chat/services/chat.service';
import { feedService } from '../services/feed.service';
import { useFeedData } from '../hooks/useFeedData';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

const HomePage = () => {
  const { 
    user, posts, members, journeys, isLoading, currentJourneyName, 
    selectedJourneyId, selectedUserId, filteredPosts,
    setSelectedUserId, handleSelectJourney, handlePostDeleted, handlePostUpdated, refreshFeed
  } = useFeedData();

  const { 
    scrollRef, activeIndex, setActiveIndex, isDragging, handlers, scrollToItem 
  } = useDraggableScroll();

  const [showJourneySelector, setShowJourneySelector] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [isCreateJourneyOpen, setIsCreateJourneyOpen] = useState(false);
  
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const handleJourneyUpdate = () => {
      refreshFeed();
    };
    window.addEventListener('JOURNEY_UPDATED', handleJourneyUpdate);
    return () => window.removeEventListener('JOURNEY_UPDATED', handleJourneyUpdate);
  }, [refreshFeed]);

  const activePost = filteredPosts[activeIndex] || null;
  const isOwner = useMemo(() => user && activePost && String(user.id) === String(activePost.userId), [user, activePost]);
  const reactionCount = (activePost?.reactionCount || 0);
  const commentCount = (activePost?.commentCount || 0);
  const totalInteractions = reactionCount + commentCount;

  const hasAnyNotification = useMemo(() => {
    return journeys.some((j: any) => j.hasNewUpdates);
  }, [journeys]);

  const isJourneyEmpty = journeys.length === 0;

  const handleSendReply = async (content?: string) => {
    const messageContent = content || chatInput;
    if (!messageContent.trim() || !activePost) return;
    setIsSending(true);
    try {
      const isReaction = !!content;
      await Promise.all([
        chatService.sendMessage({
          receiverId: activePost.userId, 
          content: messageContent,
          metadata: { replyToPostId: activePost.id, replyToImage: activePost.image, type: isReaction ? 'REACTION' : 'COMMENT' }
        }),
        isReaction ? feedService.toggleReaction(activePost.id, messageContent) : feedService.postComment(activePost.id, messageContent)
      ]);
      setChatInput('');
      setShowEmojiPicker(false);
      await refreshFeed();
    } catch (error) { console.error(error); } finally { setIsSending(false); }
  };

  const onPostDelete = (id: string) => {
      handlePostDeleted(id);
      if (activeIndex >= posts.length - 1) setActiveIndex(Math.max(0, posts.length - 2));
  };

  return (
    <MainLayout>
      <div className="relative w-full h-full bg-[#121212] overflow-y-auto overflow-x-hidden no-scrollbar">
        
        {/* Background Ambient */}
        {!isJourneyEmpty && activePost && (
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img src={activePost.image} className="w-full h-full object-cover opacity-20 blur-[100px] scale-150 transition-opacity duration-1000" draggable={false}/>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#121212]/90 to-black" />
            </div>
        )}

        {/* --- CONTAINER NỘI DUNG --- */}
        <div className="relative z-10 flex flex-col min-h-full pb-32">
            
            {/* 1. HEADER */}
            {!isJourneyEmpty && (
                <div className="w-full flex flex-col items-center gap-4 pt-6 pb-2 px-4 shrink-0">
                    <div className="relative z-50">
                        <button 
                        onClick={() => setShowJourneySelector(!showJourneySelector)} 
                        className="relative flex items-center gap-2 px-5 py-2.5 bg-zinc-800/80 hover:bg-zinc-700/80 backdrop-blur-xl rounded-full border border-white/10 text-white font-bold text-sm transition-all shadow-lg"
                        >
                        <MapIcon className="w-4 h-4 text-blue-400" />
                        {currentJourneyName}
                        {hasAnyNotification && !showJourneySelector && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#121212] animate-pulse" />
                        )}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showJourneySelector ? 'rotate-180' : ''}`} />
                        </button>

                        {showJourneySelector && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                            {journeys.map((j: any) => (
                            <button 
                                key={j.id} 
                                onClick={() => { handleSelectJourney(j.id); setShowJourneySelector(false); }} 
                                className={cn("w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors flex items-center justify-between group", selectedJourneyId === j.id ? "text-blue-400 bg-blue-500/10" : "text-zinc-300")}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <span className={cn("w-2 h-2 rounded-full shrink-0", selectedJourneyId === j.id ? "bg-blue-400" : "bg-zinc-600")} />
                                    <span className="truncate">{j.name}</span>
                                </div>
                                {j.hasNewUpdates && <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />}
                            </button>
                            ))}
                        </div>
                        )}
                    </div>

                    <div className="w-full max-w-lg">
                        <MemberFilter members={members} currentUser={user} selectedUserId={selectedUserId} onSelectUser={setSelectedUserId} />
                    </div>
                </div>
            )}

            {/* 2. MAIN CONTENT AREA */}
<div className={cn(
    "w-full flex-1 flex flex-col items-center transition-all",
    // GIẢM py-8 XUỐNG py-2 HOẶC py-4
    isJourneyEmpty ? "justify-center min-h-[80vh]" : "justify-start py-2 min-h-[50vh]" 
)}>
                
                {/* [CASE 1] EMPTY STATE: CHƯA CÓ HÀNH TRÌNH */}
                {isJourneyEmpty ? (
                    // CẬP NHẬT: Xóa mt-10 để căn giữa hoàn toàn
                    <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 w-full px-4">
                        <button 
                            onClick={() => setIsCreateJourneyOpen(true)}
                            className="group relative w-full max-w-sm aspect-[4/5] rounded-[3rem] border-2 border-dashed border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/50 hover:border-zinc-500 transition-all duration-300 flex flex-col items-center justify-center gap-8 cursor-pointer"
                        >
                            {/* Icon dấu cộng (Plus) */}
                            <div className="w-24 h-24 rounded-full bg-zinc-800/50 group-hover:bg-blue-500/20 border border-zinc-700 group-hover:border-blue-500/50 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-xl">
                                <Plus className="w-10 h-10 text-zinc-400 group-hover:text-blue-400 transition-colors" strokeWidth={2} />
                            </div>
                            <div className="text-center px-8 space-y-3">
                                <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                    Bắt đầu hành trình
                                </h3>
                                <p className="text-base text-zinc-500 group-hover:text-zinc-300 transition-colors leading-relaxed">
                                    Tạo không gian chung để lưu giữ kỷ niệm và thói quen cùng bạn bè.
                                </p>
                            </div>
                        </button>
                    </div>
                ) : (
                    /* [CASE 2] Loading Posts */
                    isLoading && posts.length === 0 ? (
                        <div className="flex items-center justify-center h-40"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                    ) : (
                        /* [CASE 3] CAROUSEL */
                        <div 
                            ref={scrollRef} 
                            {...handlers} 
                            className={cn("w-full flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory py-2", isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-mandatory")}
                        >
                            {filteredPosts.length > 0 ? (
                                <>
                                <div className="min-w-[calc(50vw-42.5vw)] md:min-w-[calc(50vw-225px)] h-full shrink-0" />
                                {filteredPosts.map((post, index) => (
                                    <div key={post.id} className="post-card-wrapper mx-2 shrink-0" onClick={() => scrollToItem(index)}>
                                        <JourneyPostCard post={post} isActive={index === activeIndex} onDelete={onPostDelete} onUpdate={handlePostUpdated} />
                                    </div>
                                ))}
                                <div className="min-w-[calc(50vw-42.5vw)] md:min-w-[calc(50vw-225px)] h-full shrink-0" />
                                </>
                            ) : (
                                /* [CASE 4] EMPTY STATE: CHƯA CÓ BÀI ĐĂNG TRONG HÀNH TRÌNH */
                                <div className="w-full flex justify-center px-4">
                                    <div className="group relative w-100 aspect-square rounded-[2.5rem] border-2 border-dashed border-zinc-800 bg-zinc-900/10 flex flex-col items-center justify-center gap-6 p-6 text-center select-none animate-in fade-in zoom-in-95 duration-500">
                                        <div className="w-20 h-20 rounded-full bg-zinc-800/30 border border-zinc-700 flex items-center justify-center">
                                            <Camera className="w-9 h-9 text-zinc-500" strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-zinc-300">Chưa có bài đăng</h3>
                                            <p className="text-sm text-zinc-500 leading-relaxed px-4">
                                                Hãy là người đầu tiên check-in để bắt đầu!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                )}
            </div>

            {/* 3. FOOTER */}
            {!isJourneyEmpty && activePost && (
                <div className="w-full shrink-0 px-4 flex justify-center">
                    <div className="w-full max-w-[450px] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col items-center text-center">
                            <h2 className="text-2xl font-extrabold text-white drop-shadow-md">{activePost.user.name}</h2>
                            <div className="flex items-center gap-2 text-xs font-medium text-zinc-300 mt-2 bg-zinc-800/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/5">
                                <span>{activePost.timestamp}</span>
                                {activePost.taskName && (
                                    <>
                                    <span className="w-1 h-1 rounded-full bg-zinc-500" />
                                    <span className="text-green-400 max-w-[150px] truncate">{activePost.taskName}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="w-full">
                            {!isOwner ? (
                                <div className="relative">
                                    {showEmojiPicker && (
                                        <>
                                        <div className="fixed inset-0 z-30" onClick={() => setShowEmojiPicker(false)} />
                                        <div className="absolute bottom-full left-0 mb-4 z-40 shadow-2xl rounded-2xl overflow-hidden border border-white/10">
                                            <EmojiPicker onEmojiClick={(e) => setChatInput(prev => prev + e.emoji)} theme={Theme.DARK} width={320} height={350} searchDisabled skinTonesDisabled />
                                        </div>
                                        </>
                                    )}
                                    <div className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center px-2 shadow-lg focus-within:border-zinc-600 transition-colors">
                                            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={cn("w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors", showEmojiPicker ? "text-yellow-400" : "text-zinc-400")}>
                                                {showEmojiPicker ? <X className="w-5 h-5" /> : <Smile className="w-6 h-6" />}
                                            </button>
                                            <input 
                                                type="text" 
                                                value={chatInput} 
                                                onChange={(e) => setChatInput(e.target.value)} 
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendReply()} 
                                                placeholder={`Gửi tin nhắn...`} 
                                                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-zinc-600 h-full px-2 font-medium" 
                                            />
                                            <button onClick={() => handleSendReply()} disabled={!chatInput.trim() || isSending} className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all font-bold", chatInput.trim() ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-zinc-600 cursor-not-allowed")}>
                                                {isSending ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5" strokeWidth={2.5} />}
                                            </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center">
                                    <button onClick={() => setShowActivityModal(true)} className="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 px-6 py-3 rounded-2xl border border-zinc-800 transition-all active:scale-95 shadow-md">
                                            <div className="flex -space-x-2">
                                                {(activePost.latestReactions && activePost.latestReactions.length > 0) ? (
                                                    activePost.latestReactions.slice(0, 3).map((reaction, index) => (
                                                        <div key={reaction.id || index} className="w-6 h-6 rounded-full border border-zinc-900 bg-zinc-800 overflow-hidden">
                                                            <img src={reaction.userAvatar || `https://ui-avatars.com/api/?name=${reaction.userFullName}`} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))
                                                ) : <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-900" />}
                                            </div>
                                            <span className="text-sm font-bold text-zinc-200">
                                                {totalInteractions > 0 ? `${totalInteractions} tương tác` : "Chưa có tương tác"}
                                            </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Modals */}
        {activePost && !isJourneyEmpty && (
            <ActivityModal isOpen={showActivityModal} onClose={() => setShowActivityModal(false)} postId={activePost.id} />
        )}

        <CreateJourneyModal
            isOpen={isCreateJourneyOpen}
            onClose={() => setIsCreateJourneyOpen(false)}
            onSuccess={() => { 
                setIsCreateJourneyOpen(false); 
                window.dispatchEvent(new Event('JOURNEY_UPDATED'));
            }}
        />
      </div>
    </MainLayout>
  );
};

export default HomePage;