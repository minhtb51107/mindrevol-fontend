import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Shield, FileText, MessageSquare, LogOut, ChevronRight } from 'lucide-react'; 
import { useAuth } from '@/modules/auth/store/AuthContext';
import { EditProfileModal } from './EditProfileModal';
import { SecurityModal } from './SecurityModal';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { userService } from '../services/user.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth(); // Lấy user từ context
  const navigate = useNavigate();
  
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleSendFeedback = async () => {
    if(!feedbackText.trim()) return;
    try {
        await userService.sendFeedback({ type: 'GENERAL', content: feedbackText });
        alert("Cảm ơn đóng góp của bạn!");
        setFeedbackText('');
        setShowFeedbackInput(false);
    } catch (e) {
        alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Cài đặt</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="overflow-y-auto p-2">
          
          <div className="mb-4">
            <p className="px-4 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">Tài khoản</p>
            <div className="space-y-1">
              <MenuItem 
                icon={<User className="w-5 h-5 text-blue-400" />} 
                label="Chỉnh sửa trang cá nhân" 
                onClick={() => setShowEditProfile(true)} 
              />
              <MenuItem 
                icon={<Shield className="w-5 h-5 text-green-400" />} 
                label="Mật khẩu & Bảo mật" 
                onClick={() => setShowSecurity(true)} 
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="px-4 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">Hỗ trợ</p>
            <div className="space-y-1">
              <MenuItem 
                icon={<MessageSquare className="w-5 h-5 text-yellow-400" />} 
                label="Gửi ý kiến phản hồi" 
                onClick={() => setShowFeedbackInput(!showFeedbackInput)}
              />
              
              {showFeedbackInput && (
                  <div className="px-4 py-2 space-y-2 bg-zinc-900/50 mx-2 rounded-xl mb-2 border border-white/5">
                      <Input 
                        placeholder="Bạn muốn chia sẻ điều gì?" 
                        value={feedbackText}
                        onChange={e => setFeedbackText(e.target.value)}
                        className="bg-zinc-800 border-zinc-700"
                      />
                      <Button size="sm" onClick={handleSendFeedback} className="w-full">Gửi ngay</Button>
                  </div>
              )}

              <MenuItem 
                icon={<FileText className="w-5 h-5 text-purple-400" />} 
                label="Chính sách quyền riêng tư" 
                onClick={() => { onClose(); navigate('/privacy'); }} 
              />
              <MenuItem 
                icon={<FileText className="w-5 h-5 text-zinc-400" />} 
                label="Điều khoản sử dụng" 
                onClick={() => { onClose(); navigate('/terms'); }} 
              />
            </div>
          </div>

          <div className="p-2 pt-4 border-t border-white/10">
            <button 
              onClick={() => { if(confirm("Bạn có chắc muốn đăng xuất?")) { logout(); onClose(); } }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
            <div className="text-center mt-4 text-xs text-zinc-600">Mindrevol v1.0.0</div>
          </div>
        </div>
      </div>

      {/* [FIX] Truyền props đầy đủ cho EditProfileModal */}
      {showEditProfile && user && (
        <EditProfileModal 
            isOpen={true} 
            onClose={() => setShowEditProfile(false)} 
            user={user as any} // Truyền user hiện tại vào
            onUpdateSuccess={() => {}} 
        />
      )}
      
      {showSecurity && (
        <SecurityModal isOpen={true} onClose={() => setShowSecurity(false)} />
      )}
    </div>,
    document.body
  );
};

const MenuItem = ({ icon, label, onClick, danger = false }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/5 rounded-xl transition-colors group ${danger ? 'text-red-400' : 'text-zinc-200'}`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
  </button>
);