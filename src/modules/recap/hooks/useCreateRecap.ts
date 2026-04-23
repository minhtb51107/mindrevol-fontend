import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { recapService } from '../services/recap.service';
import { checkinService } from '@/modules/checkin/services/checkin.service';
import { Checkin } from '@/modules/checkin/types';
import { useAuth } from '@/modules/auth/store/AuthContext';

const speedToDelayMap: Record<number, number> = {
    1: 1500, 2: 1000, 3: 500, 4: 250, 5: 120 
};

export const useCreateRecap = (isOpen: boolean, journeyId: string) => {
    const { user } = useAuth();
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [speed, setSpeed] = useState<number>(3); 
    const [filter, setFilter] = useState<'ALL' | 'ME'>('ALL');
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isLoadingImages, setIsLoadingImages] = useState(false);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    useEffect(() => {
        if (isOpen && journeyId) loadImages();
    }, [isOpen, journeyId, filter]);

    const loadImages = async () => {
        setIsLoadingImages(true);
        try {
            let journeyPhotos: any[] = await checkinService.getJourneyPhotos(journeyId);
            
            if (filter === 'ME') {
                journeyPhotos = journeyPhotos.filter((c: any) => {
                    const ownerId = c.userId || c.user?.id;
                    return ownerId === user?.id;
                });
            }
            
            setCheckins(journeyPhotos as Checkin[]);
            setSelectedIds(new Set(journeyPhotos.map((c: any) => c.id)));
        } catch (error) {
            console.error("Lỗi tải ảnh:", error);
            toast.error("Không thể tải hình ảnh của hành trình lúc này.");
        } finally {
            setIsLoadingImages(false);
        }
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handlePreview = async () => {
        if (selectedIds.size === 0) return toast.error('Vui lòng chọn ít nhất 1 bức ảnh!');
        
        setIsPreviewing(true);
        try {
            const payload = {
                speedDelayMs: speedToDelayMap[speed],
                filterType: filter,
                selectedCheckinIds: Array.from(selectedIds)
            };
            
            const blob = await recapService.previewRecap(journeyId, payload);
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url); 
            toast.success("Bản xem trước đã sẵn sàng!");
        } catch (error: any) {
            toast.error("Không thể tạo video lúc này. Vui lòng thử lại.");
        } finally {
            setIsPreviewing(false);
        }
    };

    const handleDownload = () => {
        if (!previewUrl) return;
        const a = document.createElement('a');
        a.href = previewUrl;
        a.download = `HanhTrinh_${journeyId}_Recap.mp4`; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Đang tải video về thư viện của bạn!");
    };

    return {
        isPreviewing, previewUrl,
        speed, setSpeed,
        filter, setFilter,
        checkins, selectedIds, isLoadingImages,
        toggleSelection, handlePreview, handleDownload
    };
};