import { useState, useEffect, useRef } from 'react';
import { useAuthFlow } from '../store/AuthFlowContext';

export const useOtpForm = () => {
  const { verifyOtp, resendOtp, isLoading, error, email, goToLogin, resetFlow } = useAuthFlow();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Logic đếm ngược cho nút Gửi lại mã
  const [countdown, setCountdown] = useState(0); 

  // Auto focus ô đầu tiên khi mount
  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  // Logic đếm ngược
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && otp.every(digit => digit !== '')) {
        handleSubmit();
    }
  };

  const handleSubmit = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) verifyOtp(otpCode);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
        await resendOtp();
        setCountdown(60); // Đếm ngược 60s sau khi gửi
        alert(`Đã gửi lại mã tới ${email}`);
    } catch (e) {
        // Error đã được handle trong context hoặc hiển thị alert
    }
  };

  return {
    otp,
    inputRefs,
    email,
    isLoading,
    error,
    isComplete: otp.every(digit => digit !== ''),
    countdown,
    handleChange,
    handleKeyDown,
    handleSubmit,
    handleResend,
    goToLogin,
    resetFlow
  };
};