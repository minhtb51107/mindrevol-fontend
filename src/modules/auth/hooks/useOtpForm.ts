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

  // --- LOGIC NHẬP LIỆU ĐÃ SỬA ---
  const handleChange = (index: number, value: string) => {
    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Luôn lấy ký tự cuối cùng để tránh lỗi dồn số (vd: "1" -> "12")
    const lastChar = value.substring(value.length - 1);
    
    newOtp[index] = lastChar;
    setOtp(newOtp);
    
    // Auto focus next input nếu đã nhập số
    if (lastChar && index < 5) {
        inputRefs.current[index + 1]?.focus();
    }
  };

  // --- LOGIC XỬ LÝ PASTE (DÁN) MỚI ---
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault(); // Chặn hành vi dán mặc định (bị giới hạn bởi maxLength)
    
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Nếu dữ liệu dán không phải là số thì bỏ qua
    if (!/^\d+$/.test(pastedData)) return;

    // Lấy tối đa 6 số đầu tiên
    const digits = pastedData.split('').slice(0, 6);
    const newOtp = [...otp];

    // Điền số vào mảng
    digits.forEach((digit, i) => {
        newOtp[i] = digit;
    });

    setOtp(newOtp);

    // Focus vào ô tiếp theo sau chuỗi vừa dán hoặc ô cuối cùng
    const nextFocusIndex = Math.min(digits.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();

    // Nếu dán đủ 6 số thì thử submit luôn (tuỳ chọn)
    if (digits.length === 6) {
        const otpCode = digits.join('');
        verifyOtp(otpCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Xử lý Backspace thông minh hơn:
    // Nếu ô hiện tại trống và nhấn Backspace -> lùi về ô trước
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
    handlePaste, // Export hàm này ra để dùng trong UI
    handleSubmit,
    handleResend,
    goToLogin,
    resetFlow
  };
};