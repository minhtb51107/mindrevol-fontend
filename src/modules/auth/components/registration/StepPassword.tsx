import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';

const schema = z.object({
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu nhập lại không khớp",
  path: ["confirmPassword"],
});

interface Props {
  onNext: (password: string) => void;
}

export const StepPassword: React.FC<Props> = ({ onNext }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

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

      <form onSubmit={handleSubmit((d) => onNext(d.password))} className="space-y-4">
        <Input 
          type="password" 
          label="Mật khẩu"
          {...register('password')} 
          error={errors.password?.message?.toString()} 
          autoFocus
        />
        <Input 
          type="password" 
          label="Nhập lại mật khẩu"
          {...register('confirmPassword')} 
          error={errors.confirmPassword?.message?.toString()} 
        />
        <Button type="submit">Tiếp theo</Button>
      </form>
    </motion.div>
  );
};