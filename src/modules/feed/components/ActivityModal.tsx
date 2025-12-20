import React, { useEffect, useState } from 'react';
import { X, Loader2, MessageCircle } from 'lucide-react'; // Thêm icon MessageCircle
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { feedService } from '../services/feed.service';
import { ReactionDetail } from '../types';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export const ActivityModal = ({ isOpen, onClose, postId }: ActivityModalProps) => {
  const [activities, setActivities] = useState<ReactionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && postId) {
      fetchActivities();
    }
  }, [isOpen, postId]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const data = await feedService.getPostReactions(postId);
      if (Array.isArray(data)) {
        setActivities(data);
      }
    } catch (error) {
      console.error("Failed to load activities", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#1a1a1a] md:rounded-2xl rounded-t-2xl border border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300 flex flex-col max-h-[70vh]">
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 bg-[#1a1a1a]/50 backdrop-blur-md sticky top-0 z-10">
          <h3 className="text-white font-bold text-lg">Hoạt động</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
          ) : activities.length > 0 ? (
            activities.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img 
                    src={item.userAvatar || `https://ui-avatars.com/api/?name=${item.userFullName}&background=random`} 
                    alt={item.userFullName} 
                    className="w-10 h-10 rounded-full object-cover border border-white/10" 
                  />
                  
                  {/* Badge: Emoji hoặc Chat Icon */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] shadow-sm border border-black text-white">
                    {item.type === 'COMMENT' ? <MessageCircle size={10} /> : item.emoji}
                  </div>
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                     <div className="text-sm font-semibold text-white truncate">{item.userFullName}</div>
                     <span className="text-[10px] text-zinc-500 whitespace-nowrap ml-2">
                        {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: vi }) : ''}
                     </span>
                  </div>
                  
                  {/* Nội dung Activity */}
                  <div className="text-xs text-zinc-400 truncate">
                    {item.type === 'COMMENT' ? (
                        <span className="text-white">"{item.content}"</span>
                    ) : (
                        <span>đã thả cảm xúc {item.emoji}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-zinc-500 py-10 text-sm">Chưa có tương tác nào.</div>
          )}
        </div>
      </div>
    </div>
  );
};