import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { useStepPassword } from '../../hooks/useRegisterSteps'; // Import Hook

interface Props {
  onNext: (password: string) => void;
}

export const StepPassword: React.FC<Props> = ({ onNext }) => {
  const { form, onSubmit } = useStepPassword(onNext);
  const { register, formState: { errors } } = form;

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      exit={{ x: -20, opacity: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Thiết lập bảo mật</h2>
        <p className="text-muted text-sm">Tạo một mật khẩu mạnh để bảo vệ hành trình của bạn.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input 
          type="password" 
          label="Mật khẩu"
          {...register('password')} 
          error={errors.password?.message} 
          autoFocus
        />
        <Input 
          type="password" 
          label="Nhập lại mật khẩu"
          {...register('confirmPassword')} 
          error={errors.confirmPassword?.message} 
        />
        <Button type="submit">Tiếp theo</Button>
      </form>
    </motion.div>
  );
};