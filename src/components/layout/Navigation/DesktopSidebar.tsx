import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Box, MessageCircle, PlusSquare, User, Settings, ChevronLeft, ChevronRight,
  Flame, Crown, Plus, BookOpen, Sparkles, Zap, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UpgradeModal } from '@/modules/payment/components/UpgradeModal'; 
import { useAuth } from '@/modules/auth/store/AuthContext';

interface Friend {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface DesktopSidebarProps {
  onJourneyClick?: () => void;
  triggerUpload?: () => void;
  totalUnread?: number;
  hasJourneyAlerts?: boolean;
  isExpanded: boolean;
  toggleSidebar: () => void;
  onNotificationClick: () => void;
  isNotificationOpen: boolean;
  onSettingsClick?: () => void; 
  myJourneys?: any[];
  activeJourneyId?: string | null;
  onCreateJourneyClick?: () => void;
  onAddFriendClick?: () => void;
  friends?: Friend[];
}

const JourneyIcon = ({ name, avatar, imageUrl, isActive, onClick, onMouseEnter, onMouseLeave }: any) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="relative group flex justify-center w-full cursor-pointer py-1" onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
       <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-black dark:bg-white rounded-r-full transition-all duration-300", isActive ? "h-10" : "h-0 group-hover:h-5")} />
       <div className={cn(
         "w-12 h-12 transition-all duration-300 overflow-hidden flex items-center justify-center font-bold text-lg shadow-sm shrink-0", 
         isActive ? "rounded-[16px] bg-indigo-500 text-white" : "rounded-[24px] group-hover:rounded-[16px] bg-[#F4EBE1] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white group-hover:bg-indigo-500 group-hover:text-white"
       )}>
          {avatar ? <span className="text-[1.6rem] leading-none transition-transform duration-300 drop-shadow-sm group-hover:scale-110">{avatar}</span> 
          : imageUrl && !imgError ? <img src={imageUrl} alt={name} className="w-full h-full object-cover" onError={() => setImgError(true)} /> 
          : <BookOpen size={20} strokeWidth={2.5} className={cn(isActive ? "text-white" : "text-[#8A8580] dark:text-[#A09D9A] group-hover:text-white")} />}
       </div>
    </div>
  );
};

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  triggerUpload, totalUnread = 0, isExpanded, toggleSidebar,
  onSettingsClick, myJourneys = [], activeJourneyId, onCreateJourneyClick, onAddFriendClick, friends = []
}) => {
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [tooltip, setTooltip] = useState<{ text: string, top: number, left: number } | null>(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isGold = user?.accountType === 'GOLD'; 

  const handleMouseEnter = (text: string, col: 'left' | 'right' = 'left') => (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const leftPos = col === 'left' ? 84 : (isExpanded ? 364 : 172);
    setTooltip({ text, top: rect.top + rect.height / 2, left: leftPos });
  };

  return (
    <div className="fixed z-50 top-0 left-0 h-full flex hidden md:flex font-quicksand">
      
      {/* 1. COLUMN TRÁI (JOURNEYS) */}
      <div className="w-[72px] h-full shrink-0 bg-transparent flex flex-col items-center pt-[36px] pb-4 gap-2 z-20 relative border-r border-transparent">
        
        <div 
          className="relative group flex justify-center w-full cursor-pointer mb-1" 
          onClick={() => navigate('/landing')} 
          onMouseEnter={handleMouseEnter('Landing Page')} 
          onMouseLeave={() => setTooltip(null)}
        >
          <div className="w-12 h-12 shrink-0 drop-shadow-sm transition-transform group-hover:scale-105 bg-white dark:bg-zinc-800 rounded-[16px] p-1 flex items-center justify-center">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><path d="M10 50C10 27.9086 27.9086 10 50 10C72.0914 10 90 27.9086 90 50C90 72.0914 72.0914 90 50 90C35 90 25 90 10 90C10 75 10 72.0914 10 50Z" fill="#FFF2F2" stroke="#2B2A29" strokeWidth="4" strokeLinejoin="round"/><circle cx="35" cy="45" r="5" fill="#2B2A29"/><circle cx="65" cy="45" r="5" fill="#2B2A29"/><ellipse cx="25" cy="55" rx="4" ry="3" fill="#FFB7C5" opacity="0.6"/><ellipse cx="75" cy="55" rx="4" ry="3" fill="#FFB7C5" opacity="0.6"/><path d="M45 55C45 55 48 58 50 58C52 58 55 55 55 55" stroke="#2B2A29" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        <div className="w-6 h-[1px] bg-zinc-200 dark:bg-white/10 my-1 shrink-0" />

        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col gap-1 items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {myJourneys.map(j => (
            <JourneyIcon key={j.id} name={j.name || 'Hành trình'} avatar={j.avatar} imageUrl={j.avatarUrl || j.imageUrl} isActive={activeJourneyId === j.id} onClick={() => navigate(`/?journeyId=${j.id}`)} onMouseEnter={handleMouseEnter(j.name || 'Hành trình')} onMouseLeave={() => setTooltip(null)} />
          ))}
          
          {/* NÚT TẠO HÀNH TRÌNH - Đã gắn data-tour */}
          <div className="relative group flex justify-center w-full mt-2 py-1" onMouseEnter={handleMouseEnter('Tạo hành trình mới')} onMouseLeave={() => setTooltip(null)}>
              <button 
                data-tour="create-journey" 
                onClick={onCreateJourneyClick} 
                className="w-11 h-11 rounded-[14px] border-2 border-dashed border-zinc-300 dark:border-white/20 hover:border-zinc-400 dark:hover:border-white/40 text-zinc-400 transition-all duration-300 flex items-center justify-center shrink-0"
              >
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
              </button>
          </div>

          <div className="relative group flex justify-center w-full py-1" onMouseEnter={handleMouseEnter('Tải ứng dụng')} onMouseLeave={() => setTooltip(null)}>
              <button className="w-11 h-11 rounded-[14px] border-2 border-dashed border-zinc-300 dark:border-white/20 hover:border-zinc-400 dark:hover:border-white/40 text-zinc-400 transition-all duration-300 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5" strokeWidth={2.5} />
              </button>
          </div>
        </div>

        <div className="mt-auto pt-2 w-full flex justify-center relative group" onMouseEnter={handleMouseEnter('Cài đặt')} onMouseLeave={() => setTooltip(null)}>
          <button onClick={onSettingsClick} className="w-11 h-11 rounded-[14px] flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white bg-white dark:bg-[#1A1A1A] hover:bg-zinc-100 dark:hover:bg-white/10 transition-all duration-300 shadow-sm border border-zinc-200 dark:border-white/10 shrink-0">
            <Settings className="w-[22px] h-[22px] group-hover:rotate-45 transition-transform duration-300" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* 2. COLUMN PHẢI (MAIN NAV) */}
      <div className={cn(
        "relative flex flex-col py-4 transition-all duration-300 ease-in-out z-10",
        "mt-[36px] h-[calc(100dvh-36px)]", 
        "bg-white dark:bg-[#09090b]", 
        "border-t border-l border-r border-zinc-200 dark:border-white/10",
        "rounded-tl-[24px]", 
        isExpanded ? "w-[280px] px-2.5" : "w-[88px] px-2.5" 
      )}>
        <div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-1">
          
          <div className={cn("flex items-center mt-1 mb-2", isExpanded ? "justify-between px-2" : "justify-center px-0")}>
            {isExpanded && <span className="text-[0.7rem] font-bold text-zinc-400 uppercase tracking-widest">Nội dung</span>}
            
            <button 
              onClick={() => { toggleSidebar(); setTooltip(null); }}
              onMouseEnter={!isExpanded ? handleMouseEnter('Mở rộng', 'right') : undefined}
              onMouseLeave={!isExpanded ? () => setTooltip(null) : undefined}
              className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white transition-all rounded-[8px] hover:bg-zinc-100 dark:hover:bg-white/10 shrink-0"
            >
              {isExpanded ? <ChevronLeft className="w-4 h-4 ml-0.5" strokeWidth={2.5} /> : <ChevronRight className="w-4 h-4 ml-0.5" strokeWidth={2.5} />}
            </button>
          </div>
          
          {/* MENU CÁC TRANG - Đã gắn dataTour cho Chuỗi ngày và Hộp */}
          <DesktopNavItem to="/" icon={Home} label="Bảng tin" isExpanded={isExpanded} />
          <DesktopNavItem dataTour="streak-flame" to="/streak" icon={Flame} label="Chuỗi ngày" isExpanded={isExpanded} />
          <DesktopNavItem dataTour="nav-box" to="/box" icon={Box} label="Hộp" isExpanded={isExpanded} />
          <DesktopNavItem to="/chat" icon={MessageCircle} label="Tin nhắn" badge={totalUnread} isExpanded={isExpanded} />
          
          <button data-tour="checkin" onClick={triggerUpload} className={cn("flex items-center rounded-[12px] transition-all group border border-transparent mt-1", isExpanded ? "w-full gap-3 px-2 py-2.5 justify-start" : "w-full px-0 py-2.5 justify-center", "text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5")}>
            <PlusSquare className="w-5 h-5 transition-transform group-hover:scale-110 shrink-0" strokeWidth={2} />
            {isExpanded && <span className="font-semibold text-[0.95rem]">Đăng bài</span>}
          </button>
          <DesktopNavItem to="/profile" icon={User} imgSrc={user?.avatarUrl} label="Trang cá nhân" isExpanded={isExpanded} />

          {/* DANH SÁCH BẠN BÈ */}
          <div className="mt-3 flex flex-col">
            <div className="h-[1px] bg-zinc-200 dark:bg-white/10 mx-2 mb-3 mt-1 shrink-0" />
            
            <div className={cn("flex items-center mb-2", isExpanded ? "justify-between px-2" : "justify-center px-0")}>
              {isExpanded && <span className="text-[0.7rem] font-bold text-zinc-400 uppercase tracking-widest">Bạn bè</span>}
              
              <button 
                onClick={onAddFriendClick} 
                onMouseEnter={!isExpanded ? handleMouseEnter('Thêm bạn bè', 'right') : undefined}
                onMouseLeave={!isExpanded ? () => setTooltip(null) : undefined}
                className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white transition-all rounded-[8px] hover:bg-zinc-100 dark:hover:bg-white/10 shrink-0"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            {friends.length > 0 && (
              <div className="flex flex-col gap-1">
                {friends.map(friend => (
                  <div key={friend.id} onClick={() => navigate(`/profile/${friend.id}`)} onMouseEnter={!isExpanded ? handleMouseEnter(friend.name, 'right') : undefined} onMouseLeave={!isExpanded ? () => setTooltip(null) : undefined} className={cn("flex items-center rounded-[12px] transition-all cursor-pointer group", isExpanded ? "px-2 py-2 gap-3 justify-start" : "px-0 py-2 justify-center", "text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5")}>
                    {friend.avatarUrl ? <img src={friend.avatarUrl} alt={friend.name} className="w-6 h-6 rounded-full object-cover shrink-0" /> : <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0"><User size={14} /></div>}
                    {isExpanded && <span className="text-[0.9rem] font-medium truncate">{friend.name}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PHẦN CHÂN SIDEBAR */}
        <div className="mt-auto pt-4 shrink-0 flex flex-col gap-1 pb-2">
          <div className={cn("flex w-full", !isExpanded && "justify-center")}>
            <PremiumGoldCard 
              isGold={isGold} 
              isExpanded={isExpanded} 
              onUpgrade={() => setIsUpgradeOpen(true)}
              onMouseEnter={!isExpanded ? handleMouseEnter(isGold ? "Thành viên Gold" : "Nâng cấp Gold", 'right') : undefined}
              onMouseLeave={() => setTooltip(null)}
            />
          </div>
        </div>
      </div>

      {/* RENDER TOOLTIP */}
      {tooltip && (
        <div style={{ 
          position: 'fixed', left: `${tooltip.left}px`, top: tooltip.top, transform: 'translateY(-50%)', backgroundColor: '#09090b', color: 'white', padding: '6px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', zIndex: 999999, pointerEvents: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', whiteSpace: 'nowrap'
        }}>
          {tooltip.text}
          <div style={{ position: 'absolute', top: '50%', left: '-4px', transform: 'translateY(-50%) rotate(45deg)', width: '8px', height: '8px', backgroundColor: '#09090b' }} />
        </div>
      )}

      {isUpgradeOpen && <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />}
    </div>
  );
};

const PremiumGoldCard = ({ isGold, isExpanded, onUpgrade, onMouseEnter, onMouseLeave }: any) => {
  if (!isExpanded) {
    return (
      <button onClick={onUpgrade} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={cn("w-11 h-11 rounded-[14px] flex items-center justify-center transition-all duration-300 shadow-sm shrink-0", isGold ? "bg-gradient-to-tr from-amber-400 to-yellow-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-yellow-600 hover:scale-105")}>
        <Crown className={cn("w-[22px] h-[22px]", isGold ? "animate-none" : "animate-pulse")} strokeWidth={2.5} />
      </button>
    );
  }
  return (
    <div onClick={!isGold ? onUpgrade : undefined} className={cn("group relative w-full overflow-hidden rounded-[20px] p-4 transition-all duration-500 cursor-pointer", isGold ? "bg-[#1A1A1A] border border-amber-500/30" : "bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black border border-zinc-200 dark:border-white/10 hover:border-yellow-500/50")}>
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-amber-500/10 rounded-full blur-xl group-hover:translate-x-4 transition-transform duration-700" />
      <div className="absolute top-2 right-4 opacity-20 group-hover:translate-y-[-4px] transition-transform duration-500"><Sparkles size={16} className="text-yellow-500" /></div>
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-xl shrink-0", isGold ? "bg-amber-500/20" : "bg-yellow-500/10")}><Crown size={20} className="text-yellow-500" /></div>
          <span className={cn("font-bold text-[1rem] bg-clip-text text-transparent bg-gradient-to-r truncate", isGold ? "from-amber-200 to-yellow-500" : "from-yellow-600 to-amber-700 dark:from-yellow-400 dark:to-amber-500")}>{isGold ? "Thành viên Gold" : "Nâng cấp Gold"}</span>
        </div>
        <div className="flex flex-col">
          <p className="text-[0.75rem] font-medium text-zinc-500 dark:text-zinc-400 leading-snug">{isGold ? "Cảm ơn bạn đã đồng hành cùng đặc quyền tối thượng." : "Trải nghiệm không giới hạn với các tính năng đặc biệt dành riêng cho bạn."}</p>
          {!isGold && (<div className="mt-3 flex items-center gap-1.5 text-[0.75rem] font-bold text-yellow-600 dark:text-yellow-500"><span>Khám phá ngay</span><Zap size={12} className="fill-current" /></div>)}
        </div>
      </div>
    </div>
  );
};

// [CẬP NHẬT ĐỂ NHẬN DATATOUR]
const DesktopNavItem = ({ to, icon: Icon, imgSrc, label, badge, isExpanded, dataTour }: any) => (
  <NavLink data-tour={dataTour} to={to} className={({ isActive }) => cn("flex items-center rounded-[12px] transition-all relative group border", isExpanded ? "px-2 py-2.5 gap-3 justify-start" : "px-0 py-2.5 justify-center", isActive ? "bg-zinc-100 dark:bg-white/10 text-black dark:text-white border-transparent" : "border-transparent text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5")}>
    {({ isActive }) => (
      <>
        {imgSrc ? (
          <img src={imgSrc} alt={label} className={cn("rounded-full object-cover shrink-0", isExpanded ? "w-5 h-5" : "w-6 h-6")} />
        ) : (
          <Icon className={cn("w-5 h-5 transition-transform shrink-0", isActive ? "scale-105" : "group-hover:scale-110")} strokeWidth={isActive ? 2.5 : 2} />
        )}
        {isExpanded && <span className="font-semibold text-[0.95rem] whitespace-nowrap">{label}</span>}
        {badge > 0 && isExpanded && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge > 99 ? '99+' : badge}</span>}
        {badge > 0 && !isExpanded && <span className="absolute top-1.5 right-[10px] w-2.5 h-2.5 bg-red-500 rounded-full" />}
      </>
    )}
  </NavLink>
);