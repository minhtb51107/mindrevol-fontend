import { useState, useRef } from 'react';
import { Checkin } from '../types';

interface UseArchivedCheckinsProps {
    onClose: () => void;
}

export const useArchivedCheckins = ({ onClose }: UseArchivedCheckinsProps) => {
    const [selectedCheckin, setSelectedCheckin] = useState<Checkin | null>(null);

    // ==========================================
    // GESTURE: KÉO ĐỂ ĐÓNG (DRAG TO DISMISS)
    // ==========================================
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);

    const onDragStart = (clientY: number) => {
        dragStartY.current = clientY;
        setIsDragging(true);
    };

    const onDragMove = (clientY: number) => {
        if (!isDragging) return;
        const delta = clientY - dragStartY.current;
        // Chỉ cho phép kéo xuống (delta > 0)
        if (delta > 0) {
            setDragY(delta);
        }
    };

    const onDragEnd = () => {
        setIsDragging(false);
        if (dragY > 150) { // Nếu kéo xuống hơn 150px thì đóng luôn
            onClose();
            setTimeout(() => setDragY(0), 300); // Reset sau khi animation kết thúc
        } else {
            setDragY(0); // Trôi ngược về vị trí cũ nếu kéo chưa đủ lực
        }
    };

    return {
        selectedCheckin, setSelectedCheckin,
        dragY, isDragging,
        onDragStart, onDragMove, onDragEnd
    };
};