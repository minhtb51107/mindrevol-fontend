import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, MapPin, Music, Zap, Smile, ThumbsUp, Flame, Send, 
  Plus, Circle, Triangle, Bell, UserPlus, Hash, Search, Bookmark, MoreHorizontal, LayoutGrid 
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
}

// --- 1. POST CARD (Nghiêng & Nổi hơn) ---
const PostCard = ({ img, user, avatar, caption, location, time, rotate, scale, zIndex, top, left, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0, rotate: 0 }}
    animate={{ opacity: 1, scale: scale || 1, rotate: rotate }}
    transition={{ delay: delay, type: "spring", stiffness: 60, damping: 12 }}
    whileHover={{ scale: 1.05, rotate: 0, zIndex: 100, transition: { duration: 0.3 } }}
    className={`absolute bg-white dark:bg-[#18181b] p-3.5 rounded-[24px] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.2)] dark:shadow-black/60 border-2 border-white dark:border-zinc-700 w-[280px] group cursor-pointer`}
    style={{ top, left, zIndex }}
  >
    {/* Header */}
    <div className="flex items-center gap-3 mb-3">
      <div className="relative">
        <img src={avatar} className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 dark:border-zinc-600" alt="Avt" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
      </div>
      <div className="flex-1 leading-tight">
        <p className="text-sm font-bold text-gray-900 dark:text-white">{user}</p>
        <p className="text-[10px] font-medium text-gray-400">{time}</p>
      </div>
      <MoreHorizontal className="w-5 h-5 text-gray-300" />
    </div>
    
    {/* Image */}
    <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3 relative bg-gray-100 dark:bg-zinc-900 shadow-inner">
      <img src={img} className="w-full h-full object-cover" alt="Post Content" />
      
      {/* Location Tag Nổi */}
      {location && (
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1.5 text-gray-800 dark:text-white border border-white/20">
          <MapPin className="w-3 h-3 text-red-500 fill-current" /> {location}
        </div>
      )}

      {/* Love Animation on Hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
         <Heart className="w-16 h-16 text-white fill-white drop-shadow-lg animate-bounce" />
      </div>
    </div>

    {/* Actions Bar */}
    <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex gap-4">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 hover:scale-125 transition-transform" />
            <MessageCircle className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors" />
            <Send className="w-6 h-6 text-gray-700 dark:text-gray-300 -rotate-45 hover:text-green-500 transition-colors" />
        </div>
        <Bookmark className="w-5 h-5 text-gray-400 hover:text-yellow-500 transition-colors" />
    </div>

    {/* Likes Count */}
    <div className="px-1 mb-1 flex items-center gap-1.5">
        <div className="flex -space-x-1.5">
            <div className="w-4 h-4 rounded-full bg-red-400 border border-white"></div>
            <div className="w-4 h-4 rounded-full bg-blue-400 border border-white"></div>
            <div className="w-4 h-4 rounded-full bg-yellow-400 border border-white"></div>
        </div>
        <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Liked by <span className="text-gray-900 dark:text-white">sarah</span> and <span className="text-gray-900 dark:text-white">8,234 others</span></p>
    </div>

    {/* Caption */}
    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed px-1">
      <span className="font-bold text-gray-900 dark:text-white mr-1">{user}</span>
      {caption}
    </p>
  </motion.div>
);

// --- 2. FLOATING WIDGETS (Các mảnh ghép nhỏ) ---

// Thông báo tin nhắn
const MessageWidget = ({ avatar, name, msg, top, left, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
    transition={{ delay, type: "spring" }}
    className="absolute bg-white dark:bg-[#202022] p-3 rounded-2xl shadow-xl flex items-center gap-3 w-64 border border-gray-100 dark:border-zinc-700 z-40"
    style={{ top, left }}
  >
    <div className="relative">
      <img src={avatar} className="w-10 h-10 rounded-full object-cover" />
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-white">1</div>
    </div>
    <div>
      <p className="text-xs font-bold text-gray-900 dark:text-white">{name}</p>
      <p className="text-[10px] text-gray-500 truncate w-32">{msg}</p>
    </div>
    <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
  </motion.div>
);

// Thẻ Hashtag
const HashtagPill = ({ tag, color, top, left, rotate, delay }: any) => (
  <motion.div
    initial={{ scale: 0 }} animate={{ scale: 1 }}
    transition={{ delay, type: "spring" }}
    className={`absolute px-4 py-2 rounded-full ${color} text-white font-bold text-sm shadow-lg flex items-center gap-1 z-30`}
    style={{ top, left, transform: `rotate(${rotate}deg)` }}
  >
    <Hash className="w-3 h-3" /> {tag}
  </motion.div>
);

// Nút Friend Request
const FriendReqWidget = ({ top, left, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: "spring" }}
    className="absolute bg-white dark:bg-[#202022] p-3 rounded-2xl shadow-lg flex flex-col items-center gap-2 w-32 border border-gray-100 dark:border-zinc-700 z-30"
    style={{ top, left, transform: 'rotate(5deg)' }}
  >
    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mb-1">
        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
    </div>
    <p className="text-[10px] font-bold text-center dark:text-white">Anna muốn kết bạn</p>
    <div className="flex gap-2 w-full">
        <button className="flex-1 bg-blue-500 text-white text-[10px] py-1 rounded-lg">Đồng ý</button>
        <button className="flex-1 bg-gray-100 text-gray-500 text-[10px] py-1 rounded-lg">Xóa</button>
    </div>
  </motion.div>
);

