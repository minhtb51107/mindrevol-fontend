import React, { useEffect, useState } from 'react';
import { X, Heart, MessageCircle } from 'lucide-react';
import { journeyService } from '@/modules/journey/services/journey.service';
import { Checkin } from '@/modules/checkin/types';

interface Props {
    journeyId: string;
    onClose: () => void;
}

export const RecapDetailModal: React.FC<Props> = ({ journeyId, onClose }) => {
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API lấy feed recap (đã implement ở backend turn trước)
        journeyService.getRecapFeed(journeyId)
            .then(res => setCheckins(res.data.content))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [journeyId]);

    return (
        <div className="fixed inset-0 z-[9999] bg-black animate-in fade-in duration-200 overflow-y-auto">
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur p-4 flex justify-between items-center border-b border-white/10">
                <h2 className="text-lg font-bold text-white">Kỷ niệm hành trình</h2>
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white"><X /></button>
            </div>

            <div className="max-w-md mx-auto p-1">
                {loading ? (
                    <div className="text-white text-center py-10">Đang tải kỷ niệm...</div>
                ) : (
                    <div className="grid grid-cols-3 gap-1">
                        {checkins.map(checkin => (
                            <div key={checkin.id} className="relative aspect-square bg-zinc-800">
                                <img 
                                    src={checkin.thumbnailUrl || checkin.imageUrl} 
                                    className="w-full h-full object-cover" 
                                    loading="lazy"
                                />
                                {/* Overlay hiện số like/cmt khi hover (hoặc luôn hiện mờ) */}
                                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white font-bold">
                                    <span className="flex items-center gap-1"><Heart className="w-4 h-4 fill-white"/> {checkin.reactionCount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};