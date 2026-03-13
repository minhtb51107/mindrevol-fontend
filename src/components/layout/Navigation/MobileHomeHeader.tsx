import React, { useMemo, useState, useRef } from 'react';
// [ĐÃ SỬA] Import thêm Icon Camera
import { MessageCircle, Users, Bell, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const MobileHomeHeader = () => {
  const navigate = useNavigate();

  // --- LOGIC XỬ LÝ ẢNH BÌA TÙY CHỈNH ---
  const [customBg, setCustomBg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hàm đọc file khi người dùng chọn ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Tạo URL tạm thời để hiển thị ảnh ngay lập tức mà không cần up lên server
      const imageUrl = URL.createObjectURL(file);
      setCustomBg(imageUrl);
    }
  };

  // Tạo ngẫu nhiên 120 ngôi sao đa sắc cho nền Galaxy
  const stars = useMemo(() => {
    const starColors = ['bg-white', 'bg-blue-100', 'bg-purple-100', 'bg-yellow-50'];
    return Array.from({ length: 120 }).map((_, i) => {
      const isTwinkling = Math.random() > 0.4; 
      return {
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 0.5}px`, 
        opacity: Math.random() * 0.7 + 0.3, 
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        colorClass: starColors[Math.floor(Math.random() * starColors.length)],
        isTwinkling
      };
    });
  }, []);

  return (
    <div className="relative w-full block md:hidden">
      
      {/* Input ẩn dùng để mở thư viện ảnh của điện thoại */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
      />

      {/* NÚT THAY ĐỔI ẢNH BÌA (Nằm góc trên bên phải) */}
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-lg transition-all active:scale-95"
      >
        <Camera className="w-4 h-4 drop-shadow-md" />
      </button>

      {/* 1. NỀN HEADER */}
      <div className="h-[120px] w-full relative flex flex-col justify-end transition-colors duration-300 overflow-hidden bg-[#030014]">
         
         {/* KIỂM TRA: CÓ ẢNH THÌ HIỆN ẢNH, KHÔNG CÓ THÌ HIỆN GALAXY */}
         {customBg ? (
           <>
             {/* Ảnh người dùng tải lên (Có hiệu ứng mờ dần khi mới đổi ảnh) */}
             <img 
                src={customBg} 
                alt="Custom Header" 
                className="absolute inset-0 w-full h-full object-cover z-0 animate-in fade-in duration-500" 
             />
             {/* Một lớp phủ đen mờ nhẹ để đảm bảo nút Camera góc phải luôn nhìn thấy được */}
             <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />
           </>
         ) : (
           <>
             {/* --- Nền Galaxy Mặc Định --- */}
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/50 via-[#030014]/90 to-[#000000] z-0" />
             
             <div className="absolute pointer-events-none w-[150%] h-[150%] -top-[25%] -left-[25%] animate-[spin_180s_linear_infinite] z-0">
               {stars.map(star => (
                 <div 
                   key={star.id} 
                   className={cn(
                     "absolute rounded-full shadow-[0_0_6px_rgba(255,255,255,0.4)]", 
                     star.colorClass,
                     star.isTwinkling ? "animate-pulse" : "" 
                   )} 
                   style={{
                     top: star.top, left: star.left, width: star.size, height: star.size, opacity: star.opacity,
                     ...(star.isTwinkling && { animationDuration: star.animationDuration, animationDelay: star.animationDelay })
                   }} 
                 />
               ))}
             </div>
             
             <div className="absolute top-[-50px] left-[-20%] w-[140%] h-[80px] bg-white/5 blur-[30px] rotate-[-10deg] pointer-events-none z-0" />
             <div className="absolute top-[-40px] left-1/4 w-[200px] h-[100px] bg-purple-600/30 blur-[45px] rounded-full pointer-events-none z-0" />
             <div className="absolute top-[-20px] right-1/4 w-[150px] h-[120px] bg-blue-600/20 blur-[40px] rounded-full pointer-events-none z-0" />
           </>
         )}

         {/* Ranh giới vát lồi (Vẫn luôn đè lên trên ảnh hoặc Galaxy) */}
         <div className="w-full h-[clamp(40px,10vw,56px)] bg-background rounded-t-[clamp(30px,10vw,48px)] transition-colors duration-300 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] relative z-10" />
      </div>

      {/* 2. CÁC NÚT HÌNH TRÒN */}
      <div className="absolute left-0 right-0 -bottom-[clamp(12px,3vw,20px)] z-20 flex justify-center items-center gap-[clamp(16px,6vw,32px)] px-4">
        
        {/* Nút 1: Chat (Vàng - Cam Neon) */}
        <button 
          onClick={() => navigate('/chat')} 
          className={cn(
            "flex items-center justify-center rounded-full transition-all active:scale-95 relative overflow-hidden shrink-0",
            "bg-gradient-to-br from-yellow-300/90 to-orange-500/90 backdrop-blur-md", 
            "shadow-[0_0_20px_rgba(245,158,11,0.5)] shadow-inner",
            "text-white", 
            "w-[clamp(60px,18vw,80px)] h-[clamp(60px,18vw,80px)]", 
            "border-[clamp(3px,1vw,5px)] border-background"
          )}
        >
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full pointer-events-none" />
          <MessageCircle className="w-[clamp(24px,7vw,28px)] h-[clamp(24px,7vw,28px)] relative z-10 drop-shadow-md" />
        </button>

        {/* Nút 2: Bạn bè (Hồng - Đỏ Sáng) */}
        <button 
          onClick={() => { /* TODO: Modal Bạn Bè */ }} 
          className={cn(
            "flex items-center justify-center rounded-full transition-all active:scale-95 relative overflow-hidden shrink-0",
            "bg-gradient-to-br from-rose-400/90 to-red-600/90 backdrop-blur-md", 
            "shadow-[0_0_20px_rgba(225,29,72,0.5)] shadow-inner",
            "text-white",
            "w-[clamp(60px,18vw,80px)] h-[clamp(60px,18vw,80px)]", 
            "border-[clamp(3px,1vw,5px)] border-background"
          )}
        >
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full pointer-events-none" />
          <Users className="w-[clamp(24px,7vw,28px)] h-[clamp(24px,7vw,28px)] relative z-10 drop-shadow-md" />
        </button>

        {/* Nút 3: Thông báo (Cyan - Xanh Dương Neon) */}
        <button 
          onClick={() => { /* TODO: Modal Thông báo */ }} 
          className={cn(
            "flex items-center justify-center rounded-full transition-all active:scale-95 relative overflow-hidden shrink-0",
            "bg-gradient-to-br from-cyan-400/90 to-blue-600/90 backdrop-blur-md",
            "shadow-[0_0_20px_rgba(6,182,212,0.5)] shadow-inner",
            "text-white",
            "w-[clamp(60px,18vw,80px)] h-[clamp(60px,18vw,80px)]", 
            "border-[clamp(3px,1vw,5px)] border-background"
          )}
        >
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full pointer-events-none" />
          <Bell className="w-[clamp(24px,7vw,28px)] h-[clamp(24px,7vw,28px)] relative z-10 drop-shadow-md" />
          <span className="absolute top-[8%] right-[8%] w-[clamp(10px,3vw,14px)] h-[clamp(10px,3vw,14px)] bg-red-500 rounded-full border-[clamp(1.5px,0.5vw,2px)] border-background z-10" />
        </button>

      </div>
    </div>
  );
};