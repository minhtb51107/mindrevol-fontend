import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MoreVertical, Plus, Compass, UserPlus, Trash2, Archive, Edit } from 'lucide-react';
import { boxService } from '../services/box.service';
import { BoxResponse } from '../types';
import MainLayout from '@/components/layout/MainLayout';
import { BoxMembersModal } from '../components/BoxMembersModal';
import { CreateJourneyModal } from '@/modules/journey/components/CreateJourneyModal'; 
import { UpdateBoxModal } from '../components/UpdateBoxModal'; // [THÊM MỚI] Import Modal
import { useAuth } from '@/modules/auth/store/AuthContext';
import { toast } from 'react-hot-toast';

const BoxDetailPage: React.FC = () => {
    const { boxId } = useParams<{ boxId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [box, setBox] = useState<BoxResponse | null>(null);
    const [journeys, setJourneys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // States Modals
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const [isCreateJourneyModalOpen, setIsCreateJourneyModalOpen] = useState(false); 
    const [isUpdateBoxModalOpen, setIsUpdateBoxModalOpen] = useState(false); // [THÊM MỚI]

    // States Dropdown Menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (boxId) {
            fetchBoxData(boxId);
        }
    }, [boxId]);

    const fetchBoxData = async (id: string) => {
        try {
            setLoading(true);
            const [boxRes, journeysRes] = await Promise.all([
                boxService.getBoxDetails(id),
                boxService.getBoxJourneys(id, 0, 20)
            ]);
            setBox(boxRes);
            setJourneys(journeysRes.content || []);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết Không gian:", error);
            // navigate('/box'); // Nếu lỗi thì back về list
        } finally {
            setLoading(false);
        }
    };

    const handleArchiveBox = async () => {
        if (!box || !window.confirm("Bạn có chắc chắn muốn lưu trữ Không gian này? Nó sẽ bị ẩn khỏi danh sách chính.")) return;
        try {
            await boxService.archiveBox(box.id);
            toast.success("Đã lưu trữ Không gian");
            navigate('/box');
        } catch (error) {
            toast.error("Lỗi khi lưu trữ");
        }
    };

    const handleDisbandBox = async () => {
        if (!box || !window.confirm("CẢNH BÁO: Hành động này không thể hoàn tác! Toàn bộ dữ liệu trong Box sẽ bị xóa vĩnh viễn. Bạn có chắc chắn không?")) return;
        try {
            await boxService.disbandBox(box.id);
            toast.success("Đã giải tán Không gian");
            navigate('/box');
        } catch (error) {
            toast.error("Lỗi khi giải tán");
        }
    };

    if (loading) return <MainLayout><div className="flex justify-center items-center h-screen bg-[#121212]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div></MainLayout>;
    if (!box) return null;

    const isOwner = user?.id === box.ownerId; // Kiểm tra quyền

    return (
        <MainLayout>
            <div className="w-full min-h-screen bg-[#121212] text-white pb-20">
                {/* --- HEADER --- */}
                <div className="relative">
                    <div className="h-48 md:h-64 w-full bg-zinc-800 relative" style={{ backgroundColor: box.themeColor || '#27272a' }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent"></div>
                    </div>

                    <div className="absolute top-6 left-4 right-4 md:left-8 md:right-8 flex justify-between items-center z-10">
                        <button onClick={() => navigate('/box')} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition">
                            <ArrowLeft size={20} />
                        </button>
                        
                        {/* [THÊM MỚI] Nút 3 chấm (Menu Settings) */}
                        {isOwner && (
                            <div className="relative" ref={menuRef}>
                                <button 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition text-zinc-300 hover:text-white"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute top-12 right-0 w-48 bg-[#1A1A1A] border border-zinc-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 z-50">
                                        <button 
                                            onClick={() => { setIsUpdateBoxModalOpen(true); setIsMenuOpen(false); }}
                                            className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-2"
                                        >
                                            <Edit size={16} /> Chỉnh sửa
                                        </button>
                                        <button 
                                            onClick={handleArchiveBox}
                                            className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-2"
                                        >
                                            <Archive size={16} /> Lưu trữ
                                        </button>
                                        <div className="h-px bg-zinc-800 my-1" />
                                        <button 
                                            onClick={handleDisbandBox}
                                            className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                                        >
                                            <Trash2 size={16} /> Giải tán
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="max-w-5xl mx-auto px-4 md:px-8 relative -mt-16 md:-mt-20 z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                {box.avatar && <span className="text-4xl md:text-5xl drop-shadow-lg">{box.avatar}</span>}
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md text-white">{box.name}</h1>
                            </div>
                            <p className="text-zinc-300 text-sm md:text-base max-w-2xl">{box.description || "Nơi lưu giữ những hành trình chung."}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                            <div onClick={() => setIsMembersModalOpen(true)} className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/20 transition-all shadow-lg">
                                <Users size={16} className="text-zinc-300" />
                                <span className="text-sm font-bold text-white">{box.memberCount} người</span>
                            </div>
                            <button onClick={() => setIsMembersModalOpen(true)} className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all hover:scale-105 active:scale-95">
                                <UserPlus size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- BODY --- */}
                <div className="max-w-5xl mx-auto px-4 md:px-8 mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Hành trình trong Không gian</h2>
                        <button onClick={() => setIsCreateJourneyModalOpen(true)} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors shadow-sm">
                            <Plus size={18} /><span className="hidden sm:inline">Tạo Hành trình</span>
                        </button>
                    </div>

                    {journeys.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-[#1A1A1A] rounded-3xl border border-zinc-800 border-dashed mt-8">
                            <div className="w-20 h-20 bg-[#242424] rounded-full flex items-center justify-center mb-6 shadow-inner"><Compass className="text-zinc-500 w-10 h-10" /></div>
                            <h3 className="text-xl font-bold text-white mb-2">Chưa có hành trình nào</h3>
                            <p className="text-zinc-400 text-center max-w-md mb-8">Hãy là người đầu tiên tạo một Hành trình trong "{box.name}".</p>
                            <button onClick={() => setIsCreateJourneyModalOpen(true)} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95"><Plus size={20} /> Bắt đầu Hành trình đầu tiên</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {journeys.map((journey) => (
                                <div key={journey.id} className="bg-[#1A1A1A] rounded-2xl p-5 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer group">
                                    <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition line-clamp-1">{journey.name}</h3>
                                    <p className="text-zinc-400 text-sm mt-1 line-clamp-2 min-h-[40px]">{journey.description || "Hành trình chia sẻ chung."}</p>
                                    <div className="mt-4 flex items-center gap-2"><div className="text-xs font-medium text-zinc-500 bg-[#242424] w-fit px-2 py-1 rounded">Đang diễn ra</div></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {box && (
                <BoxMembersModal 
                    isOpen={isMembersModalOpen} onClose={() => setIsMembersModalOpen(false)}
                    boxId={box.id} ownerId={box.ownerId}
                    onMemberChange={() => fetchBoxData(box.id)} 
                />
            )}

            {box && (
                <CreateJourneyModal
                    isOpen={isCreateJourneyModalOpen} onClose={() => setIsCreateJourneyModalOpen(false)}
                    onSuccess={() => fetchBoxData(box.id)} defaultBoxId={box.id} 
                />
            )}

            {/* [THÊM MỚI] Modal Cập nhật Box */}
            {box && (
                <UpdateBoxModal
                    isOpen={isUpdateBoxModalOpen} onClose={() => setIsUpdateBoxModalOpen(false)}
                    onSuccess={() => fetchBoxData(box.id)} boxData={box}
                />
            )}
        </MainLayout>
    );
};

export default BoxDetailPage;