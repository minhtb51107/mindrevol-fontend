import React, { useEffect, useState } from 'react';
import { Trash2, Shield, Loader2, UserMinus } from 'lucide-react';
import { journeyService } from '../services/journey.service';
import { JourneyParticipantResponse, JourneyRole } from '../types';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { toast } from 'react-hot-toast';

interface Props {
  journeyId: string;
  currentUserRole?: JourneyRole; // Vai trò của người đang xem modal
}

export const MemberList: React.FC<Props> = ({ journeyId, currentUserRole }) => {
  const { user } = useAuth();
  const [members, setMembers] = useState<JourneyParticipantResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [kickingId, setKickingId] = useState<number | null>(null);

  useEffect(() => {
    fetchMembers();
  }, [journeyId]);

  const fetchMembers = async () => {
    try {
      const data = await journeyService.getParticipants(journeyId);
      setMembers(data);
    } catch (error) {
      console.error("Failed to load members", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKick = async (memberId: number, memberName: string) => {
    if (!window.confirm(`Bạn có chắc muốn mời ${memberName} ra khỏi nhóm không?`)) return;
    
    setKickingId(memberId);
    try {
      await journeyService.kickMember(journeyId, memberId);
      toast.success(`Đã mời ${memberName} ra khỏi nhóm`);
      // Cập nhật lại danh sách local
      setMembers(prev => prev.filter(m => m.userId !== memberId));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi không thể kick thành viên này");
    } finally {
      setKickingId(null);
    }
  };

  // Logic kiểm tra quyền kick:
  // 1. Không thể tự kick chính mình
  // 2. Owner kick được tất cả (trừ chính mình)
  // 3. Admin chỉ kick được Member thường
  const canKick = (targetMember: JourneyParticipantResponse) => {
    const myId = Number(user?.id);
    if (targetMember.userId === myId) return false; 

    if (currentUserRole === JourneyRole.OWNER) return true;
    if (currentUserRole === JourneyRole.ADMIN && targetMember.role === JourneyRole.MEMBER) return true;
    
    return false;
  };

  if (isLoading) return <div className="text-center py-4"><Loader2 className="w-5 h-5 animate-spin mx-auto text-zinc-500"/></div>;

  return (
    <div className="space-y-3 pt-2 border-t border-white/5">
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex justify-between">
        Thành viên <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[10px]">{members.length}</span>
      </h3>
      
      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
        {members.map(member => (
          <div key={member.userId} className="flex items-center justify-between p-2.5 bg-zinc-900/50 rounded-xl border border-white/5 group hover:border-white/10 transition-all">
            {/* Info */}
            <div className="flex items-center gap-3">
              <img 
                src={member.avatarUrl || "/default-avatar.png"} 
                alt={member.fullname} 
                className="w-9 h-9 rounded-full bg-zinc-800 object-cover" 
              />
              <div>
                <p className="text-sm font-medium text-white flex items-center gap-1.5">
                  {member.fullname}
                  {member.role === JourneyRole.OWNER && <Shield className="w-3 h-3 text-yellow-500" fill="currentColor"/>}
                  {member.role === JourneyRole.ADMIN && <Shield className="w-3 h-3 text-blue-400" fill="currentColor"/>}
                </p>
                <p className="text-xs text-zinc-500">@{member.handle}</p>
              </div>
            </div>
            
            {/* Kick Button */}
            {canKick(member) && (
              <button 
                onClick={() => handleKick(member.userId, member.fullname)}
                disabled={!!kickingId}
                // [FIX] Xóa "opacity-0 group-hover:opacity-100" để nút luôn hiện
                className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" 
                title="Mời ra khỏi nhóm"
              >
                {kickingId === member.userId ? (
                  <Loader2 className="w-4 h-4 animate-spin"/> 
                ) : (
                  <UserMinus className="w-4 h-4"/>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};