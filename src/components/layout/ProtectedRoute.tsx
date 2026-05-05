// src/components/layout/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/store/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Tùy chọn: Xử lý hiển thị loading nếu AuthContext đang fetch
  if (isLoading) {
    return null; // Hoặc trả về 1 Spinner loading ở đây
  }

  // Nếu chưa đăng nhập, đá về trang "/login" thay vì "/"
  if (!isAuthenticated) {
    // Sửa lại thành includes vì bây giờ path có thể là /app/join/:code
    const isJoinRoute = location.pathname.includes('/join/');
    
    return <Navigate 
      to="/login" // <--- ĐỔI Ở ĐÂY: Chuyển hướng sang trang đăng nhập
      replace 
      state={{ 
        from: location.pathname,
        fromJoin: isJoinRoute 
      }} 
    />;
  }

  // Đã đăng nhập thì cho phép render các route con bên trong
  return <Outlet />;
};