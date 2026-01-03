import React, { createContext, useContext } from 'react';
import { UserProfile } from '@/modules/user/services/user.service';
import { useGlobalAuth } from '../hooks/useGlobalAuth'; // Import Hook logic

// Interface này định nghĩa những gì Context cung cấp ra ngoài
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
  // Toàn bộ logic được gọi từ Hook
  const authLogic = useGlobalAuth();

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