// --- MAIN LAYOUT ---

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden font-sans transition-colors duration-300 selection:bg-primary/30">
      
      {/* CỘT TRÁI: THE SOCIAL UNIVERSE (Đậm đặc & Phức tạp) */}
      <div className="hidden lg:flex lg:w-[60%] bg-surface relative overflow-hidden items-center justify-center transition-colors duration-300">
        
        {/* === LAYER 1: GEOMETRIC BACKGROUND (Đậm hơn, rõ hơn) === */}
        <div className="absolute inset-0 pointer-events-none">
            
            {/* Lưới Caro (Grid) */}
            <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.15]" 
                 style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />
            
            {/* Hình tròn lớn mờ ảo (Gradient Blobs) */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]" />

            {/* Các hình khối rắn (Solid Shapes) trôi nổi */}
            <motion.div 
                animate={{ y: [0, -30, 0], rotate: 180 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 left-20"
            >
                <Triangle className="w-16 h-16 text-yellow-400/80 fill-yellow-400/20" strokeWidth={2} />
            </motion.div>

            <motion.div 
                animate={{ x: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/3 right-10"
            >
                <Circle className="w-24 h-24 text-rose-400/80 fill-rose-400/20" strokeWidth={2} />
            </motion.div>

            <motion.div 
                animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-40 left-10"
            >
                <Plus className="w-32 h-32 text-indigo-500/30" strokeWidth={3} />
            </motion.div>

            {/* Đường uốn lượn (Squiggle) */}
            <svg className="absolute bottom-10 right-1/3 w-64 h-64 text-teal-400/30 dark:text-teal-400/20" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 100 C 50 0, 150 200, 190 100" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
        </div>

        {/* === LAYER 2: MAIN CONTENT (Các Card chồng chéo) === */}
        <div className="relative w-[900px] h-[800px] scale-[0.85] xl:scale-100">
          
          {/* Post 1: Travel (Giữa - Nổi nhất) */}
          <PostCard 
            top="18%" left="32%" zIndex={30} rotate={-5} // Nghiêng trái
            delay={0.2}
            user="minh_explorer" 
            avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
            img="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=600&auto=format&fit=crop"
            location="Kyoto, Japan"
            time="10m"
            caption="Mùa thu nước Nhật đẹp nao lòng 🍁⛩️ #Japan #Travel"
          />

          {/* Post 2: Lifestyle/Fashion (Góc trái dưới) */}
          <PostCard 
            top="52%" left="8%" zIndex={20} rotate={8} // Nghiêng phải
            delay={0.4}
            user="sarah.style"
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
            img="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop"
            location="OOTD"
            time="2h"
            caption="Outfit hôm nay thế nào mọi người? ✨👗"
          />

          {/* Post 3: Work/Tech (Góc phải trên) */}
          <PostCard 
            top="8%" left="62%" zIndex={10} rotate={12} // Nghiêng phải mạnh
            delay={0.6}
            user="coding_life"
            avatar="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
            img="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop"
            location="Setup Tour"
            time="5h"
            caption="Góc làm việc mới đã hoàn thiện! 🖥️⌨️ #Setup"
          />

          {/* Post 4: Food (Dưới cùng phải) */}
          <PostCard 
            top="65%" left="58%" zIndex={25} rotate={-8} // Nghiêng trái
            delay={0.5}
            user="food_lover"
            avatar="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop"
            img="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop"
            location="Pizza 4P's"
            time="30m"
            caption="Pizza time! 🍕🤤"
          />

          {/* === LAYER 3: FLOATING WIDGETS (Các chi tiết nhỏ bay lượn) === */}
          
          {/* Notification Badge */}
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}
            className="absolute top-[12%] left-[25%] bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-50 flex items-center gap-2 animate-bounce"
          >
            <Bell className="w-3 h-3 fill-current" /> 9+ Thông báo mới
          </motion.div>

          {/* Live Badge */}
          <div className="absolute top-[40%] left-[85%] bg-white dark:bg-black px-2 py-1 rounded-md border border-gray-200 dark:border-zinc-700 shadow-md z-40 transform rotate-12">
             <div className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">LIVE</div>
          </div>

          {/* Message Widget */}
          <MessageWidget 
            top="40%" left="5%" delay={1.2}
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
            name="Hoàng Nam"
            msg="Ê tối nay đi cà phê không?"
          />

          {/* Friend Request */}
          <FriendReqWidget top="75%" left="30%" delay={1.4} />

          {/* Hashtags */}
          <HashtagPill tag="MindRevol" color="bg-indigo-500" top="85%" left="80%" rotate={-5} delay={1.5} />
          <HashtagPill tag="Motivation" color="bg-orange-500" top="5%" left="50%" rotate={5} delay={1.6} />

          {/* Floating Icons */}
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-[30%] left-[55%] z-50 bg-white dark:bg-zinc-800 p-2 rounded-full shadow-lg text-blue-500">
            <ThumbsUp className="w-6 h-6 fill-current" />
          </motion.div>
          
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-[60%] left-[20%] z-50 bg-white dark:bg-zinc-800 p-2 rounded-full shadow-lg text-rose-500">
            <Heart className="w-8 h-8 fill-current" />
          </motion.div>

        </div>
      </div>

      {/* CỘT PHẢI: Form Area (Giữ nguyên sự tối giản để user tập trung nhập liệu) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative bg-background transition-colors duration-300">
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-[380px] relative z-20">
          {children}
        </div>
        
        {/* Footer Link */}
        <div className="absolute bottom-8 flex gap-6 text-sm text-muted font-medium">
            <a href="#" className="hover:text-primary transition-colors">Về chúng tôi</a>
            <a href="#" className="hover:text-primary transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-primary transition-colors">Hỗ trợ</a>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;