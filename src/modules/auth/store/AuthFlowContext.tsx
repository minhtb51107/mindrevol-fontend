import React, { createContext, useContext, useState } from 'react';
import { authService, UserSummary, RegisterPayload } from '@/modules/auth/services/auth.service';
import { useAuth } from './AuthContext';

export type AuthStep = 
  | 'EMAIL_INPUT'       
  | 'PASSWORD_LOGIN'    
  | 'OTP_INPUT'         
  | 'REGISTER_WIZARD';  

interface AuthFlowContextType {
  currentStep: AuthStep;
  email: string;
  userInfo: UserSummary | null;
  isLoading: boolean;
  error: string | null;
  setError: (msg: string | null) => void;
  
  registerData: Partial<RegisterPayload>; 
  updateRegisterData: (data: Partial<RegisterPayload>) => void;
  register: (finalData?: Partial<RegisterPayload>) => Promise<void>; 

  submitEmail: (email: string) => Promise<void>;
  login: (password: string) => Promise<void>;
  
  verifyOtp: (code: string) => Promise<void>;
  resendOtp: () => Promise<void>;

  loginGoogle: (accessToken: string) => Promise<void>;
  loginFacebook: (accessToken: string) => Promise<void>;
  loginTikTok: (code: string, codeVerifier: string) => Promise<void>;

  resetFlow: () => void;
  goToLogin: () => void;    
  goToRegister: () => void; 
  goToOtp: () => void;      
}

const AuthFlowContext = createContext<AuthFlowContextType | undefined>(undefined);

export const AuthFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { login: globalLogin } = useAuth(); 

  const [currentStep, setCurrentStep] = useState<AuthStep>('EMAIL_INPUT');
  const [email, setEmail] = useState('');
  const [userInfo, setUserInfo] = useState<UserSummary | null>(null);
  const [registerData, setRegisterData] = useState<Partial<RegisterPayload>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitEmail = async (inputEmail: string) => {
    setIsLoading(true);
    setError(null);
    setEmail(inputEmail);
    updateRegisterData({ email: inputEmail });

    try {
      const response = await authService.checkEmail(inputEmail);
      const userData = response.data.data;

      if (userData) {
        setUserInfo(userData);
        try {
            await authService.sendOtp(inputEmail);
            setCurrentStep('OTP_INPUT'); 
        } catch (e) {
            console.error("Lỗi gửi OTP, fallback sang pass", e);
            setCurrentStep('PASSWORD_LOGIN');
        }
      } else {
        setUserInfo(null);
        setCurrentStep('REGISTER_WIZARD');
      }
    } catch (err: any) {
      console.error(err);
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(email, password);
      const { accessToken, refreshToken } = res.data.data;
      globalLogin(accessToken, refreshToken); 
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mật khẩu không chính xác');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (finalData?: Partial<RegisterPayload>) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = { ...registerData, ...finalData, email: email, agreedToTerms: true } as RegisterPayload;
      await authService.register(payload);
      alert("Đăng ký thành công! Hãy kiểm tra email để kích hoạt.");
      resetFlow();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
        const res = await authService.verifyOtp(email, code);
        const { accessToken, refreshToken } = res.data.data;
        globalLogin(accessToken, refreshToken);
    } catch (err: any) {
        setError(err.response?.data?.message || 'Mã xác thực không đúng');
    } finally {
        setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try { await authService.sendOtp(email); } catch (err: any) { setError("Lỗi gửi mã"); }
  };

  const loginGoogle = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.loginGoogle(token);
      const { accessToken, refreshToken } = res.data.data;
      globalLogin(accessToken, refreshToken);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập Google thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const loginFacebook = async (token: string) => {
    setIsLoading(true); 
    setError(null);
    try {
      const res = await authService.loginFacebook(token);
      const { accessToken, refreshToken } = res.data.data;
      globalLogin(accessToken, refreshToken);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập Facebook thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const loginTikTok = async (code: string, codeVerifier: string) => {
    setIsLoading(true); 
    setError(null);
    try {
      // Gửi cả code và verifier
      const res = await authService.loginTikTok(code, codeVerifier);
      const { accessToken, refreshToken } = res.data.data;
      globalLogin(accessToken, refreshToken);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập TikTok thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const updateRegisterData = (data: Partial<RegisterPayload>) => { setRegisterData(prev => ({ ...prev, ...data })); };
  const resetFlow = () => { setEmail(''); setUserInfo(null); setRegisterData({}); setCurrentStep('EMAIL_INPUT'); setError(null); };

  return (
    <AuthFlowContext.Provider value={{
      currentStep, email, userInfo, isLoading, error, setError, registerData, updateRegisterData, 
      submitEmail, login, register, verifyOtp, resendOtp, 
      loginGoogle, loginFacebook, loginTikTok, // <--- Export
      resetFlow, goToLogin: () => setCurrentStep('PASSWORD_LOGIN'), goToRegister: () => setCurrentStep('REGISTER_WIZARD'), goToOtp: () => setCurrentStep('OTP_INPUT'),
    }}>
      {children}
    </AuthFlowContext.Provider>
  );
};

export const useAuthFlow = () => {
  const context = useContext(AuthFlowContext);
  if (!context) throw new Error('useAuthFlow must be used within AuthFlowProvider');
  return context;
};