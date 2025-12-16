import React, { useEffect, useState } from 'react';
import { gamificationService } from '../services/gamification.service';
import { Badge } from '../types';
import { cn } from '@/lib/utils';
import { Lock, Award } from 'lucide-react';

export const BadgeList = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await gamificationService.getMyBadges();
        setBadges(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="text-zinc-500 text-xs animate-pulse">Đang tải huy hiệu...</div>;
  if (badges.length === 0) return <div className="text-zinc-500 text-xs">Chưa có huy hiệu.</div>;

  return (
    <div className="grid grid-cols-4 gap-3">
      {badges.map((badge) => (
        <div key={badge.id} className={cn("relative flex flex-col items-center gap-2 p-2 rounded-lg border transition-all", badge.isOwned ? "bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.1)]" : "bg-white/5 border-white/5 opacity-50 grayscale")}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black/60 to-black/20 flex items-center justify-center relative overflow-hidden ring-1 ring-white/10">
             {badge.iconUrl ? 
               <img src={badge.iconUrl} className="w-full h-full object-cover p-2" alt={badge.name}/> : 
               <Award className={cn("w-6 h-6", badge.isOwned ? "text-yellow-400" : "text-zinc-600")} />
             }
             {!badge.isOwned && (
               <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                 <Lock className="w-4 h-4 text-white/80" />
               </div>
             )}
          </div>
          <span className="text-[10px] text-center font-bold text-zinc-300 line-clamp-2 h-8 flex items-center">{badge.name}</span>
        </div>
      ))}
    </div>
  );
};