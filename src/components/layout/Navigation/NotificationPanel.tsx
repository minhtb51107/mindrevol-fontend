import React, { useState, useEffect } from 'react';
import { X, Bell, CheckCheck, Loader2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { notificationService, NotificationResponse } from '@/modules/notification/services/notification.service';
import { boxService } from '@/modules/box/services/box.service'; 
import { toast } from 'react-hot-toast'; 
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const data = await notificationService.getMyNotifications(0, 30);
            
            // [FIX LỖI] Chuẩn hóa dữ liệu chống lỗi Jackson Backend cắt mất chữ "is"
            const normalizedData = (data.content || []).map((n: any) => ({
                ...n,
                isRead: n.isRead !== undefined ? n.isRead : n.read 
            }));
            
            setNotifications(normalizedData);
        } catch (error) {
            console.error("Lỗi tải thông báo", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Lỗi mark all read", error);
        }
    };

    const handleNotificationClick = async (notification: NotificationResponse) => {
        // Bắt buộc nhấn nút với Box, không cho nhấn ra ngoài nền
        if (notification.type === 'BOX_INVITE') return; 

        if (!notification.isRead) {
            try {
                await notificationService.markAsRead(notification.id);
                setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
            } catch (e) { console.error(e); }
        }

        if (notification.type === 'CHECKIN' || notification.type === 'COMMENT') {
            onClose();
        }
    };

    // Xử lý Chấp nhận
    const handleAcceptBox = async (e: React.MouseEvent, noti: NotificationResponse) => {
        e.stopPropagation(); 
        try {
            await boxService.acceptInvite(noti.referenceId);
            toast.success("Đã tham gia Không gian!");
            
            await notificationService.markAsRead(noti.id);
            setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, isRead: true } : n));
            
            navigate(`/box/${noti.referenceId}`);
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Lời mời đã hết hạn");
            setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, isRead: true } : n));
        }
    };

    // Xử lý Từ chối
    const handleRejectBox = async (e: React.MouseEvent, noti: NotificationResponse) => {
        e.stopPropagation();
        try {
            await boxService.rejectInvite(noti.referenceId);
            await notificationService.markAsRead(noti.id);
            setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, isRead: true } : n));
            toast.success("Đã từ chối lời mời");
        } catch (error) {
            console.error(error);
        }
    };

    // [THÊM MỚI] Xóa 1 thông báo
    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); 
        try {
            setNotifications(prev => prev.filter(n => n.id !== id)); 
            await notificationService.deleteNotification(id);
        } catch (err) { console.error(err); }
    };

    // [THÊM MỚI] Xóa tất cả
    const handleDeleteAll = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn dọn sạch toàn bộ thông báo không?")) return;
        try {
            setNotifications([]);
            await notificationService.deleteAllNotifications();
            toast.success("Đã dọn sạch thông báo");
        } catch (err) { console.error(err); }
    };

    const filteredNotifications = filter === 'ALL' 
        ? notifications 
        : notifications.filter(n => !n.isRead);

    return (
        <div 
            className={cn(
                "fixed top-0 bottom-0 left-[80px] w-[350px] bg-[#121212] border-r border-white/10 z-40 shadow-[20px_0_40px_rgba(0,0,0,0.5)] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col",
                isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
            )}
        >
            <div className="p-6 pb-4 flex justify-between items-center shrink-0">
                <h2 className="text-2xl font-extrabold text-white">Thông báo</h2>
                <div className="flex items-center gap-1">
                    <button onClick={handleMarkAllRead} className="text-blue-500 hover:text-blue-400 p-2" title="Đánh dấu tất cả đã đọc">
                        <CheckCheck size={20} />
                    </button>
                    {/* [THÊM MỚI] Nút thùng rác */}
                    <button onClick={handleDeleteAll} className="text-red-500 hover:text-red-400 p-2" title="Xóa tất cả thông báo">
                        <Trash2 size={18} />
                    </button>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="px-6 py-2 flex items-center gap-3 shrink-0">
                <button onClick={() => setFilter('ALL')} className={cn("px-4 py-1.5 rounded-full text-sm font-bold transition-colors", filter === 'ALL' ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 hover:text-white")}>Tất cả</button>
                <button onClick={() => setFilter('UNREAD')} className={cn("px-4 py-1.5 rounded-full text-sm font-bold transition-colors", filter === 'UNREAD' ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 hover:text-white")}>Chưa đọc</button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-zinc-500" /></div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 flex flex-col items-center">
                        <Bell size={40} className="mb-3 opacity-20" />
                        <p>Không có thông báo nào.</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {filteredNotifications.map((noti) => (
                            <div 
                                key={noti.id} 
                                onClick={() => handleNotificationClick(noti)}
                                className={cn(
                                    "px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer flex gap-4 relative border-b border-white/5 group", // Thêm chữ group
                                    !noti.isRead ? "bg-blue-500/5" : ""
                                )}
                            >
                                {!noti.isRead && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />}
                                
                                <div className="w-11 h-11 rounded-full bg-zinc-800 shrink-0 flex items-center justify-center text-xl overflow-hidden">
                                    {noti.imageUrl ? (
                                        noti.imageUrl.startsWith('http') ? <img src={noti.imageUrl} alt="" className="w-full h-full object-cover" /> : noti.imageUrl
                                    ) : (
                                        <Bell size={20} className="text-zinc-500" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white mb-0.5">{noti.title}</h4>
                                    <p className={cn("text-sm leading-snug", !noti.isRead ? "text-zinc-300 font-medium" : "text-zinc-500")}>
                                        {noti.message}
                                    </p>
                                    <p className="text-[11px] text-blue-400 font-medium mt-1.5 uppercase tracking-wider">
                                        {formatDistanceToNow(new Date(noti.createdAt), { addSuffix: true, locale: vi })}
                                    </p>

                                    {noti.type === 'BOX_INVITE' && !noti.isRead && (
                                        <div className="flex gap-2 mt-3">
                                            <button 
                                                onClick={(e) => handleAcceptBox(e, noti)}
                                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors"
                                            >
                                                Chấp nhận
                                            </button>
                                            <button 
                                                onClick={(e) => handleRejectBox(e, noti)}
                                                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors border border-zinc-700"
                                            >
                                                Từ chối
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* [THÊM MỚI] NÚT XÓA ẨN - CHỈ HIỆN KHI RÊ CHUỘT VÀO THÔNG BÁO */}
                                <button 
                                    onClick={(e) => handleDelete(e, noti.id)}
                                    className="absolute right-4 top-4 p-1.5 rounded-md text-zinc-500 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Xóa thông báo"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};