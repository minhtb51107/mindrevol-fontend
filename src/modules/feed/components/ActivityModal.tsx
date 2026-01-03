import React from 'react';
import { X, Loader2, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { usePostActivities } from '../hooks/usePostActivities';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

// [FIX] Cập nhật tham số nhận vào là string | undefined | null
const parseContent = (content?: string | null) => {
  // Nếu content là null/undefined/rỗng thì trả về chuỗi rỗng
  if (!content) return "";
  
  try {
    if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
      const parsed = JSON.parse(content);
      return parsed.content || content;
    }
  } catch (e) {
    // Ignore error
  }
  return content;
};

export const ActivityModal = ({ isOpen, onClose, postId }: ActivityModalProps) => {
  const { activities, isLoading } = usePostActivities(postId, isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#1a1a1a] md:rounded-2xl rounded-t-3xl border-t md:border border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#1a1a1a]/80 backdrop-blur-xl sticky top-0 z-10">
          <h3 className="text-white font-bold text-lg tracking-tight">Hoạt động mới</h3>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-0 min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
          ) : activities.length > 0 ? (
            <div className="flex flex-col">
                {activities.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                    
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img 
                        src={item.userAvatar || `https://ui-avatars.com/api/?name=${item.userFullName}&background=random`} 
                        alt={item.userFullName} 
                        className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-sm" 
                      />
                      
                      {/* Icon loại hoạt động */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-zinc-800 rounded-full flex items-center justify-center shadow-md border border-[#1a1a1a] text-white">
                        {item.type === 'COMMENT' ? <MessageCircle size={10} className="text-blue-400 fill-blue-400/20" /> : <span className="text-[10px]">{item.emoji}</span>}
                      </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      
                      {/* Name & Time */}
                      <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white truncate mr-2">
                            {item.userFullName}
                          </span>
                          <span className="text-[11px] text-zinc-500 font-medium whitespace-nowrap">
                            {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: vi }) : ''}
                          </span>
                      </div>
                      
                      {/* Body Text / Reaction Big */}
                      <div className="text-[15px] leading-relaxed break-words text-zinc-200">
                        {item.type === 'COMMENT' ? (
                            // Gọi hàm parseContent, giờ nó đã chấp nhận undefined
                            <span>{parseContent(item.content)}</span>
                        ) : (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-zinc-400 text-sm">đã thả cảm xúc</span>
                                <span className="text-2xl animate-in zoom-in duration-300 origin-left">{item.emoji}</span>
                            </div>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
               <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-zinc-600" />
               </div>
               <p className="text-zinc-400 font-medium">Chưa có hoạt động nào</p>
               <p className="text-zinc-600 text-sm mt-1">Hãy là người đầu tiên tương tác!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};