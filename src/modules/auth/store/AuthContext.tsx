import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService, UserProfile } from '@/modules/user/services/user.service';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      // Gọi API lấy thông tin user
      const profile = await userService.getMyProfile();
      setUser(profile);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("❌ Lỗi tải thông tin User:", error);
      
      // CHỈ LOGOUT NẾU LỖI LÀ 401 (Token sai/hết hạn) HOẶC 403 (Không có quyền)
      // Tránh logout oan khi mạng lag hoặc server lỗi 500
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout(); 
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Có token -> Tạm set true để không bị đẩy ra login ngay
        setIsAuthenticated(true);
        // Sau đó gọi API để verify và lấy info
        await fetchUserProfile();
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (token: string, refreshToken: string) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
    await fetchUserProfile(); // Tải thông tin ngay lập tức
  };

  const logout = () => {
    console.log("👋 Logging out...");
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
    // Redirect về login (đảm bảo App.tsx có route này)
    // window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, refreshProfile: fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};