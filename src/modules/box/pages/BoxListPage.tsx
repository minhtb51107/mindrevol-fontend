import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Package, Inbox, Check, X } from 'lucide-react';
import { boxService } from '../services/box.service';
import { BoxResponse, BoxInvitationResponse } from '../types';
import MainLayout from '@/components/layout/MainLayout';
import { CreateBoxModal } from '../components/CreateBoxModal'; 
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const BoxListPage: React.FC = () => {
    const [boxes, setBoxes] = useState<BoxResponse[]>([]);
    const [invitations, setInvitations] = useState<BoxInvitationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [boxData, invitesData] = await Promise.all([
                boxService.getMyBoxes(0, 50),
                boxService.getMyPendingInvitations()
            ]);
            setBoxes(boxData.content || []);
            setInvitations(invitesData || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Box:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptInvite = async (boxId: string) => {
        try {
            await boxService.acceptInvite(boxId);
            toast.success("Đã tham gia Không gian thành công!");
            fetchAllData(); 
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi khi tham gia");
        }
    };

    const handleRejectInvite = async (boxId: string) => {
        try {
            await boxService.rejectInvite(boxId);
            toast.success("Đã từ chối lời mời");
            fetchAllData(); 
        } catch (error: any) {
            toast.error("Lỗi khi từ chối");
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center w-full min-h-screen bg-zinc-50 dark:bg-[#121212]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/* [ĐÃ SỬA] Thay nền cứng bằng bg-zinc-50 dark:bg-[#121212] */}
            <div className="w-full min-h-screen bg-zinc-50 dark:bg-[#121212] pt-8 pb-20 transition-colors duration-300">
                <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
                    
                    {/* --- HEADER --- */}
                    <div className="flex justify-between items-end mb-8 border-b border-zinc-200 dark:border-white/10 pb-6">
                        <div>
                            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Không gian của bạn</h1>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">Bối cảnh lưu giữ những Hành trình chung</p>
                        </div>
                        
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Tạo không gian</span>
                        </button>
                    </div>

                    {/* --- KHU VỰC LỜI MỜI --- */}
                    {invitations.length > 0 && (
                        <div className="mb-10">
                            <h2 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Inbox size={16} className="text-blue-500 dark:text-blue-400" /> 
                                Lời mời đang chờ ({invitations.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {invitations.map(invite => (
                                    <div key={invite.id} className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-sm dark:shadow-lg transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {/* Avatar Box/Inviter */}
                                            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                                                {invite.boxAvatar ? (
                                                    <span className="text-xl">{invite.boxAvatar}</span>
                                                ) : invite.inviterAvatar ? (
                                                    <img src={invite.inviterAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    <Package size={20} className="text-zinc-400 dark:text-zinc-500" />
                                                )}
                                            </div>
                                            
                                            {/* Info */}
                                            <div className="truncate">
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300 truncate">
                                                    <span className="font-bold text-zinc-900 dark:text-white">{invite.inviterName}</span> mời bạn vào
                                                </p>
                                                <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 truncate">{invite.boxName}</p>
                                                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                                                    {formatDistanceToNow(new Date(invite.sentAt), { addSuffix: true, locale: vi })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0 ml-4">
                                            <button 
                                                onClick={() => handleAcceptInvite(invite.boxId)}
                                                className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-600/20 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white flex items-center justify-center transition-colors"
                                                title="Chấp nhận"
                                            >
                                                <Check size={18} strokeWidth={3} />
                                            </button>
                                            <button 
                                                onClick={() => handleRejectInvite(invite.boxId)}
                                                className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-500 hover:bg-red-100 hover:text-red-500 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-red-500/20 dark:hover:text-red-500 flex items-center justify-center transition-colors"
                                                title="Từ chối"
                                            >
                                                <X size={18} strokeWidth={3} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- BODY (DANH SÁCH BOX) --- */}
                    {boxes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#1A1A1A] rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 mt-4 transition-colors">
                            <div className="w-20 h-20 bg-zinc-100 dark:bg-[#242424] rounded-full flex items-center justify-center shadow-inner mb-6">
                                <Package className="text-zinc-400 dark:text-zinc-600" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Chưa có không gian nào</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 text-center max-w-sm leading-relaxed">
                                Tạo một không gian để quy tụ bạn bè hoặc gia đình. Mọi hành trình tạo trong này sẽ được tự động chia sẻ với họ.
                            </p>
                            <button 
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-black px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:scale-105"
                            >
                                <Plus size={20} /> Tạo Không gian đầu tiên
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {boxes.map((box) => (
                                <Link 
                                    to={`/box/${box.id}`} 
                                    key={box.id}
                                    className="group flex flex-col bg-white dark:bg-[#1c1c1e] rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm hover:shadow-lg dark:shadow-none hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-zinc-50 dark:hover:bg-[#202022] transition-all hover:-translate-y-1 overflow-hidden"
                                >
                                    {/* Dải màu hoặc Ảnh Cover */}
                                    <div 
                                        className="h-16 w-full relative overflow-hidden"
                                        style={{ 
                                            backgroundColor: box.themeColor || '#27272a',
                                            backgroundImage: box.coverImage ? `url(${box.coverImage})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1c1c1e] to-transparent opacity-90 dark:opacity-80 transition-colors"></div>
                                    </div>
                                    
                                    <div className="p-5 flex-1 flex flex-col relative z-10 -mt-6">
                                        <div className="w-12 h-12 bg-zinc-50 dark:bg-[#121212] rounded-xl border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-3 shadow-sm transition-colors">
                                            {box.avatar ? (
                                                <span className="text-2xl drop-shadow-sm">{box.avatar}</span>
                                            ) : (
                                                <Package size={20} className="text-blue-500" />
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors truncate">
                                            {box.name}
                                        </h3>
                                        
                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 line-clamp-2 flex-1 leading-relaxed transition-colors">
                                            {box.description || "Không gian chia sẻ và kết nối."}
                                        </p>
                                        
                                        <div className="flex items-center gap-2 mt-5 text-zinc-500 dark:text-zinc-400 text-xs font-bold">
                                            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 px-2.5 py-1.5 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                <Users size={14} />
                                                <span>{box.memberCount} thành viên</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <CreateBoxModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onSuccess={fetchAllData} 
            />
        </MainLayout>
    );
};

export default BoxListPage;