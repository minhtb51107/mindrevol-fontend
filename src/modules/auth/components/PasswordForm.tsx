import React, { useState } from 'react';
import { useAuthFlow } from '../store/AuthFlowContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/auth.service';

export const PasswordForm = () => {
  const { email, resetFlow, login, isLoading, error, goToOtp } = useAuthFlow();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    await login(password);
  };

  const handleSwitchToOtp = async () => {
    try {
      await authService.sendOtp(email);
      goToOtp(); 
    } catch (e) {
      alert("Không thể gửi mã OTP. Vui lòng thử lại sau.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full"
    >
      {/* HEADER: Nút quay lại & Tiêu đề */}
      <div className="mb-6">
        <button 
          onClick={resetFlow} 
          className="text-zinc-500 hover:text-white flex items-center text-sm transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> 
          Quay lại
        </button>
        
        <h2 className="text-2xl font-bold text-white tracking-tight">Nhập mật khẩu</h2>
        <div className="flex items-center gap-2 mt-2 text-sm text-zinc-400">
           <span>Đang đăng nhập cho:</span>
           <span className="text-[#FFF5C0] font-medium bg-[#FFF5C0]/10 px-2 py-0.5 rounded border border-[#FFF5C0]/20">
             {email}
           </span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-5 flex-1">
        
        {/* INPUT PASSWORD */}
        <div className="relative">
          <Input 
            type={showPassword ? "text" : "password"} 
            label="Mật khẩu hiện tại"
            placeholder="Nhập mật khẩu..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            disabled={isLoading}
            className="h-12 pr-10" // h-12: Cao 48px
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-zinc-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
          </button>
        </div>
        
        {/* Nút Quên mật khẩu nằm ngay dưới Input cho tiện tay */}
        <div className="flex justify-end -mt-1">
            <button 
              type="button"
              onClick={() => authService.sendMagicLink(email).then(() => alert('Đã gửi link đặt lại mật khẩu về email!'))}
              className="text-xs text-zinc-500 hover:text-[#FFF5C0] transition-colors hover:underline"
            >
              Quên mật khẩu?
            </button>
        </div>

        {error && (
          <div className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/20 flex items-center justify-center">
            {error}
          </div>
        )}

        <div className="space-y-3 pt-2">
            {/* Nút Đăng nhập: h-12 để BẰNG CHẶN với Input */}
            <Button type="submit" isLoading={isLoading} className="w-full h-12 text-base font-bold shadow-none">
              Đăng nhập
            </Button>

            {/* Phân cách */}
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                  <span className="bg-[#050505] px-2 text-zinc-600">Hoặc</span>
                </div>
            </div>

            {/* Nút chuyển sang OTP */}
            <Button 
                type="button" 
                variant="outline" 
                onClick={handleSwitchToOtp}
                className="w-full h-12 bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
            >
                <RefreshCw className="w-4 h-4 mr-2" />
                Đăng nhập bằng mã OTP
            </Button>
        </div>
      </form>
    </motion.div>
  );
};