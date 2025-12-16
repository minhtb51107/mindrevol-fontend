import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { BadgeList } from '@/modules/gamification/components/BadgeList';
import { PointHistoryList } from '@/modules/gamification/components/PointHistoryList';
import { Settings, LogOut, Coins, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <MainLayout>
      <div className="min-h-screen pt-24 px-4 pb-20 w-full max-w-md mx-auto">
        
        {/* Header Profile */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 mb-4 shadow-2xl">
            <img src={user.avatarUrl || 'https://i.pravatar.cc/150?u=me'} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-white">{user.fullname}</h1>
          <p className="text-zinc-400">@{user.handle}</p>
          
          {/* Stats Bar */}
          <div className="flex items-center gap-6 mt-6 bg-white/5 px-6 py-3 rounded-full border border-white/10">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">0</span>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">Check-ins</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-yellow-400 flex items-center gap-1">
                {/* Giả định user có field points, nếu chưa có thì hiển thị 0 hoặc cần update AuthContext */}
                0 <Coins className="w-4 h-4" />
              </span>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">Points</span>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" /> Thành tựu
            </h2>
          </div>
          <BadgeList />
        </div>

        {/* History Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" /> Biến động số dư
          </h2>
          <PointHistoryList />
        </div>

        {/* Menu Actions */}
        <div className="space-y-3">
          <Link to="/block-list" className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-white/5 hover:bg-zinc-800 transition-colors">
            <span className="flex items-center gap-3 text-zinc-300">
              <div className="p-2 bg-red-500/10 rounded-lg"><Shield className="w-4 h-4 text-red-400" /></div>
              Danh sách chặn
            </span>
          </Link>
          
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-4 text-red-400 font-medium hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" /> Đăng xuất
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;