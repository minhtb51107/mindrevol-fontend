import React from 'react';
import Cropper from 'react-easy-crop';
import { MapPin, Loader2, Music, Clock } from 'lucide-react';
import { useCheckinModal } from '../hooks/useCheckinModal';

interface CheckinMediaPreviewProps {
    data: ReturnType<typeof useCheckinModal>;
}

export const CheckinMediaPreview: React.FC<CheckinMediaPreviewProps> = ({ data }) => {
    const {
        previewUrl, isVideo, crop, zoom, setCrop, onCropComplete, setZoom,
        videoDuration, startTime, setStartTime, locationSearch,
        customContext, selectedActivity, caption, activeTag, selectedTrack
    } = data;

    const trimmedVideoUrl = isVideo && previewUrl ? `${previewUrl}#t=${startTime},${startTime + 3}` : undefined;

    const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

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

            {/* --- LOCKET STYLE: CHỈ HIỂN THỊ 1 THẺ --- */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center w-full px-6">
                
                {activeTag === 'CAPTION' && caption && (
                    <div className="bg-black/50 backdrop-blur-xl rounded-[20px] px-6 py-3.5 border border-white/20 shadow-2xl pointer-events-auto text-center animate-in zoom-in duration-300">
                        <p className="text-[1.1rem] text-white font-black leading-tight">
                            {caption}
                        </p>
                    </div>
                )}

                {activeTag === 'LOCATION' && locationSearch && (
                    <div className="flex items-center gap-2 px-5 py-3 bg-black/50 backdrop-blur-xl rounded-[18px] border border-white/20 text-white shadow-2xl animate-in zoom-in duration-300">
                        <MapPin className="w-4 h-4 text-blue-400" strokeWidth={3} />
                        <span className="text-[1rem] font-black tracking-wide truncate max-w-[200px]">{locationSearch}</span>
                    </div>
                )}

                {activeTag === 'TIME' && (
                    <div className="flex items-center gap-2 px-6 py-2.5 bg-black/50 backdrop-blur-xl rounded-[18px] border border-white/20 text-white shadow-2xl animate-in zoom-in duration-300">
                        <Clock className="w-4 h-4 text-yellow-400" strokeWidth={3} />
                        <span className="text-[1.1rem] font-black tracking-widest">{currentTime}</span>
                    </div>
                )}

                {activeTag === 'ACTIVITY' && (customContext || selectedActivity.type !== 'DEFAULT') && (
                    <div className="flex items-center gap-2 px-5 py-3 bg-black/50 backdrop-blur-xl rounded-[18px] border border-white/20 text-white shadow-2xl animate-in zoom-in duration-300">
                        <span className="text-[1rem] font-black tracking-wide truncate max-w-[200px]">
                            {customContext ? customContext : `${selectedActivity.emoji} ${selectedActivity.label}`}
                        </span>
                    </div>
                )}

                {activeTag === 'SPOTIFY' && selectedTrack && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-black/60 backdrop-blur-xl rounded-[20px] border border-white/20 text-white shadow-2xl animate-in zoom-in duration-300 max-w-[280px]">
                        <img src={selectedTrack.albumArt} className="w-10 h-10 rounded-full animate-[spin_4s_linear_infinite] shadow-md border-[2px] border-zinc-800 object-cover shrink-0" alt="vinyl" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[0.9rem] font-black tracking-wide truncate text-green-400">{selectedTrack.title}</span>
                            <span className="text-[0.75rem] font-semibold tracking-wide truncate text-white/70">{selectedTrack.artist}</span>
                        </div>
                        <Music className="w-4 h-4 text-green-400 shrink-0 ml-1" strokeWidth={3} />
                    </div>
                )}

            </div>
        </div>
    );
};