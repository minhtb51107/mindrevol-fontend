import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutGrid, Users, ChevronRight, UserPlus, 
  Crown, User, MoreVertical, UserMinus, ArrowRightLeft 
} from 'lucide-react';
import { FilterMember, MemberStatus } from '../hooks/useFeedData';

const getStatusColor = (status?: MemberStatus) => {
  switch (status) {
      case 'COMPLETED': return "border-emerald-500";
      case 'FAILED': return "border-red-500";
      case 'COMEBACK': return "border-orange-500";
      default: return "border-transparent"; 
  }
};

const MemberListItem = ({ 
  member, isSelected, onClick, isMe = false, isCollapsed = false,
  isOwnerMode = false, onKick, onTransfer
}: any) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isOwner = String(member?.role || '').toUpperCase().includes('OWNER');

  return (
    <div className="relative group w-full">
      <button 
        onClick={onClick} 
        title={isMe ? "Tôi" : member.name}
        className={cn(
          "flex items-center transition-all duration-300 w-full text-left rounded-xl",
          isCollapsed ? "justify-center py-2 px-0" : "gap-3 px-2 py-1.5",
          isSelected ? "bg-zinc-100 dark:bg-white/10" : "bg-transparent hover:bg-zinc-50 dark:hover:bg-white/5"
        )}
      >
        <div className={cn("relative shrink-0 flex items-center justify-center", isCollapsed ? "w-10 h-10" : "w-9 h-9")}>
          <div className={cn(
              "rounded-full p-[2px] border-2 transition-all bg-transparent overflow-hidden", 
              isCollapsed ? "w-10 h-10" : "w-9 h-9",
              getStatusColor(member.status)
          )}>
              <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover bg-zinc-100 dark:bg-zinc-800" />
          </div>
          {isCollapsed && (
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-0.5 shadow-sm">
              {isOwner ? <Crown className="w-3 h-3 text-yellow-500" strokeWidth={2.5}/> : <User className="w-3 h-3 text-zinc-400" strokeWidth={2.5}/>}
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="flex-1 min-w-0 flex flex-col justify-center pr-6">
              <div className="flex items-center gap-1.5">
                  <span className={cn(
                      "text-[13px] transition-colors truncate tracking-wide flex-1", 
                      isSelected ? "text-zinc-900 dark:text-white font-bold" : "text-zinc-600 dark:text-zinc-300 font-medium group-hover:text-zinc-900 dark:group-hover:text-white"
                  )}>
                      {isMe ? "Tôi" : member.name}
                  </span>
                  
                  {isOwner ? (
                      <span title="Chủ hành trình" className="shrink-0 flex items-center justify-center">
                          <Crown className="w-3.5 h-3.5 text-yellow-500" strokeWidth={2.5} />
                      </span>
                  ) : (
                      <span title="Thành viên" className="shrink-0 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-zinc-400" strokeWidth={2.5} />
                      </span>
                  )}
              </div>
              
              {/* Hiển thị Số bài viết và Lửa (nếu có) */}
              {(member.totalCheckins !== undefined || (member.presenceRate !== undefined && member.presenceRate > 0)) && (
                  <div className="flex items-center mt-0.5 whitespace-nowrap">
                      {member.totalCheckins !== undefined && (
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-none">
                              {member.totalCheckins} bài
                          </span>
                      )}
                      
                      {member.presenceRate !== undefined && member.presenceRate > 0 && (
                          <div className="flex items-center">
                              {member.totalCheckins !== undefined && (
                                  <span className="mx-1.5 text-[10px] text-zinc-300 dark:text-zinc-600 leading-none">•</span>
                              )}
                              <span className="text-[11px] text-orange-500 dark:text-orange-400 font-bold leading-none">
                                  🔥 {member.presenceRate}%
                              </span>
                          </div>
                      )}
                  </div>
              )}
          </div>
        )}
      </button>

      {isOwnerMode && !isMe && !isCollapsed && (
          <div ref={dropdownRef} className="absolute right-1 top-1/2 -translate-y-1/2">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowDropdown(false); onTransfer?.(member.id); }}
                  className="w-full text-left px-3 py-2.5 text-[13px] font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 flex items-center gap-2 transition-colors"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Chuyển quyền
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowDropdown(false); onKick?.(member.id); }}
                  className="w-full text-left px-3 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                >
                  <UserMinus className="w-4 h-4" />
                  Mời khỏi nhóm
                </button>
              </div>
            )}
          </div>
      )}
    </div>
  );
};

