import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { boxService } from '@/modules/box/services/box.service';
import { friendService, FriendshipResponse } from '@/modules/user/services/friend.service';
import { BoxResponse } from '@/modules/box/types';
import { JourneyResponse } from '@/modules/journey/types';
import { toast } from 'react-hot-toast';

export const useMapPage = () => {
    const navigate = useNavigate();
    
    const [boxes, setBoxes] = useState<BoxResponse[]>([]);
    const [boxJourneys, setBoxJourneys] = useState<Record<string, JourneyResponse[]>>({});
    const [friends, setFriends] = useState<FriendshipResponse[]>([]);
    
    const [expandedBox, setExpandedBox] = useState<string | null>(null);

    const [filterType, setFilterType] = useState<'me' | 'box' | 'journey' | 'friend'>('me');
    const [filterId, setFilterId] = useState<string>('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // --- STATE MỚI CHO HEATMAP & GHOST MODE ---
    const [mapMode, setMapMode] = useState<'markers' | 'heatmap'>('markers');
    const [ghostMode, setGhostMode] = useState<'PRECISE' | 'BLURRED' | 'HIDDEN'>('PRECISE');

    // Cập nhật Resize cho Map
    useEffect(() => {
        const triggerMapResize = () => window.dispatchEvent(new Event('resize'));
        const timer1 = setTimeout(triggerMapResize, 300);
        const mapContainer = document.getElementById('map-wrapper-container');
        let resizeObserver: ResizeObserver;
        
        if (mapContainer) {
            resizeObserver = new ResizeObserver(() => setTimeout(triggerMapResize, 300));
            resizeObserver.observe(mapContainer);
        }

        return () => {
            clearTimeout(timer1);
            if (resizeObserver && mapContainer) resizeObserver.unobserve(mapContainer);
        };
    }, []);

    // Tải dữ liệu ban đầu
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const resBox: any = await boxService.getMyBoxes('all', '', 0, 50);
                setBoxes(resBox.content || []);
                
                const resFriends: any = await friendService.getMyFriends();
                setFriends(resFriends || []);

                // (Tùy chọn) Có thể fetch setting Ghost Mode từ backend ở đây
                // const settings = await userService.getNotificationSettings();
                // setGhostMode(settings.locationVisibility || 'PRECISE');
            } catch (error) {
                console.error("Lỗi tải dữ liệu Sidebar:", error);
            }
        };
        fetchInitialData();
    }, []);

    // Xử lý thay đổi Ghost Mode (Call API Backend)
    const handleGhostModeChange = async (mode: 'PRECISE' | 'BLURRED' | 'HIDDEN') => {
        setGhostMode(mode);
        toast.success(`Đã đổi quyền riêng tư: ${mode === 'PRECISE' ? 'Chính xác' : mode === 'BLURRED' ? 'Làm mờ' : 'Tàng hình'}`);
        // TODO: Sẽ gọi API userService.updateNotificationSettings({ locationVisibility: mode }) ở đây
    };

    const toggleBox = async (boxId: string) => {
        if (expandedBox === boxId) { setExpandedBox(null); return; }
        setExpandedBox(boxId);
        if (!boxJourneys[boxId]) {
            try {
                const jRes: any = await boxService.getBoxJourneys(boxId, 0, 50);
                setBoxJourneys(prev => ({ ...prev, [boxId]: jRes.content || [] }));
            } catch (error) { console.error("Lỗi:", error); }
        }
    };

    const handleSelectMe = () => { setFilterType('me'); setFilterId(''); };
    const handleSelectBox = (boxId: string) => { setFilterType('box'); setFilterId(boxId); };
    const handleSelectJourney = (journeyId: string) => { setFilterType('journey'); setFilterId(journeyId); };
    const handleSelectFriend = (friendId: string) => { setFilterType('friend'); setFilterId(friendId); };

    return {
        navigate,
        boxes, boxJourneys, expandedBox, friends,
        filterType, filterId, isSidebarOpen, setIsSidebarOpen,
        mapMode, setMapMode, ghostMode, handleGhostModeChange,
        toggleBox, handleSelectMe, handleSelectBox, handleSelectJourney, handleSelectFriend
    };
};