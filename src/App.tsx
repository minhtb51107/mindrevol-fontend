import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/store/AuthContext'; 
import { AuthFlowProvider } from '@/modules/auth/store/AuthFlowContext'; 
import { Loader2 } from 'lucide-react';

import AuthPage from '@/modules/auth/pages/AuthPage';
import HomePage from '@/modules/feed/pages/HomePage';
import { ActivatePage } from '@/modules/auth/pages/ActivatePage';
import { TikTokCallback } from '@/modules/auth/pages/TikTokCallback';
import { JoinLinkPage } from '@/modules/journey/pages/JoinLinkPage';
import ProfilePage from './modules/user/pages/ProfilePage';

// [FIX]: Import default (Bỏ dấu ngoặc nhọn)
import ChatPage from '@/modules/chat/pages/ChatPage'; 

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
      <Route path="/activate" element={<ActivatePage onBackToLogin={() => window.location.href = '/'} />} />
      
      <Route path="/tiktok-callback" element={
        <AuthFlowProvider>
          <TikTokCallback />
        </AuthFlowProvider>
      } />

      <Route path="/join/:code" element={
        isAuthenticated ? <JoinLinkPage /> : <Navigate to="/" replace state={{ fromJoin: true }} />
      } />

      <Route path="/" element={
        isAuthenticated ? <HomePage /> : <AuthPage />
      } />

      <Route path="/chat" element={
        isAuthenticated ? <ChatPage /> : <Navigate to="/" replace />
      } />
      
      <Route path="/profile" element={
        isAuthenticated ? <ProfilePage /> : <Navigate to="/" replace />
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;