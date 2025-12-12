import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Heart, MessageCircle, Share2, MapPin, MoreHorizontal } from 'lucide-react';

const PostItem = ({ name, time, content, image, avatar, likes }: any) => (
  <div className="border-b border-border p-4 hover:bg-surface/50 transition-colors cursor-pointer">
    <div className="flex gap-4">
      {/* Avatar */}
      <img src={avatar} className="w-11 h-11 rounded-full object-cover border border-border mt-1" alt="Avatar" />
      
      <div className="flex-1">
        {/* Header Post */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-[15px] hover:underline cursor-pointer text-foreground">{name}</h4>
            <p className="text-xs text-muted">{time}</p>
          </div>
          <button className="text-muted hover:text-foreground p-1 rounded-full hover:bg-background transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="mt-2 text-[15px] leading-relaxed whitespace-pre-line text-foreground/90">
          {content}
        </p>

        {/* Image (Nếu có) */}
        {image && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-border shadow-sm max-h-[500px]">
            <img src={image} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" alt="Post Image" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 pr-4 max-w-md">
          <button className="flex items-center gap-2 text-muted hover:text-rose-500 group transition-colors">
            <div className="p-2 rounded-full group-hover:bg-rose-500/10">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">{likes}</span>
          </button>

          <button className="flex items-center gap-2 text-muted hover:text-blue-500 group transition-colors">
            <div className="p-2 rounded-full group-hover:bg-blue-500/10">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Bình luận</span>
          </button>

          <button className="flex items-center gap-2 text-muted hover:text-green-500 group transition-colors">
            <div className="p-2 rounded-full group-hover:bg-green-500/10">
              <Share2 className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  return (
    <MainLayout>
      {/* Feed Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex justify-between items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <h2 className="text-lg font-bold text-foreground">Dành cho bạn</h2>
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      </div>

      {/* New Post Input (Giống Twitter) */}
      <div className="p-4 border-b border-border flex gap-4">
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shrink-0" />
        <div className="flex-1">
          <input 
            placeholder="Hôm nay bạn thế nào?" 
            className="w-full bg-transparent outline-none text-lg placeholder:text-muted/60 mt-2 text-foreground"
          />
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2 text-primary">
              <button className="p-2 hover:bg-primary/10 rounded-full transition-colors"><MapPin className="w-5 h-5" /></button>
              {/* Thêm các icon khác */}
            </div>
            <button className="px-6 py-2 bg-primary text-white font-bold rounded-full text-sm hover:opacity-90 disabled:opacity-50 transition-all">
              Đăng
            </button>
          </div>
        </div>
      </div>

      {/* Feed Stream (Dữ liệu mẫu) */}
      <div className="pb-20">
        <PostItem 
          name="Minh Developer"
          time="2 giờ trước"
          avatar="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
          content="Vừa hoàn thành xong module Auth cho dự án MindRevol. Cảm giác thật tuyệt khi mọi thứ hoạt động mượt mà! 🚀🔥 #coding #startup"
          image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"
          likes="124"
        />
        
        <PostItem 
          name="Sarah Design"
          time="5 giờ trước"
          avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
          content="Góc làm việc mới. Một chút xanh cho ngày mới năng động 🌿"
          image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1200&auto=format&fit=crop"
          likes="892"
        />

        <PostItem 
          name="MindRevol Official"
          time="1 ngày trước"
          avatar="https://github.com/shadcn.png"
          content="Chào mừng các bạn đến với MindRevol Beta! Hãy cùng nhau xây dựng những thói quen tốt nhé."
          likes="9,999"
        />
      </div>
    </MainLayout>
  );
};

export default HomePage;