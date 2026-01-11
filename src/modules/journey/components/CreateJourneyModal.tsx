import React from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { StepBasicInfo } from './StepBasicInfo';
import { CreateJourneyRequest, JourneyType, JourneyVisibility } from '../types';
import { useCreateJourney } from '../hooks/useCreateJourney';
import { toast } from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateJourneyModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  // [REMOVED] Bỏ state step, không cần chuyển bước nữa

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors, isValid } 
  } = useForm<CreateJourneyRequest>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      type: JourneyType.HABIT,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      visibility: JourneyVisibility.PUBLIC,
      requireApproval: true
    }
  });

  const { createJourney, isCreating } = useCreateJourney(() => {
    toast.success("Tạo hành trình thành công!");
    onSuccess();
    onClose();
  });

  if (!isOpen) return null;

  const onSubmit = (data: CreateJourneyRequest) => {
    createJourney(data);
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
      {/* Container: max-w-lg để gọn hơn, max-h đảm bảo không tràn màn hình mobile */}
      <div className="w-full max-w-lg bg-[#18181b] border border-white/10 rounded-2xl flex flex-col max-h-[90vh] shadow-2xl">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/5 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Tạo Hành Trình Mới</h2>
            <p className="text-xs text-zinc-500 mt-1">Bắt đầu một chặng đường mới</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400 hover:text-white" />
          </button>
        </div>

        {/* Body - Có thanh cuộn nếu nội dung dài trên đt */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
            <StepBasicInfo 
              register={register} 
              errors={errors} 
              watch={watch} 
              setValue={setValue} 
            />
        </div>

        {/* Footer - Sticky ở dưới */}
        <div className="p-4 sm:p-6 border-t border-white/5 bg-[#18181b] rounded-b-2xl shrink-0">
          <button 
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isCreating}
            className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
              !isValid || isCreating
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
            }`}
          >
            {isCreating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            {isCreating ? 'Đang tạo...' : 'Tạo hành trình ngay'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};