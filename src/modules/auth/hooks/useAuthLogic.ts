import { useState } from 'react';
import { authService } from '../services/auth.service';
import { UserSummary, RegisterPayload, AuthStep } from '../types';
import { useAuth } from '../store/AuthContext';

export const useAuthLogic = () => {
  const { login: globalLogin } = useAuth(); 

  // --- STATE ---
  const [currentStep, setCurrentStep] = useState<AuthStep>('EMAIL_INPUT');
  const [email, setEmail] = useState('');
  const [userInfo, setUserInfo] = useState<UserSummary | null>(null);
  const [registerData, setRegisterData] = useState<Partial<RegisterPayload>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- HELPERS ---
  const handleAuthSuccess = (response: any) => {
      const { accessToken, refreshToken } = response.data.data;
      globalLogin(accessToken, refreshToken);
  };

  const handleError = (err: any, defaultMsg: string) => {
      setError(err.response?.data?.message || defaultMsg);
  };

  const resetFlow = () => { 
    setEmail(''); 
    setUserInfo(null); 
    setRegisterData({}); 
    setCurrentStep('EMAIL_INPUT'); 
    setError(null); 
  };

  // --- CORE LOGIC ---
  const submitEmail = async (inputEmail: string) => {
    setIsLoading(true);
    setError(null);
    setEmail(inputEmail);
    // Lưu tạm email vào registerData để phòng trường hợp user qua bước đăng ký luôn
    setRegisterData(prev => ({ ...prev, email: inputEmail }));

    try {
      const response = await authService.checkEmail(inputEmail);
      const userData = response.data.data;

      if (userData) {
        setUserInfo(userData);
        // Nếu user tồn tại -> Gửi OTP (để login nhanh) hoặc nhập Pass
        try {
            await authService.sendOtp(inputEmail);
            setCurrentStep('OTP_INPUT'); 
        } catch (e) {
            console.warn("Fallback to password", e);
            setCurrentStep('PASSWORD_LOGIN');
        }
      } else {
        // User chưa tồn tại -> Chuyển sang Register Wizard
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
      handleAuthSuccess(res);
    } catch (err: any) {
      handleError(err, 'Mật khẩu không chính xác');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (finalData?: Partial<RegisterPayload>) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = { ...registerData, ...finalData, email, agreedToTerms: true } as RegisterPayload;
      await authService.register(payload);
      alert("Đăng ký thành công! Hãy kiểm tra email để kích hoạt.");
      resetFlow();
    } catch (err: any) {
      handleError(err, 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
        const res = await authService.verifyOtp(email, code);
        handleAuthSuccess(res);
    } catch (err: any) {
        handleError(err, 'Mã xác thực không đúng');
    } finally {
        setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try { await authService.sendOtp(email); } 
    catch (err: any) { setError("Lỗi gửi mã"); }
  };

  // --- SOCIAL LOGIN ---
  const loginSocial = async (provider: 'google' | 'facebook' | 'tiktok', ...args: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
        let res;
        if (provider === 'google') res = await authService.loginGoogle(args[0]);
        else if (provider === 'facebook') res = await authService.loginFacebook(args[0]);
        else if (provider === 'tiktok') res = await authService.loginTikTok(args[0], args[1]);
        
        if (res) handleAuthSuccess(res);
    } catch (err: any) {
        handleError(err, `Đăng nhập ${provider} thất bại`);
    } finally {
        setIsLoading(false);
    }
  };

  return {
    // Data
    currentStep, email, userInfo, isLoading, error, registerData,
    // Actions
    setError,
    updateRegisterData: (data: Partial<RegisterPayload>) => setRegisterData(prev => ({ ...prev, ...data })),
    submitEmail, login, register, verifyOtp, resendOtp, resetFlow,
    // Social
    loginGoogle: (t: string) => loginSocial('google', t),
    loginFacebook: (t: string) => loginSocial('facebook', t),
    loginTikTok: (c: string, v: string) => loginSocial('tiktok', c, v),
    // Navigation Helpers
    goToLogin: () => setCurrentStep('PASSWORD_LOGIN'),
    goToRegister: () => setCurrentStep('REGISTER_WIZARD'),
    goToOtp: () => setCurrentStep('OTP_INPUT'),
  };
};