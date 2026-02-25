import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { LayoutGrid, Users, ChevronRight } from 'lucide-react';
import { FilterMember, MemberStatus } from '../hooks/useFeedData';

// --- HELPER FUNCTION: Xử lý màu viền Avatar ---
const getStatusColor = (status?: MemberStatus, isSelected?: boolean) => {
  if (isSelected) return "border-white shadow-[0_0_8px_rgba(255,255,255,0.6)] scale-110";
  
  switch (status) {
      case 'COMPLETED': return "border-emerald-500";
      case 'FAILED': return "border-red-500";
      case 'COMEBACK': return "border-orange-500";
      default: return "border-zinc-700/50";
  }
};

// --- SUB COMPONENT: Hiển thị 1 Hàng Thành Viên ---
const MemberListItem = ({ 
  member, isSelected, onClick, isMe = false 
}: { 
  member: FilterMember, isSelected: boolean, onClick: () => void, isMe?: boolean 
}) => {
  return (
    <button 
      onClick={onClick} 
      className="flex items-center gap-3 py-1.5 px-1 transition-all duration-300 w-full text-left group bg-transparent"
    >
      <div className="relative shrink-0 flex items-center justify-center w-10 h-10">
        <div className={cn(
            "w-9 h-9 rounded-full p-[2px] border-2 transition-all bg-[#121212] overflow-hidden", 
            getStatusColor(member.status, isSelected)
        )}>
            <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover bg-zinc-800" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className={cn(
            "text-[13px] transition-colors truncate drop-shadow-md", 
            isSelected ? "text-white font-bold" : "text-zinc-400 font-medium group-hover:text-zinc-200"
        )}>
            {isMe ? "Tôi" : member.name}
        </span>
        {member.presenceRate !== undefined && member.presenceRate > 0 && (
            <span className="text-[10px] text-zinc-400 font-medium mt-0.5 drop-shadow-md">
               🔥 {member.presenceRate}%
            </span>
        )}
      </div>
    </button>
  );
};

// --- MAIN COMPONENT ---
interface Props {
  members: FilterMember[];
  currentUser: any;
  selectedUserId: string | null;
  onSelectUser: (id: string | null) => void;
}

export const MemberFilter: React.FC<Props> = ({ members, currentUser, selectedUserId, onSelectUser }) => {
  const userAvatar = currentUser?.avatar || currentUser?.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser?.fullname}`;
  const myMemberInfo = members.find(m => String(m.id) === String(currentUser?.id));
  const myPresence = myMemberInfo?.presenceRate || 0;
  
  const [isExpanded, setIsExpanded] = useState(true);

  if (!members || members.length === 0) return null;

  return (
    <div className={cn(
        "fixed top-4 right-4 md:right-6 z-[60] flex flex-col transition-all duration-500 ease-in-out",
        isExpanded ? "w-[180px] md:w-[200px]" : "w-[40px]"
    )}>
        <div className="flex flex-col max-h-[80vh] bg-transparent">
            
            {/* Tiêu đề & Nút Thu/Phóng (Không nền) */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between py-2 px-1 bg-transparent group"
            >
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400 shrink-0 drop-shadow-md transition-transform group-hover:scale-110" />
                    {isExpanded && <span className="text-sm font-bold text-zinc-100 whitespace-nowrap drop-shadow-md">Thành viên</span>}
                </div>
                {isExpanded && <ChevronRight className="w-4 h-4 text-zinc-400 transition-transform rotate-90" />}
            </button>

            {/* Đường cắt dưới tiêu đề (HR) */}
            {isExpanded && (
                <div className="w-full h-px bg-white/10 my-1.5" />
            )}

            {/* Danh sách thành viên (Không nền) */}
            {isExpanded && (
                <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar pb-4 mt-1">
                    
                    {/* Nút "Tất cả mọi người" */}
                    <button 
                        onClick={() => onSelectUser(null)} 
                        className="flex items-center gap-3 py-1.5 px-1 transition-all duration-300 w-full text-left group bg-transparent"
                    >
                        <div className="relative shrink-0 flex items-center justify-center w-10 h-10">
                            <div className={cn(
                                "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all bg-zinc-800", 
                                selectedUserId === null ? "border-white shadow-[0_0_8px_rgba(255,255,255,0.6)] scale-110" : "border-transparent group-hover:border-zinc-500"
                            )}>
                                <LayoutGrid className={cn("w-4 h-4", selectedUserId === null ? "text-white" : "text-zinc-400")} />
                            </div>
                        </div>
                        <span className={cn(
                            "text-[13px] transition-colors truncate drop-shadow-md", 
                            selectedUserId === null ? "text-white font-bold" : "text-zinc-400 font-medium group-hover:text-zinc-200"
                        )}>
                            Tất cả mọi người
                        </span>
                    </button>

                    {/* Nút Tôi */}
                    {currentUser && (
                        <MemberListItem 
                            member={{ id: currentUser.id, name: "Tôi", avatar: userAvatar, status: 'NORMAL', presenceRate: myPresence }}
                            isSelected={selectedUserId === String(currentUser.id)}
                            onClick={() => onSelectUser(String(currentUser.id))}
                            isMe={true}
                        />
                    )}

                    {/* Các thành viên khác */}
                    {members.map(member => {
                        if (String(member.id) === String(currentUser?.id)) return null; 
                        return (
                            <MemberListItem 
                                key={member.id} member={member}
                                isSelected={selectedUserId === String(member.id)}
                                onClick={() => onSelectUser(String(member.id))}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    </div>
  );
};