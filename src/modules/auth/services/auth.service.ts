import { http } from '@/lib/http';

// --- DTOs ---
export interface UserSummary {
  id: number;
  handle: string;
  fullname: string;
  avatarUrl: string;
  isOnline: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface RegisterPayload {
  email: string;
  password?: string;
  fullname?: string;
  handle?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  agreedToTerms?: boolean;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  errorCode?: string;
  data: T;
  timestamp: string;
}

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