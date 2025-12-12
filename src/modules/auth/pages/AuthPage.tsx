import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout'; 
import { AuthFlowProvider, useAuthFlow } from '../store/AuthFlowContext';
import { EmailForm } from '../components/EmailForm';
import { PasswordForm } from '../components/PasswordForm';
import { RegisterWizard } from '../components/RegisterWizard';
import { OtpForm } from '../components/OtpForm'; // <--- IMPORT MỚI
import { AnimatePresence } from 'framer-motion';

const AuthContent = () => {
  const { currentStep } = useAuthFlow();

  const Header = (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform rotate-3 shadow-lg shadow-primary/30">
          <span className="text-white font-black text-xl">M</span>
        </div>
        <span className="text-2xl font-extrabold tracking-tighter text-foreground">MindRevol</span>
      </div>
      
      {currentStep !== 'REGISTER_WIZARD' && (
        <>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {currentStep === 'EMAIL_INPUT' ? 'Chào bạn mới!' : 'Mừng trở lại,'}
          </h1>
          <p className="text-muted text-sm font-medium">
            Cùng nhau đi xa hơn mỗi ngày.
          </p>
        </>
      )}
    </div>
  );

  return (
    <>
      {Header}
      <div className="relative w-full min-h-[400px]"> 
        <AnimatePresence mode="wait" initial={false}>
          
          {/* Màn hình 1: Nhập Email */}
          {currentStep === 'EMAIL_INPUT' && (
            <div key="email" className="absolute inset-0">
              <EmailForm />
            </div>
          )}
          
          {/* Màn hình 2: OTP (Mặc định) */}
          {currentStep === 'OTP_INPUT' && (
            <div key="otp" className="absolute inset-0">
              <OtpForm />
            </div>
          )}

          {/* Màn hình 3: Password (Fallback) */}
          {currentStep === 'PASSWORD_LOGIN' && (
            <div key="password" className="absolute inset-0">
              <PasswordForm />
            </div>
          )}
          
          {/* Màn hình 4: Đăng ký */}
          {currentStep === 'REGISTER_WIZARD' && (
            <div key="register" className="absolute inset-0">
              <RegisterWizard />
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

const AuthPage = () => {
  return (
    <AuthLayout>
      <AuthFlowProvider>
        <AuthContent />
      </AuthFlowProvider>
    </AuthLayout>
  );
};

export default AuthPage;