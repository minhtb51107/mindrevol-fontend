import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Key, ShieldAlert, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { userService } from '../services/user.service';
import { BlockedUsersModal } from './BlockedUsersModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<'MENU' | 'PASSWORD' | 'BLOCK'>('MENU');
  const [hasPassword, setHasPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Kiểm tra user có password chưa khi mở modal
  useEffect(() => {
    if (isOpen) {
        userService.hasPassword().then(res => {
            setHasPassword(res);
            setIsLoading(false);
        }).catch(() => setIsLoading(false));
    }
  }, [isOpen]);

  const handleSubmitPassword = async () => {
    setMessage(null);
    if (newPassword !== confirmPassword) {
        setMessage({ type: 'error', text: "Mật khẩu xác nhận không khớp" });
        return;
    }
    if (newPassword.length < 6) {
        setMessage({ type: 'error', text: "Mật khẩu phải có ít nhất 6 ký tự" });
        return;
    }

    try {
        if (hasPassword) {
            // Đổi mật khẩu (cần pass cũ)
            await userService.changePassword({ oldPassword, newPassword });
            setMessage({ type: 'success', text: "Đổi mật khẩu thành công!" });
        } else {
            // Tạo mật khẩu mới (không cần pass cũ - dành cho user Google)
            await userService.createPassword(newPassword);
            setMessage({ type: 'success', text: "Đã tạo mật khẩu thành công!" });
            setHasPassword(true); // Cập nhật state ngay
        }
        
        // Reset form
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Back to menu after 1.5s
        setTimeout(() => setView('MENU'), 1500);

    } catch (error: any) {
        setMessage({ type: 'error', text: error.response?.data?.message || "Có lỗi xảy ra" });
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
             {view !== 'MENU' && <button onClick={() => setView('MENU')} className="text-zinc-400 hover:text-white"><ArrowRight className="w-5 h-5 rotate-180" /></button>}
             <h2 className="text-lg font-bold text-white">
                {view === 'PASSWORD' ? (hasPassword ? "Đổi mật khẩu" : "Tạo mật khẩu") : "Bảo mật"}
             </h2>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-zinc-400" /></button>
        </div>

        <div className="p-4">
            {view === 'MENU' && (
                <div className="space-y-2">
                    <button 
                        onClick={() => setView('PASSWORD')}
                        className="w-full flex items-center justify-between p-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors text-left"
                    >
                        <div className="flex items-center gap-3">
                            <Key className="w-5 h-5 text-blue-400" />
                            <div>
                                <div className="font-bold text-white">
                                    {isLoading ? "Đang tải..." : (hasPassword ? "Đổi mật khẩu" : "Tạo mật khẩu")}
                                </div>
                                <div className="text-xs text-zinc-500">
                                    {hasPassword ? "Cập nhật mật khẩu định kỳ" : "Thêm mật khẩu để đăng nhập bằng Email"}
                                </div>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-600" />
                    </button>

                    <button 
                        onClick={() => setView('BLOCK')}
                        className="w-full flex items-center justify-between p-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors text-left"
                    >
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="w-5 h-5 text-red-400" />
                            <div>
                                <div className="font-bold text-white">Danh sách chặn</div>
                                <div className="text-xs text-zinc-500">Quản lý người dùng bạn đã chặn</div>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-600" />
                    </button>
                </div>
            )}

            {view === 'PASSWORD' && (
                <div className="space-y-4">
                    {message && (
                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {message.text}
                        </div>
                    )}

                    {/* Chỉ hiện ô nhập mật khẩu CŨ nếu đã có mật khẩu */}
                    {hasPassword && (
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-400">Mật khẩu hiện tại</label>
                            <Input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="bg-zinc-900" />
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-400">Mật khẩu mới</label>
                        <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="bg-zinc-900" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-400">Xác nhận mật khẩu mới</label>
                        <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="bg-zinc-900" />
                    </div>

                    <Button onClick={handleSubmitPassword} className="w-full mt-4">
                        {hasPassword ? "Lưu thay đổi" : "Tạo mật khẩu"}
                    </Button>
                </div>
            )}

            {view === 'BLOCK' && (
                <BlockedUsersModal />
            )}
        </div>
      </div>
    </div>,
    document.body
  );
};