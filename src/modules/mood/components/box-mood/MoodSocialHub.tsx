import React from 'react';
import { MapPin, Music, CloudRain, Disc3, Activity } from 'lucide-react';

export const MoodSocialHub = ({ viewingMood }: any) => {
    const hasContext = viewingMood?.location || viewingMood?.activity || viewingMood?.weather;

    return (
        <div data-tour="mood-social-hub" className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-4 lg:gap-6">
            
            <div className="bg-white/30 dark:bg-[#1A1A1A]/30 backdrop-blur-[30px] rounded-[24px] lg:rounded-[32px] p-5 lg:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-white/50 dark:border-white/10 w-full">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[0.75rem] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Music size={14} /> Đang Nghe
                    </span>
                    {viewingMood?.spotifyTrackId && (
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    )}
                </div>

                {viewingMood?.spotifyTrackId ? (
                    <iframe style={{ borderRadius: "16px" }} src={`https://open.spotify.com/embed/track/${viewingMood.spotifyTrackId}?utm_source=generator&theme=0`} width="100%" height="80" frameBorder="0" allowFullScreen={false} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-500 py-2 lg:py-4 opacity-70">
                        <Disc3 size={28} className="mb-2 animate-[spin_6s_linear_infinite]" strokeWidth={1.5} />
                        <p className="text-[0.8rem] font-bold">Không gian tĩnh lặng</p>
                    </div>
                )}
            </div>

            <div className="bg-white/30 dark:bg-[#1A1A1A]/30 backdrop-blur-[30px] rounded-[24px] lg:rounded-[32px] p-5 lg:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-white/50 dark:border-white/10 transition-all duration-500 w-full">
                <span className="text-[0.75rem] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-4">
                    <MapPin size={14} /> Trạng thái & Hoạt động
                </span>
                
                {hasContext ? (
                    <div className="flex flex-wrap gap-2">
                        {(viewingMood.location || viewingMood.weather) && (
                            <span className="px-3 py-2 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md rounded-xl text-[0.85rem] font-bold text-zinc-700 dark:text-zinc-300 border border-white/50 dark:border-zinc-700 flex items-center gap-2 shadow-sm">
                                <CloudRain size={16} className="text-blue-500 shrink-0" /> 
                                <span className="truncate max-w-[200px]">
                                    {viewingMood.location || "Không rõ nơi đâu"}
                                    {viewingMood.weather ? `, ${viewingMood.weather}` : ""}
                                </span>
                            </span>
                        )}
                        {viewingMood.activity && (
                            <span className="px-3 py-2 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md rounded-xl text-[0.85rem] font-bold text-zinc-700 dark:text-zinc-300 border border-white/50 dark:border-zinc-700 flex items-center gap-2 shadow-sm">
                                <Activity size={16} className="text-amber-500 shrink-0" /> 
                                <span className="truncate max-w-[200px]">{viewingMood.activity}</span>
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-500 py-2 opacity-70">
                        <p className="text-[0.8rem] font-bold">Chưa cập nhật thêm</p>
                    </div>
                )}
            </div>

            {viewingMood?.reactions && viewingMood.reactions.length > 0 && (
                <div className="bg-white/30 dark:bg-[#1A1A1A]/30 backdrop-blur-[30px] rounded-[24px] lg:rounded-[32px] p-5 lg:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-white/50 dark:border-white/10 w-full">
                    <span className="text-[0.75rem] font-black uppercase tracking-widest text-zinc-500 mb-4 block">Những tương tác</span>
                    
                    <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 max-h-[150px] lg:max-h-[250px]">
                        {viewingMood.reactions.map((r: any) => (
                            <div key={r.userId} className="flex items-center justify-between bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md p-2.5 rounded-2xl border border-white/50 dark:border-zinc-700 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <img src={r.avatarUrl || `https://ui-avatars.com/api/?name=${r.fullname}`} className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-600" alt="avt" />
                                    <span className="text-[0.9rem] font-bold text-zinc-800 dark:text-zinc-200">{r.fullname.split(' ')[0]}</span>
                                </div>
                                <span className="text-[1.2rem] bg-white dark:bg-zinc-900 w-8 h-8 rounded-full flex items-center justify-center shadow-sm">{r.emoji}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};