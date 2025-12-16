import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Check, Link as LinkIcon, Copy } from 'lucide-react';
import { useInviteMembers } from '../hooks/useInviteMembers';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  journeyId: string;
  inviteCode: string;
}

export const InviteMembersModal: React.FC<Props> = ({ isOpen, onClose, journeyId, inviteCode }) => {
  const { friends, isLoading, invitedIds, inviteUser } = useInviteMembers(journeyId);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Tạo link mời
  const inviteLink = `${window.location.origin}/join?code=${inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl flex flex-col max-h-[80vh]">
        
        <div className="p-6 border-b border-white/5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Mời thành viên</h2>
            <button onClick={onClose}><X className="text-zinc-400 hover:text-white" /></button>
          </div>
          
          <div className="mt-4 space-y-3">
             {/* Box 1: Mã Code */}
            <div className="p-3 bg-zinc-900 rounded-lg flex justify-between items-center border border-white/5">
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Mã hành trình</p>
                    <p className="text-xl font-mono text-blue-400 font-bold tracking-widest">{inviteCode}</p>
                </div>
            </div>

            {/* Box 2: Link */}
            <button 
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-all group"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-blue-500/20 rounded-full text-blue-400">
                        <LinkIcon className="w-4 h-4" />
                    </div>
                    <div className="text-left overflow-hidden">
                        <p className="text-xs text-blue-200 font-medium truncate w-full">Sao chép liên kết tham gia</p>
                        <p className="text-[10px] text-blue-500/60 truncate">{inviteLink}</p>
                    </div>
                </div>
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />}
            </button>
          </div>
        </div>

        {/* Danh sách bạn bè */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <p className="text-center text-zinc-500 py-4 text-sm">Đang tải danh sách bạn bè...</p>
          ) : friends?.length === 0 ? (
            <p className="text-center text-zinc-500 py-4 text-sm">Bạn chưa có bạn bè nào để mời.</p>
          ) : (
            friends?.map((friend: any) => (
              <div key={friend.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 overflow-hidden">
                     {friend.friend?.avatarUrl ? <img src={friend.friend.avatarUrl} className="w-full h-full object-cover"/> : (friend.friend?.fullname?.[0] || 'U')}
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">{friend.friend?.fullname}</h4>
                    <p className="text-xs text-zinc-500">@{friend.friend?.handle}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => inviteUser(friend.friend?.id)}
                  disabled={invitedIds.includes(friend.friend?.id)}
                  className={`p-2 rounded-full transition-all ${
                    invitedIds.includes(friend.friend?.id) 
                      ? 'bg-green-500/20 text-green-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                  }`}
                >
                  {invitedIds.includes(friend.friend?.id) ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
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