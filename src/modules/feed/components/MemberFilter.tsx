import React from 'react';
import { cn } from '@/lib/utils';
import { LayoutGrid } from 'lucide-react';
import { FilterMember, MemberStatus } from '../hooks/useFeedData';

// --- HELPER FUNCTION: Chỉ giữ logic màu viền theo Status hành trình (nếu có) ---
const getStatusColor = (status?: MemberStatus, isSelected?: boolean) => {
    if (isSelected) return "border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]";
    
    switch (status) {
        case 'COMPLETED': return "border-emerald-500";
        case 'FAILED': return "border-red-500";
        case 'COMEBACK': return "border-orange-500";
        default: return "border-transparent";
    }
};

// --- SUB COMPONENT ---
const MemberAvatarItem = ({ 
  member, isSelected, onClick, isMe = false 
}: { 
  member: FilterMember, isSelected: boolean, onClick: () => void, isMe?: boolean 
}) => {
  
  return (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-1.5 min-w-[50px] transition-all duration-300 group shrink-0", isSelected ? "opacity-100" : "opacity-60 hover:opacity-100")}>
      <div className="relative">
        <div className={cn("w-12 h-12 rounded-full p-[2px] border-2 transition-all bg-[#121212] overflow-hidden relative", getStatusColor(member.status, isSelected))}>
           <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover bg-zinc-800" />
           <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-colors rounded-full pointer-events-none" />
        </div>

        {/* Vẫn giữ hiển thị % nếu có, vì nó trực quan */}
        {isSelected && member.presenceRate !== undefined && member.presenceRate > 0 && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-zinc-800 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full border border-white/20 whitespace-nowrap shadow-md z-20 animate-in fade-in slide-in-from-bottom-1">
                {member.presenceRate}%
            </div>
        )}
      </div>
      
      <span className={cn("text-[10px] font-medium transition-colors truncate max-w-[64px]", isSelected ? "text-white" : "text-zinc-400 group-hover:text-zinc-300")}>
        {isMe ? "Tôi" : member.name}
      </span>
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
  
  // Logic hiển thị đơn giản
  const myMemberInfo = members.find(m => String(m.id) === String(currentUser?.id));
  const myPresence = myMemberInfo?.presenceRate || 0;

  return (
    <div className="w-full pointer-events-auto flex justify-center px-4">
      <div className="flex items-start gap-4 overflow-x-auto no-scrollbar py-3 px-2 scroll-smooth snap-x w-fit max-w-[95vw] md:max-w-2xl">
        
        {/* Nút Tất cả */}
        <button onClick={() => onSelectUser(null)} className={cn("flex flex-col items-center gap-1.5 min-w-[50px] transition-all group shrink-0", selectedUserId === null ? "opacity-100 scale-105" : "opacity-60 hover:opacity-100")}>
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all bg-zinc-800 group-hover:bg-zinc-700", selectedUserId === null ? "border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "border-transparent")}>
              <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-medium text-white">Tất cả</span>
        </button>
        
        <div className="w-[1px] h-8 bg-white/10 self-center mx-1 shrink-0" />
        
        {/* Nút Tôi */}
        {currentUser && (
            <MemberAvatarItem 
                member={{ 
                    id: currentUser.id, 
                    name: "Tôi", 
                    avatar: userAvatar, 
                    status: 'NORMAL',
                    presenceRate: myPresence
                }}
                isSelected={selectedUserId === String(currentUser.id)}
                onClick={() => onSelectUser(String(currentUser.id))}
                isMe={true}
            />
        )}

        {/* Danh sách thành viên khác */}
        {members.map(member => {
            if (String(member.id) === String(currentUser?.id)) return null; 
            return (
                <MemberAvatarItem 
                    key={member.id}
                    member={member}
                    isSelected={selectedUserId === String(member.id)}
                    onClick={() => onSelectUser(String(member.id))}
                />
            );
        })}
      </div>
    </div>
  );
};