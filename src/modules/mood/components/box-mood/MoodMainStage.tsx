import React from 'react';
import { Trash2, Send, Hand } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MOOD_DICTIONARY } from '../../constants/moodAssets';

export const MoodMainStage = ({ 
    isViewingMe, viewingMood, viewingUser, currentAsset,
    handleDeleteMood, setIsModalOpen, onReactClick,
    replyMessage, setReplyMessage, handleReply, handleAskMood, user
 }: any) => {
    return (
        <div className="flex-1 w-full max-w-[560px] flex flex-col justify-center pb-4 lg:pb-0 mx-auto">
            {/* Tấm nền Glassmorphism */}
            <div className="w-full bg-white/30 dark:bg-[#1A1A1A]/30 backdrop-blur-[40px] rounded-[32px] md:rounded-[40px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/60 dark:border-white/10 p-6 md:p-10 relative flex flex-col items-center text-center transition-all duration-500">
                
                {/* Nút xóa (Chỉ hiện khi xem chính mình và đã có mood) */}
                {isViewingMe && viewingMood && (
                    <button onClick={handleDeleteMood} className="absolute top-5 right-5 p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all shadow-sm" title="Gỡ trạng thái">
                        <Trash2 size={20} strokeWidth={2.5} />
                    </button>
                )}

                {/* Avatar vắn tắt */}
                <div className="flex items-center gap-3 mb-6 md:mb-8 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md py-2 px-4 rounded-full shadow-sm border border-white/50 dark:border-zinc-700/50">
                    {viewingUser.avatarUrl ? (
                        <img src={viewingUser.avatarUrl} className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-zinc-700" alt="avatar" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[0.8rem] font-black text-zinc-900 dark:text-white border-2 border-white dark:border-zinc-700">
                            {viewingUser.fullname?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="text-[1rem] font-bold text-zinc-800 dark:text-zinc-200">{viewingUser.fullname}</span>
                </div>

                {/* Mascot */}
                <div data-tour="mood-mascot" className="w-full flex justify-center">
                    {viewingMood ? (
                        <motion.div animate={{ y: [0, -10, 0], scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-[180px] h-[180px] md:w-[240px] md:h-[240px] mb-6 cursor-pointer drop-shadow-2xl relative" onClick={() => isViewingMe && setIsModalOpen(true)}>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[20px] bg-black/10 dark:bg-black/30 blur-xl rounded-[100%] pointer-events-none"></div>
                            <img src={currentAsset.gif} alt="Mood" className="w-full h-full object-contain relative z-10" />
                        </motion.div>
                    ) : (
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="w-[140px] h-[140px] mb-6 cursor-pointer drop-shadow-xl opacity-50 grayscale relative" onClick={() => isViewingMe && setIsModalOpen(true)}>
                            <img src={MOOD_DICTIONARY['default'].gif} alt="Empty Mood" className="w-full h-full object-contain pointer-events-none" />
                        </motion.div>
                    )}
                </div>

                {/* Lời nhắn */}
                {viewingMood?.message ? (
                    <p className="text-[1.2rem] md:text-[1.3rem] text-zinc-900 dark:text-white font-black mb-8 leading-relaxed max-w-[90%]">"{viewingMood.message}"</p>
                ) : (
                    <p className="text-[1.05rem] text-zinc-500 dark:text-zinc-400 font-bold mb-8">
                        {isViewingMe ? "Hôm nay bạn thấy thế nào?" : "Bạn ấy đang im lặng..."}
                    </p>
                )}

                {/* KHU VỰC TƯƠNG TÁC */}
                {!isViewingMe && viewingMood ? (
                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-center gap-3 bg-white/50 dark:bg-zinc-800/40 backdrop-blur-md p-2.5 rounded-3xl shadow-inner border border-white/50 dark:border-zinc-800/50">
                            {['🔥', '😂', '💖', '😢'].map(emoji => {
                                const hasReacted = viewingMood.reactions?.some((r: any) => r.userId === user?.id && r.emoji === emoji);
                                return (
                                    <button key={emoji} onClick={() => onReactClick(viewingMood.id, emoji)} className={cn("w-12 h-12 rounded-[18px] text-[1.5rem] flex items-center justify-center transition-all active:scale-90", hasReacted ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-lg -translate-y-1 scale-110" : "bg-white/80 dark:bg-zinc-800 hover:bg-white dark:hover:bg-zinc-700 shadow-sm border border-white dark:border-zinc-700 hover:-translate-y-0.5")}>
                                        {emoji}
                                    </button>
                                )
                            })}
                        </div>
                        <div className="w-full flex items-center bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md rounded-2xl p-1.5 shadow-sm border border-white/50 dark:border-zinc-700/50">
                            <input type="text" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder={`Gửi tin nhắn riêng cho @${viewingUser.fullname.split(' ')[0]}...`} className="flex-1 bg-transparent border-none px-4 text-[0.95rem] font-bold text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-0" />
                            <button disabled={!replyMessage.trim()} onClick={handleReply} className="w-11 h-11 md:w-12 md:h-12 rounded-[14px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center disabled:opacity-50 active:scale-95 transition-all hover:shadow-lg"><Send size={18} className="-ml-0.5" strokeWidth={2.5} /></button>
                        </div>
                    </div>
                ) : !isViewingMe && !viewingMood ? (
                    <button onClick={() => handleAskMood(viewingUser.id)} className="w-full flex items-center justify-center gap-3 h-[56px] md:h-[60px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-[0.98] rounded-2xl md:rounded-[20px] text-[1.05rem] font-extrabold shadow-xl shadow-zinc-900/20 dark:shadow-white/10 active:scale-95 transition-all group">
                        <Hand size={20} className="group-hover:rotate-12 transition-transform" strokeWidth={2.5} /> Chọc bạn ấy
                    </button>
                ) : null}
                
            </div>
        </div>
    );
};