import React from 'react';
import { PlayCircle, Calendar } from 'lucide-react';
import { Journey } from '@/modules/journey/types';

interface Props {
  journey: Journey;
  onClick: () => void;
}

export const RecapAlbumCard: React.FC<Props> = ({ journey, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-purple-500/50 transition-all"
    >
      {/* Background Image (Nếu journey có ảnh cover, nếu không dùng màu gradient) */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-blue-900/40 group-hover:scale-110 transition-transform duration-500" />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:bg-purple-500 group-hover:text-white transition-colors">
            <PlayCircle className="w-6 h-6 text-white/80 group-hover:text-white" />
        </div>
        <h3 className="font-bold text-white line-clamp-2">{journey.name}</h3>
        <div className="flex items-center gap-1 mt-2 text-xs text-zinc-400">
            <Calendar className="w-3 h-3" />
            <span>Đã xong</span>
        </div>
      </div>
    </div>
  );
};