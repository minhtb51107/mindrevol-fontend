import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { JourneyMap } from '@/modules/map/components/JourneyMap';
import { useMapPage } from '../hooks/useMapPage';
import { MapHeader } from '../components/MapHeader';
import { MapSidebar } from '../components/MapSidebar';

export const MapPage = () => {
    const {
        navigate, boxes, boxJourneys, expandedBox, friends,
        filterType, filterId, isSidebarOpen, setIsSidebarOpen,
        mapMode, setMapMode, ghostMode, handleGhostModeChange,
        toggleBox, handleSelectMe, handleSelectBox, handleSelectJourney, handleSelectFriend
    } = useMapPage();

    return (
        <MainLayout>
            {/* 
              ĐÃ SỬA: 
              - Thay `relative h-[100dvh]` thành `absolute inset-0` để Map vừa khít 100% không gian trống, không sinh ra thanh cuộn.
              - Khóa thanh cuộn bằng: [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            */}
            <div id="map-wrapper-container" className="absolute inset-0 bg-gray-50 dark:bg-[#121212] overflow-hidden font-quicksand transition-colors duration-500 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                
                <div className="absolute inset-0 z-0">
                    <JourneyMap
                        userId={filterType === 'me' ? 'me' : (filterType === 'friend' ? filterId : undefined)}
                        boxId={filterType === 'box' ? filterId : undefined}
                        journeyId={filterType === 'journey' ? filterId : undefined}
                        mapMode={mapMode}
                        className="w-full h-full"
                    />
                </div>

                <MapHeader 
                    onBack={() => navigate(-1)}
                    isSidebarOpen={isSidebarOpen}
                    onOpenSidebar={() => setIsSidebarOpen(true)}
                />

                <MapSidebar 
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    filterType={filterType}
                    filterId={filterId}
                    boxes={boxes}
                    boxJourneys={boxJourneys}
                    expandedBox={expandedBox}
                    friends={friends}
                    mapMode={mapMode}
                    setMapMode={setMapMode}
                    ghostMode={ghostMode}
                    onGhostModeChange={handleGhostModeChange}
                    onSelectMe={handleSelectMe}
                    onToggleBox={toggleBox}
                    onSelectBox={handleSelectBox}
                    onSelectJourney={handleSelectJourney}
                    onSelectFriend={handleSelectFriend}
                />

            </div>
        </MainLayout>
    );
};