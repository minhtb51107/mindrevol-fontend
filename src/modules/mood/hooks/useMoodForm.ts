import { useState, useEffect } from 'react';
import { MoodRequest } from '../types';
import toast from 'react-hot-toast';

export const useMoodForm = (
    isOpen: boolean, 
    onClose: () => void, 
    onSubmit: (data: MoodRequest) => Promise<void>,
    initialIcon?: string, 
    initialMessage?: string, 
    initialSpotifyTrackId?: string, // Thêm dòng này
    initialActivity?: string,       // Thêm dòng này
    initialLocation?: string,       // Thêm dòng này
    defaultIcon: string = "default"
) => {
    const [icon, setIcon] = useState(initialIcon || defaultIcon);
    const [message, setMessage] = useState(initialMessage || "");
    
    // Hứng dữ liệu cũ thay vì để ""
    const [spotifyTrackId, setSpotifyTrackId] = useState(initialSpotifyTrackId || "");
    const [activity, setActivity] = useState(initialActivity || "");
    const [location, setLocation] = useState(initialLocation || "");
    
    const [loading, setLoading] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    // Mỗi khi Modal mở, nạp lại toàn bộ dữ liệu hiện tại
    useEffect(() => {
        if (isOpen) {
            setIcon(initialIcon || defaultIcon);
            setMessage(initialMessage || "");
            setSpotifyTrackId(initialSpotifyTrackId || "");
            setActivity(initialActivity || "");
            setLocation(initialLocation || "");
        }
    }, [isOpen, initialIcon, initialMessage, initialSpotifyTrackId, initialActivity, initialLocation, defaultIcon]);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Trình duyệt không hỗ trợ định vị");
            return;
        }

        setIsFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    
                    const city = data.address?.city || data.address?.town || data.address?.state || "Vị trí không xác định";
                    setLocation(city);
                    toast.success("Đã cập nhật vị trí!");
                } catch (error) {
                    setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
                } finally {
                    setIsFetchingLocation(false);
                }
            },
            (error) => {
                toast.error("Vui lòng cho phép truy cập vị trí");
                setIsFetchingLocation(false);
            }
        );
    };

    // Hàm submit nhận trackId mới (nếu có chọn) hoặc giữ trackId cũ
    const handleSubmit = async (newSpotifyId?: string) => {
        setLoading(true);
        try {
            const finalTrackId = newSpotifyId !== undefined ? newSpotifyId : spotifyTrackId;
            await onSubmit({ 
                icon, 
                message, 
                spotifyTrackId: finalTrackId, 
                activity, 
                location 
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return {
        icon, setIcon, message, setMessage,
        activity, setActivity, location, setLocation, 
        spotifyTrackId, setSpotifyTrackId,
        loading, handleSubmit,
        isFetchingLocation, handleGetLocation
    };
};