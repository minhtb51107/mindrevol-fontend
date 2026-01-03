import React from 'react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useOtpForm } from '../hooks/useOtpForm'; // Import Hook mới

export const OtpForm = () => {
  const {
    otp,
    inputRefs,
    email,
    isLoading,
    error,
    isComplete,
    countdown,
    handleChange,
    handleKeyDown,
    handleSubmit,
    handleResend,
    goToLogin,
    resetFlow
  } = useOtpForm();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      <div className="flex-1 space-y-8">
        {/* Header Text */}
        <div className="text-center space-y-2">
          <p className="text-sm text-zinc-400">
            Mã xác thực 6 số đã được gửi đến:
          </p>
          <p className="text-base font-bold text-white tracking-wide">
            {email || 'your-email@example.com'}
          </p>
        </div>

        {/* Input 6 số */}
        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading}
              className={`
                w-10 h-12 sm:w-12 sm:h-14 
                text-center text-xl font-bold rounded-xl 
                bg-[#18181b] border 
                transition-all duration-200 outline-none
                ${digit ? 'border-[#FFF5C0] text-[#FFF5C0]' : 'border-zinc-800 text-white'}
                focus:border-[#FFF5C0] focus:ring-1 focus:ring-[#FFF5C0] focus:bg-zinc-900
              `}
            />
          ))}
        </div>

        {/* Hiển thị lỗi */}
        {error && (
            <p className="text-red-500 text-sm text-center font-medium animate-pulse">
                {error}
            </p>
        )}

        {/* Nút Xác thực */}
        <Button 
          onClick={handleSubmit} 
          isLoading={isLoading} 
          disabled={!isComplete}
          className="w-full h-12 text-base font-bold"
        >
          Xác thực ngay
        </Button>

        {/* Nút Gửi lại mã (Có logic đếm ngược) */}
        <div className="text-center">
           <button 
             type="button" 
             onClick={handleResend}
             disabled={countdown > 0 || isLoading}
             className={`text-xs transition-colors underline underline-offset-4 ${
                countdown > 0 
                    ? 'text-zinc-600 cursor-not-allowed' 
                    : 'text-zinc-500 hover:text-[#FFF5C0]'
             }`}
           >
             {countdown > 0 ? `Gửi lại mã sau ${countdown}s` : 'Gửi lại mã'}
           </button>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-8 pt-6 border-t border-zinc-800/50 flex flex-col gap-3">
        <Button
          variant="secondary"
          className="w-full h-12 font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"
          onClick={goToLogin}
        >
          Đăng nhập bằng mật khẩu
        </Button>
        
        <button 
          onClick={resetFlow}
          className="text-xs text-zinc-500 hover:text-white transition-colors py-2"
        >
          Quay lại nhập Email
        </button>
      </div>
    </motion.div>
  );
};