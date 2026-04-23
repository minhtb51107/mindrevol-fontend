import React from 'react';
import { UserX, Unlock, Loader2 } from 'lucide-react';
import { useBlockedUsers } from '../hooks/useBlockedUsers';

export const BlockedUsersModal = () => {
  const { blockedUsers, loading, handleUnblock } = useBlockedUsers();

  return (
    <div className="flex-1 overflow-y-auto p-2 custom-scrollbar font-quicksand pb-10">
        {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#8A8580]" /></div>
        ) : blockedUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-70">
                <UserX className="w-12 h-12 mb-4 text-[#A09D9A]" />
                <span className="text-[1.05rem] font-bold text-[#8A8580] dark:text-[#A09D9A]">Danh sách chặn trống.</span>
            </div>
        ) : (
            <div className="space-y-3">
                {blockedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-white dark:bg-[#1A1A1A] rounded-[20px] border border-[#F4EBE1] dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-4">
                            <img 
                                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullname}&background=random`} 
                                className="w-12 h-12 rounded-[16px] object-cover bg-[#E2D9CE] border border-[#F4EBE1] dark:border-[#2B2A29]" 
                                alt="Avatar"
                            />
                            <div>
                                <h4 className="text-[1.05rem] font-black text-[#1A1A1A] dark:text-white leading-tight">{user.fullname}</h4>
                                <p className="text-[0.8rem] font-bold text-[#8A8580] dark:text-[#A09D9A]">@{user.handle}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleUnblock(user.id)}
                            className="px-4 h-[40px] flex items-center justify-center gap-2 bg-[#F4EBE1]/50 dark:bg-[#2B2A29] hover:bg-[#E2D9CE] dark:hover:bg-[#3A3734] text-[#1A1A1A] dark:text-white rounded-[14px] font-bold text-[0.85rem] transition-all active:scale-95 border border-transparent dark:border-white/5"
                        >
                            <Unlock className="w-4 h-4" strokeWidth={2.5}/> Bỏ chặn
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};