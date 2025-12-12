import { useEffect, useState } from 'react';
import { useAuth, AuthProvider } from '@/modules/auth/store/AuthContext'; // Import AuthProvider để bọc lại TikTokCallback nếu cần
import { AuthFlowProvider } from '@/modules/auth/store/AuthFlowContext'; // Import FlowProvider
import { Loader2 } from 'lucide-react';

// Import các trang
import AuthPage from '@/modules/auth/pages/AuthPage';
import HomePage from '@/modules/feed/pages/HomePage';
import { ActivatePage } from '@/modules/auth/pages/ActivatePage';
import { TikTokCallback } from '@/modules/auth/pages/TikTokCallback'; // <--- Import mới

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isActivating, setIsActivating] = useState(false);
  const [isTikTokCallback, setIsTikTokCallback] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/activate') setIsActivating(true);
    if (path === '/tiktok-callback') setIsTikTokCallback(true); // <--- Check route
  }, []);

  // 1. Loading ban đầu
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // 2. Màn hình Callback TikTok
  if (isTikTokCallback) {
    // Cần bọc AuthFlowProvider để TikTokCallback dùng được hàm loginTikTok
    return (
      <AuthFlowProvider>
        <TikTokCallback />
      </AuthFlowProvider>
    );
  }

  // 3. Màn hình Kích hoạt
  if (isActivating) {
    return (
      <ActivatePage 
        onBackToLogin={() => {
          window.history.pushState({}, '', '/'); 
          setIsActivating(false);
          window.location.reload(); 
        }} 
      />
    );
  }

  // 4. Main App
  return isAuthenticated ? <HomePage /> : <AuthPage />;
}

export default App;