import React from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSecurity } from '../hooks/useSecurity';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
      user, otpStep, isLoading,
      otp, setOtp, newPassword, setNewPassword, confirmPassword, setConfirmPassword,
      handleSendOtp, handleSubmit, handleBack
  } = useSecurity(onClose);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center p-0 md:p-6 font-quicksand">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px] animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full md:w-[480px] bg-white dark:bg-[#121212] rounded-t-[32px] md:rounded-[40px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-1/2 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300">
        
        {/* HEADER ĐỒNG BỘ */}
        <div className="w-full flex justify-center pt-3 pb-1 md:hidden shrink-0">
            <div className="w-12 h-1.5 bg-[#D6CFC7] dark:bg-[#3A3734] rounded-full"></div>
        </div>

        <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-[#F4EBE1] dark:border-[#2B2A29] shrink-0">
          <div className="flex items-center gap-3">
              <button onClick={handleBack} className="p-2 -ml-2 hover:bg-[#F4EBE1] dark:hover:bg-[#2B2A29] rounded-xl text-[#8A8580] dark:text-[#A09D9A] transition-colors">
                  <ArrowLeft size={20} strokeWidth={2.5} />
              </button>
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-[14px] flex items-center justify-center shadow-sm">
                  <KeyRound className="w-5 h-5 text-blue-500" strokeWidth={2.5} />
              </div>
              <h2 className="text-[1.4rem] font-black text-[#1A1A1A] dark:text-white tracking-tight">Bảo mật</h2>
          </div>
          <button onClick={onClose} className="p-2.5 bg-[#F4EBE1] dark:bg-[#2B2A29] hover:bg-[#E2D9CE] dark:hover:bg-[#3A3734] rounded-[16px] text-[#8A8580] dark:text-[#A09D9A] transition-colors active:scale-95">
              <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gradient-to-b from-[#F4EBE1]/30 to-white dark:from-[#1A1A1A]/30 dark:to-[#0A0A0A]">
            
            {otpStep === 'INIT' ? (
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100 dark:border-blue-500/20">
                        <ShieldCheck className="w-10 h-10 text-blue-500" strokeWidth={2} />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-[1.3rem] font-black text-[#1A1A1A] dark:text-white">Xác thực thay đổi</h3>
                        <p className="text-[#8A8580] dark:text-[#A09D9A] text-[0.95rem] font-semibold px-4 leading-relaxed">
                            Để bảo vệ tài khoản, chúng tôi cần gửi một mã xác nhận (OTP) đến email của bạn trước khi đổi mật khẩu.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-[20px] flex items-center gap-4 border border-[#D6CFC7]/50 dark:border-[#3A3734] shadow-sm mt-8">
                        <div className="p-3 bg-[#F4EBE1] dark:bg-[#2B2A29] rounded-[14px] shrink-0">
                            <Mail className="w-6 h-6 text-[#8A8580] dark:text-[#A09D9A]" />
                        </div>
                        <div className="text-left overflow-hidden min-w-0">
                            <div className="text-[0.75rem] font-extrabold uppercase tracking-widest text-[#8A8580] dark:text-[#A09D9A] mb-0.5">Email nhận mã</div>
                            <div className="text-[1rem] font-bold text-[#1A1A1A] dark:text-white truncate" title={user?.email}>
                                {user?.email}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="text-center mb-8">
                        <h3 className="text-[1.3rem] font-black text-[#1A1A1A] dark:text-white mb-2">Tạo mật khẩu mới</h3>
                        <p className="text-[0.95rem] text-[#8A8580] dark:text-[#A09D9A] font-semibold">Nhập mã OTP đã gửi đến email của bạn</p>
                    </div>

                    <div>
                        <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2 pl-1">Mã xác nhận (OTP)</label>
                        <input 
                            value={otp} 
                            onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0,6))}
                            className="w-full h-[60px] bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] rounded-[20px] text-center text-[1.4rem] tracking-[0.5em] font-black text-[#1A1A1A] dark:text-white focus:border-[#1A1A1A] dark:focus:border-white focus:bg-white dark:focus:bg-[#1A1A1A] outline-none transition-all shadow-sm" 
                            placeholder="000000"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-4 pt-4">
                        <div>
                            <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2 pl-1">Mật khẩu mới</label>
                            <input 
                                type="password" 
                                value={newPassword} 
                                onChange={e => setNewPassword(e.target.value)} 
                                className="w-full h-[52px] bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] rounded-[16px] px-5 font-bold text-[#1A1A1A] dark:text-white placeholder:text-[#A09D9A] focus:border-[#1A1A1A] dark:focus:border-white focus:bg-white dark:focus:bg-[#1A1A1A] outline-none transition-all"
                                placeholder="Nhập mật khẩu..."
                            />
                        </div>
                        <div>
                            <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2 pl-1">Xác nhận lại</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={e => setConfirmPassword(e.target.value)} 
                                className="w-full h-[52px] bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] rounded-[16px] px-5 font-bold text-[#1A1A1A] dark:text-white placeholder:text-[#A09D9A] focus:border-[#1A1A1A] dark:focus:border-white focus:bg-white dark:focus:bg-[#1A1A1A] outline-none transition-all"
                                placeholder="Nhập lại mật khẩu..."
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="p-6 md:p-8 border-t border-[#F4EBE1] dark:border-[#2B2A29] bg-white dark:bg-[#121212] shrink-0">
            {otpStep === 'INIT' ? (
                <button 
                    onClick={handleSendOtp} 
                    disabled={isLoading}
                    className="w-full h-[60px] bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] rounded-[24px] font-black text-[1.1rem] flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Gửi mã xác nhận'}
                </button>
            ) : (
                <button 
                    onClick={handleSubmit} 
                    disabled={isLoading || !otp || !newPassword || !confirmPassword}
                    className={cn("w-full h-[60px] rounded-[24px] font-black text-[1.1rem] flex items-center justify-center gap-2 transition-all", (isLoading || !otp || !newPassword || !confirmPassword) ? "bg-[#E2D9CE] dark:bg-[#2B2A29] text-[#8A8580] dark:text-[#A09D9A] cursor-not-allowed" : "bg-blue-600 text-white hover:-translate-y-1 active:scale-[0.98] shadow-[0_8px_24px_rgba(37,99,235,0.25)]")}
                >
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin" />} Cập nhật mật khẩu
                </button>
            )}
        </div>

      </div>
    </div>,
    document.body
  );
};