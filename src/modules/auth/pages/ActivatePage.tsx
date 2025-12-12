import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Cần cài react-router-dom nếu chưa (nhưng App bạn đang dùng cách khác, chờ chút)
// À, nãy giờ ta chưa setup React Router. Ta đang dùng App.tsx để switch view thủ công.
// Để đơn giản cho MVP, ta sẽ xử lý logic này ngay trong App.tsx hoặc tạo view đơn giản.

// --- TẠM THỜI DÙNG CÁCH NÀY TRONG KHI CHỜ SETUP ROUTER ---
// (Ta sẽ dùng URL Search Params native của JS)

import { http } from '@/lib/http';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ActivatePage = ({ onBackToLogin }: { onBackToLogin: () => void }) => {
  const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
  
  useEffect(() => {
    const activate = async () => {
      // Lấy token từ URL: ?token=...
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('ERROR');
        return;
      }

      try {
        // Gọi API Backend
        await http.get(`/auth/activate?token=${token}`);
        setStatus('SUCCESS');
      } catch (err) {
        setStatus('ERROR');
      }
    };

    activate();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="w-full max-w-md bg-surface border border-border p-8 rounded-3xl text-center shadow-2xl">
        
        {status === 'LOADING' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <h2 className="text-xl font-bold">Đang kích hoạt tài khoản...</h2>
          </div>
        )}

        {status === 'SUCCESS' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold">Kích hoạt thành công!</h2>
            <p className="text-muted">Tài khoản của bạn đã sẵn sàng.</p>
            <Button onClick={onBackToLogin} className="mt-4">
              Đăng nhập ngay
            </Button>
          </div>
        )}

        {status === 'ERROR' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold">Kích hoạt thất bại</h2>
            <p className="text-muted">Link có thể đã hết hạn hoặc không hợp lệ.</p>
            <Button variant="outline" onClick={onBackToLogin} className="mt-4">
              Quay lại đăng nhập
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};