import React from 'react';
import Webcam from 'react-webcam';
import { X, RefreshCcw, ImageIcon } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void; 
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const {
      webcamRef, fileInputRef,
      facingMode, isCapturing, isRecording, recordProgress,
      handlePointerDown, handlePointerUp, toggleCamera, handleGallerySelect
  } = useCamera({ onCapture });

  if (!isOpen) return null;

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * recordProgress) / 100;

  return (
    <div className="fixed inset-0 z-[110] bg-[#121212]/95 backdrop-blur-3xl flex flex-col animate-in fade-in zoom-in-95 duration-300 font-sans">
      <div className="h-20 flex items-center justify-between px-6 w-full absolute top-0 z-20">
        <button onClick={onClose} className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all shadow-sm">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[460px] md:max-w-[560px] lg:max-w-[640px] mx-auto relative px-5 mt-4 md:mt-8">
        <div className="mb-6 md:mb-8 text-center animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-white text-2xl md:text-3xl font-black tracking-tight">Trạng thái của bạn?</h3>
            <p className="text-white/60 text-[15px] md:text-base font-medium mt-1.5 md:mt-2">
              {isRecording ? <span className="text-red-400 animate-pulse">Đang quay Live Photo...</span> : "Nhấn để chụp, Giữ để quay"}
            </p>
        </div>

        <div className={`w-full aspect-square relative bg-zinc-900 overflow-hidden rounded-[36px] md:rounded-[48px] lg:rounded-[64px] border-[6px] md:border-[8px] transition-all duration-300 shadow-[0_0_50px_rgba(255,255,255,0.05)] ${isRecording ? 'border-amber-400/50 scale-[0.98]' : 'border-white/10'}`}>
          {isCapturing && <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-300" />}
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.92}
            videoConstraints={{ facingMode: facingMode, aspectRatio: 1 }}
            className="w-full h-full object-cover"
            mirrored={facingMode === 'user'} 
          />
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
            <div className="border-r border-b border-white/30" /><div className="border-r border-b border-white/30" /><div className="border-b border-white/30" />
            <div className="border-r border-b border-white/30" /><div className="border-r border-b border-white/30" /><div className="border-b border-white/30" />
            <div className="border-r border-white/30" /><div className="border-r border-white/30" /><div className="" />
          </div>
        </div>

        <div className="w-full flex items-center justify-between px-6 md:px-12 mt-8 md:mt-10 mb-6 relative">
          <button onClick={() => fileInputRef.current?.click()} className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all shadow-lg border border-white/5">
            <ImageIcon size={24} strokeWidth={2} />
          </button>
          <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleGallerySelect} className="hidden" />

          <div 
            onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} 
            className="relative w-[84px] h-[84px] md:w-[96px] md:h-[96px] flex items-center justify-center cursor-pointer group select-none touch-none"
          >
            <div className="absolute inset-0 rounded-full border-[4px] md:border-[6px] border-white/30 transition-colors duration-300" />
            {isRecording && (
              <svg className="absolute inset-0 w-full h-full -rotate-90 transform origin-center drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} stroke="currentColor" className="text-amber-400 transition-all duration-75 ease-linear" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
              </svg>
            )}
            <div className={`w-[68px] h-[68px] md:w-[76px] md:h-[76px] bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.6)] ${isRecording ? 'scale-75 bg-red-500 rounded-[20px]' : 'group-active:scale-90'}`}></div>
          </div>

          <button onClick={toggleCamera} className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all shadow-lg border border-white/5">
            <RefreshCcw size={24} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};