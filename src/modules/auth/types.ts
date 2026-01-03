// src/modules/auth/types.ts

// 1. DTO cho User (dùng chung cho Auth và User module)
export interface UserSummary {
  id: number;
  handle: string;
  fullname: string;
  avatarUrl: string;
  isOnline: boolean;
}

// 2. DTO phản hồi khi Login/Register thành công
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

// 3. DTO gửi lên khi Register
export interface RegisterPayload {
  email: string;
  password?: string;
  fullname?: string;
  handle?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  agreedToTerms?: boolean;
}

// 4. Format chuẩn của API Response (bọc ngoài)
export interface ApiResponse<T> {
  status: number;
  message: string;
  errorCode?: string;
  data: T;
  timestamp: string;
}

// 5. [QUAN TRỌNG] Type định nghĩa các bước của luồng Auth
// Đây chính là phần bạn đang thiếu
export type AuthStep = 
  | 'EMAIL_INPUT'       // Bước 1: Nhập Email
  | 'PASSWORD_LOGIN'    // Bước 2a: Nhập Pass (User cũ)
  | 'OTP_INPUT'         // Bước 2b: Nhập OTP (Quên pass hoặc login nhanh)
  | 'REGISTER_WIZARD';  // Bước 2c: Đăng ký mới (User mới)