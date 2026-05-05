import React, { useMemo } from 'react';
import { ArrowLeft, Activity, Edit3, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { SetMoodModal } from '@/modules/mood/components/SetMoodModal';
import { useBoxMoodPage } from '../hooks/useBoxMoodPage';
import MainLayout from '@/components/layout/MainLayout'; 
import { MOOD_DICTIONARY } from '../constants/moodAssets';
import { cn } from '@/lib/utils';
import { useFloatingReactions, FloatingReactionsContainer } from '../components/FloatingReactions';
import { MoodMainStage } from '../components/box-mood/MoodMainStage';
import { MoodSocialHub } from '../components/box-mood/MoodSocialHub';
import { MoodMemberDock } from '../components/box-mood/MoodMemberDock';

interface Props {
    boxId: string;
    onBack: () => void;
}

export const BoxMoodPage: React.FC<Props> = ({ boxId, onBack }) => {
    const {
        user, moods, myMood, viewingUserId, setViewingUserId,
        isModalOpen, setIsModalOpen, replyMessage, setReplyMessage,
        viewingMood, isViewingMe, viewingUser,
        handleReply, sortedMembers,
        handleSetMood, handleDeleteMood, handleAskMood, handleReact
    } = useBoxMoodPage(boxId);

    const currentAsset = viewingMood?.icon 
        ? MOOD_DICTIONARY[viewingMood.icon] || MOOD_DICTIONARY['default']
        : MOOD_DICTIONARY['default'];

    const { reactions, triggerReaction } = useFloatingReactions();

    const onReactClick = (moodId: string, emoji: string) => {
        handleReact(moodId, emoji);
        triggerReaction(emoji);
    };

    // ĐÃ FIX: Kích thước sao to dần (10px đến 25px) 
    const stars = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 15 + 10, 
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 3,
    })), []);

    return (
        <MainLayout>
            {/* THAY VÌ 2 LỚP, ÁP DỤNG TRỰC TIẾP GRADIENT VÀO THẺ BAO NGOÀI CÙNG ĐỂ CHỐNG NUỐT MÀU */}
            <div className={cn(
                "flex w-full h-[100dvh] font-quicksand overflow-hidden relative bg-gradient-to-b transition-colors duration-1000",
                currentAsset.themeColor
            )}>
                
                {/* Lưới không gian Blueprint */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none transition-colors z-0" />

{/* Các ngôi sao lấp lánh */}
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute text-indigo-400/80 dark:text-white/80 pointer-events-none flex items-center justify-center transition-colors z-0 overflow-visible"
                        style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
                        animate={{ opacity: [0.1, 1, 0.1] }}
                        transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
                    >
                        {/* Đã mở rộng viewBox thành -6 -6 36 36 và thêm overflow-visible */}
                        <svg viewBox="-6 -6 36 36" fill="currentColor" className="w-full h-full overflow-visible drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                            <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" />
                        </svg>
                    </motion.div>
                ))}

                <FloatingReactionsContainer reactions={reactions} />

                {/* ================= KHU VỰC NỘI DUNG CHÍNH ================= */}
                <div className="flex-1 flex flex-col relative h-full overflow-hidden z-10">
                    
                    {/* TOP NAVIGATION BAR */}
                    <div className="flex items-center justify-between px-5 lg:px-8 pt-6 md:pt-8 pb-2 shrink-0 z-20 w-full relative">
                        <button onClick={onBack} className="p-2.5 -ml-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-zinc-800/50 rounded-2xl transition-all active:scale-95 z-10">
                            <ArrowLeft size={24} strokeWidth={2.5} />
                        </button>
                        
                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10">
                            <Activity size={16} className="text-zinc-700 dark:text-zinc-300" />
                            <span className="font-black text-zinc-900 dark:text-white tracking-widest uppercase text-[0.7rem] md:text-[0.75rem]">Trạm Cảm Xúc</span>
                        </div>

                        <button 
                            onClick={() => setIsModalOpen(!isModalOpen)} 
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-[0.8rem] md:text-[0.9rem] transition-all shadow-md z-10",
                                isModalOpen 
                                    ? "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700" 
                                    : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 active:scale-95"
                            )}
                        >
                            {isModalOpen ? (
                                <><X size={16} strokeWidth={2.5} /><span className="hidden sm:inline">Đóng</span></>
                            ) : myMood ? (
                                <><Edit3 size={16} strokeWidth={2.5} /><span className="hidden sm:inline">Đổi Mood</span></>
                            ) : (
                                <><Plus size={16} strokeWidth={2.5} /><span className="hidden sm:inline">Bật Mood</span></>
                            )}
                        </button>
                    </div>

                    {/* VÙNG CUỘN NỘI DUNG */}
                    <div className="flex-1 w-full overflow-y-auto custom-scrollbar flex flex-col relative">
                        <div className="block lg:hidden w-full shrink-0">
                            <MoodMemberDock 
                                user={user} moods={moods} myMood={myMood} viewingUserId={viewingUserId} 
                                setViewingUserId={setViewingUserId} sortedMembers={sortedMembers} 
                                isMobile={true} 
                            />
                        </div>

                        <div className="w-full max-w-[1000px] mx-auto px-4 md:px-6 flex flex-row flex-wrap justify-center items-start gap-6 lg:gap-10 pt-4 lg:pt-10 pb-10">
                            
                            {/* KHỐI CHÍNH */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="w-full max-w-[500px] relative z-10 shrink-0"
                            >
                                <MoodMainStage 
                                    isViewingMe={isViewingMe} viewingMood={viewingMood} viewingUser={viewingUser} currentAsset={currentAsset}
                                    handleDeleteMood={handleDeleteMood} setIsModalOpen={setIsModalOpen} onReactClick={onReactClick}
                                    replyMessage={replyMessage} setReplyMessage={setReplyMessage} handleReply={handleReply}
                                    handleAskMood={handleAskMood} user={user}
                                />
                            </motion.div>

                            {/* KHỐI WIDGET */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                                className="w-full max-w-[500px] lg:max-w-[320px] shrink-0 z-10"
                            >
                                <MoodSocialHub viewingMood={viewingMood} />
                            </motion.div>
                        </div>
                    </div>

                    <div className="hidden lg:block w-full shrink-0 z-20">
                        <MoodMemberDock 
                            user={user} moods={moods} myMood={myMood} viewingUserId={viewingUserId} 
                            setViewingUserId={setViewingUserId} sortedMembers={sortedMembers} 
                            isMobile={false} 
                        />
                    </div>
                </div>

                <SetMoodModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleSetMood} 
                    currentIcon={myMood?.icon} 
                    currentMessage={myMood?.message} 
                    currentSpotifyTrackId={myMood?.spotifyTrackId}
                    currentLocation={myMood?.location}
                    currentActivity={myMood?.activity}
                />
            </div>
        </MainLayout>
    );
};