interface Props {
  members: FilterMember[] | any[];
  currentUser: any;
  selectedUserId: string | null;
  onSelectUser: (id: string | null) => void;
  isDesktop?: boolean;
  isDesktopExpanded?: boolean;
  onToggleDesktop?: () => void;
  journeyVisibility?: 'PUBLIC' | 'PRIVATE';
  currentUserRole?: 'OWNER' | 'ADMIN' | 'MEMBER';
  onInviteClick?: () => void;
  onKickMember?: (memberId: string) => void;
  onTransferOwnership?: (memberId: string) => void;
}

export const MemberFilter: React.FC<Props> = ({ 
  members, currentUser, selectedUserId, onSelectUser, 
  isDesktop = false, isDesktopExpanded = true, onToggleDesktop,
  journeyVisibility = 'PUBLIC', currentUserRole = 'MEMBER', 
  onInviteClick, onKickMember, onTransferOwnership
}) => {
  const userAvatar = currentUser?.avatar || currentUser?.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser?.fullname}`;
  
  const myMemberInfo = members.find(m => String(m.id) === String(currentUser?.id));
  const myPresence = myMemberInfo?.presenceRate || 0;
  
  const myRole = myMemberInfo?.role || currentUserRole || 'MEMBER';
  const isOwnerMode = String(myRole).toUpperCase().includes('OWNER');
  
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  if (!members || members.length === 0) return null;

  const isCollapsed = isDesktop && !isDesktopExpanded;

  const canInvite = isOwnerMode || String(myRole).toUpperCase().includes('ADMIN') || journeyVisibility === 'PUBLIC';

  const InviteButton = () => {
    if (!canInvite) return null;
    return (
      <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-white/10 shrink-0">
        <button 
          onClick={onInviteClick}
          className={cn(
            "flex items-center justify-center transition-all duration-300 w-full text-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black hover:scale-[1.02] active:scale-95 shadow-md",
            isCollapsed ? "py-2 px-0 h-10" : "gap-2 px-3 py-2.5"
          )}
          title="Mời thêm thành viên"
        >
          <UserPlus className={cn(isCollapsed ? "w-5 h-5" : "w-4 h-4")} strokeWidth={2.5} />
          {!isCollapsed && <span className="text-[13px] font-bold tracking-wide">Mời thành viên</span>}
        </button>
      </div>
    );
  };

  const renderList = () => (
      <div className="flex flex-col gap-1 w-full pb-2">
          <button 
              onClick={() => onSelectUser(null)} 
              title="Tất cả mọi người"
              className={cn(
                  "flex items-center transition-all duration-300 w-full text-left group rounded-xl",
                  isCollapsed ? "justify-center py-2 px-0" : "gap-3 px-2 py-1.5",
                  selectedUserId === null ? "bg-zinc-100 dark:bg-white/10" : "bg-transparent hover:bg-zinc-50 dark:hover:bg-white/5"
              )}
          >
              <div className={cn("relative shrink-0 flex items-center justify-center", isCollapsed ? "w-10 h-10" : "w-9 h-9")}>
                  <div className={cn(
                      "flex items-center justify-center transition-all rounded-full", 
                      isCollapsed ? "w-9 h-9" : "w-8 h-8",
                      selectedUserId === null 
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-md scale-105" 
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                  )}>
                      <LayoutGrid className="w-4 h-4" strokeWidth={2.5} />
                  </div>
              </div>
              {!isCollapsed && (
                  <span className={cn(
                      "text-[13px] transition-colors truncate tracking-wide", 
                      selectedUserId === null ? "text-zinc-900 dark:text-white font-bold" : "text-zinc-600 dark:text-zinc-300 font-medium group-hover:text-zinc-900 dark:group-hover:text-white"
                  )}>
                      Tất cả mọi người
                  </span>
              )}
          </button>

          {currentUser && (
              <MemberListItem 
                  member={{ 
                      id: String(currentUser.id), 
                      name: "Tôi", 
                      avatar: userAvatar, 
                      status: 'NORMAL', 
                      presenceRate: myPresence, 
                      role: myRole,
                      totalCheckins: myMemberInfo?.totalCheckins // Truyền tổng số bài của chính mình
                  }}
                  isSelected={selectedUserId === String(currentUser.id)}
                  onClick={() => onSelectUser(String(currentUser.id))}
                  isMe={true}
                  isCollapsed={isCollapsed}
                  isOwnerMode={isOwnerMode}
              />
          )}

          {members.map(member => {
              if (String(member.id) === String(currentUser?.id)) return null; 
              return (
                  <MemberListItem 
                      key={member.id} member={member}
                      isSelected={selectedUserId === String(member.id)}
                      onClick={() => onSelectUser(String(member.id))}
                      isCollapsed={isCollapsed}
                      isOwnerMode={isOwnerMode}
                      onKick={onKickMember}
                      onTransfer={onTransferOwnership}
                  />
              );
          })}
      </div>
  );

  if (isDesktop) {
      return (
         <div className="w-full h-full flex flex-col py-5 px-2 bg-transparent overflow-hidden">
             <div className={cn("mb-3 flex items-center shrink-0 h-[30px]", isDesktopExpanded ? "justify-between px-2" : "justify-center")}>
                 {isDesktopExpanded && <span className="text-[0.75rem] font-bold text-zinc-400 uppercase tracking-wider">Thành viên</span>}
                 <button 
                    onClick={onToggleDesktop} 
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/10 rounded-lg transition-all active:scale-95"
                    title={isDesktopExpanded ? "Thu gọn" : "Mở rộng"}
                 >
                     {isDesktopExpanded ? <ChevronRight className="w-4 h-4" strokeWidth={2.5}/> : <Users className="w-5 h-5" strokeWidth={2.5} />}
                 </button>
             </div>
             <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {renderList()}
             </div>
             <InviteButton />
         </div>
      );
  }

  return (
    <div className={cn(
        "absolute top-2 right-2 z-[70] flex flex-col transition-all duration-500 ease-in-out md:hidden",
        isMobileExpanded ? "w-[220px]" : "w-[48px]"
    )}>
        <div className={cn(
            "flex flex-col max-h-[70vh] transition-all duration-300",
            isMobileExpanded ? "bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-200/50 dark:border-white/10 p-2 flex flex-col" : "p-1 items-center"
        )}>
            {/* ĐÃ SỬA: Bỏ padding px-2, py-2 thừa lúc thu nhỏ để đồng bộ kích thước w-10 h-10 */}
            <button 
                onClick={() => setIsMobileExpanded(!isMobileExpanded)}
                className={cn(
                    "flex items-center bg-transparent group w-full outline-none shrink-0",
                    isMobileExpanded ? "py-2 px-2 justify-between" : "justify-center p-0"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                        isMobileExpanded ? "w-7 h-7 text-zinc-900 dark:text-white" : "w-10 h-10 bg-white dark:bg-zinc-800 rounded-[14px] shadow-sm border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300"
                    )}>
                        <Users className={cn(isMobileExpanded ? "w-4 h-4" : "w-5 h-5")} strokeWidth={2.5} />
                    </div>
                    {isMobileExpanded && <span className="text-[13px] font-bold text-zinc-900 dark:text-white whitespace-nowrap tracking-wide">Thành viên</span>}
                </div>
                {isMobileExpanded && <ChevronRight className="w-4 h-4 text-zinc-400 transition-transform rotate-90" strokeWidth={2.5} />}
            </button>
            {isMobileExpanded && <div className="w-full h-px bg-zinc-200 dark:bg-white/10 my-2 shrink-0" />}
            {isMobileExpanded && (
               <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                 {renderList()}
               </div>
            )}
            {isMobileExpanded && <InviteButton />}
        </div>
    </div>
  );
};