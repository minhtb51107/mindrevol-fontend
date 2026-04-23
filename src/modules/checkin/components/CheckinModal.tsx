import React from 'react';
import { X, Loader2, Sparkles } from 'lucide-react'; 
import { useCheckinModal } from '../hooks/useCheckinModal'; 
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { CheckinMediaPreview } from './CheckinMediaPreview';
import { CheckinFormSettings } from './CheckinFormSettings';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  journeyId: string;
  onSuccess: () => void;
}

export const CheckinModal: React.FC<CheckinModalProps> = (props) => {
  const { isOpen, onClose, file } = props;
  const { theme: appTheme } = useTheme();

  // Gọi duy nhất 1 hook quản lý Data
  const hookData = useCheckinModal(props);

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center p-0 md:p-6 font-quicksand animate-in fade-in duration-300">
      
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px] md:block hidden" onClick={onClose} />

      {/* MODAL CONTAINER */}
      <div className="relative w-full h-[95vh] md:h-[85vh] max-w-[1100px] md:max-h-[750px] bg-white dark:bg-[#121212] rounded-t-[32px] md:rounded-[40px] overflow-hidden flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl z-10 animate-in slide-in-from-bottom-1/2 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#F4EBE1] dark:border-[#2B2A29] shrink-0 bg-white dark:bg-[#121212] pt-safe md:pt-0">
          <button onClick={onClose} className="p-2.5 -ml-2.5 bg-[#F4EBE1]/50 hover:bg-[#F4EBE1] dark:bg-[#2B2A29]/50 dark:hover:bg-[#3A3734] text-[#8A8580] dark:text-[#A09D9A] rounded-[16px] transition-colors active:scale-95">
             <X size={20} strokeWidth={2.5}/>
          </button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1A1A1A] dark:text-white" strokeWidth={2.5} />
            <h2 className="text-[#1A1A1A] dark:text-white font-black text-[1.3rem] tracking-tight">Bài viết mới</h2>
          </div>

          <button 
            onClick={hookData.handleSubmit} 
            disabled={hookData.isSubmitting}
            className={cn(
                "px-6 h-[44px] font-black rounded-[18px] transition-all flex items-center gap-2 active:scale-95 shadow-sm",
                hookData.isSubmitting 
                    ? "bg-[#E2D9CE] dark:bg-[#2B2A29] text-[#8A8580] dark:text-[#A09D9A] cursor-not-allowed shadow-none" 
                    : "bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] hover:-translate-y-0.5"
            )}
          >
            {hookData.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Chia sẻ"}
          </button>
        </div>

        {/* PHÂN BỔ 2 COMPONENT CON VÀO 2 CỘT */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
            <CheckinMediaPreview data={hookData} />
            <CheckinFormSettings data={hookData} appTheme={appTheme === 'dark' ? 'dark' : 'light'} />
        </div>

      </div>
    </div>
  );
};