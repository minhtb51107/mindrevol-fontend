// src/App.tsx
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/store/AuthContext'; 
import { AuthFlowProvider } from '@/modules/auth/store/AuthFlowContext'; 
import { Loader2 } from 'lucide-react';

import AuthPage from '@/modules/auth/pages/AuthPage';
import HomePage from '@/pages/HomePage';
import { TikTokCallback } from '@/modules/auth/pages/TikTokCallback';
import { JoinLinkPage } from '@/modules/journey/pages/JoinLinkPage';
import ProfilePage from './modules/user/pages/ProfilePage';
import ChatPage from '@/modules/chat/pages/ChatPage'; 
import Terms from '@/pages/Terms';     
import Privacy from '@/pages/Privacy'; 

// [MỚI] Import các trang của Box
import BoxListPage from '@/modules/box/pages/BoxListPage';
import BoxDetailPage from '@/modules/box/pages/BoxDetailPage';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#121212]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* --- CÁC TRANG CÔNG KHAI (KHÔNG CẦN LOGIN) --- */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      
      <Route path="/tiktok-callback" element={
        <AuthFlowProvider>
          <TikTokCallback />
        </AuthFlowProvider>
      } />

      {/* --- CÁC TRANG YÊU CẦU ĐĂNG NHẬP --- */}
      <Route path="/join/:code" element={
        isAuthenticated ? <JoinLinkPage /> : <Navigate to="/" replace state={{ fromJoin: true }} />
      } />

      <Route path="/" element={
        isAuthenticated ? <HomePage /> : <AuthPage />
      } />

      <Route path="/chat" element={
        isAuthenticated ? <ChatPage /> : <Navigate to="/" replace />
      } />

      <Route path="/chat/:conversationId" element={
        isAuthenticated ? <ChatPage /> : <Navigate to="/" replace />
      } />
      
      <Route path="/profile" element={
        isAuthenticated ? <ProfilePage /> : <Navigate to="/" replace />
      } />

      <Route path="/profile/:userId" element={
        isAuthenticated ? <ProfilePage /> : <Navigate to="/" replace />
      } />

      {/* [MỚI] Routes cho module Box */}
      <Route path="/box" element={
        isAuthenticated ? <BoxListPage /> : <Navigate to="/" replace />
      } />
      <Route path="/box/:boxId" element={
        isAuthenticated ? <BoxDetailPage /> : <Navigate to="/" replace />
      } />

      {/* Fallback route: Nếu không khớp route nào thì về trang chủ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;