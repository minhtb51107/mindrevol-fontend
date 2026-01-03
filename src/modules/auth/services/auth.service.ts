import { http } from '@/lib/http';
import { UserSummary, AuthResponse, RegisterPayload, ApiResponse } from '../types'; // Import mới

export const authService = {
  // 1. Kiểm tra Email
  checkEmail: async (email: string) => {
    return http.post<ApiResponse<UserSummary | null>>('/auth/check-email', { email });
  },

  // 2. Đăng nhập bằng Mật khẩu
  login: async (email: string, password: string) => {
    return http.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
  },

  // 3. Đăng ký
  register: async (payload: RegisterPayload) => {
    return http.post<ApiResponse<void>>('/auth/register', payload);
  },
  
  // 4. Gửi Magic Link (Legacy)
  sendMagicLink: async (email: string) => {
    return http.post<ApiResponse<void>>('/auth/magic-link', { email });
  },

  // 5. Gửi mã OTP Login
  sendOtp: async (email: string) => {
    return http.post<ApiResponse<void>>('/auth/otp/send', { email });
  },

  // 6. Xác thực OTP Login
  verifyOtp: async (email: string, otpCode: string) => {
    return http.post<ApiResponse<AuthResponse>>('/auth/otp/login', { email, otpCode });
  },

  // 7. Social Login
  loginGoogle: async (accessToken: string) => {
    return http.post<ApiResponse<AuthResponse>>('/auth/login/google', { accessToken });
  },

  loginFacebook: async (accessToken: string) => {
    return http.post<ApiResponse<AuthResponse>>('/auth/login/facebook', { accessToken });
  },
  
  loginApple: async (identityToken: string, user?: string) => {
    return http.post<ApiResponse<AuthResponse>>('/auth/login/apple', { identityToken, user });
  },

  loginTikTok: async (code: string, codeVerifier: string) => {
    return http.post<ApiResponse<AuthResponse>>('/auth/login/tiktok', { code, codeVerifier });
  }
};