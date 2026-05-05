import React from 'react';
import { X, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { NotificationResponse } from '@/modules/notification/services/notification.service';

interface Props {
    noti: NotificationResponse;
    onClick: (noti: NotificationResponse) => void;
    onDelete: (e: React.MouseEvent, id: string) => void;
    onAction: (e: React.MouseEvent, action: 'ACCEPT' | 'REJECT', noti: NotificationResponse) => void;
}

const ACTIONABLE_TYPES = ['BOX_INVITE', 'JOURNEY_INVITE', 'FRIEND_REQUEST'];

export const NotificationItem: React.FC<Props> = ({ noti, onClick, onDelete, onAction }) => {
    
    const requiresAction = ACTIONABLE_TYPES.includes(noti.type) && !noti.isRead;

    const handleClick = () => {
        if (ACTIONABLE_TYPES.includes(noti.type)) return;
        onClick(noti);
    };

    return (
        <div 
            onClick={handleClick}
            className={cn(
                "px-5 py-4 transition-all duration-300 cursor-pointer flex gap-4 relative border-b border-zinc-100 dark:border-white/5 group",
                // Background xanh nhạt cho thông báo chưa đọc, hover xám nhạt cho thông báo đã đọc
                !noti.isRead 
                    ? "bg-blue-50/60 dark:bg-blue-500/10" 
                    : "bg-transparent hover:bg-zinc-50 dark:hover:bg-white/5"
            )}
        >
            {/* Chấm xanh báo chưa đọc */}
            {!noti.isRead && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
            
            {/* Avatar viền bo tròn mềm mại */}
            <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0 flex items-center justify-center text-xl overflow-hidden shadow-sm border border-zinc-300/50 dark:border-white/10">
                {noti.imageUrl ? (
                    noti.imageUrl.startsWith('http') ? <img src={noti.imageUrl} alt="" className="w-full h-full object-cover" /> : noti.imageUrl
                ) : (
                    <Bell size={20} className="text-zinc-500 dark:text-zinc-400" strokeWidth={2.5} />
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center mt-0.5">
                <h4 className="text-[0.95rem] font-bold text-zinc-900 dark:text-white mb-1 leading-snug line-clamp-2 tracking-tight">
                    {noti.title}
                </h4>
                <p className={cn(
                    "text-[0.85rem] leading-relaxed pr-4 line-clamp-3", 
                    !noti.isRead ? "text-zinc-700 dark:text-zinc-300 font-medium" : "text-zinc-500 dark:text-zinc-400"
                )}>
                    {noti.message}
                </p>
                <p className="text-[0.7rem] text-zinc-400 dark:text-zinc-500 font-bold mt-2 uppercase tracking-widest">
                    {formatDistanceToNow(new Date(noti.createdAt), { addSuffix: true, locale: vi })}
                </p>

                {/* Các nút hành động (Nếu có) */}
                {requiresAction && (
                    <div className="flex gap-2 mt-3.5">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onAction(e, 'ACCEPT', noti); }}
                            className="px-4 py-2 bg-zinc-900 dark:bg-white hover:bg-black dark:hover:bg-zinc-200 active:scale-95 text-white dark:text-zinc-900 text-[0.8rem] font-bold rounded-[12px] transition-all shadow-sm"
                        >
                            Chấp nhận
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onAction(e, 'REJECT', noti); }}
                            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 active:scale-95 text-zinc-700 dark:text-zinc-200 text-[0.8rem] font-bold rounded-[12px] transition-all border border-transparent"
                        >
                            Từ chối
                        </button>
                    </div>
                )}
            </div>

            {/* Nút Xóa (Hiện khi Hover) */}
            <button 
                onClick={(e) => onDelete(e, noti.id)}
                className="absolute right-4 top-4 p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                title="Xóa"
            >
                <X size={16} strokeWidth={2.5} />
            </button>
        </div>
    );
};