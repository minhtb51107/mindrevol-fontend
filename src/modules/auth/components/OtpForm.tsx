import React, { useState, useEffect, useRef } from 'react';
import { useAuthFlow } from '../store/AuthFlowContext';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const OtpForm = () => {
  // Lấy hàm goToLogin từ context để chuyển màn hình
  const { email, userInfo, resetFlow, verifyOtp, resendOtp, isLoading, error, setError, goToLogin } = useAuthFlow();
  
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0]?.focus();
    
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(val => val !== "") && index === 5) {
        handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    
    const nextFocus = Math.min(pastedData.length, 5);
    inputRefs.current[nextFocus]?.focus();

    if (pastedData.length === 6) {
        handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (code: string) => {
    await verifyOtp(code);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setOtp(new Array(6).fill(""));
    setError(null);
    await resendOtp();
    setCountdown(60); 
    inputRefs.current[0]?.focus();
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

      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-surface mx-auto flex items-center justify-center border border-border mb-4">
            {userInfo?.avatarUrl ? (
                <img src={userInfo.avatarUrl} className="w-full h-full rounded-full object-cover" />
            ) : (
                <span className="text-2xl">📧</span>
            )}
        </div>
        <h3 className="text-xl font-bold">Nhập mã xác thực</h3>
        <p className="text-sm text-muted">
          Chúng tôi đã gửi mã 6 số đến <br/> <span className="font-bold text-foreground">{email}</span>
        </p>
      </div>

      <div className="flex justify-center gap-2 my-6">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            // --- ĐÃ SỬA LỖI TYPESCRIPT TẠI ĐÂY ---
            ref={(el) => { inputRefs.current[index] = el; }} 
            // -------------------------------------
            value={data}
            onChange={e => handleChange(e.target, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="w-10 h-12 md:w-12 md:h-14 border-2 border-border rounded-xl text-center text-xl font-bold bg-surface focus:border-primary focus:bg-background outline-none transition-all caret-primary"
            disabled={isLoading}
          />
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center animate-pulse">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button 
            onClick={() => handleSubmit(otp.join(""))} 
            isLoading={isLoading} 
            disabled={otp.some(v => v === "")}
        >
            Xác nhận
        </Button>

        <button 
            onClick={handleResend}
            disabled={countdown > 0 || isLoading}
            className="text-sm text-muted hover:text-primary transition-colors flex items-center justify-center gap-2 py-2"
        >
            <RefreshCw className={`w-4 h-4 ${countdown > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
            {countdown > 0 ? `Gửi lại mã sau ${countdown}s` : "Gửi lại mã mới"}
        </button>
      </div>

      {/* --- NÚT CHUYỂN QUA MẬT KHẨU --- */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted">Hoặc</span></div>
      </div>

      <Button variant="outline" onClick={goToLogin}>
        Đăng nhập bằng mật khẩu
      </Button>
      {/* ---------------------------------- */}
    </motion.div>
  );
};