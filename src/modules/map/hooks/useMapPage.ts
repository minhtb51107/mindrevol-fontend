import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { boxService } from '@/modules/box/services/box.service';
import { BoxResponse } from '@/modules/box/types';
import { JourneyResponse } from '@/modules/journey/types';

export const useMapPage = () => {
    const navigate = useNavigate();
    
    const [boxes, setBoxes] = useState<BoxResponse[]>([]);
    const [boxJourneys, setBoxJourneys] = useState<Record<string, JourneyResponse[]>>({});
    const [expandedBox, setExpandedBox] = useState<string | null>(null);

    const [filterType, setFilterType] = useState<'me' | 'box' | 'journey'>('me');
    const [filterId, setFilterId] = useState<string>('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // XỬ LÝ LỖI KHUYẾT BẢN ĐỒ KHI SIDEBAR TRÁI CO GIÃN
    useEffect(() => {
        const triggerMapResize = () => {
            window.dispatchEvent(new Event('resize'));
        };

        const timer1 = setTimeout(triggerMapResize, 300);
        const mapContainer = document.getElementById('map-wrapper-container');
        let resizeObserver: ResizeObserver;
        
        if (mapContainer) {
            resizeObserver = new ResizeObserver(() => {
                setTimeout(triggerMapResize, 300); 
            });
            resizeObserver.observe(mapContainer);
        }

        return () => {
            clearTimeout(timer1);
            if (resizeObserver && mapContainer) {
                resizeObserver.unobserve(mapContainer);
            }
        };
    }, []);

    // Fetch danh sách Box lần đầu
    useEffect(() => {
        const fetchBoxes = async () => {
            try {
                const res: any = await boxService.getMyBoxes('all', '', 0, 50);
                setBoxes(res.content || []);
            } catch (error) {
                console.error("Lỗi lấy danh sách Box:", error);
            }
        };
        fetchBoxes();
    }, []);

    const toggleBox = async (boxId: string) => {
        if (expandedBox === boxId) {
            setExpandedBox(null);
            return;
        }
        setExpandedBox(boxId);
        
        if (!boxJourneys[boxId]) {
            try {
                const jRes: any = await boxService.getBoxJourneys(boxId, 0, 50);
                setBoxJourneys(prev => ({ ...prev, [boxId]: jRes.content || [] }));
            } catch (error) {
                console.error("Lỗi lấy hành trình của box:", error);
            }
        }
    };

    const handleSelectMe = () => {
        setFilterType('me');
        setFilterId('');
    };

    const handleSelectBox = (boxId: string) => {
        setFilterType('box');
        setFilterId(boxId);
    };

    const handleSelectJourney = (journeyId: string) => {
        setFilterType('journey');
        setFilterId(journeyId);
    };

    return {
        navigate,
        boxes, boxJourneys, expandedBox,
        filterType, filterId, isSidebarOpen, setIsSidebarOpen,
        toggleBox, handleSelectMe, handleSelectBox, handleSelectJourney
    };
};