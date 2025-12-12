import React, { useEffect } from 'react';
import { useAuthFlow } from '../store/AuthFlowContext';
import { Loader2 } from 'lucide-react';

export const TikTokCallback = () => {
  const { loginTikTok, error } = useAuthFlow();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    // Lấy verifier đã lưu lúc bấm nút Login
    const codeVerifier = localStorage.getItem('tiktok_code_verifier');
    
    if (code && codeVerifier) {
      loginTikTok(code, codeVerifier).then(() => {
        window.history.replaceState({}, document.title, "/");
        localStorage.removeItem('tiktok_code_verifier'); // Xóa sau khi dùng
      });
    } else if (!codeVerifier) {
       console.error("Missing Code Verifier (PKCE Error)");
    }
  }, []);

  // ... (Phần render UI giữ nguyên) ...
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-background text-foreground">
        <p className="text-red-500 font-bold">{error}</p>
        <button onClick={() => window.location.href = '/'} className="text-primary hover:underline font-medium">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-background text-foreground">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-muted text-sm font-medium">Đang xác thực bảo mật...</p>
    </div>
  );
};