import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { AtSign } from 'lucide-react';
import { useStepHandle } from '../../hooks/useRegisterSteps'; // Import Hook

interface Props {
  onFinish: (handle: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const StepHandle: React.FC<Props> = ({ onFinish, onBack, isLoading }) => {
  const { form, onSubmit } = useStepHandle(onFinish);
  const { register, formState: { errors } } = form;

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Tạo dấu ấn riêng</h2>
        <p className="text-muted text-sm">Chọn một ID độc nhất (Handle) để bạn bè tìm thấy bạn.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            <AtSign className="w-5 h-5" />
          </div>
          <Input 
            className="pl-12"
            placeholder="username"
            {...register('handle')} 
            error={errors.handle?.message} 
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