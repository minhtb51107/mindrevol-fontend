// src/App.tsx
import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/store/AuthContext'; 
import { AuthFlowProvider } from '@/modules/auth/store/AuthFlowContext'; 
import { Loader2 } from 'lucide-react';

// Import Pages
import AuthPage from '@/modules/auth/pages/AuthPage';
import HomePage from '@/modules/feed/pages/HomePage';
import { ActivatePage } from '@/modules/auth/pages/ActivatePage';
import { TikTokCallback } from '@/modules/auth/pages/TikTokCallback';
import { JoinLinkPage } from '@/modules/journey/pages/JoinLinkPage';
import ProfilePage from './modules/user/pages/ProfilePage';
import BlockListPage from './modules/user/pages/BlockListPage';
import { ChatPage } from '@/modules/chat/pages/ChatPage'; // <--- [UPDATE] Import ChatPage

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
      {/* 1. Public Routes */}
      <Route path="/activate" element={<ActivatePage onBackToLogin={() => window.location.href = '/'} />} />
      
      <Route path="/tiktok-callback" element={
        <AuthFlowProvider>
          <TikTokCallback />
        </AuthFlowProvider>
      } />

      {/* 2. Route xử lý Link Mời (Quan trọng) */}
      <Route path="/join/:code" element={
        isAuthenticated ? <JoinLinkPage /> : <Navigate to="/" replace state={{ fromJoin: true }} />
      } />

      {/* 3. Main Route (Có auth guard) */}
      <Route path="/" element={
        isAuthenticated ? <HomePage /> : <AuthPage />
      } />

      {/* 4. Private Routes (Yêu cầu đăng nhập) */}
      <Route path="/chat" element={
        isAuthenticated ? <ChatPage /> : <Navigate to="/" replace />
      } />
      
      <Route path="/profile" element={
        isAuthenticated ? <ProfilePage /> : <Navigate to="/" replace />
      } />
      
      <Route path="/block-list" element={
        isAuthenticated ? <BlockListPage /> : <Navigate to="/" replace />
      } />

      {/* 5. Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;