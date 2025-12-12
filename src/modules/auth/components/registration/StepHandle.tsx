import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { AtSign } from 'lucide-react';

const schema = z.object({
  handle: z.string()
    .min(3, "Handle tối thiểu 3 ký tự")
    .regex(/^[a-zA-Z0-9._]+$/, "Chỉ chứa chữ, số, dấu chấm và gạch dưới")
});

interface Props {
  onFinish: (handle: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const StepHandle: React.FC<Props> = ({ onFinish, onBack, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Tạo dấu ấn riêng</h2>
        <p className="text-muted text-sm">Chọn một ID độc nhất (Handle) để bạn bè tìm thấy bạn.</p>
      </div>

      <form onSubmit={handleSubmit((d: any) => onFinish(d.handle))} className="space-y-6">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            <AtSign className="w-5 h-5" />
          </div>
          <Input 
            className="pl-12" // Padding left để né icon @
            placeholder="username"
            {...register('handle')} 
            error={errors.handle?.message?.toString()} 
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={onBack} disabled={isLoading} className="w-1/3">
            Quay lại
          </Button>
          <Button type="submit" isLoading={isLoading} className="w-2/3">
            Hoàn tất đăng ký
          </Button>
        </div>
      </form>
    </motion.div>
  );
};