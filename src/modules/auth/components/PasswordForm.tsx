import React, { useState } from 'react';
import { useAuthFlow } from '../store/AuthFlowContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, User as UserIcon, RefreshCw } from 'lucide-react'; // Thêm icon RefreshCw
import { motion } from 'framer-motion';
import { authService } from '../services/auth.service';

export const PasswordForm = () => {
  // Lấy thêm hàm goToOtp và email từ context
  const { email, userInfo, resetFlow, login, isLoading, error, goToOtp } = useAuthFlow();
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    await login(password);
  };

  // Hàm xử lý khi user muốn chuyển sang OTP
  const handleSwitchToOtp = async () => {
    try {
      // Gửi mã OTP mới cho chắc chắn
      await authService.sendOtp(email);
      // Chuyển màn hình
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
      className="space-y-6"
    >
      <button onClick={resetFlow} className="text-muted hover:text-foreground flex items-center text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
      </button>

      <div className="flex flex-col items-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center overflow-hidden border-2 border-primary shadow-lg shadow-primary/20">
          {userInfo?.avatarUrl ? (
            <img src={userInfo.avatarUrl} alt="User" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-8 h-8 text-muted" />
          )}
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground">{userInfo?.fullname || "Người dùng"}</h3>
          <p className="text-primary text-sm font-medium">{email}</p>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 mt-6">
        <Input 
          type="password" 
          label="Mật khẩu"
          placeholder="Nhập mật khẩu..." 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        
        {error && <p className="text-destructive text-sm text-center font-medium bg-destructive/10 p-2 rounded-lg">{error}</p>}

        <div className="space-y-4">
            {/* Nút Đăng nhập chính */}
            <Button type="submit" isLoading={isLoading}>Đăng nhập</Button>

            {/* Phân cách */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted">Hoặc</span></div>
            </div>

            {/* Nút chuyển sang OTP */}
            <Button 
                type="button" 
                variant="outline" 
                onClick={handleSwitchToOtp}
                className="w-full"
            >
                <RefreshCw className="w-4 h-4 mr-2" />
                Đăng nhập bằng mã xác thực (OTP)
            </Button>
        </div>
      </form>

      <div className="text-center">
        <button 
          type="button"
          onClick={() => authService.sendMagicLink(email).then(() => alert('Đã gửi link!'))}
          className="text-sm text-muted hover:text-primary transition-colors hover:underline"
        >
          Quên mật khẩu?
        </button>
      </div>
    </motion.div>
  );
};