import React, { createContext, useContext, useEffect, useState } from 'react'; 
import { UserProfile, userService } from '@/modules/user/services/user.service'; 
import { useGlobalAuth } from '../hooks/useGlobalAuth';
import { identifyUser, resetAnalytics } from '@/lib/analytics';
import { requestFirebaseToken, onMessageListener } from '@/lib/firebase'; 

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authLogic = useGlobalAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  // 1. [QUAN TRỌNG] Khôi phục phiên đăng nhập khi F5 (Refresh trang)
  useEffect(() => {
    const initSession = async () => {
      const token = localStorage.getItem('accessToken');
      if (token && !authLogic.user) {
        try {
          // Gọi API lấy lại thông tin user từ Backend
          await authLogic.refreshProfile(); 
        } catch (error) {
          console.error("Phiên đăng nhập đã hết hạn hoặc không hợp lệ.");
          authLogic.logout(); // Xóa token cũ nếu không hợp lệ
        }
      }
      setIsInitializing(false); // Xong quá trình kiểm tra ban đầu
    };

    initSession();
  }, []); // Chỉ chạy 1 lần khi mở/refresh trang

  // 2. Theo dõi trạng thái đăng nhập để báo cáo Analytics & Setup Firebase
  useEffect(() => {
    if (authLogic.user) {
      // Định danh Analytics
      identifyUser(authLogic.user.id, {
        email: authLogic.user.email,
        fullname: authLogic.user.fullname, 
        role: authLogic.user.role
      });

      // Thiết lập Firebase Push Notifications
      const setupFirebasePush = async () => {
        try {
          const token = await requestFirebaseToken();
          if (token) {
            console.log("FCM Token lấy thành công:", token);
            await userService.updateFcmToken(token);
          }
        } catch (error) {
          console.error("Lỗi khi setup Firebase FCM Token:", error);
        }
      };

      setupFirebasePush();

      // Lắng nghe thông báo khi user ĐANG MỞ web (Foreground)
      let isListening = true; 
      const listenToForegroundMessages = async () => {
        if (!isListening) return;
        try {
          const payload: any = await onMessageListener();
          console.log("Có thông báo mới khi đang mở app:", payload);
          listenToForegroundMessages(); 
        } catch (error) {
          console.error("Lỗi khi lắng nghe thông báo FCM:", error);
        }
      };
      
      listenToForegroundMessages();

      return () => {
        isListening = false;
      };

    } else if (!authLogic.isAuthenticated && !authLogic.isLoading && !isInitializing) {
      resetAnalytics();
    }
  }, [authLogic.user, authLogic.isAuthenticated, authLogic.isLoading, isInitializing]);

  // Chờ kiểm tra token xong mới render app để tránh giật giao diện (Flash)
  if (isInitializing) {
    return <div className="w-screen h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">Đang tải phiên làm việc...</div>;
  }

  return (
    <AuthContext.Provider value={authLogic}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};