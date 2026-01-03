import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Globe, Lock, Calendar } from 'lucide-react';
import { CreateJourneyRequest, JourneyVisibility } from '../types';

interface Props {
  register: UseFormRegister<CreateJourneyRequest>;
  errors: FieldErrors<CreateJourneyRequest>;
  watch: UseFormWatch<CreateJourneyRequest>;
  setValue: UseFormSetValue<CreateJourneyRequest>;
}

export const StepBasicInfo: React.FC<Props> = ({ register, errors, watch, setValue }) => {
  const currentVisibility = watch('visibility');

  return (
    <div className="space-y-5">
      {/* Tên hành trình */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">Tên hành trình <span className="text-red-500">*</span></label>
        <input 
          {...register('name', { required: "Vui lòng nhập tên hành trình" })}
          className="w-full bg-zinc-800 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-zinc-600"
          placeholder="Ví dụ: Dậy sớm đọc sách, Chạy bộ 30 ngày..."
          autoFocus
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* [ĐÃ XÓA PHẦN MÔ TẢ Ở ĐÂY] */}

      {/* Thời gian */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Ngày bắt đầu</label>
          <div className="relative">
            <input 
              type="date"
              {...register('startDate', { required: "Chọn ngày bắt đầu" })}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl p-3 pl-10 text-white focus:ring-2 focus:ring-blue-500 outline-none [color-scheme:dark]"
            />
            <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Ngày kết thúc</label>
          <div className="relative">
            <input 
              type="date"
              {...register('endDate', { required: "Chọn ngày kết thúc" })}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl p-3 pl-10 text-white focus:ring-2 focus:ring-blue-500 outline-none [color-scheme:dark]"
            />
            <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
          </div>
        </div>
      </div>

      {/* Quyền riêng tư */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3">Quyền riêng tư</label>
        <div className="grid grid-cols-2 gap-3">
          {/* Option: PUBLIC */}
          <div 
            onClick={() => setValue('visibility', JourneyVisibility.PUBLIC)}
            className={`cursor-pointer p-3 rounded-xl border transition-all ${
              currentVisibility === JourneyVisibility.PUBLIC 
                ? 'bg-blue-600/20 border-blue-500' 
                : 'bg-zinc-800 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Globe className={`w-4 h-4 ${currentVisibility === JourneyVisibility.PUBLIC ? 'text-blue-400' : 'text-zinc-400'}`} />
              <span className={`text-sm font-bold ${currentVisibility === JourneyVisibility.PUBLIC ? 'text-blue-400' : 'text-zinc-200'}`}>Công khai</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-tight">
              Ai cũng có thể tìm thấy. Thành viên được phép mời bạn bè.
            </p>
          </div>

          {/* Option: PRIVATE */}
          <div 
            onClick={() => setValue('visibility', JourneyVisibility.PRIVATE)}
            className={`cursor-pointer p-3 rounded-xl border transition-all ${
              currentVisibility === JourneyVisibility.PRIVATE 
                ? 'bg-blue-600/20 border-blue-500' 
                : 'bg-zinc-800 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Lock className={`w-4 h-4 ${currentVisibility === JourneyVisibility.PRIVATE ? 'text-blue-400' : 'text-zinc-400'}`} />
              <span className={`text-sm font-bold ${currentVisibility === JourneyVisibility.PRIVATE ? 'text-blue-400' : 'text-zinc-200'}`}>Riêng tư</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-tight">
              Chỉ thành viên mới xem được. Chỉ Chủ phòng được mời người mới.
            </p>
          </div>
        </div>
        <input type="hidden" {...register('visibility')} />
      </div>
    </div>
  );
};