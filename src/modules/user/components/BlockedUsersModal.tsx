import React, { useEffect, useState } from 'react';
import { X, Unlock } from 'lucide-react';
import { blockService, BlockedUser } from '../services/block.service';

interface BlockedUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlockedUsersModal: React.FC<BlockedUsersModalProps> = ({ isOpen, onClose }) => {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadBlockList();
    }
  }, [isOpen]);

  const loadBlockList = async () => {
    try {
      setLoading(true);
      const data = await blockService.getBlockList();
      setBlockedUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId: number) => {
    if (confirm("Bạn có chắc muốn bỏ chặn người dùng này?")) {
      try {
        await blockService.unblockUser(userId);
        // Refresh list
        setBlockedUsers(prev => prev.filter(item => item.blockedUser.id !== userId));
      } catch (error) {
        alert("Có lỗi xảy ra khi bỏ chặn.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-zinc-800">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
            <h3 className="text-lg font-bold text-white pl-2">Danh sách chặn</h3>
            <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition text-zinc-400">
                <X size={20} />
            </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
                <div className="text-center text-zinc-500 py-10">Đang tải...</div>
            ) : blockedUsers.length === 0 ? (
                <div className="text-center text-zinc-500 py-10">Bạn chưa chặn ai cả.</div>
            ) : (
                <div className="space-y-3">
                    {blockedUsers.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-zinc-800">
                            <div className="flex items-center gap-3">
                                <img 
                                    src={item.blockedUser.avatarUrl || `https://ui-avatars.com/api/?name=${item.blockedUser.fullname}`} 
                                    className="w-10 h-10 rounded-full object-cover border border-zinc-700" 
                                    alt="Avt"
                                />
                                <div>
                                    <h4 className="text-sm font-bold text-white">{item.blockedUser.fullname}</h4>
                                    <p className="text-xs text-zinc-500">@{item.blockedUser.handle}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleUnblock(item.blockedUser.id)}
                                className="p-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition text-xs font-bold flex items-center gap-1"
                            >
                                <Unlock size={14}/> Bỏ chặn
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};