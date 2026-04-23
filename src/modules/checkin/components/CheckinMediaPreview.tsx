import React from 'react';
import Cropper from 'react-easy-crop';
import { MapPin, Loader2 } from 'lucide-react';
import { useCheckinModal } from '../hooks/useCheckinModal';

interface CheckinMediaPreviewProps {
    data: ReturnType<typeof useCheckinModal>;
}

export const CheckinMediaPreview: React.FC<CheckinMediaPreviewProps> = ({ data }) => {
    const {
        previewUrl, isVideo, crop, zoom, setCrop, onCropComplete, setZoom,
        videoDuration, startTime, setStartTime, locationSearch,
        customContext, selectedActivity, caption
    } = data;

    const trimmedVideoUrl = isVideo && previewUrl ? `${previewUrl}#t=${startTime},${startTime + 3}` : undefined;

    return (
        <div className="w-full md:w-[55%] h-[45vh] min-h-[45vh] md:min-h-0 md:h-full bg-[#0A0A0A] relative group flex items-center justify-center border-b md:border-b-0 md:border-r border-[#F4EBE1] dark:border-[#2B2A29] overflow-hidden shrink-0">
            {previewUrl ? (
                <Cropper
                    image={!isVideo ? previewUrl : undefined} 
                    video={isVideo ? trimmedVideoUrl : undefined} 
                    crop={crop} 
                    zoom={zoom} 
                    aspect={1} 
                    onCropChange={setCrop} 
                    onCropComplete={onCropComplete} 
                    onZoomChange={setZoom}
                    classes={{ containerClassName: 'bg-[#0A0A0A]' }}
                />
            ) : (
                <Loader2 className="w-8 h-8 text-[#8A8580] animate-spin" />
            )}

            {/* THANH TRƯỢT ZOOM */}
            <div className="absolute top-4 left-4 w-[180px] z-30 bg-black/40 backdrop-blur-md rounded-[20px] px-4 py-3 border border-white/10 flex items-center shadow-[0_8px_24px_rgba(0,0,0,0.15)] pointer-events-auto">
                <span className="text-white/80 text-[0.7rem] font-black mr-3 uppercase tracking-widest">Zoom</span>
                <input 
                    type="range" value={zoom} min={1} max={3} step={0.05}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer"
                />
            </div>

            {/* THANH CHỌN THỜI GIAN (VIDEO) */}
            {isVideo && videoDuration > 3 && (
                <div className="absolute top-20 left-4 w-[220px] z-30 bg-black/40 backdrop-blur-md rounded-[20px] px-4 py-3 border border-white/10 flex items-center gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.15)] pointer-events-auto">
                    <span className="text-amber-400 text-[0.7rem] font-black uppercase tracking-widest whitespace-nowrap">Đoạn (3s)</span>
                    <input 
                        type="range" min={0} max={Math.max(0, videoDuration - 3)} step={0.1}
                        value={startTime}
                        onChange={(e) => setStartTime(Number(e.target.value))}
                        className="flex-1 accent-amber-400 cursor-pointer"
                    />
                </div>
            )}

            {/* OVERLAY TAGS & CAPTION */}
            <div className="absolute bottom-5 left-5 right-5 z-20 pointer-events-none flex flex-col gap-2 items-start">
                <div className="flex flex-wrap gap-2 pointer-events-auto">
                    {locationSearch && (
                        <div className="flex items-center gap-1.5 px-3.5 py-2 bg-black/40 backdrop-blur-md rounded-[14px] border border-white/10 text-white shadow-sm">
                            <MapPin className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                            <span className="text-[0.8rem] font-bold tracking-wide truncate max-w-[140px]">{locationSearch}</span>
                        </div>
                    )}
                    {(customContext || selectedActivity.type !== 'DEFAULT') && (
                        <div className="flex items-center gap-1.5 px-3.5 py-2 bg-black/40 backdrop-blur-md rounded-[14px] border border-white/10 text-white shadow-sm">
                            <span className="text-[0.8rem] font-bold tracking-wide truncate max-w-[160px]">
                                {customContext ? customContext : `${selectedActivity.emoji} ${selectedActivity.label}`}
                            </span>
                        </div>
                    )}
                </div>
                {caption && (
                    <div className="bg-black/40 backdrop-blur-md rounded-[20px] px-5 py-3.5 border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.1)] inline-block pointer-events-auto max-w-[90%]">
                        <p className="text-[0.95rem] text-white font-semibold leading-relaxed whitespace-pre-line line-clamp-3">
                            {caption}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};