import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Heart, Loader2 } from 'lucide-react';
import { checkinService, Comment } from '@/modules/checkin/services/checkin.service';
import { cn } from '@/lib/utils';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  checkinId: string;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({ isOpen, onClose, checkinId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load comments khi mở
  useEffect(() => {
    if (isOpen && checkinId) {
      loadComments();
    }
  }, [isOpen, checkinId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const data = await checkinService.getComments(checkinId);
      setComments(data);
      // Scroll xuống cuối
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    } catch (e) { console.error(e); } 
    finally { setIsLoading(false); }
  };

  const handleSend = async () => {
    if (!newComment.trim()) return;
    setIsSending(true);
    try {
      const comment = await checkinService.postComment(checkinId, newComment);
      setComments(prev => [...prev, comment]); // Optimistic update
      setNewComment('');
      // Scroll xuống
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    } catch (e) {
      alert("Lỗi gửi bình luận");
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-xl animate-in slide-in-from-bottom-full duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
        <h3 className="font-bold text-white">Bình luận</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-400">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* List Comments */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-blue-500"/></div>
        ) : comments.length === 0 ? (
          <div className="text-center text-zinc-500 py-10">Chưa có tin nhắn nào. Hãy là người đầu tiên!</div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <img src={c.userAvatar} className="w-8 h-8 rounded-full object-cover shrink-0" />
              <div className="flex flex-col gap-1">
                <div className="bg-zinc-800/80 px-3 py-2 rounded-2xl rounded-tl-none">
                  <span className="text-xs font-bold text-zinc-400 block mb-0.5">{c.userFullName}</span>
                  <p className="text-sm text-white">{c.content}</p>
                </div>
                <span className="text-[10px] text-zinc-600 pl-2">
                  {new Date(c.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-black/60">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Nhắn tin..."
            className="flex-1 bg-zinc-900 border border-white/10 rounded-full px-4 py-3 text-white focus:outline-none focus:border-blue-500"
          />
          <button 
            onClick={handleSend} 
            disabled={isSending || !newComment.trim()}
            className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:opacity-50 disabled:bg-zinc-800"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};