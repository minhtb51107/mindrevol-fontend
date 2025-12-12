import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';

// Định nghĩa mảng giá trị
const GENDER_VALUES = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'] as const;

const schema = z.object({
  fullname: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  dateOfBirth: z.string().refine((date) => {
    if (!date) return false;
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 13;
  }, "Bạn phải trên 13 tuổi để tham gia"),
  
  // [FIX LỖI 1]: Dùng required_error thay vì errorMap để an toàn hơn
  gender: z.enum(GENDER_VALUES, {
    required_error: "Vui lòng chọn giới tính",
    invalid_type_error: "Vui lòng chọn giới tính"
  })
});

// [FIX LỖI 2]: Tạo type từ schema để đảm bảo khớp 100% với form
export type StepFormValues = z.infer<typeof schema>;

interface Props {
  onNext: (data: StepFormValues) => void;
  onBack: () => void;
}

export const StepBasicInfo: React.FC<Props> = ({ onNext, onBack }) => {
  // Truyền StepFormValues vào useForm
  const { register, handleSubmit, formState: { errors } } = useForm<StepFormValues>({
    resolver: zodResolver(schema)
  });

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Giới thiệu bản thân</h2>
        <p className="text-muted text-sm">Hãy cho mọi người biết thêm về bạn.</p>
      </div>

      <form onSubmit={handleSubmit((d) => onNext(d))} className="space-y-4">
        {/* Tên */}
        <Input 
          label="Tên hiển thị"
          placeholder="Ví dụ: Minh Developer"
          {...register('fullname')} 
          error={errors.fullname?.message} 
          autoFocus
        />

        {/* Ngày sinh */}
        <Input 
          label="Ngày sinh"
          type="date"
          {...register('dateOfBirth')} 
          error={errors.dateOfBirth?.message} 
        />

        {/* Giới tính */}
        <div className="w-full space-y-1.5">
          <label className="text-xs font-semibold text-muted ml-1 uppercase">Giới tính</label>
          <div className="relative">
            <select
              {...register('gender')}
              className={`w-full bg-surface border-2 border-transparent rounded-2xl px-5 py-3.5 text-foreground outline-none transition-all font-medium appearance-none cursor-pointer focus:border-primary focus:bg-background ${errors.gender ? 'border-destructive/50 bg-destructive/5' : ''}`}
              defaultValue="" 
            >
              <option value="" disabled>Chọn giới tính...</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
              <option value="PREFER_NOT_TO_SAY">Không muốn tiết lộ</option>
            </select>
            
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          {errors.gender && <span className="text-xs text-destructive font-bold ml-1">{errors.gender.message}</span>}
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={onBack} className="w-1/3">Quay lại</Button>
          <Button type="submit" className="w-2/3">Tiếp theo</Button>
        </div>
      </form>
    </motion.div>
  );
};