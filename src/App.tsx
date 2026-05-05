import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/store/AuthContext'; 
import { AuthFlowProvider } from '@/modules/auth/store/AuthFlowContext'; 
import { Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Import 2 màn hình quản lý cuộc gọi
import { GlobalCallOverlay } from '@/modules/call/components/GlobalCallOverlay';
import { PiPCallWindow } from '@/modules/call/components/PiPCallWindow'; // <--- IMPORT COMPONENT MỚI

import AuthPage from '@/modules/auth/pages/AuthPage';
import { TikTokCallback } from '@/modules/auth/pages/TikTokCallback';
import Terms from '@/pages/Terms';     
import Privacy from '@/pages/Privacy'; 

// Lazy load trang
const LandingPage = lazy(() => import('@/pages/LandingPage')); 
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProfilePage = lazy(() => import('@/modules/user/pages/ProfilePage'));
const ChatPage = lazy(() => import('@/modules/chat/pages/ChatPage'));
const BoxListPage = lazy(() => import('@/modules/box/pages/BoxListPage'));
const BoxDetailPage = lazy(() => import('@/modules/box/pages/BoxDetailPage'));
const MemoryTimelinePage = lazy(() => import('@/modules/user/pages/MemoryTimelinePage'));
const JourneyGridFeedPage = lazy(() => import('@/modules/journey/pages/JourneyGridFeedPage'));
const JoinLinkPage = lazy(() => import('@/modules/journey/pages/JoinLinkPage').then(m => ({ default: m.JoinLinkPage })));
const MapPage = lazy(() => import('@/modules/map/pages/MapPage').then(m => ({ default: m.MapPage })));

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#121212]">
    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
  </div>
);

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={isAuthenticated ? <HomePage /> : <LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        
        <Route path="/tiktok-callback" element={
          <AuthFlowProvider><TikTokCallback /></AuthFlowProvider>
        } />

        <Route element={<ProtectedRoute />}>
          <Route path="/join/:code" element={<JoinLinkPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:conversationId" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/box" element={<BoxListPage />} />
          <Route path="/box/:boxId" element={<BoxDetailPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/streak" element={<MemoryTimelinePage />} />
          <Route path="/journeys/grid" element={<JourneyGridFeedPage />} />
          
          {/* ĐÃ XÓA ROUTE /call/:roomId VÌ CHÚNG TA DÙNG OVERLAY NỔI */}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* OVERLAY: Đổ chuông & Cuộc gọi nổi */}
      {isAuthenticated && <GlobalCallOverlay />}
      {isAuthenticated && <PiPCallWindow />}
      
    </Suspense>
  );
}

export default App;