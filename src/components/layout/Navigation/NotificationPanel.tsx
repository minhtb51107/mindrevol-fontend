import React from 'react';
import { X, Bell, CheckCheck, Loader2, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/modules/notification/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { NotificationResponse } from '@/modules/notification/services/notification.service';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    
    const { 
        notifications, isLoading, filter, setFilter, 
        markAsRead, markAllAsRead, deleteNotification, deleteAll, handleAction 
    } = useNotifications(isOpen);

    const handleItemClick = (noti: NotificationResponse) => {
        if (!noti.isRead) markAsRead(noti.id);
        
        if (['CHECKIN', 'COMMENT'].includes(noti.type)) {
            // navigate(...);
            onClose();
        }
    };

    const handleItemAction = async (e: React.MouseEvent, action: 'ACCEPT' | 'REJECT', noti: NotificationResponse) => {
        const success = await handleAction(action, noti);
        if (success && action === 'ACCEPT' && noti.type === 'BOX_INVITE') {
            navigate(`/box/${noti.referenceId}`);
            onClose();
        }
    };

    return (
        <div 
            className={cn(
                "fixed z-[100] transition-all duration-300 flex flex-col font-sans",
                
                // --- MOBILE: Full màn hình trượt từ dưới lên ---
                "max-md:inset-0 max-md:w-full max-md:h-[100dvh] max-md:bg-white max-md:dark:bg-[#121212]",

                // --- DESKTOP: Modal nổi ở góc trên cùng bên phải ---
                "md:top-[44px] md:right-5 md:w-[380px] md:max-h-[calc(100vh-80px)]",
                "md:bg-white/95 md:dark:bg-[#121212]/95 md:backdrop-blur-xl md:rounded-[24px]",
                "md:border md:border-zinc-200/50 md:dark:border-white/10 md:shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
                
                // Hiệu ứng Ẩn/Hiện (Scale & Fade cho Desktop, Translate cho Mobile)
                isOpen 
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
                    : "opacity-0 pointer-events-none max-md:translate-y-8 md:translate-y-[-10px] md:scale-95 md:origin-top-right"
            )}
        >
            {/* HEADER */}
            <div className="p-4 md:px-5 md:py-4 flex justify-between items-center shrink-0 border-b border-zinc-200/50 dark:border-white/10 bg-transparent z-10">
                
                <div className="flex items-center gap-2 md:gap-0">
                    {/* Nút Back (Chỉ hiện trên Mobile) */}
                    <button onClick={onClose} className="md:hidden p-2 -ml-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors active:scale-95">
                        <ArrowLeft size={22} strokeWidth={2.5} />
                    </button>
                    
                    <h2 className="text-[1.2rem] font-bold text-zinc-900 dark:text-white tracking-wide">
                        Thông báo
                    </h2>
                </div>

                <div className="flex items-center gap-1">
                    <button onClick={markAllAsRead} className="text-zinc-400 hover:text-blue-500 p-2 transition-colors rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 active:scale-95" title="Đánh dấu đã đọc tất cả">
                        <CheckCheck size={20} strokeWidth={2.5} />
                    </button>
                    <button onClick={deleteAll} className="text-zinc-400 hover:text-red-500 p-2 transition-colors rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 active:scale-95" title="Xóa tất cả">
                        <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                    
                    {/* Nút Đóng (Chỉ hiện trên Desktop) */}
                    <button onClick={onClose} className="hidden md:flex p-2 ml-1 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* FILTER BUTTONS */}
            <div className="px-4 md:px-5 py-3 flex items-center gap-2.5 shrink-0 border-b border-zinc-200/50 dark:border-white/10">
                <button 
                    onClick={() => setFilter('ALL')} 
                    className={cn(
                        "px-4 py-1.5 rounded-full text-[0.85rem] font-bold transition-all active:scale-95", 
                        filter === 'ALL' 
                            ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm" 
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    )}
                >
                    Tất cả
                </button>
                <button 
                    onClick={() => setFilter('UNREAD')} 
                    className={cn(
                        "px-4 py-1.5 rounded-full text-[0.85rem] font-bold transition-all active:scale-95", 
                        filter === 'UNREAD' 
                            ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm" 
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    )}
                >
                    Chưa đọc
                </button>
            </div>

            {/* NOTIFICATION LIST */}
            <div className="flex-1 overflow-y-auto mt-1 pb-24 md:pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {isLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-zinc-400" size={26} /></div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-16 text-zinc-500 flex flex-col items-center">
                        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-5 border border-zinc-200/50 dark:border-white/5 shadow-sm">
                            <Bell size={32} className="text-zinc-400 dark:text-zinc-500" strokeWidth={2} />
                        </div>
                        <p className="text-[1rem] font-bold text-zinc-800 dark:text-zinc-200">Chưa có thông báo nào</p>
                        <p className="text-[0.85rem] text-zinc-500 dark:text-zinc-400 font-medium mt-1 px-8">Chúng mình sẽ báo cho bạn ngay khi có tin mới.</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {notifications.map((noti) => (
                            <NotificationItem 
                                key={noti.id} 
                                noti={noti} 
                                onClick={handleItemClick}
                                onDelete={async (e, id) => { e.stopPropagation(); deleteNotification(id); }}
                                onAction={handleItemAction}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};