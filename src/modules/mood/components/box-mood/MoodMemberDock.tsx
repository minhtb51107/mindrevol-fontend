import React from 'react';
import { cn } from '@/lib/utils';
import { MOOD_DICTIONARY } from '../../constants/moodAssets';

export const MoodMemberDock = ({ user, moods, myMood, viewingUserId, setViewingUserId, sortedMembers, isMobile }: any) => {
    return (
        <div className={cn(
            "w-full shrink-0 z-20",
            isMobile 
                ? "pt-1 pb-4" 
                : "flex flex-col justify-end pb-6 pt-4 bg-gradient-to-t from-[#F8F9FA] dark:from-[#09090B] via-[#F8F9FA]/80 dark:via-[#09090B]/80 to-transparent"
        )}>
            <div className="flex gap-3 md:gap-4 overflow-x-auto custom-scrollbar pb-2 pt-6 px-4 md:px-6 items-end justify-start lg:justify-center w-full max-w-[1200px] mx-auto">
                
                {/* BẢN THÂN (USER) */}
                <div className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group origin-bottom" onClick={() => setViewingUserId(user?.id)}>
                    <div className={cn(
                        "rounded-[20px] md:rounded-[24px] flex items-center justify-center relative transition-all duration-300 border-2",
                        viewingUserId === user?.id 
                            // Khi được chọn (Active)
                            ? "w-[65px] h-[65px] md:w-[80px] md:h-[80px] bg-white/80 dark:bg-[#1A1A1A]/80 shadow-[0_0_20px_rgba(255,255,255,0.5)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] ring-4 ring-white/50 dark:ring-white/20 -translate-y-3 md:-translate-y-4 border-transparent" 
                            // Khi không được chọn
                            : "w-[52px] h-[52px] md:w-[64px] md:h-[64px] bg-white/30 dark:bg-[#1A1A1A]/30 backdrop-blur-md hover:w-[60px] hover:h-[60px] md:hover:w-[70px] md:hover:h-[70px] border-transparent"
                    )}>
                        {myMood ? (
                            <img src={MOOD_DICTIONARY[myMood.icon]?.gif || MOOD_DICTIONARY['default'].gif} alt="My Mood" className="w-[85%] h-[85%] object-contain drop-shadow-md" />
                        ) : user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="You" className="w-[calc(100%-8px)] h-[calc(100%-8px)] object-cover rounded-[16px] md:rounded-[20px]" />
                        ) : (
                            <span className="text-zinc-600 dark:text-zinc-400 font-black text-[1.5rem]">{user?.fullname?.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <span className={cn("text-[0.7rem] md:text-[0.75rem] font-extrabold uppercase tracking-widest transition-all", viewingUserId === user?.id ? 'text-zinc-900 dark:text-white scale-110' : 'text-zinc-500 dark:text-zinc-500')}>Bản thân</span>
                </div>

                <div className="w-px h-8 md:h-10 bg-zinc-300 dark:bg-zinc-800 mx-1 md:mx-2 self-center rounded-full shrink-0"></div>

                {/* DANH SÁCH BẠN BÈ */}
                {sortedMembers.map((member: any) => {
                    const friendMood = moods.find((m: any) => m.userId === member.userId);
                    const isSelected = viewingUserId === member.userId;
                    
                    return (
                        <div key={member.userId} className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group origin-bottom" onClick={() => setViewingUserId(member.userId)}>
                            <div className={cn(
                                "rounded-[20px] md:rounded-[24px] flex items-center justify-center relative transition-all duration-300 border-2",
                                isSelected 
                                    // Khi được chọn (Active)
                                    ? "w-[65px] h-[65px] md:w-[80px] md:h-[80px] bg-white/80 dark:bg-[#1A1A1A]/80 shadow-[0_0_20px_rgba(255,255,255,0.5)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] ring-4 ring-white/50 dark:ring-white/20 -translate-y-3 md:-translate-y-4 border-transparent" 
                                    // Khi không được chọn
                                    : "w-[52px] h-[52px] md:w-[64px] md:h-[64px] bg-white/30 dark:bg-[#1A1A1A]/30 backdrop-blur-md hover:w-[60px] hover:h-[60px] md:hover:w-[70px] md:hover:h-[70px] border-transparent"
                            )}>
                                {friendMood ? (
                                    <img src={MOOD_DICTIONARY[friendMood.icon]?.gif || MOOD_DICTIONARY['default'].gif} alt="Friend Mood" className="w-[85%] h-[85%] object-contain drop-shadow-md" />
                                ) : member.avatarUrl ? (
                                    <img src={member.avatarUrl} alt="avt" className="w-[calc(100%-8px)] h-[calc(100%-8px)] object-cover rounded-[16px] md:rounded-[20px] grayscale opacity-40" />
                                ) : (
                                    <span className="text-zinc-400 opacity-40 font-black text-[1.2rem] md:text-[1.5rem]">{member.fullname?.charAt(0).toUpperCase()}</span>
                                )}

                                {friendMood && (
                                    <div className="absolute -bottom-2 -right-2 w-7 h-7 md:w-8 md:h-8 rounded-xl border-[3px] border-[#F8F9FA] dark:border-[#09090B] bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md flex items-center justify-center overflow-hidden shadow-sm z-10">
                                        {member.avatarUrl ? <img src={member.avatarUrl} alt="avt" className="w-full h-full object-cover" /> : <span className="text-[10px] font-black text-zinc-900 dark:text-white">{member.fullname?.charAt(0)}</span>}
                                    </div>
                                )}
                            </div>
                            <span className={cn("text-[0.65rem] md:text-[0.75rem] font-extrabold uppercase tracking-widest truncate max-w-[65px] md:max-w-[80px] transition-all", isSelected ? 'text-zinc-900 dark:text-white scale-110' : 'text-zinc-500 dark:text-zinc-500')}>{member.fullname.split(' ')[0]}</span>
                        </div>
                    );
                })}

            </div>
        </div>
    );
};