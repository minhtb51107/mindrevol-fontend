import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Send, CheckCircle2, XCircle, Smile } from 'lucide-react';
import { checkinService } from '@/modules/checkin/services/checkin.service';
import imageCompression from 'browser-image-compression';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  journeyId: string;
  onSuccess: () => void;
}

export const CheckinModal: React.FC<CheckinModalProps> = ({ 
  isOpen, onClose, file, journeyId, onSuccess 
}) => {
  const [caption, setCaption] = useState('');
  const [isCompleted, setIsCompleted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Đang đăng...');
  
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setCaption((prev) => prev + emojiData.emoji);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setStatusMessage("Đang tối ưu ảnh...");
      
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/jpeg' };
      let fileToUpload = file;
      if (file.size > 1024 * 1024) {
        try {
          fileToUpload = await imageCompression(file, options);
        } catch (e) { console.warn("Nén thất bại", e); }
      }

      setStatusMessage("Đang gửi...");
      await checkinService.createCheckin({
        file: fileToUpload,
        journeyId: journeyId,
        caption: caption,
        emotion: isCompleted ? 'EXCITED' : 'HOPELESS',
        statusRequest: isCompleted ? 'NORMAL' : 'FAILED' 
      });
      
      onSuccess();
      onClose();
      setCaption('');
      setIsCompleted(true);
      setShowPicker(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi đăng bài");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-white font-bold text-lg">Check-in</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 relative">
          {/* 1. Preview Ảnh */}
          <div className="relative w-full aspect-square rounded-[24px] overflow-hidden bg-black border border-white/10 shadow-lg shrink-0">
            {/* [FIX] Chỉ render thẻ img khi có previewUrl */}
            {previewUrl && (
              <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
            )}
            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white border flex items-center gap-2 backdrop-blur-md shadow-lg ${isCompleted ? 'bg-green-500/80 border-green-400' : 'bg-red-500/80 border-red-400'}`}>
              {isCompleted ? <CheckCircle2 className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
              <span>{isCompleted ? 'Hoàn thành' : 'Thất bại'}</span>
            </div>
          </div>

          {/* 2. Toggle Status */}
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/10 shrink-0">
            <button 
              onClick={() => setIsCompleted(true)}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${isCompleted ? 'bg-green-600 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}
            >
              <CheckCircle2 className="w-4 h-4" /> Hoàn thành
            </button>
            <button 
              onClick={() => setIsCompleted(false)}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${!isCompleted ? 'bg-red-600 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}
            >
              <XCircle className="w-4 h-4" /> Thất bại
            </button>
          </div>

          {/* 3. Caption & Emoji Trigger */}
          <div className="relative shrink-0">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={isCompleted ? "Tuyệt vời! Cảm giác thế nào? 🔥" : "Không sao cả. Tại sao hôm nay chưa tốt? 😭"}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 resize-none min-h-[100px]"
            />
            {/* Nút mở Emoji Picker */}
            <button 
              onClick={() => setShowPicker(!showPicker)}
              className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors ${showPicker ? 'text-yellow-400 bg-white/10' : 'text-zinc-400 hover:text-yellow-400 hover:bg-white/5'}`}
            >
              <Smile className="w-6 h-6" />
            </button>

            {/* BẢNG EMOJI PICKER (Hiển thị nổi) */}
            {showPicker && (
              <div className="absolute bottom-full right-0 mb-2 z-50 shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200" ref={pickerRef}>
                <EmojiPicker 
                  onEmojiClick={onEmojiClick}
                  theme={Theme.DARK}
                  width={300}
                  height={400}
                  lazyLoadEmojis={true}
                  searchDisabled={false}
                  skinTonesDisabled
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/5 bg-[#18181b] z-10">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full font-bold text-base h-12 rounded-full flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg ${isCompleted ? 'bg-white text-black hover:bg-zinc-200' : 'bg-red-600 text-white hover:bg-red-500'}`}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            <span>{isSubmitting ? statusMessage : 'Đăng bài'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};