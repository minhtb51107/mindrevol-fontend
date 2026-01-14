import React, { useState, useEffect } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Globe, Lock, Calendar, Clock, Flag, CheckCircle2 } from 'lucide-react';
import { CreateJourneyRequest, JourneyVisibility } from '../types';
import { cn } from '@/lib/utils';

interface Props {
  register: UseFormRegister<CreateJourneyRequest>;
  errors: FieldErrors<CreateJourneyRequest>;
  watch: UseFormWatch<CreateJourneyRequest>;
  setValue: UseFormSetValue<CreateJourneyRequest>;
}

export const StepBasicInfo: React.FC<Props> = ({ register, errors, watch, setValue }) => {
  const currentVisibility = watch('visibility');
  const [duration, setDuration] = useState<number>(30);

  // [LOGIC MỚI] Tính ngày kết thúc
  // duration = 1 ngày => endDate = startDate (cùng ngày)
  const calculateEndDate = (days: number) => {
      const today = new Date();
      const endDate = new Date(today);
      // Nếu 1 ngày thì cộng 0, 30 ngày thì cộng 29
      const daysToAdd = days > 0 ? days - 1 : 0; 
      endDate.setDate(today.getDate() + daysToAdd);
      return endDate;
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let days = parseInt(e.target.value);
    if (isNaN(days) || days < 1) days = 1;
    if (days > 30) days = 30;
    
    setDuration(days);

    const endDate = calculateEndDate(days);
    setValue('endDate', endDate.toISOString().split('T')[0], { shouldValidate: true });
  };

  // Tính ngày kết thúc để hiển thị (Preview)
  const today = new Date();
  const endDatePreview = calculateEndDate(duration);

  // Khi component mount, set giá trị mặc định vào form
  useEffect(() => {
      setValue('endDate', endDatePreview.toISOString().split('T')[0]);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* 1. Tên hành trình (Hero Input) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Tên hành trình <span className="text-red-500">*</span></label>
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Flag className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input 
              {...register('name', { required: "Vui lòng nhập tên hành trình" })}
              className="w-full bg-zinc-900/50 border border-zinc-700/50 text-white text-lg rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-600"
              placeholder="Đặt tên cho hành trình..."
              autoFocus
            />
        </div>
        {errors.name && <p className="text-red-400 text-xs ml-2 font-medium flex items-center gap-1">⚠️ {errors.name.message}</p>}
      </div>

      {/* 2. Thiết lập thời gian (Grouped Card) */}
      <div className="bg-zinc-900/30 rounded-2xl p-4 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-zinc-400">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Thời gian thực hiện</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date Display */}
            <div className="bg-zinc-800/50 rounded-xl p-3 border border-white/5 flex flex-col justify-center relative overflow-hidden">
                <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Bắt đầu</span>
                <div className="text-zinc-200 font-medium text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Hôm nay ({today.toLocaleDateString('vi-VN')})
                </div>
                <input type="hidden" {...register('startDate')} />
            </div>

            {/* Duration Input */}
            <div className="relative group">
                <span className="absolute left-3 top-2 text-[10px] text-zinc-500 uppercase font-bold z-10">Kéo dài</span>
                <input 
                  type="number"
                  value={duration}
                  onChange={handleDurationChange}
                  min={1}
                  max={30}
                  className="w-full h-full bg-zinc-800 border border-zinc-700/50 rounded-xl pt-6 pb-2 pl-3 pr-12 text-white font-bold text-lg focus:border-blue-500 focus:bg-zinc-800/80 outline-none transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none">
                    <span className="text-xs text-zinc-400 font-medium">Ngày</span>
                </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between px-1 pt-1">
              <span className="text-xs text-zinc-500">Kết thúc dự kiến:</span>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                  {endDatePreview.toLocaleDateString('vi-VN')}
              </span>
          </div>
          <input type="hidden" {...register('endDate')} />
      </div>

      {/* 3. Quyền riêng tư (Selectable Cards) */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Quyền riêng tư</label>
        <div className="grid grid-cols-1 gap-3">
          
          {/* Option: PUBLIC */}
          <div 
            onClick={() => setValue('visibility', JourneyVisibility.PUBLIC)}
            className={cn(
                "cursor-pointer p-4 rounded-2xl border transition-all relative group flex items-start gap-4",
                currentVisibility === JourneyVisibility.PUBLIC 
                  ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]" 
                  : "bg-zinc-900/30 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
            )}
          >
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                currentVisibility === JourneyVisibility.PUBLIC ? "bg-blue-500 text-white" : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300"
            )}>
                <Globe className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className={cn("font-bold text-sm", currentVisibility === JourneyVisibility.PUBLIC ? "text-blue-400" : "text-zinc-300")}>Công khai</span>
                    {currentVisibility === JourneyVisibility.PUBLIC && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Bất kỳ ai cũng có thể tìm thấy và xem hành trình này. Thành viên có thể mời bạn bè tham gia.
                </p>
            </div>
          </div>

          {/* Option: PRIVATE */}
          <div 
            onClick={() => setValue('visibility', JourneyVisibility.PRIVATE)}
            className={cn(
                "cursor-pointer p-4 rounded-2xl border transition-all relative group flex items-start gap-4",
                currentVisibility === JourneyVisibility.PRIVATE 
                  ? "bg-yellow-600/10 border-yellow-500/50 shadow-[0_0_15px_-5px_rgba(234,179,8,0.3)]" 
                  : "bg-zinc-900/30 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
            )}
          >
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                currentVisibility === JourneyVisibility.PRIVATE ? "bg-yellow-500 text-black" : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300"
            )}>
                <Lock className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className={cn("font-bold text-sm", currentVisibility === JourneyVisibility.PRIVATE ? "text-yellow-500" : "text-zinc-300")}>Riêng tư</span>
                    {currentVisibility === JourneyVisibility.PRIVATE && <CheckCircle2 className="w-4 h-4 text-yellow-500" />}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Chỉ thành viên được duyệt mới có thể xem. Chỉ Admin mới có quyền mời người khác.
                </p>
            </div>
          </div>
        </div>
        <input type="hidden" {...register('visibility')} />
      </div>
    </div>
  );
};