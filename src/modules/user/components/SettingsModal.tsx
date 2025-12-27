import React, { useEffect, useState } from 'react';
import { X, ChevronRight, LogOut, Trash2, Mail, Bug, Bell, Lock, User, ShieldAlert, Globe, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { userService, NotificationSettings, LinkedAccount } from '../services/user.service';
import { useAuth } from '@/modules/auth/store/AuthContext'; 
import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils';

// Import các modal con
import { EditProfileModal } from './EditProfileModal';
import { SecurityModal } from './SecurityModal';
import { BlockedUsersModal } from './BlockedUsersModal'; // Bạn đã có file này

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Các View con trong Modal chính
type SettingsView = 'MENU' | 'NOTIFICATIONS' | 'ACCOUNT_LINKS' | 'FEEDBACK_BUG' | 'FEEDBACK_FEATURE';

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<SettingsView>('MENU');
  
  // Modal states (Mở đè lên trên)
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showBlockList, setShowBlockList] = useState(false);

  // Data states
  const [notiSettings, setNotiSettings] = useState<NotificationSettings | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [feedbackContent, setFeedbackContent] = useState('');

  useEffect(() => {
    if (isOpen) loadData();
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [notis, accounts] = await Promise.all([
        userService.getNotificationSettings().catch(() => null),
        userService.getLinkedAccounts().catch(() => []),
      ]);
      setNotiSettings(notis);
      setLinkedAccounts(accounts);
    } catch (e) { console.error(e); }
  };

  // --- ACTIONS ---

  const handleToggleNoti = async (key: keyof NotificationSettings) => {
    if (!notiSettings) return;
    const newVal = !notiSettings[key];
    setNotiSettings({ ...notiSettings, [key]: newVal }); // Optimistic UI
    try { await userService.updateNotificationSettings({ [key]: newVal }); } 
    catch { setNotiSettings({ ...notiSettings, [key]: !newVal }); } // Revert
  };

  const handleUnlink = async (provider: string) => {
    if (confirm(`Hủy liên kết ${provider}?`)) {
      try {
        await userService.unlinkSocialAccount(provider);
        loadData();
      } catch { alert("Không thể hủy liên kết lúc này."); }
    }
  };

  const handleSendFeedback = async (type: 'BUG' | 'FEATURE_REQUEST') => {
    if (!feedbackContent.trim()) return;
    try {
      await userService.sendFeedback({ type, content: feedbackContent, appVersion: '1.0.0' });
      alert("Đã gửi thành công! Cảm ơn bạn.");
      setFeedbackContent('');
      setCurrentView('MENU');
    } catch { alert("Lỗi khi gửi."); }
  };

  const handleDeleteAccount = async () => {
    const cf = prompt("Nhập 'DELETE' để xóa tài khoản vĩnh viễn. Hành động này không thể hoàn tác:");
    if (cf === 'DELETE') {
      await userService.deleteAccount();
      logout();
    }
  };

  // --- RENDERS ---

  const renderMenu = () => (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
      
      {/* 1. Account Section */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase px-4 mb-2">Tài khoản</h3>
        <div className="bg-zinc-800/50 rounded-2xl overflow-hidden">
          <MenuItem 
            icon={<User size={18} />} label="Chỉnh sửa hồ sơ" 
            onClick={() => setShowEditProfile(true)} 
          />
          <MenuItem 
            icon={<LinkIcon size={18} />} label="Liên kết mạng xã hội" 
            onClick={() => setCurrentView('ACCOUNT_LINKS')} 
          />
          <MenuItem 
            icon={<Lock size={18} />} label="Mật khẩu & Bảo mật" 
            onClick={() => setShowSecurity(true)} 
          />
        </div>
      </div>

      {/* 2. Privacy & Notifications */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase px-4 mb-2">Cài đặt chung</h3>
        <div className="bg-zinc-800/50 rounded-2xl overflow-hidden">
          <MenuItem 
            icon={<Bell size={18} />} label="Thông báo" 
            onClick={() => setCurrentView('NOTIFICATIONS')} 
          />
          <MenuItem 
            icon={<ShieldAlert size={18} />} label="Danh sách chặn" 
            onClick={() => setShowBlockList(true)} 
          />
          <a href="/privacy" target="_blank" className="flex items-center justify-between p-4 hover:bg-zinc-800 transition cursor-pointer">
            <div className="flex items-center gap-3 text-zinc-200"><Globe size={18} className="text-zinc-400"/> Quyền riêng tư & Dữ liệu</div>
            <ChevronRight size={16} className="text-zinc-600"/>
          </a>
        </div>
      </div>

      {/* 3. Support (Split Bug/Feature) */}
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase px-4 mb-2">Hỗ trợ</h3>
        <div className="bg-zinc-800/50 rounded-2xl overflow-hidden">
            <MenuItem 
                icon={<Bug size={18} />} label="Báo cáo sự cố" 
                onClick={() => setCurrentView('FEEDBACK_BUG')} 
            />
            <MenuItem 
                icon={<Mail size={18} />} label="Gửi đề xuất tính năng" 
                onClick={() => setCurrentView('FEEDBACK_FEATURE')} 
            />
        </div>
      </div>

      {/* 4. Danger Zone */}
      <div className="pt-2">
        <button onClick={logout} className="w-full p-3 mb-2 bg-zinc-800 text-red-400 font-medium rounded-xl hover:bg-zinc-700 flex items-center justify-center gap-2">
            <LogOut size={18}/> Đăng xuất
        </button>
        <div className="flex justify-center">
            <button onClick={handleDeleteAccount} className="text-xs text-zinc-600 hover:text-red-500 flex items-center gap-1 transition-colors">
                <Trash2 size={12}/> Xóa tài khoản
            </button>
        </div>
        <p className="text-center text-[10px] text-zinc-700 mt-4">Mindrevol v1.0.0 (Beta)</p>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <HeaderBack title="Thông báo" onBack={() => setCurrentView('MENU')} />
      {notiSettings ? (
        <div className="space-y-6 mt-4">
            <div>
                <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Qua Email</h4>
                <div className="bg-zinc-800/50 rounded-xl p-2">
                    <Switch label="Nhắc nhở hàng ngày" checked={notiSettings.emailDailyReminder} onChange={() => handleToggleNoti('emailDailyReminder')} />
                    <Switch label="Tin tức cập nhật" checked={notiSettings.emailUpdates} onChange={() => handleToggleNoti('emailUpdates')} />
                </div>
            </div>
            <div>
                <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Trên ứng dụng</h4>
                <div className="bg-zinc-800/50 rounded-xl p-2">
                    <Switch label="Lời mời kết bạn" checked={notiSettings.pushFriendRequest} onChange={() => handleToggleNoti('pushFriendRequest')} />
                    <Switch label="Bình luận mới" checked={notiSettings.pushNewComment} onChange={() => handleToggleNoti('pushNewComment')} />
                    <Switch label="Mời vào hành trình" checked={notiSettings.pushJourneyInvite} onChange={() => handleToggleNoti('pushJourneyInvite')} />
                    <Switch label="Cảm xúc (Reaction)" checked={notiSettings.pushReaction} onChange={() => handleToggleNoti('pushReaction')} />
                </div>
            </div>
        </div>
      ) : <p className="text-center py-10 text-zinc-500">Đang tải...</p>}
    </div>
  );

  const renderAccountLinks = () => (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <HeaderBack title="Liên kết tài khoản" onBack={() => setCurrentView('MENU')} />
      <div className="mt-4 space-y-3">
        {['GOOGLE', 'FACEBOOK', 'TIKTOK'].map(provider => {
            const linked = linkedAccounts.find(a => a.provider === provider);
            return (
                <div key={provider} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-800">
                    <div className="flex items-center gap-3">
                        {/* Placeholder Icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            provider === 'GOOGLE' ? 'bg-white text-black' : 
                            provider === 'FACEBOOK' ? 'bg-blue-600 text-white' : 'bg-black text-white border border-zinc-700'
                        }`}>
                            {provider[0]}
                        </div>
                        <div>
                            <div className="font-bold text-sm text-white">{provider}</div>
                            {linked ? 
                                <span className="text-xs text-green-500">Đã kết nối</span> : 
                                <span className="text-xs text-zinc-500">Chưa kết nối</span>
                            }
                        </div>
                    </div>
                    {linked ? (
                        <button onClick={() => handleUnlink(provider)} className="text-xs text-red-400 bg-red-900/20 px-3 py-1.5 rounded-full">Hủy</button>
                    ) : (
                        // Logic connect sẽ redirect sang Backend OAuth endpoint
                        // Ví dụ: window.location.href = `${API_URL}/oauth2/authorization/${provider.toLowerCase()}`
                        <button className="text-xs text-zinc-400 bg-zinc-700/50 px-3 py-1.5 rounded-full cursor-not-allowed">Kết nối</button>
                    )}
                </div>
            )
        })}
      </div>
      <p className="text-xs text-zinc-500 mt-4 px-2">
        <AlertTriangle size={12} className="inline mr-1"/>
        Kết nối tài khoản mạng xã hội giúp bạn đăng nhập nhanh hơn và đồng bộ bạn bè.
      </p>
    </div>
  );

  const renderFeedback = (type: 'BUG' | 'FEATURE_REQUEST') => (
    <div className="animate-in slide-in-from-right-4 duration-300">
        <HeaderBack title={type === 'BUG' ? "Báo cáo lỗi" : "Gửi đề xuất"} onBack={() => setCurrentView('MENU')} />
        <div className="mt-4">
            <textarea 
                className="w-full h-40 bg-zinc-800 text-white p-4 rounded-xl outline-none resize-none placeholder:text-zinc-500"
                placeholder={type === 'BUG' ? "Mô tả lỗi bạn gặp phải..." : "Bạn muốn Mindrevol có thêm tính năng gì?"}
                value={feedbackContent}
                onChange={e => setFeedbackContent(e.target.value)}
            />
            <button 
                onClick={() => handleSendFeedback(type)}
                disabled={!feedbackContent.trim()}
                className="w-full mt-4 bg-yellow-500 text-black font-bold py-3 rounded-xl disabled:opacity-50 hover:bg-yellow-400 transition"
            >
                Gửi ngay
            </button>
        </div>
    </div>
  );

  if (!isOpen || !user) return null;

  return (
    <>
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-zinc-800">
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
                    <h2 className="text-lg font-bold text-white pl-2">
                        {currentView === 'MENU' ? 'Cài đặt' : ''}
                    </h2>
                    <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* User Mini Profile in Menu */}
                    {currentView === 'MENU' && (
                        <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl">
                            <img src={user.avatarUrl} className="w-12 h-12 rounded-full border border-zinc-600" alt="Avt" />
                            <div>
                                <h3 className="font-bold text-white">{user.fullname}</h3>
                                <p className="text-xs text-zinc-400">@{user.handle}</p>
                            </div>
                        </div>
                    )}

                    {currentView === 'MENU' && renderMenu()}
                    {currentView === 'NOTIFICATIONS' && renderNotifications()}
                    {currentView === 'ACCOUNT_LINKS' && renderAccountLinks()}
                    {currentView === 'FEEDBACK_BUG' && renderFeedback('BUG')}
                    {currentView === 'FEEDBACK_FEATURE' && renderFeedback('FEATURE_REQUEST')}
                </div>
            </div>
        </div>

        {/* --- SUB MODALS (Nằm đè lên SettingsModal) --- */}
        {showEditProfile && (
            <EditProfileModal 
                user={user} 
                onClose={() => setShowEditProfile(false)} 
                onUpdateSuccess={() => {}} 
            />
        )}
        
        {showSecurity && (
            <SecurityModal onClose={() => setShowSecurity(false)} />
        )}

        {showBlockList && (
            <BlockedUsersModal 
                isOpen={true} 
                onClose={() => setShowBlockList(false)} 
            />
        )}
    </>
  );
};

// --- HELPER COMPONENTS ---
const MenuItem = ({ icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 transition border-b border-zinc-800/50 last:border-0 group">
        <div className="flex items-center gap-3 text-zinc-200 group-hover:text-white transition">
            <span className="text-zinc-400 group-hover:text-yellow-500 transition">{icon}</span>
            {label}
        </div>
        <ChevronRight size={16} className="text-zinc-600 group-hover:text-zinc-400"/>
    </button>
);

const HeaderBack = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className="flex items-center mb-4 cursor-pointer text-zinc-400 hover:text-white group" onClick={onBack}>
        <div className="mr-2 p-1.5 bg-zinc-800 rounded-full group-hover:bg-zinc-700 transition"><ChevronRight className="rotate-180" size={16}/></div>
        <span className="font-bold text-lg text-white">{title}</span>
    </div>
);