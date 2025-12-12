import React, { useState } from 'react';
import { useAuthFlow } from '../store/AuthFlowContext';
import { StepPassword } from './registration/StepPassword';
import { StepHandle } from './registration/StepHandle';
// [QUAN TRỌNG] Import type từ file con để đồng bộ
import { StepBasicInfo, StepFormValues } from './registration/StepBasicInfo'; 
import { AnimatePresence } from 'framer-motion';

type RegisterStep = 1 | 2 | 3;

export const RegisterWizard = () => {
  const { updateRegisterData, register, isLoading, resetFlow, email, error } = useAuthFlow();
  const [step, setStep] = useState<RegisterStep>(1);

  const handlePasswordSubmit = (password: string) => {
    updateRegisterData({ password });
    setStep(2);
  };

  // [FIX LỖI]: Dùng đúng type StepFormValues
  // updateRegisterData chấp nhận Partial<RegisterPayload>, và StepFormValues tương thích với nó
  const handleInfoSubmit = (data: StepFormValues) => {
    updateRegisterData(data);
    setStep(3);
  };

  const handleHandleSubmit = async (handle: string) => {
    await register({ handle });
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-xs font-bold text-muted uppercase tracking-wider">Đăng ký tài khoản</div>
        <div className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">{email}</div>
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-surface border border-border'}`} />
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && <StepPassword key="step1" onNext={handlePasswordSubmit} />}
        {step === 2 && <StepBasicInfo key="step2" onNext={handleInfoSubmit} onBack={() => setStep(1)} />}
        {step === 3 && <StepHandle key="step3" onFinish={handleHandleSubmit} onBack={() => setStep(2)} isLoading={isLoading} />}
      </AnimatePresence>
      
      {step === 1 && (
        <button onClick={resetFlow} className="w-full mt-6 text-xs text-muted hover:text-foreground underline underline-offset-2 transition-colors">
          Không phải email của bạn? Nhập lại
        </button>
      )}
    </div>
  );
};