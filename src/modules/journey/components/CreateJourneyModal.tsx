import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, Loader2, Check } from 'lucide-react';
import { useForm } from 'react-hook-form'; // [FIX] Sử dụng hook form
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
  const [step, setStep] = useState(1);
  
  // [FIX] Khởi tạo form
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
      // Mặc định 30 ngày
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      visibility: JourneyVisibility.PUBLIC,
      requireApproval: true // Luôn bật theo logic mới
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

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4 animate-in fade-in zoom-in-95">
      <div className="w-full max-w-2xl bg-[#18181b] border border-white/10 rounded-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Tạo Hành Trình Mới</h2>
            <p className="text-xs text-zinc-500 mt-1">Bước {step}/2</p>
          </div>
          <button onClick={onClose}><X className="text-zinc-400 hover:text-white" /></button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {step === 1 && (
            // [FIX] Truyền đúng props cho StepBasicInfo (react-hook-form props)
            <StepBasicInfo 
              register={register} 
              errors={errors} 
              watch={watch} 
              setValue={setValue} 
            />
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Xác nhận thông tin</h3>
              <div className="bg-zinc-900 rounded-xl p-4 space-y-3 border border-white/5">
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-sm">Tên:</span>
                  <span className="text-white font-medium">{watch('name')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-sm">Quyền riêng tư:</span>
                  <span className={`text-xs px-2 py-0.5 rounded border ${
                    watch('visibility') === 'PUBLIC' 
                    ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' 
                    : 'border-orange-500/30 text-orange-400 bg-orange-500/10'
                  }`}>
                    {watch('visibility') === 'PUBLIC' ? 'Công khai' : 'Riêng tư'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-sm">Ngày bắt đầu:</span>
                  <span className="text-white font-medium">{watch('startDate')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-sm">Ngày kết thúc:</span>
                  <span className="text-white font-medium">{watch('endDate')}</span>
                </div>
              </div>
              <p className="text-zinc-500 text-xs text-center">
                Sau khi tạo, bạn có thể mời bạn bè tham gia ngay.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex justify-between items-center bg-[#18181b] rounded-b-2xl">
          {step > 1 ? (
            <button onClick={handleBack} className="text-zinc-400 hover:text-white text-sm px-4 py-2">
              Quay lại
            </button>
          ) : (
            <div></div> 
          )}

          {step < 2 ? (
            <button 
              onClick={handleNext}
              disabled={!isValid} // Disable nếu form chưa valid (ví dụ chưa nhập tên)
              className="bg-white text-black px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit(onSubmit)} // [FIX] Submit form
              disabled={isCreating}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-lg shadow-blue-900/20"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Hoàn tất
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};