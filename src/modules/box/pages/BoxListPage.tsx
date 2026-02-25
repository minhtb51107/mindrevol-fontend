import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Package } from 'lucide-react';
import { boxService } from '../services/box.service';
import { BoxResponse } from '../types';
import MainLayout from '@/components/layout/MainLayout';
import { CreateBoxModal } from '../components/CreateBoxModal'; // [THÊM MỚI] Import Modal

const BoxListPage: React.FC = () => {
    const [boxes, setBoxes] = useState<BoxResponse[]>([]);
    const [loading, setLoading] = useState(true);
    
    // [THÊM MỚI] State quản lý đóng/mở Modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchBoxes();
    }, []);

    const fetchBoxes = async () => {
        try {
            const data = await boxService.getMyBoxes(0, 50);
            setBoxes(data.content || []);
        } catch (error) {
            console.error("Lỗi khi tải danh sách Không gian:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center w-full min-h-screen bg-[#121212]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="w-full min-h-screen bg-[#121212] pt-8 pb-20">
                <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
                    {/* --- HEADER --- */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Không gian của bạn</h1>
                            <p className="text-zinc-400 text-sm mt-1">Bối cảnh lưu giữ những Hành trình chung</p>
                        </div>
                        
                        {/* NÚT TẠO GÓC TRÊN CÙNG */}
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Tạo không gian</span>
                        </button>
                    </div>

                    {/* --- BODY --- */}
                    {boxes.length === 0 ? (
                        /* Empty State: Chưa có Box */
                        <div className="flex flex-col items-center justify-center py-20 bg-[#1A1A1A] rounded-2xl border border-dashed border-zinc-800">
                            <div className="w-16 h-16 bg-[#242424] rounded-full flex items-center justify-center shadow-inner mb-4">
                                <Package className="text-zinc-500" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">Chưa có không gian nào</h3>
                            <p className="text-zinc-400 text-sm mb-6 text-center max-w-sm">
                                Tạo một không gian để quy tụ bạn bè hoặc gia đình. Mọi hành trình tạo trong này sẽ được tự động chia sẻ với họ.
                            </p>
                            {/* NÚT TẠO TRONG EMPTY STATE */}
                            <button 
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                            >
                                <Plus size={18} />
                                Tạo ngay
                            </button>
                        </div>
                    ) : (
                        /* Grid Danh sách Box */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {boxes.map((box) => (
                                <Link 
                                    to={`/box/${box.id}`} 
                                    key={box.id}
                                    className="group flex flex-col bg-[#1A1A1A] rounded-2xl border border-zinc-800 shadow-sm hover:border-zinc-600 transition-all overflow-hidden"
                                >
                                    {/* Dải màu hoặc Ảnh Cover */}
                                    <div 
                                        className="h-14 w-full bg-zinc-800 relative"
                                        style={{ 
                                            backgroundColor: box.themeColor || '#27272a',
                                            backgroundImage: box.coverImage ? `url(${box.coverImage})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    >
                                        {/* Phủ mờ một chút để làm nền */}
                                        {box.coverImage && <div className="absolute inset-0 bg-black/20"></div>}
                                    </div>
                                    
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2 truncate">
                                            {box.avatar ? (
                                                <span className="text-xl">{box.avatar}</span>
                                            ) : (
                                                <Package size={18} className="text-zinc-500 shrink-0" />
                                            )}
                                            <span className="truncate">{box.name}</span>
                                        </h3>
                                        
                                        <p className="text-zinc-400 text-sm mt-2 line-clamp-2 flex-1">
                                            {box.description || "Không có mô tả"}
                                        </p>
                                        
                                        <div className="flex items-center gap-1.5 mt-4 text-zinc-400 text-xs font-medium bg-[#242424] w-fit px-2 py-1 rounded-md">
                                            <Users size={14} />
                                            <span>{box.memberCount} thành viên</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* [THÊM MỚI] GẮN MODAL TẠO BOX VÀO ĐÂY */}
            <CreateBoxModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onSuccess={fetchBoxes} 
            />
        </MainLayout>
    );
};

export default BoxListPage;