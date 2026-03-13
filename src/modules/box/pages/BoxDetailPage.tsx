import React from 'react';
import { useParams } from 'react-router-dom';
import { Map as MapIcon } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useBoxDetail } from '../hooks/useBoxDetail';
import { JourneyMap } from '@/modules/map/components/JourneyMap';
import { BoxMembersModal } from '../components/BoxMembersModal';
import { CreateJourneyModal } from '@/modules/journey/components/CreateJourneyModal'; 
import { UpdateBoxModal } from '../components/UpdateBoxModal'; 
import { useAuth } from '@/modules/auth/store/AuthContext';

import { BoxHeader } from '../components/BoxHeader';
import { BoxJourneyList } from '../components/BoxJourneyList';

const BoxDetailPage: React.FC = () => {
    const { boxId } = useParams<{ boxId: string }>();
    const { user } = useAuth();
    
    const {
        box, journeys, loading, isOwner, navigate,
        viewMode, setViewMode, isMenuOpen, setIsMenuOpen, menuRef,
        isMembersModalOpen, setIsMembersModalOpen,
        isCreateJourneyModalOpen, setIsCreateJourneyModalOpen,
        isUpdateBoxModalOpen, setIsUpdateBoxModalOpen,
        fetchBoxData, handleArchiveBox, handleDisbandBox
    } = useBoxDetail(boxId, user?.id);

    if (loading) {
        return (
            <MainLayout>
                {/* [ĐÃ SỬA]: bg-zinc-50 dark:bg-[#121212] */}
                <div className="flex justify-center items-center min-h-screen bg-zinc-50 dark:bg-[#121212]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-white"></div>
                </div>
            </MainLayout>
        );
    }
    
    if (!box) return null;

    return (
        <MainLayout>
            {/* [ĐÃ SỬA]: bg-zinc-50 dark:bg-[#121212] và text-zinc-900 dark:text-white */}
            <div className="w-full min-h-screen bg-zinc-50 dark:bg-[#121212] text-zinc-900 dark:text-white pb-20 transition-colors duration-300">
                
                <BoxHeader 
                    box={box}
                    isOwner={isOwner}
                    navigate={navigate}
                    menuRef={menuRef}
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    setIsUpdateBoxModalOpen={setIsUpdateBoxModalOpen}
                    handleArchiveBox={handleArchiveBox}
                    handleDisbandBox={handleDisbandBox}
                    setIsMembersModalOpen={setIsMembersModalOpen}
                />

                <div className="max-w-5xl mx-auto px-4 md:px-8 mt-12">
                    
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-4">
                            <MapIcon className="text-blue-500" size={24} />
                            <h2 className="text-xl font-bold">Bản đồ kỷ niệm</h2>
                        </div>
                        <JourneyMap boxId={box.id} />
                    </div>

                    <BoxJourneyList 
                        journeys={journeys}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        setIsCreateJourneyModalOpen={setIsCreateJourneyModalOpen}
                        navigate={navigate}
                        boxName={box.name}
                    />
                </div>
            </div>

            {box && <BoxMembersModal isOpen={isMembersModalOpen} onClose={() => setIsMembersModalOpen(false)} boxId={box.id} ownerId={box.ownerId} onMemberChange={() => fetchBoxData(box.id)} />}
            {box && <CreateJourneyModal isOpen={isCreateJourneyModalOpen} onClose={() => setIsCreateJourneyModalOpen(false)} onSuccess={() => fetchBoxData(box.id)} defaultBoxId={box.id} />}
            {box && <UpdateBoxModal isOpen={isUpdateBoxModalOpen} onClose={() => setIsUpdateBoxModalOpen(false)} onSuccess={() => fetchBoxData(box.id)} boxData={box} />}
        </MainLayout>
    );
};

export default BoxDetailPage;