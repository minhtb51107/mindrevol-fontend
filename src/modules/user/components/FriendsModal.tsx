import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, UserCheck, MessageCircle, Loader2, Search, UserPlus, Check } from 'lucide-react';
import { friendService, FriendshipResponse, UserSummary } from '../services/friend.service';
import { Input } from '@/components/ui/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FriendsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  // State quản lý Tab đang active
  const [activeTab, setActiveTab] = useState<'FIND' | 'REQUESTS' | 'FRIENDS'>('FIND');
  
  // Dữ liệu
  const [friends, setFriends] = useState<FriendshipResponse[]>([]);
  const [requests, setRequests] = useState<FriendshipResponse[]>([]);
  const [searchResults, setSearchResults] = useState<UserSummary[]>([]);
  
  // State UI
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset khi mở modal
  useEffect(() => {
    if (isOpen) {
      if (activeTab !== 'FIND') fetchData();
    }
  }, [isOpen, activeTab]);

  // Logic tìm kiếm (Debounce: đợi người dùng ngừng gõ 500ms mới gọi API)
  useEffect(() => {
    if (activeTab === 'FIND' && searchQuery.trim().length > 1) {
      const timer = setTimeout(() => handleSearch(), 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'FRIENDS') {
        const data = await friendService.getMyFriends();
        setFriends(data);
      } else if (activeTab === 'REQUESTS') {
        const data = await friendService.getIncomingRequests();
        setRequests(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const data = await friendService.searchUsers(searchQuery);
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async (userId: number) => {
    try {
      await friendService.sendFriendRequest(userId);
      // Cập nhật UI ngay lập tức: đổi trạng thái user đó thành PENDING
      setSearchResults(prev => prev.map(u => 
        u.id === userId ? { ...u, friendshipStatus: 'PENDING' } : u
      ));
    } catch (error) {
      alert("Lỗi khi gửi lời mời.");
    }
  };

  const handleAccept = async (friendshipId: number) => {
    try {
      await friendService.acceptRequest(friendshipId);
      setRequests(prev => prev.filter(r => r.id !== friendshipId));
      // Có thể hiển thị thông báo nhỏ hoặc reload list bạn bè
    } catch (error) {
      alert("Lỗi xử lý");
    }
  };

  const handleDecline = async (friendshipId: number) => {
    try {
      await friendService.declineRequest(friendshipId);
      setRequests(prev => prev.filter(r => r.id !== friendshipId));
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Bạn Bè & Kết Nối</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-white/10">
          <TabButton 
            active={activeTab === 'FIND'} 
            onClick={() => setActiveTab('FIND')} 
            label="Tìm bạn" 
            icon={<Search className="w-4 h-4" />}
          />
          <TabButton 
            active={activeTab === 'REQUESTS'} 
            onClick={() => setActiveTab('REQUESTS')} 
            label="Lời mời" 
            count={requests.length}
          />
          <TabButton 
            active={activeTab === 'FRIENDS'} 
            onClick={() => setActiveTab('FRIENDS')} 
            label="Bạn bè" 
          />
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          
          {/* --- TAB 1: TÌM KIẾM --- */}
          {activeTab === 'FIND' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                <Input 
                  placeholder="Nhập tên, email hoặc handle..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-900 border-white/10 text-white"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="animate-spin text-zinc-500" /></div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullname}`} 
                          className="w-10 h-10 rounded-full bg-zinc-800 object-cover"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{user.fullname}</p>
                          <p className="text-xs text-zinc-500">@{user.handle}</p>
                        </div>
                      </div>
                      
                      {/* Nút hành động thông minh dựa trên trạng thái */}
                      {user.friendshipStatus === 'NONE' ? (
                        <button 
                          onClick={() => handleSendRequest(user.id)}
                          className="p-2 bg-white text-black hover:bg-zinc-200 rounded-full transition-colors"
                          title="Gửi kết bạn"
                        >
                          <UserPlus className="w-5 h-5" />
                        </button>
                      ) : user.friendshipStatus === 'PENDING' ? (
                        <span className="text-xs font-bold text-zinc-500 px-3 py-1 bg-zinc-800 rounded-full border border-white/5">
                          Đã gửi
                        </span>
                      ) : user.friendshipStatus === 'ACCEPTED' ? (
                        <span className="text-xs font-bold text-green-500 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                          Bạn bè
                        </span>
                      ) : null}
                    </div>
                  ))
                ) : searchQuery.length > 1 ? (
                  <div className="text-center text-zinc-500 py-8">Không tìm thấy người dùng này.</div>
                ) : (
                  <div className="text-center text-zinc-500 py-8 text-sm">
                    Nhập tên hoặc ID để tìm kiếm bạn đồng hành.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- TAB 2: LỜI MỜI --- */}
          {activeTab === 'REQUESTS' && (
            isLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-zinc-500" /></div> :
            requests.length === 0 ? <div className="text-center text-zinc-500 py-10">Không có lời mời nào.</div> :
            requests.map(req => (
              <div key={req.id} className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <img src={req.friend.avatarUrl || `https://ui-avatars.com/api/?name=${req.friend.fullname}`} className="w-10 h-10 rounded-full bg-zinc-800 object-cover"/>
                  <div>
                    <p className="font-bold text-white text-sm">{req.friend.fullname}</p>
                    <p className="text-xs text-zinc-500">@{req.friend.handle}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAccept(req.id)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white transition-colors">
                    Chấp nhận
                  </button>
                  <button onClick={() => handleDecline(req.id)} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold text-red-400 transition-colors">
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}

          {/* --- TAB 3: DANH SÁCH BẠN BÈ --- */}
          {activeTab === 'FRIENDS' && (
            isLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-zinc-500" /></div> :
            friends.length === 0 ? <div className="text-center text-zinc-500 py-10">Chưa có bạn bè. Hãy qua tab "Tìm bạn" nhé!</div> :
            friends.map(f => (
              <div key={f.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={f.friend.avatarUrl || `https://ui-avatars.com/api/?name=${f.friend.fullname}`} className="w-10 h-10 rounded-full bg-zinc-800 object-cover"/>
                    {f.friend.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#18181b]"></div>}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{f.friend.fullname}</p>
                    <p className="text-xs text-zinc-500">@{f.friend.handle}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Component con: Nút Tab
const TabButton = ({ active, onClick, label, count, icon }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 border-b-2 ${
      active ? 'text-white border-blue-500' : 'text-zinc-500 border-transparent hover:text-zinc-300'
    }`}
  >
    {icon}
    {label}
    {count > 0 && <span className="text-blue-400 ml-1">({count})</span>}
  </button>
);